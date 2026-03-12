import { Ollama } from 'ollama';

const API_KEY = "dd4800a9c48c431ba4ce6e0b5c63ce64.vtmKnUSIf9XDlvD37EJCiXXb";

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
