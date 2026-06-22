import { createEmbedding } from "../services/embeddingService.js";
import { Document } from "../models/documentModel.js";
import { Chunk } from "../models/chunkModel.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

export const uploadDocument = async (req, res, next) => {
  try {
    // Get workspaceId from header or find default
    let workspaceId = req.headers["x-workspace-id"] || req.body.workspaceId;

    if (!workspaceId) {
      const Workspace = (await import("../models/workspaceModel.js")).default;
      const workspace = await Workspace.findOne({
        owner: req.user._id,
        isDefault: true,
      });
      workspaceId = workspace?._id || null;
    }

    console.log("🔍 FINAL workspaceId:", workspaceId);

    if (!req.file) {
      res.status(400);
      throw new Error("No file uploaded! Ensure it is a valid PDF or DOCX.");
    }

    const documentName = req.file.originalname;
    const category = req.body.category || "Other";

    const pdfData = await pdfParse(req.file.buffer);
    const text = pdfData.text;
    if (!text || text.trim().length === 0) {
      res.status(400);
      throw new Error("Could not extract any text from the given document.");
    }

    const doc = await Document.create({
      title: documentName,
      originalName: documentName,
      category,
      filePath: "N/A", // No file path since we're using memory
      uploadedBy: req.user._id,
      workspaceId: workspaceId,
    });

    await createEmbedding(text, doc._id.toString(), category, workspaceId);

    // No need to delete file from disk since it was never saved

    res.json({
      message: "Document processed and embedded successfully",
      document: doc,
    });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    // No file cleanup needed since we're using memory storage
    next(err);
  }
};

export const getDocuments = async (req, res) => {
  try {
    const filter =
      req.query.category && req.query.category !== "All"
        ? { category: req.query.category }
        : {};
    const documents = await Document.find(filter)
      .sort({ createdAt: -1 })
      .populate("uploadedBy", "name");
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Delete only chunks belonging to this specific document
    await Chunk.deleteMany({
      documentName: document.originalName,
      workspaceId: req.workspaceId,
      category: document.category,
    });

    await Document.findByIdAndDelete(req.params.id);
    res.json({ message: "Document removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
