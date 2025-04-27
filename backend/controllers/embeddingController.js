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

// // Used to get PDF buffer
// const downloadPDF = async (pdfUrl) => {
//   const response = await axios.get(pdfUrl, { responseType: "arraybuffer" });
//   return response.data;
// };

// BACKUP TEXT EXTRACTOR USING pdf-parse LIBRARY
// const extractTextFromPDF = async (pdfBuffer) => {
//   const options = {
//     pagerender: (pageData) => {
//       return pageData.getTextContent().then((textContent) => {
//         const strings = textContent.items.map((item) => item.str);
//         return strings.join(" ");
//       });
//     },
//   };
//   const data = await pdf(pdfBuffer, options);
//   const pageBreakRegex = /(\f|\r\n\r\n|\n\n)/; // Depending on how the page break is encoded
//   const pages = data.text.split(pageBreakRegex);
//   return pages;
// };

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

const PDFEmbedding = async (req, res) => {
  const { pdfUrl, docSetId } = req.body;

  try {
    // const pdfBuffer = await downloadPDF(pdfUrl);
    // const pageTexts = await extractTextFromPDF(pdfBuffer);
    const pageTexts = await extractTextFromPDF(pdfUrl);
    console.log("Number of pages detected: ", pageTexts.length);
    pageTexts.forEach((page, idx) => {
      console.log(`Page ${idx + 1} length: ${page.length}`);
    });
    // const chunks = await splitIntoChunks(text);
    const fileId = new mongoose.Types.ObjectId();

    const savedEmbeddings = []; // for logging/success purposes

    // console.log(chunks.length);

    // for (let i = 0; i < chunks.length; i++) {
    //   //   console.log(chunks[i]);
    //   const textChunk = chunks[i].pageContent;
    //   //   console.log(textChunk);
    //   const metadata = chunks[i].metadata;
    //   //   console.log(metadata);
    //   const embedding = await generateEmbedding(textChunk);
    //   console.log(embedding);

    //   if (!embedding) {
    //     console.warn(`Failed to generate embedding for chunk ${i}`);
    //     continue;
    //   }

    //   const saved = await saveEmbeddingToDB({
    //     docSetId,
    //     fileId,
    //     chunkIndex: i,
    //     textChunk,
    //     embedding,
    //     metadata: { source: pdfUrl },
    //   });

    //   savedEmbeddings.push(saved);
    // }

    for (const [pageIndex, pageText] of pageTexts.entries()) {
      //   console.log(pageText);
      const chunks = await splitIntoChunks(pageText);

      for (const [chunkIndex, chunk] of chunks.entries()) {
        // console.log(chunk);
        const embedding = await generateEmbedding(chunk.pageContent);

        if (!embedding) {
          console.warn(`Failed to generate embedding for chunk ${chunkIndex}`);
          continue;
        }

        console.log(pageIndex + 1);

        const saved = await saveEmbeddingToDB({
          docSetId,
          fileId,
          chunkIndex: chunkIndex,
          textChunk: chunk.pageContent,
          embedding,
          metadata: { source: pdfUrl },
          pageNumber: pageIndex + 1,
        });

        savedEmbeddings.push(saved);
      }
    }
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

const getEmbeddingsFromDocSet = async (req, res) => {
  // document set id
  const { id } = req.params;

  try {
    const embeddings = await Embedding.find({ docSetId: id });
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
