const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require('express-session');
const MongoStore = require('connect-mongo');


require("dotenv").config();

const app = express();

app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true
  }));
  
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({mongoUrl: process.env.MONGO_URI})
}))

const router = require("./routes/ocrRoutes");
app.use("/api", router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

