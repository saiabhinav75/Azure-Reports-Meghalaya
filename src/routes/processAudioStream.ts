const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const stream = require('stream');
const {Readable} = require('stream')

ffmpeg.setFfmpegPath(ffmpegPath);

const base64ToBuffer = (base64:string) => Buffer.from(base64, 'base64');
export async function processAudioStream(base64:String) {
  const allChunks:Uint8Array[] = [];
  const buffer = base64ToBuffer(base64.toString())
  const bufferStream = new stream.PassThrough();
  bufferStream.end(buffer);
  return await new Promise(async (resolve, reject) => {
    
    ffmpeg(bufferStream)
      .toFormat('wav')
      .on('error', reject) // Reject the promise on error
      .pipe(new Readable({ read() {} })) // Pipe to a dummy readable stream
      .on('data', (chunk:Uint8Array) => {
        allChunks.push(chunk);
      })
      .on('end', () => {
        const completeBuffer = Buffer.concat(allChunks);
        const b64 = completeBuffer.toString("base64")
        fs.writeFileSync("sampleaudio.wav",completeBuffer)
        resolve(b64); // Resolve with the complete buffer
      });
  });
}