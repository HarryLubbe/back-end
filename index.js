const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

//express setup
const app = express();
app.use(express.json());
app.use(cors());

//start server
const PORT = process.env.PORT || 5000; //hosting provider setup port provider, this gets me the port assigned. if it's local it uses port 5000
app.listen(PORT, () => console.log(`The server has started on port: ${PORT}`));

//mongoose setup

mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true}, (err) => {
    if (err) throw err;
    console.log("MongoDB connection established");
});

// set up routes
app.use("/users", require("./routes/userRouter"));
app.use("/dataHandling", require("./routes/dataRouter"));