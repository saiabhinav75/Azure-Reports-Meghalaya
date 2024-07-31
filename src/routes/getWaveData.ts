import wavefile,{WaveFile} from 'wavefile';
import {Buffer} from 'node:buffer'
import * as sdk from "microsoft-cognitiveservices-speech-sdk";

// Helper to get __dirname in ES6 modules

interface WaveFormat{
    chunkId:string,
    chunkSize: number,
    audioFormat: number,
    numChannels: number,
    sampleRate: number,
    byteRate: number,
    blockAlign: number,
    bitsPerSample: number,
    cbSize: number,
    validBitsPerSample: number,
    dwChannelMask: number,
    subformat: []
}
function parseWavBuffer(buffer:Buffer) {

    let wav = new WaveFile()
    wav.fromBuffer(buffer);
    let format = wav.fmt as WaveFormat;
    var f
    switch (format.audioFormat)
    {
        case 1: // PCM
            f = sdk.AudioFormatTag.PCM;
            break;
        case 6: 
            f = sdk.AudioFormatTag.ALaw;
            break;
        case 7:
            f = sdk.AudioFormatTag.MuLaw;
            break;
        default:
            throw new Error("Wave format " + format.audioFormat + " is not supported");
    }
    return {
        framerate: format.sampleRate,
        bitsPerSample: format.bitsPerSample,
        nChannels: format.numChannels,
        tag: format.audioFormat,
        format : f
    };
}

export { parseWavBuffer };
