import OpenAI from "openai";
import dotenv from "dotenv";
import process from "process";
dotenv.config();

const getOpenAIClient = () =>
  new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENAI_API_KEY,
  });

export const generateAnswer = async (question, contextDocs) => {
  const openai = getOpenAIClient();
  // Advanced compilation of multi-document reasoning context using citation tags explicitly
  const contextString = contextDocs
    .map(
      (doc, i) => `[Source ${i + 1}]
Document Name: ${doc.documentName}
Page Number: ${doc.pageNumber || 1}
Content: ${doc.text}`,
    )
    .join("\n\n");

  const systemPrompt = `
You are a professional Enterprise AI assistant.

Your task is to comprehensively answer the user's question using ONLY the provided metadata-enriched context.

=====================
🔒 STRICT RULES
=====================
1. Use ONLY the provided context documents to generate the answer.
2. Do NOT use prior knowledge or make assumptions.
3. If the answer cannot be found entirely in the context, respond EXACTLY with:
"I don't have enough context from the documents to answer this question."
4. Do NOT hallucinate any information.

=====================
📚 CITATIONS (MANDATORY)
=====================
- Every fact MUST include a citation.
- Use this format: [Source 1], [Source 2]
- You may combine citations like: [Source 1, Source 3]

=====================
🧾 RESPONSE FORMATTING (VERY IMPORTANT)
=====================
- Always respond in clean Markdown format
- Use clear headings (#, ##, ###)
- Use bullet points where appropriate
- Bold important keywords
- Keep paragraphs short and readable
- Avoid large blocks of text

=====================
👤 SPECIAL CASE: PERSON-BASED QUESTIONS
=====================
If the question is about a person, structure the answer like:

# Name

## Overview
...

## Career Goals
...

## Technical Skills
- ...

## Projects
- ...

## Interests
- ...

(Still follow citation rules strictly)

=====================
🎯 GOAL
=====================
Make the response:
- Structured
- Professional
- Easy to read
- Fully grounded in provided context
`;

  const userPrompt = `
Context documents:
${contextString}

Question:
${question}
`;

  try {
    const response = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini", // Optimized for RAG performance
      max_tokens: 500, // Guardrail against excessive usage costs
      temperature: 0.1, // Stick precisely to context via low temperature
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }, // Clean formatting
      ],
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("[ERROR] generateAnswer failed: ", error.message);
    throw new Error("Failed to generate response from Language Model.");
  }
};
