import { NLPmanager } from "./manager.js";
import enquiryData from "../intents/enquiry.json" with { type: "json" };
import confirmationData from "../intents/confirmation.json" with { type: "json" };
import cancelData from "../intents/cancel.json" with { type: "json" };
import editFlowData from "../intents/editFlow.json" with { type: "json" };
import fallbackData from "../intents/fallback.json" with { type: "json" };
import faqData from "../intents/faq/index.js";
import termsData from "../intents/terms-conditions/index.js";
import flowsData from "../intents/flows/index.js";
import conversationData from "../intents/conversation/index.js";
import fs from "fs";
import csv from "csv-parser";
import Fuse from "fuse.js";

let fuse = null; 

const allIntents = [
...fallbackData,
  ...enquiryData,
  ...confirmationData,
  ...cancelData,
  ...editFlowData,
  ...faqData,
  ...conversationData,
  ...termsData,
  ...flowsData
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

export const loadFuseConversation = async () => {
  const csvIntents = await loadConversationCSV("./bots/intents/Conversation.csv");

  fuse = new Fuse(csvIntents, {
    keys: ["utterance"],
    threshold: 0.4, 
    includeScore: true,
  });

  console.log("Fuse.js conversation retriever ready!");
  return fuse;
};

export const trainModel = async () => {

  const combinedIntents = [
    ...allIntents,
  ];

for (const { lan, utterance, intent, answer, entities } of combinedIntents) {
  if (utterance && intent) {
    NLPmanager.addDocument(lan, utterance, intent);

    // If entities exist, register them too
    if (entities) {
      for (const [entityName, values] of Object.entries(entities)) {
        for (const value of values) {
          // Add the entity value as a training example
          NLPmanager.addNamedEntityText(
            entityName,       // the entity type (e.g., "field")
            value,            // the value (e.g., "pickupAddress")
            [lan],            // languages
            [value]           // possible text variations
          );
        }
      }
    }
  }

  if (answer) {
    NLPmanager.addAnswer(lan, intent, answer);
  }
}


  NLPmanager.addAnswer("en", "dispatch", "Okay, dispatch request noted.");
  NLPmanager.addAnswer("en", "errand", "Got it, errand request.");
  NLPmanager.addAnswer("en", "enquiry", "Sure, let me calculate cost.");
  NLPmanager.addAnswer("en", "order", "Order request received.");

  NLPmanager.addRegexEntity("code", "en", /\b[a-f0-9]{24}\b/);

  console.log("Training model, please wait...");
  await NLPmanager.train();
  await NLPmanager.save("./bots/nlp/model.nlp");
  console.log("Model trained and saved!");
};

export const queryConversation = (input) => {
  if (!fuse) {
    throw new Error("Fuse not initialized. Call loadFuseConversation() first.");
  }

  const results = fuse.search(input);
  if (results.length > 0) {
  return results.length ? results[0].item.answer :  "Sorry, I didn't understand that. Can you rephrase?";

  }
  return null;
};
