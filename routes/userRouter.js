const router = require("express").Router();
const User = require("../models/userModel")
const bcrypt = require("bcryptjs");
const { findOne } = require("../models/userModel");
const jwt = require("jsonwebtoken");
const auth = require("../middelware/auth");

router.post("/register", async (req, res) => {
    try{
    let {email, password, passwordCheck, displayName} = req.body;
    //validate
    if (!email || !password || !passwordCheck) {
       return res.status(400).json({msg: "Not all fields were entered."}); 
    }
    if(password.length < 5)
        return res.status(400).json({ msg: "The password must be five or more characters long."});
    if(password !== passwordCheck)
        return res.status(400).json({ msg: "Enter the same password."});

    const existingUser = await User.findOne({email: email});
    console.log(existingUser);
    if(existingUser)
        return res.status(400).json({msg: "An account with this email already exists."});
    if (!displayName) displayName = email; 
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
        email,
        password:   passwordHash,
        displayName
    });
    const savedUser = await newUser.save();
    res.json(savedUser);
    }
    catch(err)  {
        res.status(500).json({error: err.message});
    }
});

router.post("/login", async (req, res) => {
    try{
        const {email, password} = req.body;

        //validate
        if(!email || !password)
            return res.status(400).json({msg: "Not all fields were entered."}); 

        const user = await User.findOne({email: email});
        
        if(!user)
             return res.status(400).json({msg: "No account with given credentials exist."}); 
        
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch)
            return res.status(400).json({msg: "Invalid credentials."}); 
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
        res.json({
            token,
            user: {
                id: user._id,
                displayName: user.displayName,
            },
        });
    }
    catch(err)  {
        res.status(500).json({error: err.message});
    }
});

router.post("/tokenIsValid", async (req, res) => {
    try{
      const token = req.header("x-auth-token"); 
      if(!token) return res.json(false);

      const verified = jwt.verify(token, process.env.JWT_SECRET);
      if(!verified) return res.json(false);

      const user = await User.findById(verified.id);
      if(!user) return res.json(false);

      return res.json(true);
    } catch(err){
        return res.status(500).json({error: err.message});
    }
});

router.get("/", auth, async (req, res) => {
    const user = await User.findById(req.user);
    res.json({
        displayName: user.displayName,
        id: user._id,
    });
});

module.exports = router;