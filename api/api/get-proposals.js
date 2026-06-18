export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  try {
    const { nombre, id_propuesta } = req.query;
    let url = `${process.env.SUPABASE_URL}/rest/v1/propuestas?select=*&order=fecha.desc&limit=5`;
    if (id_propuesta) url += `&id_propuesta=eq.${id_propuesta}`;
    else if (nombre) url += `&colaborador=ilike.*${encodeURIComponent(nombre)}*`;
    const response = await fetch(url, { headers: { 'apikey': process.env.SUPABASE_ANON_KEY, 'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}` } });
    if (!response.ok) { const error = await response.json(); return res.status(response.status).json({ error: error.message || 'Error al consultar' }); }
    const data = await response.json();
    return res.status(200).json({ success: true, data });
  } catch (error) { return res.status(500).json({ error: 'Error interno del servidor' }); }
}
