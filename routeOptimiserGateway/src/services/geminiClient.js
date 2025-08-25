import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

let client = null;
export function getGeminiClient() {
  if (!client) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not configured');
    }
    client = new GoogleGenerativeAI(apiKey);
  }
  return client;
}

export async function checkCompliance({ sourceCountry, destinationCountry, products }) {
  const genAI = getGeminiClient();
  const modelName = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: `You are a compliance validator for international trade. Return ONLY strict JSON matching this schema, with no code fences, no commentary, and no extra text:
{
  "items": [
    {"name": string, "hsCode": string|null, "accepted": boolean, "reasons": string[]}
  ],
  "exportNotes": string[]|[],
  "importNotes": string[]|[]
}
Validation rules:
- Validate export permissions from the source country and import permissions to the destination country.
- Prefer provided HS codes; infer when missing (include inferred hsCode and add a reason if low confidence).
- If restricted (license, dangerous goods, sanctions), set accepted=false and include a concise reason.
- Respond with valid JSON only.`,
  });

  const system = `You are a compliance validator for international trade. Return ONLY strict JSON matching this schema:
{
  "items": [
    {"name": string, "hsCode": string|null, "accepted": boolean, "reasons": string[]}
  ],
  "exportNotes": string[]|[],
  "importNotes": string[]|[]
}
Rules:
- Validate export permissions from the source country and import permissions to the destination country.
- Prefer provided HS codes; infer when missing (include inferred hsCode and reason if low confidence).
- If restricted (license, dangerous goods, sanctions), set accepted=false and include concise reason.
- Respond with valid JSON only; do not include markdown or commentary.`;

  const user = {
    sourceCountry,
    destinationCountry,
    products
  };

  const prompt = `${system}\nINPUT:\n${JSON.stringify(user)}`;

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.2,
      responseMimeType: 'application/json'
    }
  });
  const text = result.response.text();
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (e) {
    // Fallback: strip code fences and extract JSON substring
    let t = (text || '').trim();
    t = t.replace(/^```json\s*/i, '').replace(/^```/i, '').replace(/```\s*$/i, '').trim();
    const start = t.indexOf('{');
    const end = t.lastIndexOf('}');
    if (start !== -1 && end !== -1 && end > start) {
      const slice = t.slice(start, end + 1);
      try {
        parsed = JSON.parse(slice);
      } catch (e2) {
        throw Object.assign(new Error('Compliance service returned invalid JSON'), { status: 502 });
      }
    } else {
      throw Object.assign(new Error('Compliance service returned invalid JSON'), { status: 502 });
    }
  }
  if (!parsed || !Array.isArray(parsed.items)) {
    throw Object.assign(new Error('Compliance response missing items'), { status: 502 });
  }
  // Normalize items
  parsed.items = parsed.items.map(it => ({
    name: String(it.name || ''),
    hsCode: it.hsCode ? String(it.hsCode) : null,
    accepted: Boolean(it.accepted),
    reasons: Array.isArray(it.reasons) ? it.reasons.map(String) : []
  }));
  parsed.exportNotes = Array.isArray(parsed.exportNotes) ? parsed.exportNotes.map(String) : [];
  parsed.importNotes = Array.isArray(parsed.importNotes) ? parsed.importNotes.map(String) : [];
  return parsed;
}


