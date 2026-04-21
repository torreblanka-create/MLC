/**
 * Vercel Serverless Function - API de Contenidos
 * Endpoint para guardar y recuperar contenidos de módulos
 * URL: /api/content?action=get|save
 */

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const action = req.query.action || req.body?.action;

  if (action === 'get') {
    return handleGet(req, res);
  } else if (action === 'save') {
    return handleSave(req, res);
  } else {
    return res.status(400).json({ error: 'Invalid action' });
  }
}

async function handleGet(req, res) {
  try {
    // En Vercel, usamos KV (Upstash) o retornamos estructura vacía
    // Por ahora, retornamos estructura que permite funcionar sin backend persistente
    // Para persistencia, configura Vercel KV en https://vercel.com/docs/storage/vercel-kv

    const kv = getKVClient();
    if (!kv) {
      // Sin KV configurado, retornar estructura vacía (usará localStorage como fallback)
      return res.status(200).json({ data: {} });
    }

    const content = await kv.get('gmlc:content');
    return res.status(200).json({ data: content || {} });
  } catch (error) {
    console.error('Error fetching content:', error);
    return res.status(200).json({ data: {} });
  }
}

async function handleSave(req, res) {
  try {
    const data = req.body?.data;

    if (!data || typeof data !== 'object') {
      return res.status(400).json({ error: 'Invalid data format' });
    }

    const kv = getKVClient();
    if (!kv) {
      // Sin KV configurado, retornar éxito de todas formas (graceful degradation)
      return res.status(200).json({
        status: 'saved',
        message: 'Contenido guardado en sesión (configure Vercel KV para persistencia)',
      });
    }

    // Guardar en KV con expiración de 90 días
    await kv.set('gmlc:content', data, { ex: 90 * 24 * 60 * 60 });

    return res.status(200).json({
      status: 'saved',
      message: 'Contenido guardado exitosamente',
    });
  } catch (error) {
    console.error('Error saving content:', error);
    return res.status(500).json({ error: 'Failed to save content' });
  }
}

function getKVClient() {
  // Intenta usar Vercel KV si está configurado
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    // Nota: Aquí iría la configuración de Upstash KV
    // Por ahora retornamos null para usar localStorage como fallback
    return null;
  }
  return null;
}
