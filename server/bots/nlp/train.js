import { NLPmanager } from "./manager.js";
import dispatchData from "../intents/dispatch.json" with { type: "json" };
import errandData from "../intents/errand.json" with { type: "json" };
import enquiryData from "../intents/enquiry.json" with { type: "json" };
import orderData from "../intents/order.json" with { type: "json" };

const allIntents = [
  ...dispatchData,
  ...errandData,
  ...enquiryData,
  ...orderData,
];

export const trainModel = async () => {
  for (const { lan, utterance, intent } of allIntents) {
    NLPmanager.addDocument(lan, utterance, intent);
  }

  NLPmanager.addAnswer("en", "dispatch", "Okay, dispatch request noted.");
NLPmanager.addAnswer("en", "errand", "Got it, errand request.");
NLPmanager.addAnswer("en", "enquiry", "Sure, let me calculate cost.");
NLPmanager.addAnswer("en", "order", "Order request received.");
  await NLPmanager.train();
  await NLPmanager.save();
};
