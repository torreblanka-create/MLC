/**
 * File Upload API - Guardar en Vercel Blob Storage usando REST API
 * Endpoint: /api/upload
 * Body: { filename, data (base64), moduleKey }
 */

export const config = { maxDuration: 60 };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method === 'POST') return handleUpload(req, res);
  if (req.method === 'DELETE') return handleDelete(req, res);
  return res.status(405).json({ error: 'Method not allowed' });
}

async function handleUpload(req, res) {
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { filename, data, moduleKey } = body;

    if (!filename || !data || !moduleKey) {
      return res.status(400).json({ error: 'Faltan: filename, data, moduleKey' });
    }

    if (!/^[a-z0-9_]+$/.test(moduleKey)) {
      return res.status(400).json({ error: 'moduleKey inválido' });
    }

    if (!/^[A-Za-z0-9+/=]+$/.test(data)) {
      return res.status(400).json({ error: 'Base64 inválido' });
    }

    const buffer = Buffer.from(data, 'base64');
    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const token = process.env.BLOB_READ_WRITE_TOKEN;

    if (!token) {
      console.warn('BLOB_READ_WRITE_TOKEN not configured');
      return res.status(500).json({
        error: 'Token no configurado',
        details: 'BLOB_READ_WRITE_TOKEN no está en variables de entorno',
      });
    }

    const blobPath = `uploads/${moduleKey}/${safeName}`;

    // Upload a Vercel Blob usando REST API
    const uploadRes = await fetch('https://blob.vercel-storage.com/', {
      method: 'PUT',
      headers: {
        'authorization': `Bearer ${token}`,
        'x-add-random': 'true',
      },
      body: buffer,
    });

    if (!uploadRes.ok) {
      const errorText = await uploadRes.text();
      console.error('Vercel Blob error:', uploadRes.status, errorText);
      return res.status(500).json({
        error: 'Error en Blob Storage',
        details: `${uploadRes.status}: ${errorText.substring(0, 100)}`,
      });
    }

    const result = await uploadRes.json();
    const url = result.url;

    console.log('✓ Uploaded to Blob:', url);

    return res.status(200).json({
      status: 'uploaded',
      ok: true,
      filename: safeName,
      url,
      size: buffer.length,
    });
  } catch (error) {
    console.error('Upload error:', error.message);
    return res.status(500).json({
      error: 'Error al subir',
      details: error.message,
    });
  }
}

async function handleDelete(req, res) {
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { url } = body;

    if (!url) {
      return res.status(400).json({ error: 'URL requerida' });
    }

    // Vercel Blob API para eliminar
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token || !url.includes('blob.vercel-storage.com')) {
      return res.status(200).json({ ok: true });
    }

    const deleteRes = await fetch(url, {
      method: 'DELETE',
      headers: { 'authorization': `Bearer ${token}` },
    });

    return res.status(200).json({ ok: deleteRes.ok });
  } catch (error) {
    console.error('Delete error:', error.message);
    return res.status(500).json({ error: error.message });
  }
}
