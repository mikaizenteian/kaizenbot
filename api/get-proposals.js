import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }
  const { id_propuesta, colaborador } = req.body;
  if (!id_propuesta && !colaborador) {
    return res.status(400).json({ error: 'Se requiere id_propuesta o colaborador' });
  }

  try {
    if (id_propuesta) {
      const { data, error } = await supabase
        .from('propuestas')
        .select('id_propuesta, colaborador, area, proceso, fecha, estado')
        .eq('id_propuesta', id_propuesta.trim().toUpperCase())
        .single();

      if (error || !data) {
        return res.status(404).json({ propuestas: [] });
      }
      return res.status(200).json({ propuestas: [data] });
    } else {
      const { data, error } = await supabase
        .from('propuestas')
        .select('id_propuesta, colaborador, area, proceso, fecha, estado')
        .ilike('colaborador', `%${colaborador.trim()}%`)
        .limit(5);

      if (error) {
        return res.status(500).json({ error: 'Error al consultar propuestas' });
      }
      return res.status(200).json({ propuestas: data || [] });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
