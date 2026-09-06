const { StateGraph, Annotation, START, END } = require('@langchain/langgraph');
const intentNode = require('./nodes/intentNode');
const ragSearchNode = require('./nodes/ragSearchNode');
const responseNode = require('./nodes/responseNode');

/**
 * Chatbot State Schema
 */
const ChatState = Annotation.Root({
  userMessage: Annotation({ default: () => '' }),
  history: Annotation({ default: () => [] }),
  district: Annotation({ default: () => 'Ranchi' }),
  language: Annotation({ default: () => 'hinglish' }),
  intent: Annotation({ default: () => 'GENERAL_CHAT' }),
  retrievedContext: Annotation({ default: () => '' }),
  botReply: Annotation({ default: () => '' }),
  complaintData: Annotation({ default: () => null }),
  steps: Annotation({
    reducer: (curr, update) => (update ? curr.concat(update) : curr),
    default: () => [],
  }),
});

/**
 * Build & Compile Sahayak AI Chatbot StateGraph
 */
const buildChatbotGraph = () => {
  const workflow = new StateGraph(ChatState)
    .addNode('classifyIntent', intentNode)
    .addNode('ragSearch', ragSearchNode)
    .addNode('generateResponse', responseNode)
    .addEdge(START, 'classifyIntent')
    .addEdge('classifyIntent', 'ragSearch')
    .addEdge('ragSearch', 'generateResponse')
    .addEdge('generateResponse', END);

  return workflow.compile();
};

const sahayakChatbot = buildChatbotGraph();

/**
 * Run Chatbot
 * @param {string} userMessage
 * @param {Array<{role: string, content: string}>} history
 * @param {string} district
 * @param {string} language
 */
const talkToSahayak = async (userMessage, history = [], district = 'Ranchi', language = 'hinglish') => {
  const result = await sahayakChatbot.invoke({
    userMessage,
    history,
    district,
    language,
    steps: [],
  });
  return result;
};

module.exports = {
  sahayakChatbot,
  talkToSahayak,
};
