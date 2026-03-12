export interface ExpenseRecord {
  id: string;
  date: string;
  line_item: string;
  amount: number;
  category: 'air_travel' | 'cab_taxi' | 'hotel' | 'food_beverage' | 'misc' | 'excluded';
  client_name?: string;
}

export async function analyzeStatementImages(base64Images: string[], apiKey: string): Promise<ExpenseRecord[]> {
  if (!apiKey) throw new Error("API Key is missing");
  
  // In development, use Vite proxy. In production (GitHub Pages), use a CORS proxy to reach Ollama Cloud
  const isDev = import.meta.env.DEV;
  const fetchUrl = isDev 
    ? `${window.location.origin}/api/ollama/api/chat`
    : `https://corsproxy.io/?${encodeURIComponent('https://ollama.com/api/chat')}`;

  const prompt = `
  You are an expert accountant. Read the provided credit card statement image(s).
  Extract EVERY SINGLE transaction into a strict JSON array of objects.
  
  CRITICAL CATEGORIZATION RULES:
  1. Business Expenses: Categorize into exactly one of: "air_travel", "cab_taxi", "hotel", "food_beverage", "misc". Note: "Fuel" or "Gas" should be marked as "misc".
  2. Personal/Excluded Expenses: Automatically categorize groceries, pharmacy, clothing, streaming subscriptions, and personal items as "excluded".
  
  You must output a strict JSON array of objects with the following schema EXACTLY:
  [
    {
      "date": "YYYY-MM-DD",
      "line_item": "Exact description text",
      "category": "Must be exactly one of: air_travel, cab_taxi, hotel, food_beverage, misc, excluded",
      "amount": float (positive number representing the expense)
    }
  ]
  `;

  const response = await fetch(fetchUrl, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
        model: 'qwen3-vl:235b-instruct',
        messages: [{ 
            role: 'user', 
            content: prompt,
            images: base64Images
        }],
        format: 'json',
        stream: false,
        options: { temperature: 0.1 }
    })
  });

  if (!response.ok) {
    throw new Error(`Ollama API Error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  try {
      let content = data.message.content.trim();
      
      const arrayMatch = content.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (arrayMatch) {
          content = arrayMatch[0];
      }

      const parsed = JSON.parse(content);
      return (Array.isArray(parsed) ? parsed : parsed.expenses || parsed.transactions || []).map((item: any) => ({
          ...item,
          id: Math.random().toString(36).substring(2, 9),
          amount: Number(item.amount) || 0,
          category: ['air_travel', 'cab_taxi', 'hotel', 'food_beverage', 'misc', 'excluded'].includes(item.category) ? item.category : 'misc',
          client_name: item.client_name || ''
      }));
  } catch (e) {
      console.error("Failed to parse JSON response from Ollama", e, "\nRaw Output:", data.message.content);
      return [];
  }
}
