const User = require("../models/userModel");
const DocSet = require("../models/docSetModel"); //docSetModel is imported to interact with docSet collection
const Embedding = require("../models/embeddingModel");
const { OpenAI } = require("openai");
const axios = require("axios");
const pdf = require("pdf-parse");
const mongoose = require("mongoose");

// initialize openai client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// HELPER METHODS FOR MODULARITY
const downloadPDF = async (pdfUrl) => {
  const response = await axios.get(pdfUrl, { responseType: "arraybuffer" });
  return response.data;
};

const extractTextFromPDF = async (pdfBuffer) => {
  const data = await pdf(pdfBuffer);
  return data.text;
};

const splitIntoChunks = (text) => {
  return text.split(/\n\s*\n/).map((chunk) => chunk.trim());
};

const generateEmbedding = async (textChunk) => {
  const embeddingResponse = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: textChunk,
  });

  const embedding = embeddingResponse?.data[0]?.embedding;

  console.log("embedding: ", embedding);
};

const saveEmbeddingToDB = async ({
  fileId,
  chunkIndex,
  textChunk,
  embedding,
  metadata,
}) => {
  const entry = new Embedding({
    docSetId,
    fileId,
    chunkIndex,
    pageNumber: 1,
    textChunk,
    embedding,
    metadata,
  });

  await entry.save();
  return entry;
};

const PDFEmbedding = async (req, res) => {
  const { pdfUrl, docSetId } = req.body;

  try {
    const pdfBuffer = await downloadPDF(pdfUrl);
    const text = await extractTextFromPDF(pdfBuffer);
    const chunks = splitIntoChunks(text);
    const fileId = new mongoose.Types.ObjectId();

    const savedEmbeddings = []; // for logging/success purposes

    for (let i = 0; i < chunks.length; i++) {
      const textChunk = chunks[i];
      const embedding = await generateEmbedding(textChunk);

      if (!embedding) {
        console.warn(`Failed to generate embedding for chunk ${i}`);
        continue;
      }

      const saved = await saveEmbeddingToDB({
        docSetId,
        fileId,
        chunkIndex: i,
        textChunk,
        embedding,
        metadata: { source: pdfUrl },
      });

      savedEmbeddings.push(saved);
    }

    res.status(201).json({
      message: "Embeddings created successfully",
      count: savedEmbeddings,
      fileId: fileId,
    });
  } catch (error) {
    console.error("PDF embedding failed: ", error);

    // More specific error messages
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: "PDF URL not found" });
    }

    if (error.code === "ECONNREFUSED") {
      return res.status(503).json({ message: "OpenAI service unavailable" });
    }

    res.status(500).json({ message: "Failed to embed PDF" });
  }
};

module.exports = {
  PDFEmbedding,
};
