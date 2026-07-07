import { createClient } from '@supabase/supabase-js';
 
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);
 
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }
  try {
    const { data, error } = await supabase
      .from('propuestas')
      .select('id_propuesta, colaborador, area, proceso, fecha, estado, indicador')
      .order('created_at', { ascending: false });
 
    if (error) {
      return res.status(500).json({ error: 'Error al consultar propuestas' });
    }
 
    return res.status(200).json({ propuestas: data || [] });
  } catch (err) {
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
