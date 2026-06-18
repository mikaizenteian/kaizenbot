export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });
  try {
    const { proposal } = req.body;
    const record = {
      id_propuesta: proposal.id_propuesta || '',
      colaborador: proposal.colaborador || '',
      area: proposal.area || '',
      proceso: proposal.proceso || '',
      fecha: proposal.fecha || '',
      estado: proposal.estado || 'Borrador',
      indicador: proposal.indicador || '',
      desperdicios: proposal.desperdicios || '',
      mejora_estimada: proposal.mejora_estimada || '',
      propuestas_relacionadas: ''
    };
    const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/propuestas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(record)
    });
    const responseText = await response.text();
    if (!response.ok) return res.status(response.status).json({ error: responseText });
    return res.status(200).json({ success: true, data: JSON.parse(responseText) });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
