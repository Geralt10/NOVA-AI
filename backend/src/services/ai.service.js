import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage, AIMessage } from "langchain";
import { ChatMistralAI } from "@langchain/mistralai";

const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-3.1-flash-lite",
  apiKey: process.env.GEMINI_API_KEY,
});

const mistralModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
});

export async function generateResponse(messages) {
  const response = await geminiModel.invoke(
    messages.map((msg) => {
      if (msg.role == "user") {
        return new HumanMessage(msg.content);
      } else if (msg.role == "ai") {
        return new AIMessage(msg.content);
      }
    })
  );

  return response.text;
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
