import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { numero_empleado } = req.body;

  if (!numero_empleado) {
    return res.status(400).json({ error: 'Número de empleado requerido' });
  }

  try {
    const { data, error } = await supabase
      .from('colaboradores')
      .select('*')
      .eq('numero_empleado', numero_empleado)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Colaborador no encontrado' });
    }

    return res.status(200).json({
      nombre: data['Nombre completo'] || '',
      area: data['Área / Departamento'] || '',
      email_colaborador: data['email colaborador'] || '',
      email_supervisor: data['email supervisor'] || ''
    });

  } catch (err) {
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
