import OpenAI from "openai";
import { chunkText } from "../utils/chunkText.js";
import { Chunk } from "../models/chunkModel.js";
import dotenv from "dotenv";
import process from "process";
dotenv.config();

const getOpenAIClient = () => {
  return new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENAI_API_KEY,
  });
};

export const createEmbedding = async (
  text,
  documentName,
  category,
  workspaceId,
) => {
  const openai = getOpenAIClient();
  const chunks = chunkText(text, 1000, 200);

  const batchSize = 100;
  for (let i = 0; i < chunks.length; i += batchSize) {
    const chunkBatch = chunks.slice(i, i + batchSize);

    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: chunkBatch,
    });

    const dbRecords = chunkBatch.map((chunkStr, idx) => {
      const globalIdx = i + idx;
      const estimatedPage = Math.max(1, Math.ceil((globalIdx * 800) / 3000));

      return {
        text: chunkStr,
        embedding: embeddingResponse.data[idx].embedding,
        category: category || "general",
        documentName: documentName || "Unnamed_Document",
        chunkIndex: globalIdx,
        pageNumber: estimatedPage,
        workspaceId: workspaceId || null,
      };
    });

    await Chunk.insertMany(dbRecords);
  }
};

// ADD THIS — simple single-text embedding for the controller
export const createSingleEmbedding = async (text) => {
  const openai = getOpenAIClient();
  const embeddingResponse = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return embeddingResponse.data[0].embedding;
};
