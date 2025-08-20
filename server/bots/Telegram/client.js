import axios from "axios";
import { onMessageReceived } from "../nlp/manager.js";

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

export const telegramWebhook = async (req, res) => {
  try {
    const body = req.body;

    if (body.message) {
      const chatId = body.message.chat.id;
      const text = body.message.text;

      onMessageReceived(chatId, text, "telegram");
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


