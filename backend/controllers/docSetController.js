const User = require('../models/userModel');
const DocSet = require('../models/docSetModel'); //docSetModel is imported to interact with docSet collection
const mongoose = require("mongoose");

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

//function to retrieve all documents for specified user
const getAllDocSets = async (req, res) => { 
    try {
    const userId = req.user.id; //gets userId

    const docSets = await DocSet.find({userId}) //gets all documents sets where userId matches
    .sort({ createdAt: -1 }); //all document sets are sorted with newest ones showing up first

    //responds with success message and retrieved document sets
    res.status(200).json({
        success: true, 
        count: docSets.length, //includes number of fetched document sets
        data: docSets //includes data from the actual document sets
    });
    }
    catch (error) { //if error occurs, it is logged and server response is sent
        console.error('Error fetching document sets:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching document sets'
        });
    }
}

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

module.exports = {
  getAllDocSets,
  updateDocumentSet,
  deleteDocSet
};
