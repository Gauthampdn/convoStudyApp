const User = require("../models/userModel");
const Embedding = require("../models/embeddingModel");
const { OpenAI } = require("openai");
const axios = require("axios");
const pdf = require("pdf-parse");
const mongoose = require("mongoose");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");

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

// const splitIntoChunks = (text) => {
//   return text.split(/\n\s*\n/).map((chunk) => chunk.trim());
// };

const splitIntoChunks = async (text) => {
  //   console.log(text);
  //   console.log("splitIntoChunks Function");
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
    separators: ["\n\n", "\n", ". ", " ", ""],
  });
  const chunks = await splitter.createDocuments([text]);
  //   console.log(chunks);
  return chunks;
};

const generateEmbedding = async (textChunk) => {
  //   console.log("generateEmbedding Function");
  //   console.log(textChunk);
  const embeddingResponse = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: textChunk,
  });

  const embedding = embeddingResponse?.data[0]?.embedding;

  //   console.log("embedding: ", embedding);
  return embedding;
};

const saveEmbeddingToDB = async ({
  docSetId,
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
    const chunks = await splitIntoChunks(text);
    const fileId = new mongoose.Types.ObjectId();

    const savedEmbeddings = []; // for logging/success purposes

    // console.log(chunks.length);

    for (let i = 0; i < chunks.length; i++) {
      //   console.log(chunks[i]);
      const textChunk = chunks[i].pageContent;
      //   console.log(textChunk);
      const metadata = chunks[i].metadata;
      //   console.log(metadata);
      const embedding = await generateEmbedding(textChunk);
      console.log(embedding);

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
