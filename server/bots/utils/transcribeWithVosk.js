import vosk from "vosk";
import { Readable } from "stream";

vosk.setLogLevel(0);

const MODEL_PATH = "./model";
const SAMPLE_RATE = 16000;

const model = new vosk.Model(MODEL_PATH);

export const transcribeWithVosk = async (wavBuffer) => {
  return new Promise((resolve, reject) => {
    try {
      const recognizer = new vosk.Recognizer({
        model,
        sampleRate: SAMPLE_RATE,
      });

      const stream = Readable.from(wavBuffer);

      stream.on("data", (chunk) => {
        recognizer.acceptWaveform(chunk);
      });

      stream.on("end", () => {
        const result = recognizer.finalResult();
        recognizer.free();
        resolve(result.text || "");
      });

      stream.on("error", (err) => {
        recognizer.free();
        reject(err);
      });
    } catch (err) {
      reject(err);
    }
  });
};
