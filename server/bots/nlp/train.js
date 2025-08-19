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
import { NlpManager } from "node-nlp";

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

export const trainModel = async () => {
  for (const { lan, utterance, intent, answer } of allIntents) {
    if(utterance ==="I'm good, thanks") console.log(lan, utterance, intent, answer)
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

  await NLPmanager.train();
  await NLPmanager.save("./bots/NLP/model.nlp"); 
};
