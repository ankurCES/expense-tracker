import { Ollama } from 'ollama';

const API_KEY = "random";

const ollama = new Ollama({ 
    host: 'https://ollama.com',
    headers: {
        'Authorization': `Bearer ${API_KEY}`
    }
});

async function run() {
  try {
      const response = await ollama.list();
      console.log("AVAILABLE MODELS:", response.models.map(m => m.name));
  } catch (e) {
      console.log("ERROR:", e.message);
  }
}
run();
