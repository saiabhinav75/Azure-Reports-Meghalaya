import * as sdk from "microsoft-cognitiveservices-speech-sdk";;
export function processWavBuffer(buffer:Buffer, pushStream:sdk.PushAudioInputStream) {

    const start = 44; 
    const slicedBuffer = buffer.slice(start); 
    
    pushStream.write(slicedBuffer);
    pushStream.close();

    return pushStream;
}