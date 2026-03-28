import { OpenAI } from "openai/client.js";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function extractSkills(description) {
  const prompt = `
    Extract technical skills from this job description.
    Return ONLY a JSON array of strings.
    Example: ["React", "Node.js", "MongoDB"]

    Text:
    ${description}
  `;

  try {
    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });
    const text = response.choices[0].message.content;
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : Object.values(parsed)[0] || [];
  } catch (error) {
    if (error.status === 429) {
      console.error(
        "Groq Rate Limit exceeded. Consider increasing the sleep() time in your loop.",
      );
    } else {
      console.error("Extraction error:", error.message);
    }
    return [];
  }
}
