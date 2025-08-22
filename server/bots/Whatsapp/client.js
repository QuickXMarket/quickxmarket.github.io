import axios from "axios";
import { NLPmanager, onMessageReceived } from "../nlp/manager.js";
import { convertOggToWav } from "../utils/convertOggToWav.js";
import { transcribeAudioBuffer } from "../utils/transcribeAudioBuffer .js";

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

const downloadWhatsappAudio = async (mediaId) => {
  try {
    const mediaMeta = await axios.get(
      `https://graph.facebook.com/v20.0/${mediaId}`,
      { headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}` } }
    );

    const audioRes = await axios.get(mediaMeta.data.url, {
      headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}` },
      responseType: "arraybuffer",
    });

    return audioRes.data;
  } catch (err) {
    console.error("Failed to download audio:", err?.response?.data || err);
  }
};

const handleWhatsappAudio = async (mediaId, from) => {
  try {
    const audioBuffer = await downloadWhatsappAudio(mediaId);

    const wavBuffer = await convertOggToWav(audioBuffer);
    const transcript = await transcribeAudioBuffer(wavBuffer);
    console.log(transcript);
    if (transcript) onMessageReceived(from, transcript, "whatsapp");
  } catch (err) {
    console.error("Error handling WhatsApp audio:", err.message);
  }
};

export const incomingWhatsappMSG = async (req, res) => {
  const body = req.body;

  if (body.object && body.entry) {
    const changes = body.entry[0].changes[0].value;

    if (changes.messages && changes.messages[0]) {
      const msg = changes.messages[0];
      const from = msg.from;

      if (msg.type === "text") {
        const text = msg.text?.body;
        await onMessageReceived(from, text, "whatsapp");
      } else if (msg.type === "audio") {
        const mediaId = msg.audio?.id;
        if (mediaId) {
          await handleWhatsappAudio(mediaId, from);
        } else {
          console.log("Audio message missing mediaId");
        }
      } else {
        console.log("invalid message type");
      }
    }

    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
};

export const sendWhatsappMessage = async (to, type, content) => {
  try {
    const url = `https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`;

    const payload = {
      messaging_product: "whatsapp",
      to,
      type,
      [type]: content,
    };

    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (err) {
    console.error("❌ Error sending message: " + err.message);
  }
};

export const buildInteractiveMessage = ({
  type,
  headerText,
  bodyText,
  footerText,
  buttonText,
  options,
}) => {
  if (type === "list") {
    return {
      type: "list",
      header: { type: "text", text: headerText || "" },
      body: { text: bodyText || "" },
      footer: { text: footerText || "" },
      action: {
        button: buttonText || "Select",
        sections: options.map((section) => ({
          title: section.title,
          rows: section.rows.map((row) => ({
            id: row.id,
            title: row.title,
            description: row.description || "",
          })),
        })),
      },
    };
  }

  if (type === "buttons") {
    return {
      type: "button",
      header: { type: "text", text: headerText || "" },
      body: { text: bodyText || "" },
      footer: { text: footerText || "" },
      action: {
        buttons: options.map((btn) => ({
          type: "reply",
          reply: {
            id: btn.id,
            title: btn.title,
          },
        })),
      },
    };
  }

  console.error("Unsupported interactive type: " + type);
};
