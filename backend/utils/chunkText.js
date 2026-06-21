export const chunkText = (text, chunkSize = 1000, overlap = 200) => {
  if (!text) return [];
  
  const chunks = [];
  let startIndex = 0;
  
  while (startIndex < text.length) {
    let endIndex = startIndex + chunkSize;
    if (endIndex >= text.length) {
      chunks.push(text.slice(startIndex));
      break;
    }
    
    // Look for a space to break naturally
    const lastSpace = text.lastIndexOf(" ", endIndex);
    if (lastSpace > startIndex) {
      endIndex = lastSpace;
    }
    
    chunks.push(text.slice(startIndex, endIndex));
    startIndex = endIndex - overlap;
  }
  
  return chunks;
};
