import axios from "axios";
import { NLPmanager } from "../nlp/manager.js";

const VERIFY_TOKEN = "my_verify_token";
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
let messageHandler;

export const whatsappWebhook = (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token && mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("WEBHOOK_VERIFIED");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
};

export const incomingWhatsappMSG = async (req, res) => {
  const body = req.body;

  if (body.object && body.entry) {
    const changes = body.entry[0].changes[0].value;
    if (changes.messages && changes.messages[0]) {
      const msg = changes.messages[0];
      console.log(msg);
      // const textMessage=
      const response = await NLPmanager.process("en", msg.text.body);
      console.log(response);
      sendMessage(msg.from, response.answer);
      if (!messageHandler) {
        messageHandler = msg;
      }
    }
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
};

export const sendMessage = async (to, text) => {
  try {
    const url = `https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`;

    const response = await axios.post(
      url,
      {
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: text },
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (err) {
    console.log("❌ Error sending message: " + err.message);
    throw err;
  }
};
