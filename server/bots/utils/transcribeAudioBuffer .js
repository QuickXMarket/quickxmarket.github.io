import { AssemblyAI } from "assemblyai";

const client = new AssemblyAI({ apiKey: process.env.ASSEMBLYAI_API_KEY });

export const transcribeAudioBuffer = async (wavBuffer) => {
  try {
    const uploadResponse = await client.files.upload(wavBuffer);

    const transcript = await client.transcripts.transcribe({
      audio_url: uploadResponse,
      speech_model: "universal",
    });

    return transcript.text;
  } catch (err) {
    console.error("Transcription failed:", err);
    return null;
  }
};
