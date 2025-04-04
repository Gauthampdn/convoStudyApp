const User = require('../models/userModel');
const DocSet = require('../models/docSetModel'); //docSetModel is imported to interact with docSet collection

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

module.exports = { getAllDocSets }; //function is exported to be used elsewhere