const { StateGraph, Annotation, START, END } = require('@langchain/langgraph');

/**
 * Agent State Definition
 * Defines the schema of the state that flows through the graph nodes.
 */
const AgentState = Annotation.Root({
  // Input prompt or message history
  input: Annotation({
    reducer: (curr, update) => (update !== undefined ? update : curr),
    default: () => '',
  }),
  // History of steps / reasoning logs
  steps: Annotation({
    reducer: (curr, update) => (update ? curr.concat(update) : curr),
    default: () => [],
  }),
  // Intermediate thoughts or context
  context: Annotation({
    reducer: (curr, update) => ({ ...curr, ...update }),
    default: () => ({}),
  }),
  // Final response produced by the agent
  output: Annotation({
    reducer: (curr, update) => (update !== undefined ? update : curr),
    default: () => '',
  }),
});

/**
 * Node 1: Input Analysis & Pre-processing
 */
const analyzeInputNode = async (state) => {
  const { input } = state;
  const timestamp = new Date().toISOString();
  
  return {
    steps: [`[${timestamp}] Analyzed input: "${input}"`],
    context: {
      receivedAt: timestamp,
      charCount: input ? input.length : 0,
    },
  };
};

/**
 * Node 2: Reasoning & Execution Step
 * This is where LLM calls, tool executions, or business logic happen.
 */
const executeReasoningNode = async (state) => {
  const { input, context } = state;
  const timestamp = new Date().toISOString();

  // Simulated agent reasoning (can be replaced/augmented with ChatOpenAI/ChatGoogleGenerativeAI etc.)
  const reasoningLog = `[${timestamp}] Processed reasoning pipeline for query: "${input}"`;
  
  const generatedOutput = `Agent Response: Processed request "${input}". All nodes executed successfully.`;

  return {
    steps: [reasoningLog],
    output: generatedOutput,
  };
};

/**
 * Node 3: Post-processing & Finalization
 */
const finalizeResponseNode = async (state) => {
  const { output } = state;
  const timestamp = new Date().toISOString();

  return {
    steps: [`[${timestamp}] Finalized agent execution.`],
    output: output.trim(),
  };
};

/**
 * Build and compile the LangGraph Workflow
 */
const createAgentGraph = () => {
  const workflow = new StateGraph(AgentState)
    .addNode('analyzeInput', analyzeInputNode)
    .addNode('executeReasoning', executeReasoningNode)
    .addNode('finalizeResponse', finalizeResponseNode)
    .addEdge(START, 'analyzeInput')
    .addEdge('analyzeInput', 'executeReasoning')
    .addEdge('executeReasoning', 'finalizeResponse')
    .addEdge('finalizeResponse', END);

  return workflow.compile();
};

// Compiled singleton agent instance
const agent = createAgentGraph();

/**
 * Helper function to run the agent with a given input query
 * @param {string} input - The user prompt or task for the agent
 * @param {object} [context] - Optional initial context
 * @returns {Promise<{ output: string, steps: string[], context: object }>}
 */
const runAgent = async (input, context = {}) => {
  const initialState = {
    input,
    steps: [],
    context,
    output: '',
  };

  const finalState = await agent.invoke(initialState);
  return finalState;
};

module.exports = {
  AgentState,
  createAgentGraph,
  agent,
  runAgent,
};
