export const flows = {
  dispatch: [
    { name: "pickupAddress", question: "Where should we pick up the package?" },
    { name: "deliveryAddress", question: "Where should we deliver it?" },
    {
      name: "deliveryType",
      question: "Do you want express or standard delivery?",
    },
  ],
  errand: [
    { name: "item", question: "What item do you want us to buy?" },
    { name: "purchaseLocation", question: "Where should we buy it from?" },
    { name: "deliveryAddress", question: "Where should we deliver it?" },
  ],
  enquiry: [
    { name: "from", question: "What's the pickup location for your enquiry?" },
    { name: "to", question: "What's the delivery location for your enquiry?" },
  ],
  order: [
    { name: "item", question: "What item would you like to order?" },
    { name: "deliveryAddress", question: "Where should we deliver it?" },
  ],
};
