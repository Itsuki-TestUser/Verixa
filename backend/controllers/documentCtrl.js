import { createEmbedding } from "../services/embeddingService.js";
import { Document } from "../models/documentModel.js";
import { Chunk } from "../models/chunkModel.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

export const uploadDocument = async (req, res, next) => {
  try {
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
    const fileExtension = documentName.split(".").pop().toLowerCase();

    console.log(
      "📄 File:",
      documentName,
      "Size:",
      req.file.size,
      "Type:",
      fileExtension,
    );

    let text = "";

    // Handle different file types
    if (fileExtension === "pdf") {
      try {
        const pdfData = await pdfParse(req.file.buffer);
        text = pdfData.text;
        console.log("✅ PDF parsed, text length:", text.length);
      } catch (pdfError) {
        console.error("PDF Parse Error:", pdfError.message);
        res.status(400);
        throw new Error(
          "Invalid or corrupted PDF file. Please check the file and try again.",
        );
      }
    } else if (["txt", "md", "csv"].includes(fileExtension)) {
      text = req.file.buffer.toString("utf-8");
      console.log("✅ Text file read, length:", text.length);
    } else if (["doc", "docx"].includes(fileExtension)) {
      // For DOCX, you'd need mammoth or another parser
      res.status(400);
      throw new Error(
        "DOCX files are not supported yet. Please convert to PDF first.",
      );
    } else {
      res.status(400);
      throw new Error(
        `Unsupported file type: .${fileExtension}. Please upload PDF, TXT, MD, or CSV files.`,
      );
    }

    if (!text || text.trim().length === 0) {
      res.status(400);
      throw new Error(
        "Could not extract any text from the document. The file might be empty or image-based.",
      );
    }

    const doc = await Document.create({
      title: documentName,
      originalName: documentName,
      category,
      filePath: "N/A",
      uploadedBy: req.user._id,
      workspaceId: workspaceId,
    });

    await createEmbedding(text, doc._id.toString(), category, workspaceId);

    res.json({
      message: "Document processed and embedded successfully",
      document: doc,
    });
  } catch (err) {
    console.error("UPLOAD ERROR:", err.message);
    next(err);
  }
};
