const User = require("../models/userModel");
const mongoose = require("mongoose");
const documentSet = require("../models/docSetModel");

// GET: Fetch a single document set
const getDocumentSet = async (req, res) => {
  const { id } = req.params;
  const { title, files, tags, description, stats } = req.body;

  const docSet = await documentSet.findById(id);

  if (!docSet) {
    return res.status(404).json({ message: "Document Set not found" });
  }

  res.status(200).json(docSet);
};
