import fs from "fs";
import path from "path";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
import { trackUsage } from "../utils/usageTracker.js";
import { createSingleEmbedding } from "../services/embeddingService.js";
import { Document } from "../models/documentModel.js";
import Chunk from "../models/chunkModel.js";
import Workspace from "../models/workspaceModel.js";

function cleanText(text) {
  return text
    .replace(/[\r\n]+/g, " ")
    .replace(/HR Policies – Verixa Corp/gi, "")
    .replace(/([A-Za-z])\1{2,}/g, "$1")
    .replace(/[^\x20-\x7E]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function chunkText(text, chunkSize = 200) {
  const words = text.split(" ");
  const chunks = [];
  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize).join(" "));
  }
  return chunks;
}

export const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error("No file uploaded!");
    }

    // Get workspaceId
    let workspaceId =
      req.workspaceId || req.headers["x-workspace-id"] || req.body.workspaceId;

    if (!workspaceId && req.user?._id) {
      const workspace = await Workspace.findOne({
        owner: req.user._id,
        isDefault: true,
      });
      workspaceId = workspace?._id || null;
    }

    console.log("🔍 FINAL workspaceId:", workspaceId);

    const filePath = req.file.path;
    const documentName = req.file.originalname;
    const category = req.body.category || "Other";

    let text = "";
    const ext = path.extname(documentName).toLowerCase();

    if (ext === ".pdf") {
      const buffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(buffer);
      text = pdfData.text;
    } else if (ext === ".docx" || ext === ".doc") {
      const result = await mammoth.extractRawText({ path: filePath });
      text = result.value;
    } else {
      text = fs.readFileSync(filePath, "utf-8");
    }

    if (!text || text.trim().length === 0) {
      throw new Error("No text extracted from document");
    }

    const cleanedText = cleanText(text);
    const chunks = chunkText(cleanedText, 200);

    console.log("Total chunks:", chunks.length);

    const doc = await Document.create({
      title: documentName,
      originalName: documentName,
      category,
      filePath: `uploads/${req.file.filename}`,
      uploadedBy: req.user._id,
      workspaceId: workspaceId,
    });
    await trackUsage({
      workspaceId: req.workspaceId,
      userId: req.user._id,
      action: "upload",
      details: { documentName: documentName },
      documentSize: req.file.size,
    });

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      if (!chunk.trim()) continue;

      const embedding = await createSingleEmbedding(chunk);
      await Chunk.create({
        text: chunk,
        embedding,
        documentName: doc.title,
        chunkIndex: i,
        category,
        workspaceId: workspaceId,
      });
    }

    res.json({
      message: "Document uploaded & processed successfully",
      chunks: chunks.length,
      document: doc,
    });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(err);
  }
};

export const getDocuments = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category && req.query.category !== "All") {
      filter.category = req.query.category;
    }
    if (req.workspaceId) {
      filter.workspaceId = req.workspaceId;
    }
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
    await trackUsage({
      workspaceId: req.workspaceId,
      userId: req.user._id,
      action: "document_delete",
      details: { documentName: document.originalName },
    });
    await Chunk.deleteMany({
      documentName: document.originalName,
      workspaceId: req.workspaceId,
    });

    await document.deleteOne();
    res.json({ message: "Document removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
