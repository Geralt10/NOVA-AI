import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage, AIMessage, tool, createAgent } from "langchain";
import { ChatMistralAI } from "@langchain/mistralai";
import * as z from "zod";
import { searchInternet } from "./internet.service.js";

const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-3.1-flash-lite",
  apiKey: process.env.GEMINI_API_KEY,
  temperature:0,
});

const mistralModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
});

const searchInternetTool = tool(searchInternet, {
  name: "web_search",
  description:
    "Search the web for current or recent information. Use only once per request.",
  schema: z.object({
    query: z.string().describe("search query"),
  }),
});

const agent = createAgent({
  model: geminiModel,
  tools: [searchInternetTool],
});

export async function generateResponse(messages) {
  const response = await agent.invoke(
    {
      messages: [
      new SystemMessage(`
You are Nova AI, a highly intelligent and reliable AI assistant.

Instructions:
- Answer clearly and accurately.
- Use the searchInternet tool ONLY when the user asks for recent, current, real-time, or internet-specific information.
- After receiving search results, answer the user directly.
- Never call the searchInternet tool more than once for the same user request unless the previous search failed.
- After using the searchInternet tool exactly once, you MUST generate a final answer for the user using only the tool's output.
- Never call the searchInternet tool again after receiving its results.
- Never invent facts.
- Present answers in clean Markdown.
- When writing code, provide production-ready solutions.
`),
        ...messages.map((msg) => {
          if (msg.role == "user") {
            return new HumanMessage(msg.content);
          } else if (msg.role == "ai") {
            return new AIMessage(msg.content);
          }
        }),
      ],
    },
    {
      recursionLimit: 5,
    }
  );
  return response.messages[response.messages.length - 1].text;
}

export async function generateChatTitle(message) {
  const response = await mistralModel.invoke([
    new SystemMessage(`
You are an expert conversation title generator.

Generate a concise, human-friendly title that accurately summarizes the user's message.

Requirements:
- Output ONLY the title.
- 3–6 words.
- No quotes.
- No markdown.
- No emojis.
- No explanations.
- Use Title Case.
- Focus on the main intent.
- Preserve technical terms (React, Express, JWT, MongoDB, Socket.IO, etc.) when applicable.
`),
    new HumanMessage(`Create a short title for this message:\n\n${message}`),
  ]);

  return response.text;
}
