import { createRequire } from "module";
const require = createRequire(import.meta.url);

let pdfjsLib;

const initPdfJs = async () => {
  if (!pdfjsLib) {
    pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
    // Disable worker for Railway compatibility
    pdfjsLib.GlobalWorkerOptions.workerSrc = false;
  }
  return pdfjsLib;
};

export const extractTextFromPDF = async (buffer) => {
  try {
    const pdfjs = await initPdfJs();

    // Convert Buffer to Uint8Array
    const uint8Array = new Uint8Array(buffer);

    // Load PDF
    const pdf = await pdfjs.getDocument({ data: uint8Array }).promise;

    let fullText = "";

    // Extract text from each page
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map((item) => item.str).join(" ");
      fullText += pageText + "\n";
    }

    return fullText.trim();
  } catch (error) {
    console.error("PDF Extraction Error:", error.message);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
};
