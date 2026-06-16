export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("ANTHROPIC_API_KEY nao configurada no Vercel");
    return res.status(500).json({ error: "Server misconfigured" });
  }

  const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";

  try {
    const requestBody = {
      ...req.body,
      model: MODEL,
    };

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Anthropic error:", {
        status: response.status,
        model: MODEL,
        error: data,
      });
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (e) {
    console.error("Catch error:", e.message);
    return res.status(500).json({ error: e.message });
  }
}
export const config = {
  maxDuration: 60,
};
