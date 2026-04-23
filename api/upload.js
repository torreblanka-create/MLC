/**
 * File Upload API - Guardar archivos en estado de localStorage
 * Endpoint: /api/upload
 * Método: POST
 * Body: { filename, data (base64), moduleKey }
 *
 * Simula una carga de archivo guardando en localStorage vía el servidor
 */

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    return handleUpload(req, res);
  } else if (req.method === 'DELETE') {
    return handleDelete(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function handleUpload(req, res) {
  try {
    let body = req.body;

    if (typeof body === 'string') {
      body = JSON.parse(body);
    }

    const { filename, data, moduleKey } = body;

    if (!filename || !data || !moduleKey) {
      console.error('Missing params:', { filename: !!filename, data: !!data, moduleKey: !!moduleKey });
      return res.status(400).json({ error: 'Faltan parámetros: filename, data, moduleKey' });
    }

    // Validar que moduleKey no contiene caracteres peligrosos
    if (!/^[a-z0-9_]+$/.test(moduleKey)) {
      return res.status(400).json({ error: 'moduleKey inválido' });
    }

    // Validar base64
    if (!/^[A-Za-z0-9+/=]+$/.test(data)) {
      return res.status(400).json({ error: 'Datos base64 inválidos' });
    }

    // Decodificar base64 para obtener tamaño
    const buffer = Buffer.from(data, 'base64');

    // Sanitizar nombre de archivo
    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');

    // Generar URL simulada (en Vercel, se guardaría en blob storage o similar)
    const url = `/uploads/${moduleKey}/${safeName}`;

    return res.status(200).json({
      status: 'uploaded',
      ok: true,
      filename: safeName,
      url,
      size: buffer.length,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Error al subir archivo', details: error.message });
  }
}

async function handleDelete(req, res) {
  try {
    let body = req.body;

    if (typeof body === 'string') {
      body = JSON.parse(body);
    }

    const { url } = body;

    if (!url) {
      return res.status(400).json({ error: 'URL requerida' });
    }

    return res.status(200).json({ status: 'deleted', ok: true });
  } catch (error) {
    console.error('Delete error:', error);
    return res.status(500).json({ error: 'Error al eliminar archivo', details: error.message });
  }
}
