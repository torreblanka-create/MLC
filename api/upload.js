/**
 * File Upload API - Guardar archivos como data URLs
 * Nota: Los archivos persisten en el localStorage de la app
 * Para almacenamiento persistente real, usa Vercel KV + esta API
 */

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method === 'POST') return handleUpload(req, res);
  return res.status(405).json({ error: 'Method not allowed' });
}

async function handleUpload(req, res) {
  try {
    let body = req.body;

    // En Vercel, req.body puede ser string, Buffer, o objeto
    if (Buffer.isBuffer(body)) {
      body = JSON.parse(body.toString('utf-8'));
    } else if (typeof body === 'string') {
      body = JSON.parse(body);
    }

    const { filename, data, moduleKey } = body;

    if (!filename || !data || !moduleKey) {
      return res.status(400).json({ error: 'Faltan parámetros' });
    }

    if (!/^[a-z0-9_]+$/.test(moduleKey)) {
      return res.status(400).json({ error: 'moduleKey inválido' });
    }

    if (!/^[A-Za-z0-9+/=]+$/.test(data)) {
      return res.status(400).json({ error: 'Base64 inválido' });
    }

    const buffer = Buffer.from(data, 'base64');
    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const mimeType = getMimeType(filename);

    // Crear data URL (funciona en navegador, persiste en localStorage)
    const dataUrl = `data:${mimeType};base64,${data}`;

    return res.status(200).json({
      status: 'uploaded',
      ok: true,
      filename: safeName,
      url: dataUrl,
      size: buffer.length,
      method: 'data-url',
      note: 'Archivo almacenado como data URL en cliente',
    });
  } catch (error) {
    console.error('Upload error:', error.message);
    return res.status(500).json({ error: error.message });
  }
}

function getMimeType(filename) {
  const ext = filename.split('.').pop()?.toLowerCase();
  const types = {
    pdf: 'application/pdf',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
  };
  return types[ext] || 'application/octet-stream';
}
