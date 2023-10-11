import OpenAI from "openai";

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });

  try {
    const response = await openai.chat.completions.create(req.body);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Failed to communicate with OpenAI." });
  }
};
