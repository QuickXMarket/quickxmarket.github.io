import { NLPmanager } from "./manager.js";
import dispatchData from "../intents/dispatch.json" with { type: "json" };
import errandData from "../intents/errand.json" with { type: "json" };
import enquiryData from "../intents/enquiry.json" with { type: "json" };
import orderData from "../intents/order.json" with { type: "json" };
import greetingsData from "../intents/greetings.json" with { type: "json" };
import confirmationData from "../intents/confirmation.json" with { type: "json" };
import conversationData from "../intents/conversation.json" with { type: "json" };
import pidginGreetingsData from "../intents/pidginGreetings.json" with { type: "json" };
import pidginConversationData from "../intents/pidginConversation.json" with { type: "json" };
import fs from "fs";
import csv from "csv-parser";   

const allIntents = [
  ...dispatchData,
  ...errandData,
  ...enquiryData,
  ...orderData,
  ...greetingsData,
  ...confirmationData,
  ...conversationData,
  ...pidginConversationData,
  ...pidginGreetingsData
];

const loadConversationCSV = async (filePath) => {
  return new Promise((resolve, reject) => {
    const qaIntents = [];
    let index = 1;

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        const question = row["question"]?.trim();
        const answer = row["answer"]?.trim();

        if (question && answer) {
          qaIntents.push({
            lan: "en",
            utterance: question,
            intent: `qa_${index}`,
            answer: answer,
          });
          index++;
        }
      })
      .on("end", () => {
        console.log(`Loaded ${qaIntents.length} Q&A pairs from CSV`);
        resolve(qaIntents);
      })
      .on("error", reject);
  });
};

export const trainModel = async () => {
  const csvIntents = await loadConversationCSV("./bots/intents/Conversation.csv");

  const combinedIntents = [
    ...allIntents,
    // ...csvIntents
  ];

  for (const { lan, utterance, intent, answer } of combinedIntents) {
    if (utterance && intent) {
      NLPmanager.addDocument(lan, utterance, intent);
    }
    if (answer) {
      NLPmanager.addAnswer(lan, intent, answer);
    }
  }

  NLPmanager.addAnswer("en", "dispatch", "Okay, dispatch request noted.");
  NLPmanager.addAnswer("en", "errand", "Got it, errand request.");
  NLPmanager.addAnswer("en", "enquiry", "Sure, let me calculate cost.");
  NLPmanager.addAnswer("en", "order", "Order request received.");

  NLPmanager.addRegexEntity('code', 'en', /\b[a-f0-9]{24}\b/);

  console.log("Training model, please wait...");
  await NLPmanager.train();
  await NLPmanager.save("./bots/nlp/model.nlp");
  console.log("Model trained and saved!");
};
