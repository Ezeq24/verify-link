export default async function handler(req, res) {
  // Solo aceptar POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { url } = req.body;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'URL inválida' });
  }

  // Validación básica de longitud
  if (url.length > 2000) {
    return res.status(400).json({ error: 'URL demasiado larga' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY, // La key vive aquí, segura en el servidor
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: `Eres un experto en ciberseguridad especializado en detectar phishing, estafas y links maliciosos.
Analizás URLs y determinás si son seguras, sospechosas o peligrosas.

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

Los flags deben ser específicos al link analizado. flagTypes debe tener el mismo largo que flags.`,
        messages: [{ role: 'user', content: `Analiza esta URL y devuelve el JSON: ${url}` }]
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return res.status(502).json({ error: error?.error?.message || 'Error al contactar la API' });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || '';

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
