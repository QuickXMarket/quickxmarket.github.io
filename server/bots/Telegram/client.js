import axios from "axios";
import { onMessageReceived } from "../nlp/manager.js";
import { transcribeAudioBuffer } from "../utils/transcribeAudioBuffer .js";
import { convertOggToWav } from "../utils/convertOggToWav.js";

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

const downloadTelegramVoice = async (fileId) => {
  try {
    const fileMetaRes = await axios.get(
      `https://api.telegram.org/bot${TELEGRAM_TOKEN}/getFile?file_id=${fileId}`
    );
    const filePath = fileMetaRes.data.result.file_path;

    const fileUrl = `https://api.telegram.org/file/bot${TELEGRAM_TOKEN}/${filePath}`;
    const audioRes = await axios.get(fileUrl, { responseType: "arraybuffer" });

    return audioRes.data;
  } catch (err) {
    console.error(
      "❌ Failed to download Telegram voice:",
      err?.response?.data || err
    );
  }
};

const handleTelegramVoice = async (fileId, chatId) => {
  try {
    const audioBuffer = await downloadTelegramVoice(fileId);
    const wavBuffer = await convertOggToWav(audioBuffer);

    const transcript = await transcribeAudioBuffer(wavBuffer);

    if (transcript) onMessageReceived(chatId, transcript, "telegram");
  } catch (err) {
    console.error("❌ Error handling Telegram voice:", err.message);
  }
};

export const telegramWebhook = async (req, res) => {
  try {
    const body = req.body;

    if (body.message) {
      const chatId = body.message.chat.id;

      if (body.message.text) {
        const text = body.message.text;
        await onMessageReceived(chatId, text, "telegram");
      } else if (body.message.voice) {
        const fileId = body.message.voice.file_id;
        await handleTelegramVoice(fileId, chatId);
      } else {
        console.log("⚠️ Unsupported Telegram message type");
      }
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Error in Telegram webhook:", err.message);
    res.sendStatus(500);
  }
};

export const sendTelegramMessage = async (to, text) => {
  try {
    await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: to,
      text,
    });
  } catch (err) {
    console.error("❌ Error sending Telegram message:", err.message);
  }
};
