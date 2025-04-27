export async function streamTTS(text: string, voice = "alloy") {
  const response = await fetch("http://localhost:3000/api/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, voice }),
  });

  if (!response.ok || !response.body) {
    throw new Error("TTS request failed");
  }

  const reader = response.body.getReader();
  const mediaSource = new MediaSource();
  const audio = new Audio();
  audio.src = URL.createObjectURL(mediaSource);

  mediaSource.addEventListener("sourceopen", async () => {
    const sourceBuffer = mediaSource.addSourceBuffer("audio/mpeg");

    const queue: Uint8Array[] = []; // ✅

    let isUpdating = false;

    const processQueue = () => {
      const chunk = queue.shift();
      if (chunk && !sourceBuffer.updating) {
        sourceBuffer.appendBuffer(chunk);
      }
    };

    sourceBuffer.addEventListener("updateend", processQueue);

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        mediaSource.endOfStream();
        break;
      }
      queue.push(value);
      processQueue();
    }
  });

  audio.play();
}
