const axios = require("axios");

const textToSpeech = async (req, res) => {
  console.log("Received TTS Request:", req.body);

  const { text, voice = "alloy" } = req.body;

  if (!text) {
    console.log("No text provided.");
    return res.status(400).json({ message: "Text is required" });
  }

  try {
    console.log("Sending request to OpenAI TTS API...");

    const response = await axios({
      method: "post",
      url: "https://api.openai.com/v1/audio/speech",
      responseType: "stream",
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
      timeout: 5000,
    });

    console.log("OpenAI responded. Streaming audio...");

    res.set("Content-Type", "audio/mpeg");
    res.set("Content-Disposition", 'inline; filename="speech.mp3"');
    response.data.pipe(res);
  } catch (error) {
    console.error("TTS stream Error:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to generate speech" });
  }
};

module.exports = { textToSpeech }; // ✅ This is critical
