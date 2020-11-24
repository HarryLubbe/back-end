const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
    file: {type: String, required: true},
    userId: {type: String, required: true},
});

module.exports = DataHandling = mongoose.model("dataHandling", dataSchema);