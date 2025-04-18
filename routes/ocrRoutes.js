const express = require("express");
const multer = require("multer");
const Tesseract = require("tesseract.js");
const Item = require("../database/task")
const User = require("../database/user")


const router = express.Router();


const storage = multer.memoryStorage();
const upload = multer({storage: storage});

router.post('/login', async(req, res)=>{
    try{
        const {username} = req.body

        if (!username){
            return res.status(400).json({message: 'username not found'})
        }

        let  user = await User.findOne({username});

        if (!user){
            user = await User.create({username})
        }

        req.session.userId = user._id;

        return res.status(201).json({message: 'login sucessfully'})
    }
    catch (error){
        return res.status(500).json({error: error})
    }
})


router.post("/extract-text", upload.single("image"), async(req, res)=>{
    try {
        if (!req.file){
            return res.status(400).json({error: "please upload something"});
        }
        const {data: {text}} = await Tesseract.recognize(req.file.buffer, "eng");

        const items = text.split("\n").map(line => line.trim()).filter(line=>line && line.includes("$"));
        const savedItems = await Item.insertMany(items.map(item => ({text: item, userId: req.session.userId})));
        res.status(201).json({items});
    }   
    catch (error) {
        return res.status(500).json({message: "upload failed"})
    }
})

router.get("/get-extracted", async(req, res) => {
    try {
        const saved = await Item.find({userId: req.session.userId});
        return res.status(200).json({data: saved});
    }
    catch (error){
        return res.status(500).json({error: error});
    }
})

module.exports = router;

router.delete("/delete-item/:id", async(req,res) => {
    try {
        const {id} = req.params;
        const deleted = await Item.findOneAndDelete({_id: id, userId: req.session.userId});
        if (deleted){
            return res.status(200).json({message: "delete successfully"})
        }
    }
    catch (error){
        return res.status(500).json({error:error});
    }
})

router.delete('/delete-all', async(req, res) => {
    try {
        const deleted = await Item.deleteMany({userId: req.session.userId})

        if (!deleted){
            return res.status(400).json({message: 'nothing to delete'})
        }
        else{
            return res.status(200).json({message: 'deleted everything successfully'})
        }
    } catch(error){
        return res.status(500).json({error: error})
    }
})