export class ConversationManager {
  constructor(timeoutMs = 10 * 60 * 1000) {
    this.sessions = new Map();
    this.flows = {};
    this.timeoutMs = timeoutMs;
  }

  registerFlow(intent, steps) {
    this.flows[intent] = steps;
  }

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

  _reply(session, text) {
    session.history.push({ from: "bot", text });
    return text;
  }

  _completeFlow(session) {
    const botReply = `✅ ${
      session.currentIntent
    } request completed: ${JSON.stringify(session.data)}`;
    session.history.push({ from: "bot", text: botReply });

    session.currentIntent = null;
    session.pendingStep = null;
    session.data = {};

    return botReply;
  }

  async handleMessage(userId, message, nlpResponse) {
    const session = this.getSession(userId);
    session.history.push({ from: "user", text: message });

    if (nlpResponse.intent === "edit_step") {
      const rawField = nlpResponse.entities?.field?.[0]?.value?.toLowerCase();

      // Map entity → step name
      const stepName = FIELD_TO_STEP[rawField];

      if (stepName) {
        const flow = this.flows[session.currentIntent];
        const targetStep = flow.find((s) => s.name === stepName);

        if (targetStep) {
          session.pendingStep = targetStep.name;
          return this._reply(
            session,
            `Okay, let's update your ${rawField}.\n${targetStep.question}`
          );
        }
      }

      return this._reply(
        session,
        "Which detail would you like to change? (pickup, delivery address, recipient name, phone, etc.)"
      );
    }

    // Case 1: Already in a flow
    if (session.currentIntent) {
      const flow = this.flows[session.currentIntent];
      if (!flow) {
        session.currentIntent = null;
        session.pendingStep = null;
        return "Something went wrong with this flow.";
      }

      let stepIndex = flow.findIndex((s) => s.name === session.pendingStep);
      let step = flow[stepIndex];

      // Validator check
      if (step.validate && !step.validate(message, nlpResponse.intent)) {
        return this._reply(session, `Invalid input. ${step.question}`);
      }

      let result = {};
      if (step.handler) {
        result = await step.handler(
          message,
          session.data,
          step.name,
          nlpResponse.intent,
          userId
        );
        if (result?.retry) {
          return this._reply(session, result.message);
        }
      }

      // Save input/result
      session.data[session.pendingStep] = result?.selected || message;

      if (result?.nextStep) {
        session.pendingStep = result.nextStep;
      } else if (stepIndex >= 0 && stepIndex + 1 < flow.length) {
        session.pendingStep = flow[stepIndex + 1].name;
      } else {
        return this._completeFlow(session);
      }

      const nextStep = flow.find((s) => s.name === session.pendingStep);
      if (!nextStep) {
        return this._completeFlow(session);
      }

      return this._reply(
        session,
        typeof nextStep.question === "function"
          ? await nextStep.question(session.data)
          : nextStep.question
      );
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
