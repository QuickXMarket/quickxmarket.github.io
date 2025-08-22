import ffmpeg from "fluent-ffmpeg";
import streamifier from "streamifier";
import ffmpegPath from "@ffmpeg-installer/ffmpeg";

ffmpeg.setFfmpegPath(ffmpegPath.path);

export const convertOggToWav = async (audioBuffer) => {
  return new Promise((resolve, reject) => {
    const inputStream = streamifier.createReadStream(audioBuffer);
    const chunks = [];

    ffmpeg(inputStream)
      .audioCodec("pcm_s16le")
      .audioFrequency(16000)
      .audioChannels(1)
      .format("wav")
      .on("error", (err) => reject(err))
      .on("end", () => {
        resolve(Buffer.concat(chunks));
      })
      .pipe()
      .on("data", (chunk) => chunks.push(chunk));
  });
};
