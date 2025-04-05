const User = require("../models/userModel");

const mongoose = require("mongoose");
const DocSet = require("../models/docSetModel");

const deleteDocSet = async (req, res) => {
  const docSetId = req.params.id;
  const user_id = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(docSetId)) {
    return res.status(400).json({ error: "Invalid DocSet ID" });
  }

  try {
    const docSet = await DocSet.findById(docSetId);

    if (!docSet) {
      return res.status(404).json({ error: "DocSet not found" });
    }

    await DocSet.findByIdAndDelete(docSetId);

    res.status(200).json({ message: "DocSet deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  deleteDocSet,
};
