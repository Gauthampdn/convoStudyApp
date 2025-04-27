// models
const Embedding = require("../models/embeddingModel");

// PDF embedding imports
const { OpenAI } = require("openai");
const axios = require("axios");
const pdf = require("pdf-parse");
const { getDocument } = require("pdfjs-dist/legacy/build/pdf.mjs");

const mongoose = require("mongoose");

// langchain text splitter
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");

// initialize openai client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// HELPER METHODS FOR MODULARITY

// Description: Extract text from each page of PDF and return an array of text from each page.
// Parameter(s): pdfUrl: (s3 bucket URL)
// Return: pages: array where index is page number and elements are the text from each page
const extractTextFromPDF = async (pdfUrl) => {
  //   const data = await pdf(pdfBuffer);
  const loadingData = getDocument(pdfUrl);
  const data = await loadingData.promise;
  const pages = [];

  // Iterate through each page directly
  for (let i = 0; i < data.numPages; i++) {
    const page = await data.getPage(i + 1); // Pages are 1-indexed
    const textContent = await page.getTextContent();
    const text = textContent.items.map((item) => item.str).join(" ");
    pages.push(text);
  }

  //   console.log(pages);
  return pages;
};

// Description: Use LangChain RecursiveCharacterTextSplitter to split text into chunks
// Parameter(s): text: all text from 1 PDF page
// Return: chunks: array of Documents which each contain a text chunk and other data.
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

// Description: Generates an embedding based on the textChunk using the ada openai embedding model
// Parameter(s): textChunk: Chunk of text
// Return: embedding: 1536 openai embedding
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

// Description: Create new Embedding Document and save.
// Parameter(s): Many parameters
// Return: entry: Embedding document that was created
const saveEmbeddingToDB = async ({
  docSetId,
  fileId,
  chunkIndex,
  textChunk,
  embedding,
  metadata,
  pageNumber,
}) => {
  const entry = new Embedding({
    docSetId,
    fileId,
    chunkIndex,
    pageNumber,
    textChunk,
    embedding,
    metadata,
  });

  await entry.save();
  return entry;
};

// CREATE PDF EMBEDDING
const PDFEmbedding = async (req, res) => {
  const { pdfUrl, docSetId } = req.body;

  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(docSetId)) {
      return res.status(404).json({ error: "Invalid DocSet ID" });
    }

    const pageTexts = await extractTextFromPDF(pdfUrl); // pageTexts contains an array with elements being the text from each page that is read.
    // console.log("Number of pages detected: ", pageTexts.length);
    // pageTexts.forEach((page, idx) => {
    //   console.log(`Page ${idx + 1} length: ${page.length}`);
    // });
    // const chunks = await splitIntoChunks(text);
    const fileId = new mongoose.Types.ObjectId();

    const savedEmbeddings = []; // for logging/success purposes

    // iterates through each pdf page
    let indexCount = 0;
    for (const [pageIndex, pageText] of pageTexts.entries()) {
      //   console.log(pageText);
      const chunks = await splitIntoChunks(pageText); // split page's text into chunks

      // iterate through chunks for each page
      for (const [chunkIndex, chunk] of chunks.entries()) {
        console.log(indexCount);
        // console.log(chunk);
        const embedding = await generateEmbedding(chunk.pageContent);

        if (!embedding) {
          console.warn(`Failed to generate embedding for chunk ${indexCount}`);
          continue;
        }

        // console.log(pageIndex + 1);

        const saved = await saveEmbeddingToDB({
          docSetId,
          fileId,
          chunkIndex: indexCount,
          textChunk: chunk.pageContent,
          embedding,
          metadata: { source: pdfUrl },
          pageNumber: pageIndex + 1,
        });

        indexCount += 1;
        savedEmbeddings.push(saved);
      }
    }
    // return success, # of embeddings, and fileId
    res.status(201).json({
      message: "Embeddings created successfully",
      count: savedEmbeddings.length,
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

// GET EMBEDDINGS
const getEmbeddingsFromDocSet = async (req, res) => {
  // document set id
  const { id } = req.params;

  try {
    const embeddings = await Embedding.find({ docSetId: id }); // find all Embeddings with docSetId
    if (!embeddings) {
      return res.status(404).json({
        message:
          "Embeddings associated with this documentSet could not be found",
      });
    }
    res.status(200).json({ embeddings });
  } catch (error) {
    console.error(
      "Error fetching embeddings associated with docSetId: ",
      error
    );
    res.status(500).json({
      message: "Failed to retrieve embeddings associated with docSetId",
    });
  }
};

module.exports = {
  PDFEmbedding,
  getEmbeddingsFromDocSet,
};
