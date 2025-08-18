import { NlpManager } from "node-nlp";

export const NLPmanager = new NlpManager({ languages: ["en"], forceNER: true });
