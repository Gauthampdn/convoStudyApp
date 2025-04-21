const mic = require("mic");
const WebSocket = require("ws");
require("dotenv").config();

const deepgramApiKey = process.env.DEEPGRAM_API_KEY;

const speechToText = {
  async streamFromMic(req, res) {
    try {
      const deepgramSocket = new WebSocket(
        `wss://api.deepgram.com/v1/listen?model=nova-3&punctuate=true&interim_results=false`,
        {
          headers: {
            Authorization: `Token ${deepgramApiKey}`,
          },
        }
      );

      const micInstance = mic({
        rate: "16000",
        channels: "1",
        debug: false,
        fileType: "wav",
      });

      const micInputStream = micInstance.getAudioStream();
      const transcripts = [];

      let silenceTimer = null;

      const resetSilenceTimer = () => {
        if (silenceTimer) clearTimeout(silenceTimer);
        silenceTimer = setTimeout(() => {
          console.log("⏹️ Silence detected. Closing connection...");
          deepgramSocket.close(); // triggers the 'close' handler below
        }, 1000); // listens for 1 second of silence
      };

      micInputStream.on("data", (data) => {
        if (deepgramSocket.readyState === WebSocket.OPEN) {
          deepgramSocket.send(data);
        }
      });

      micInputStream.on("error", (err) => {
        console.error("Mic error:", err);
      });

      deepgramSocket.on("open", () => {
        console.log("🎙️ Streaming started.");
        micInstance.start();
      });

      deepgramSocket.on("message", (message) => {
        const data = JSON.parse(message);
        const transcript = data.channel?.alternatives?.[0]?.transcript;

        if (transcript) {
          console.log("📝 Transcript:", transcript);
          transcripts.push(transcript);
          resetSilenceTimer(); // Restart silence timer on new speech
        }
      });

      deepgramSocket.on("close", () => {
        console.log("🔌 Connection closed. Stopping mic.");
        micInstance.stop();

        if (silenceTimer) clearTimeout(silenceTimer);

        return res.status(200).json({
          message: "Transcription finished after silence.",
          transcripts,
        });
      });

      deepgramSocket.on("error", (err) => {
        console.error("WebSocket error:", err);
        micInstance.stop();
        if (silenceTimer) clearTimeout(silenceTimer);
        return res.status(500).json({ error: "Streaming error." });
      });
    } catch (err) {
      console.error("Server error:", err.message);
      return res.status(500).json({ error: "Internal server error." });
    }
  },
};

module.exports = speechToText;
