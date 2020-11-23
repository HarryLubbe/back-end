const auth = require("../middleware/auth");
const router = require("express").Router();
const dataM = require("../models/dataModel");

router.post("/", auth, async (req, res) => {
  try{
    const {file} = req.body;
    const newFile = {
        file,
        userId: auth.user
    }
    const savedFile = await newFile
  }
  catch(err){
      res.status(500).json({error: err.message});
  }
});

module.exports = router;