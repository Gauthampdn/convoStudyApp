const express = require("express");
const router = express.Router();
const axios = require("axios");

const { protect } = require("../middleware/authMiddleware");
router.use(protect);

const textToSpeech = async (req, res) => {
  const { text, voice = "alloy" } = req.body; // voice is optional and is set to "coral" if not specified

  if (!text) {
    return res.status(400).json({ message: "Text is required" });
  }

  try {
    // send request to openai tts
    const response = await axios({
      method: "post",
      url: "https://api.openai.com/v1/audio/speech",
      responseType: "arraybuffer", // expect binary data (audio file)
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      data: {
        model: "tts-1",
        input: text,
        voice: voice,
        response_format: "mp3",
      },
    });

    // set response headers to let browser know that content is mp3 file.
    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Disposition": 'inline; filename="speech.mp3"',
    });

    // send mp3 file from openAI to frontend
    res.send(response.data);
  } catch (error) {
    console.error("TTS Error: ", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to generate speech" });
  }
};

module.exports = { textToSpeech };
