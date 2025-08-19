import { validate } from "node-cron";
import {
  completeDispatchRequest,
  getDispatchTotal,
} from "../controllers/dispatch.js";
import { addressHandler } from "./flowHandlers.js";

export const flows = {
  dispatch: [
    {
      name: "senderName",
      question: "Please provide your full name.",
    },
    {
      name: "pickupAddress",
      question: "Where should we pick up the package?",
      handler: async (message, data, stepName) =>
        await addressHandler(message, data, stepName),
    },
    {
      name: "recipientName",
      question: "Please provide the recipient's full name.",
    },
    {
      name: "recipientPhone",
      question: "Please provide the recipient's phone number.",
      validate: (input) =>
        /^(?:\+?234|0)(701|702|703|704|705|706|707|708|709|802|803|804|805|806|807|808|809|810|811|812|813|814|815|816|817|818|819|901|902|903|904|905|906|907|908|909|911|912|913|915|916)\d{7}$/.test(
          input
        ),
    },
    {
      name: "deliveryAddress",
      question: "Where should we deliver it?",
      handler: async (message, data, stepName) =>
        await addressHandler(message, data, stepName),
    },
    {
      name: "deliveryDetails",
      question: "What would you like to send?\n(Describe the package)",
    },
    {
      name: "deliveryType",
      question: "Do you want Express or Standard delivery?",
      validate: (input) => ["Express", "Standard"].includes(input),
    },
    {
      name: "total",
      question: async (data) => await getDispatchTotal(data),
      validate: (input, intent) =>
        ["confirm.yes", "confirm.no"].includes(intent),
      handler: async (message, data, stepName, intent, userId) =>
        await completeDispatchRequest(data, intent, userId),
    },
    {
      name: "paystackLink",
      question: async (data) => data.total,
    },
  ],

  errand: [
    { name: "item", question: "What item do you want us to buy?" },
    {
      name: "purchaseLocation",
      question: "Where should we buy it from?",
      handler: async (message, data, stepName) =>
        await addressHandler(message, data, stepName),
    },
    {
      name: "deliveryAddress",
      question: "Where should we deliver it?",
      handler: async (message, data, stepName) =>
        await addressHandler(message, data, stepName),
    },
  ],
  enquiry: [
    { name: "from", question: "What's the pickup location for your enquiry?" },
    { name: "to", question: "What's the delivery location for your enquiry?" },
  ],
  order: [
    { name: "item", question: "What item would you like to order?" },
    {
      name: "deliveryAddress",
      question: "Where should we deliver it?",
      handler: async (message, data, stepName) =>
        await addressHandler(message, data, stepName),
    },
  ],
};
