const { PassThrough } = require('stream');
const { spawn } = require('child_process');
const fs = require('fs');
const ffmpegStatic = require('ffmpeg-static');

const ffmpegPath = ffmpegStatic; 

const base64ToBuffer = (base64:string) => Buffer.from(base64, 'base64');

export async function convertBase64WebMToWAV(base64WebM:string):Promise<string> {
    const webMBuffer = base64ToBuffer(base64WebM);
    const webMStream = new PassThrough();
    const wavStream = new PassThrough();
    
    webMStream.end(webMBuffer);

    return new Promise((resolve, reject) => {
        
        const ffmpegProcess = spawn(ffmpegPath, [
            '-i', 'pipe:0',
            '-acodec', 'pcm_s16le',
            '-filter:a', 'aformat=channel_layouts=stereo',
            '-f', 'wav',
            'pipe:1'
        ]);

        let wavBuffer:  Uint8Array[] = [];
        ffmpegProcess.stdout.on('data', (chunk: Uint8Array) => wavBuffer.push(chunk));
        ffmpegProcess.stdout.on('end', () => {
            resolve(Buffer.concat(wavBuffer).toString('base64'));
        });

        ffmpegProcess.stderr.on('data', (data: { toString: () => any; }) => {
            console.error('FFmpeg stderr:', data.toString());
        });

        ffmpegProcess.on('error', (err: { message: any; }) => {
            console.error('FFmpeg Error:', err.message);
            reject(`FFmpeg Error: ${err.message}`);
        });

        webMStream.pipe(ffmpegProcess.stdin);
    });
}

