const User = require("../models/userModel");
const mongoose = require("mongoose");
const DocumentSet = require("../models/docSetModel");

// UPDATE request
const updateDocumentSet = async (req, res) => {
  const { id } = req.params;
  const { title, files, tags, description, stats } = req.body; // extract fields from request's body

  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "Invalid assignment ID" });
    }

    // update document set
    const documentSet = await DocumentSet.findOneAndUpdate(
      { _id: id },
      {
        title,
        files,
        tags,
        description,
        stats,
      },
      { new: true } // return updated document set
    );

    // if document set doesn't exist
    if (!documentSet) {
      return res.status(404).json({ error: "Document set not found" });
    }

    res.status(200).json({ documentSet });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { updateDocumentSet };
