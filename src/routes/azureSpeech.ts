import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import * as filePushStream from "./filePushStream";
import fs from 'node:fs';
import { v4 as uuidv4 } from "uuid";
import { diffArrays } from "diff";
import _ from "lodash";
import { parseWavBuffer } from "./getWaveData";

export const main = async (fileBuffer: Buffer, subKey: string, serviceRegion: string, reference_text: string, studentClass:number) => {
    try {
        const wavFileHeader = parseWavBuffer(fileBuffer);
        const format = sdk.AudioStreamFormat.getWaveFormatPCM(wavFileHeader.framerate, wavFileHeader.bitsPerSample, wavFileHeader.nChannels);
        const pushStream = sdk.AudioInputStream.createPushStream(format);
        filePushStream.processWavBuffer(fileBuffer, pushStream);
        const audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);
        const speechConfig = sdk.SpeechConfig.fromSubscription(subKey, serviceRegion);
 
        const enableProsodyAssessment = true;
        const pronunciationAssessmentConfig = new sdk.PronunciationAssessmentConfig(
            reference_text,
            sdk.PronunciationAssessmentGradingSystem.HundredMark,
            sdk.PronunciationAssessmentGranularity.Phoneme,
            true
        );
        pronunciationAssessmentConfig.enableProsodyAssessment = enableProsodyAssessment;
 
        speechConfig.speechRecognitionLanguage = "en-GB";
        const reco = new sdk.SpeechRecognizer(speechConfig, audioConfig);
        pronunciationAssessmentConfig.applyTo(reco);
 
        const scoreNumber = {
            accuracy:{
                score:0,
                bucket:"Emergent"
            },
            fluency: {
                score:0,
                bucket:"Emergent"
            },
            comp:  {
                score:0,
                bucket:"Emergent"
            },
            prosody:  {
                score:0,
                bucket:"Emergent"
            },
            partA_score:{
                score:0
            },

            words: [] as Object[]
        };
        const allWords: Object[] = [];
        let currentText: string[] = [];
        let startOffset = 0;
        const fluencyScores: number[] = [];
        const prosodyScores: number[] = [];
        const durations: number[] = [];
        let jo: Object = {};
        const filePath = `${uuidv4()}.txt`;
        let recognizedWordsNum = 0;
 
        // Create a promise that resolves when the recognition is done
        const recognitionPromise = new Promise((resolve, reject) => {
            reco.recognizing = function (s, e) {
                // do Nothing
                // console.log("(recognizing) Reason:", sdk.ResultReason[e.result.reason], "Text:", e.result.text);
            };
 
            reco.recognized = function (s, e) {
                const pronunciation_result = sdk.PronunciationAssessmentResult.fromResult(e.result);
                // console.log(`Accuracy score: ${pronunciation_result.accuracyScore},` +
                //     `\npronunciation score: ${pronunciation_result.pronunciationScore},` +
                //     `\ncompleteness score: ${pronunciation_result.completenessScore},` +
                //     `\nfluency score: ${pronunciation_result.fluencyScore},` +
                //     `${enableProsodyAssessment ? `\nprosody score: ${pronunciation_result.prosodyScore}` : ""}`
                // );
 
                jo = JSON.parse(e.result.properties.getProperty(sdk.PropertyId.SpeechServiceResponse_JsonResult));
                const nb = (jo as any)["NBest"][0];
                startOffset = nb.Words[0].Offset;
                const localtext = _.map(nb.Words, (item) => item.Word.toLowerCase());
                currentText = currentText.concat(localtext);
                fluencyScores.push(nb.PronunciationAssessment.FluencyScore);
                prosodyScores.push(nb.PronunciationAssessment.ProsodyScore);
                const isSucceeded = (jo as any).RecognitionStatus === 'Success';
                const nBestWords = (jo as any).NBest[0].Words;
                const durationList: number[] = [];
                _.forEach(nBestWords, (word) => {
                    if (word.PronunciationAssessment.AccuracyScore < 60 && word.PronunciationAssessment.ErrorType == "None") {
                        word.PronunciationAssessment.ErrorType = "Mispronunciation";
                    }
                    if (word.PronunciationAssessment.ErrorType == "None") recognizedWordsNum++;
                    durationList.push(word.Duration);
                });
                durations.push(_.sum(durationList));
                if (isSucceeded && nBestWords) {
                    allWords.push(...nBestWords);
                }
            };
 
            reco.canceled = function (s, e) {
                if (e.reason === sdk.CancellationReason.Error) {
                    console.log("(cancel) Reason:", sdk.CancellationReason[e.reason], "Error details:", e.errorDetails);
                }
                reco.stopContinuousRecognitionAsync(() => resolve(calculateOverallPronunciationScore()), reject);
            };
 
            reco.sessionStarted = function (s, e) {};
 
            reco.sessionStopped = function (s, e) {
                reco.stopContinuousRecognitionAsync(() => resolve(calculateOverallPronunciationScore()), reject);
            };
 
            reco.startContinuousRecognitionAsync();
        });
 
        function wordsToTempDict(words: string[]) {
            let data = "";
            const wordMap: any = {};
            for (const word of words) word in wordMap ? wordMap[word]++ : wordMap[word] = 1;
            for (const key in wordMap) data += key + `|0x00000000|${wordMap[key]}\n`;
            fs.writeFileSync(filePath, data.trim());
        }
 
        function removeTempDict() {
            fs.unlink(filePath, (_e) => {});
        }
 
        function calculateOverallPronunciationScore() {
            let wholelyricsArray: string[] = [];
 
            let wholelyrics = (reference_text.toLocaleLowerCase() ?? "").replace(new RegExp("[!\"#$%&()*+,-./:;<=>?@[^_`{|}~]+", "g"), "").replace(new RegExp("]+", "g"), "");
            wholelyricsArray = wholelyrics.split(" ");
            const wholelyricsArrayRes = _.map(
                _.filter(wholelyricsArray, (item) => !!item),
                (item) => item.trim()
            );
 
            let lastWords: Object[] = [];
            if (reference_text.length != 0) {
                const diff = diffArrays(wholelyricsArrayRes, currentText);
                let currentWholelyricsArrayResIndex = 0;
                let currentResTextArrayIndex = 0;
                for (const d of diff) {
                    if (d.added) {
                        _.map(allWords.slice(currentResTextArrayIndex, currentResTextArrayIndex + (d.count ?? 0)), (item) => {
                            if ((item as any).PronunciationAssessment.ErrorType !== "Insertion") {
                                (item as any).PronunciationAssessment.ErrorType = "Insertion";
                            }
                            lastWords.push(item);
                            currentResTextArrayIndex++;
                        });
                    }
                    if (d.removed) {
                        if (
                            currentWholelyricsArrayResIndex + (d.count ?? 0) + 1 == wholelyricsArrayRes.length &&
                            !(
                                (jo as any).RecognitionStatus == "Success" ||
                                (jo as any).RecognitionStatus == "Failed"
                            )
                        )
                            continue;
                        for (let i = 0; i < (d.count ?? 0); i++) {
                            const word = {
                                Word: wholelyricsArrayRes[currentWholelyricsArrayResIndex],
                                PronunciationAssessment: {
                                    ErrorType: "Omission",
                                },
                            };
                            lastWords.push(word);
                            currentWholelyricsArrayResIndex++;
                        }
                    }
                    if (!d.added && !d.removed) {
                        _.map(allWords.slice(currentResTextArrayIndex, currentResTextArrayIndex + (d.count ?? 0)), (item) => {
                            lastWords.push(item);
                            currentWholelyricsArrayResIndex++;
                            currentResTextArrayIndex++;
                        });
                    }
                }
            } else {
                lastWords = allWords;
            }
 
            if (reference_text.trim() != "") {
                let compScore =
                    reference_text.length != 0
                        ? Number(((recognizedWordsNum / wholelyricsArrayRes.length) * 100).toFixed(0))
                        : 0;
 
                if (compScore > 100) {
                    compScore = 100;
                }
                scoreNumber.comp.score = compScore;
                const comp_bucket=getBucket(studentClass,compScore)
                scoreNumber.comp.bucket = comp_bucket;

            }
 
            const accuracyScores: number[] = [];
            _.forEach(lastWords, (word) => {
                if (word && (word as any)?.PronunciationAssessment?.ErrorType != "Insertion") {
                    accuracyScores.push(Number((word as any)?.PronunciationAssessment.AccuracyScore ?? 0));
                }
            });
            const wordLevelResponse: Object[] = []
            _.forEach(lastWords, (word: any, ind) => {
                let wordLevelOutput = `     ${ind + 1}: word: ${word.Word}`;
                if (word.PronunciationAssessment.ErrorType != "Omission" && word.PronunciationAssessment.ErrorType != "Insertion") {
                    wordLevelResponse.push({ word: word.Word, accuracy_score: word.PronunciationAssessment.AccuracyScore, error_type: word.PronunciationAssessment.ErrorType })
                    wordLevelOutput += `\taccuracy score: ${word.PronunciationAssessment.AccuracyScore}\terror type: ${word.PronunciationAssessment.ErrorType};`;
                } else {
                    wordLevelResponse.push({ word: word.Word, error_type: word.PronunciationAssessment.ErrorType })
                    wordLevelOutput += `\t\t\t\terror type: ${word.PronunciationAssessment.ErrorType};`;
                }
            })
            const accuracyScore = accuracyScores.length > 0 ? _.mean(accuracyScores) : 0;
            const accuracy_bucket=getBucket(studentClass,accuracyScore)
            scoreNumber.accuracy.score = accuracyScore;
            scoreNumber.accuracy.bucket = accuracy_bucket;
            
            const fluencyScore = fluencyScores.length > 0 ? _.mean(fluencyScores) : 0;
            const fluency_bucket=getBucket(studentClass,fluencyScore)
            scoreNumber.fluency.score = fluencyScore;
            scoreNumber.fluency.bucket = fluency_bucket;

            const prosodyScore = prosodyScores.length > 0 ? _.mean(prosodyScores) : 0;
            const prosody_bucket=getBucket(studentClass,prosodyScore)
            scoreNumber.prosody.score = prosodyScore;
            scoreNumber.prosody.bucket = prosody_bucket;


            scoreNumber.words = wordLevelResponse

            let last_score=(accuracyScore+fluencyScore+prosodyScore)/3
            last_score=last_score/10
            scoreNumber.partA_score.score=last_score

            return scoreNumber;
        }
 
        // Wait for the recognition process to complete and get the final score
        const finalScore = await recognitionPromise;
 
        // Cleanup resources
        reco.close();
        pushStream.close();
        removeTempDict();
 
        return finalScore;
    } catch (error) {
        console.log(error);
        return undefined;
    }
}

function getBucket(studentClass:number,totalScore:number) {
  
    let bucket = 'E';

    if (studentClass >= 6 && studentClass <= 10) {
        if (totalScore >= 0 && totalScore <= 65) {
            bucket = 'Emergent';
        } else if (totalScore >= 66 && totalScore <= 80) {
            bucket = 'Transitional';
        } else if (totalScore >= 81 && totalScore <= 100) {
            bucket = 'Proficient';
        } else {
            bucket = 'Invalid score';
        }
    } else if (studentClass >= 1 && studentClass <= 5) {
        if (totalScore >= 0 && totalScore <= 70) {
            bucket = 'Emergent';
        } else if (totalScore >= 71 && totalScore <= 80) {
            bucket = 'Transitional';
        } else if (totalScore >= 81 && totalScore <= 100) {
            bucket = 'Proficient';
        } else {
            bucket = 'Invalid score';
        }
    } else {
        bucket = 'Invalid class';
    }

    return bucket;
}




