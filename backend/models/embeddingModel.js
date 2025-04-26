const mongoose = require("mongoose");
const { Schema } = mongoose;

const embeddingSchema = new Schema({
  docSetId: { type: String, required: true },
  fileId: { type: String, required: true },
  chunkIndex: { type: Number, required: true },
  pageNumber: { type: Number, required: true },
  textChunk: { type: String, required: true },
  embedding: { type: [Number], required: true },
  metadata: { type: Object },
});

module.exports = mongoose.model("Embedding", embeddingSchema);
