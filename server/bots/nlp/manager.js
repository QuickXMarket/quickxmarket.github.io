import { NlpManager } from "node-nlp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ConversationManager } from "../utils/ConversationManager.js";
import { sendWhatsappMessage } from "../Whatsapp/client.js";
import { flows } from "../utils/flows.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const convManager = new ConversationManager();

export const NLPmanager = new NlpManager({ languages: ["en"], forceNER: true });

for (const [intent, steps] of Object.entries(flows)) {
  convManager.registerFlow(intent, steps);
}

export const loadModel = async () => {
  const modelPath = path.join(__dirname, "model.nlp");

  if (fs.existsSync(modelPath)) {
    NLPmanager.load(modelPath);
    console.log("Model loaded successfully!");
  } else {
    throw new Error("No trained model found. Run train.js first.");
  }
};

export const onMessageReceived = async (userId, text) => {
  const nlpResponse = await NLPmanager.process("en", text);
  const reply = await convManager.handleMessage(userId, text, nlpResponse);
  sendWhatsappMessage(userId, reply);
};
