export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { url } = req.body;

  if (!url || typeof url !== 'string' || url.length > 2000) {
    return res.status(400).json({ error: 'URL inválida' });
  }

  const prompt = `Eres un experto en ciberseguridad especializado en detectar phishing, estafas y links maliciosos.

Analizá esta URL y determiná si es segura, sospechosa o peligrosa.

IMPORTANTE: Responde SOLO con un objeto JSON válido, sin texto adicional, sin backticks, sin explicaciones fuera del JSON.

El JSON debe tener exactamente esta estructura:
{
  "verdict": "seguro" | "sospechoso" | "peligroso",
  "riskScore": número entre 0 y 100,
  "summary": "descripción breve en español de máximo 2 oraciones",
  "flags": ["señal de riesgo 1", "señal de riesgo 2"],
  "recommendation": "qué debe hacer el usuario en una oración",
  "flagTypes": ["red" | "amber" | "green"]
}

Criterios:
- seguro (0-30): dominios conocidos y confiables, https, sin tricks
- sospechoso (31-69): dominios extraños, urgencia, redirecciones, http, subdominios raros
- peligroso (70-100): typosquatting, dominios .tk .xyz .click, palabras como "verificar", "urgente", "banco" en dominios raros, patrones de phishing claros

Los flags deben ser específicos al link analizado. flagTypes debe tener el mismo largo que flags.

URL a analizar: ${url}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 1000
          }
        })
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return res.status(502).json({ error: err?.error?.message || 'Error al contactar Gemini' });
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    let result;
    try {
      result = JSON.parse(text.replace(/```json|```/g, '').trim());
    } catch {
      return res.status(500).json({ error: 'No se pudo interpretar la respuesta' });
    }

    return res.status(200).json(result);

  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
