import { Ollama } from 'ollama';

const API_KEY = "random";

const ollama = new Ollama({ 
    host: 'https://ollama.com',
    headers: { Authorization: `Bearer ${API_KEY}` }
});

async function run() {
  try {
      const response = await ollama.chat({
          model: 'qwen3-vl:235b-instruct', // A known vision-language model on the cloud
          messages: [{ 
              role: 'user', 
              content: 'What is this image about?',
              // Mock base64 white pixel
              images: ['iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII='] 
          }],
      });
      console.log("VISION SUPPORTED:", response.message.content);
  } catch (e) {
      console.log("VISION ERROR:", e.message);
  }
}
run();
