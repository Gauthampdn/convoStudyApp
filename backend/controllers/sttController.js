const { createClient } = require("@deepgram/sdk");
require("dotenv").config();

const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

const speechToText = {
  async transcribeFromUrl(req, res) {
    try {
      const audioUrl = "https://dpgr.am/spacewalk.wav";

      //   if (!audioUrl) {
      //     return res.status(400).json({ error: "Audio URL is required." });
      //   }

      const { result, error } = await deepgram.listen.prerecorded.transcribeUrl(
        {
          url: audioUrl,
        },
        {
          model: "nova-3",
          smart_format: true,
        }
      );

      if (error) {
        console.error("Deepgram API error:", error);
        return res.status(500).json({ error: "Transcription failed." });
      }

      return res.status(200).json(result);
    } catch (err) {
      console.error("Server error:", err.message);
      return res.status(500).json({ error: "Internal server error." });
    }
  },
};

module.exports = speechToText;
