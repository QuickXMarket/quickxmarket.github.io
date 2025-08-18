// ConversationManager.js
export class ConversationManager {
  constructor(timeoutMs = 10 * 60 * 1000) {
    this.sessions = new Map(); 
    this.flows = {}; 
    this.timeoutMs = timeoutMs;
  }

  // Define a flow for an intent
  registerFlow(intent, steps) {
    this.flows[intent] = steps;
  }

  // Get or create session
  getSession(userId) {
    if (!this.sessions.has(userId)) {
      this.sessions.set(userId, {
        currentIntent: null,
        pendingStep: null,
        data: {},
        history: [],
      });
    }
    return this.sessions.get(userId);
  }

  // Process a message
  async handleMessage(userId, message, nlpResponse) {
    const session = this.getSession(userId);
    session.history.push({ from: "user", text: message });

    // Case 1: Already in a flow
    if (session.currentIntent) {
      const flow = this.flows[session.currentIntent];
      if (!flow) {
        session.currentIntent = null;
        session.pendingStep = null;
        return "Something went wrong with this flow.";
      }

      const stepIndex = flow.findIndex((s) => s.name === session.pendingStep);

      // Validate input if validator exists
      const step = flow[stepIndex];
      if (step.validate && !step.validate(message)) {
        const botReply = `Invalid input. ${step.question}`;
        session.history.push({ from: "bot", text: botReply });
        return botReply;
      }

      // Save user input in session data
      session.data[session.pendingStep] = message;

      // Move to next step or finish
      if (stepIndex + 1 < flow.length) {
        session.pendingStep = flow[stepIndex + 1].name;
        const botReply = flow[stepIndex + 1].question;
        session.history.push({ from: "bot", text: botReply });
        return botReply;
      } else {
        // Flow completed
        const botReply = `✅ ${
          session.currentIntent
        } request completed: ${JSON.stringify(session.data)}`;
        session.currentIntent = null;
        session.pendingStep = null;
        session.data = {};
        session.history.push({ from: "bot", text: botReply });
        return botReply;
      }
    }

    // Case 2: No active flow → start a new one if intent matches
    if (nlpResponse.intent && this.flows[nlpResponse.intent]) {
      session.currentIntent = nlpResponse.intent;
      session.pendingStep = this.flows[nlpResponse.intent][0].name;
      const botReply = this.flows[nlpResponse.intent][0].question;
      session.history.push({ from: "bot", text: botReply });
      return botReply;
    }

    // Case 3: Fallback
    return (
      nlpResponse.answer || "Sorry, I didn't understand that. Can you rephrase?"
    );
  }
}
