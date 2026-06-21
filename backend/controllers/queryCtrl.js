import { retrieveDocuments } from "../services/retrievalService.js";
import Conversation from "../models/conversationModel.js";
import OpenAI from "openai";
import process from "process";
import { trackUsage } from "../utils/usageTracker.js";

export const askQuestion = async (req, res, next) => {
  try {
    const {
      question,
      category,
      history = [],
      toolModifier,
      conversationId,
    } = req.body;

    if (!question || question.trim().length === 0) {
      res.status(400);
      throw new Error("Question property is required.");
    }

    const modifiedQuestion = toolModifier
      ? `${toolModifier}: ${question}`
      : question;

    const results = await retrieveDocuments(
      modifiedQuestion,
      category,
      req.workspaceId,
    );

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    let fullResponse = "";
    let savedConversationId = null;

    if (!results || results.length === 0) {
      const isGreeting = modifiedQuestion.match(
        /^(hi|hello|hey|greetings|howdy|whats up|how are you)/i,
      );
      if (isGreeting) {
        fullResponse =
          "Hello! I am your Enterprise Knowledge Assistant. How can I help you with your documents today?";
        res.write(
          `data: ${JSON.stringify({ type: "content", data: fullResponse })}\n\n`,
        );
      } else {
        fullResponse = "Information not available in the current documents.";
        res.write(
          `data: ${JSON.stringify({ type: "content", data: fullResponse })}\n\n`,
        );
      }

      savedConversationId = await saveConversation(
        req,
        question,
        fullResponse,
        [],
      );
      if (savedConversationId) {
        res.write(
          `data: ${JSON.stringify({ type: "conversationId", data: savedConversationId })}\n\n`,
        );
      }
      // Track usage for fallback response
      trackUsage({
        workspaceId: req.workspaceId,
        userId: req.user._id,
        action: "query",
        details: { question: question.substring(0, 100) },
        tokensUsed: Math.ceil(fullResponse.length / 4),
      });
      res.write("data: [DONE]\n\n");

      return res.end();
    }

    const rawCitations = results.map((r) => ({
      document: r.documentName,
      page: r.pageNumber || 1,
      category: r.category,
    }));

    const citations = rawCitations.filter(
      (v, i, a) =>
        a.findIndex((t) => t.document === v.document && t.page === v.page) ===
        i,
    );

    res.write(
      `data: ${JSON.stringify({ type: "citations", data: citations })}\n\n`,
    );

    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENAI_API_KEY,
    });

    const contextText = results.map((r) => r.text).join("\n\n");

    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an Enterprise Knowledge Assistant. Base your answer strictly on the provided context below. Do not omit citations or make up info.\n\nContext:\n${contextText}`,
        },
        ...history.map((msg) => ({
          role: msg.isAi ? "assistant" : "user",
          content: msg.text || msg.content,
        })),
        { role: "user", content: modifiedQuestion },
      ],
      stream: true,
      max_tokens: 1500,
    });

    for await (const chunk of completion) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        fullResponse += content;
        res.write(
          `data: ${JSON.stringify({ type: "content", data: content })}\n\n`,
        );
      }
    }

    savedConversationId = await saveConversation(
      req,
      question,
      fullResponse,
      citations,
    );
    if (savedConversationId) {
      res.write(
        `data: ${JSON.stringify({ type: "conversationId", data: savedConversationId })}\n\n`,
      );
    }
    res.write("data: [DONE]\n\n");
    res.end();

    // Track usage
    await trackUsage({
      workspaceId: req.workspaceId,
      userId: req.user._id,
      action: "query",
      details: { question: question.substring(0, 100) },
      tokensUsed: Math.ceil(fullResponse.length / 4),
    });
  } catch (err) {
    if (!res.headersSent) {
      next(err);
    } else {
      res.write(
        `data: ${JSON.stringify({ type: "error", data: err.message })}\n\n`,
      );
      res.end();
    }
  }
};

const saveConversation = async (req, userMessage, aiResponse, citations) => {
  try {
    const title =
      userMessage.substring(0, 50) + (userMessage.length > 50 ? "..." : "");
    const workspaceId = req.workspaceId || null;
    const conversationId = req.body.conversationId || null;

    let conversation;

    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
      if (conversation) {
        conversation.updatedAt = new Date();
      }
    }

    if (!conversation) {
      conversation = new Conversation({
        user: req.user._id,
        title: title,
        workspaceId: workspaceId,
        messages: [],
      });
    }

    conversation.messages.push({
      id: Date.now(),
      isAi: false,
      text: userMessage,
    });

    conversation.messages.push({
      id: Date.now() + 1,
      isAi: true,
      text: aiResponse,
      citations: citations,
    });

    await conversation.save();
    console.log("✅ Conversation saved:", conversation._id);
    return conversation._id;
  } catch (error) {
    console.error("❌ Failed to save conversation:", error.message);
    return null;
  }
};
