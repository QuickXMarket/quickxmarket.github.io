
import greetingsData from "./greetings.json" with { type: "json" };
import conversation1Data from "./conversation-1.json" with { type: "json" };
import conversation2Data from "./conversation-2.json" with { type: "json" };
import conversation3Data from "./conversation-3.json" with { type: "json" };
import conversation4Data from "./conversation-4.json" with { type: "json" };
import pidginGreetingsData from "./pidginGreetings.json" with { type: "json" };
import pidginConversationData from "./pidginConversation.json" with { type: "json" };

const conversationData =[
  ...greetingsData,
  ...conversation1Data,
  ...conversation2Data,
  ...conversation3Data,
  ...conversation4Data,
  ...pidginConversationData,
  ...pidginGreetingsData
]

  export default conversationData