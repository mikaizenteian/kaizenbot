export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });
  try {
    const { proposal } = req.body;
    const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/propuestas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': process.env.SUPABASE_ANON_KEY, 'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`, 'Prefer': 'return=representation' },
      body: JSON.stringify(proposal)
    });
    if (!response.ok) { const error = await response.json(); return res.status(response.status).json({ error: error.message || 'Error al guardar' }); }
    const data = await response.json();
    return res.status(200).json({ success: true, data });
  } catch (error) { return res.status(500).json({ error: 'Error interno del servidor' }); }
}
