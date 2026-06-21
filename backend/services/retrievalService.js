import OpenAI from "openai";
import Chunk from "../models/chunkModel.js";
import dotenv from "dotenv";
import process from "process";
dotenv.config();

const getOpenAIClient = () =>
  new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENAI_API_KEY,
  });

export const retrieveDocuments = async (
  question,
  categoryFilter,
  workspaceId,
) => {
  const openai = getOpenAIClient();
  const embeddingRes = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: question,
  });

  const queryVector = embeddingRes.data[0].embedding;

  try {
    const pipeline = [
      {
        $vectorSearch: {
          queryVector,
          path: "embedding",
          numCandidates: 150,
          limit: 8,
          index: "default",
        },
      },
    ];

    // Filter by workspace
    if (workspaceId) {
      pipeline.push({
        $match: { workspaceId: workspaceId },
      });
    }

    // Filter by category
    if (categoryFilter && categoryFilter.toLowerCase() !== "all") {
      pipeline.push({
        $match: { category: categoryFilter },
      });
    }

    pipeline.push({
      $project: {
        text: 1,
        category: 1,
        documentName: 1,
        pageNumber: 1,
        score: { $meta: "vectorSearchScore" },
      },
    });

    const results = await Chunk.aggregate(pipeline);

    if (results && results.length > 0) {
      return results;
    }
    throw new Error(
      "VectorSearch returned 0 results. Falling back to local cosine similarity.",
    );
  } catch (error) {
    const filter = {};
    if (workspaceId) {
      filter.workspaceId = workspaceId;
    }
    if (categoryFilter && categoryFilter.toLowerCase() !== "all") {
      filter.category = categoryFilter;
    }
    const allChunks = await Chunk.find(filter).lean();

    if (!allChunks || allChunks.length === 0) return [];

    const vectorLength = queryVector.length;
    const scoredChunks = allChunks.map((chunk) => {
      const dbVector = chunk.embedding;
      let dotProduct = 0;
      let normA = 0;
      let normB = 0;
      for (let i = 0; i < vectorLength; i++) {
        dotProduct += queryVector[i] * dbVector[i];
        normA += queryVector[i] * queryVector[i];
        normB += dbVector[i] * dbVector[i];
      }
      const score = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
      return { ...chunk, score };
    });

    scoredChunks.sort((a, b) => b.score - a.score);
    return scoredChunks.slice(0, 8);
  }
};
