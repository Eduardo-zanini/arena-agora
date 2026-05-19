export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // 1. Validação da API key
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("ANTHROPIC_API_KEY nao configurada no Vercel");
    return res.status(500).json({ error: "Server misconfigured" });
  }

  // 2. Modelo definido no backend
  const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";

  try {
    const requestBo
