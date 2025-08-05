const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch'); // v2 recommended
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// UPDATE THIS TO THE CORRECT GEMINI MODEL NAME! (Check your enabled models)
const GEMINI_MODEL = 'gemini-1.5-flash'; // or 'gemini-1.5-pro'

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;
  console.log(userMessage);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: userMessage }]
          }]
        }),
      }
    );

    const data = await response.json();
    console.log("data===>", data);

    // Get reply safely from the Gemini API structure
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text
      || data?.candidates?.[0]?.content?.text
      || data?.candidates?.[0]?.content
      || "No response.";

    res.json({ reply });
  } catch (err) {
    console.error("API Error:", err);
    res.status(500).json({ reply: "Something went wrong." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
