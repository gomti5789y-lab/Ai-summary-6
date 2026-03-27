const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const Tesseract = require("tesseract.js");
const { OpenAI } = require("openai");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/ai-doc");

const User = mongoose.model("User", {
  email: String,
  password: String,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

const openai = new OpenAI({
  apiKey: "YOUR_OPENAI_API_KEY",
});


// 🔐 Signup
app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.send(user);
});

// 🔐 Login
app.post("/login", async (req, res) => {
  const user = await User.findOne(req.body);
  res.send(user);
});


// 📄 Upload + OCR
app.post("/upload", upload.single("file"), async (req, res) => {
  const result = await Tesseract.recognize(req.file.buffer, "eng");
  res.send({ text: result.data.text });
});


// 🧠 Summary
app.post("/summary", async (req, res) => {
  const { text } = req.body;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: `Summarize: ${text}` }],
  });

  res.send({ summary: response.choices[0].message.content });
});

app.listen(5000, () => console.log("Server running"));
