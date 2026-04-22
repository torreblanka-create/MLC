/**
 * Vercel Blob Storage - API para guardar archivos PDF
 * Endpoint: /api/upload
 * Método: POST
 * Body: FormData con archivo
 */

import { put, del } from '@vercel/blob';

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
    // req.body contiene el archivo en formato base64
    const { filename, data, moduleKey } = req.body;

    if (!filename || !data || !moduleKey) {
      return res.status(400).json({ error: 'Faltan parámetros: filename, data, moduleKey' });
    }

    // Decodificar base64
    const buffer = Buffer.from(data, 'base64');

    // Subir a Vercel Blob
    const blob = await put(`gmlc/${moduleKey}/${filename}`, buffer, {
      access: 'public',
      contentType: 'application/pdf',
    });

    return res.status(200).json({
      status: 'uploaded',
      filename,
      url: blob.url,
      size: buffer.length,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Error al subir archivo' });
  }
}

async function handleDelete(req, res) {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL requerida' });
    }

    await del(url);

    return res.status(200).json({ status: 'deleted' });
  } catch (error) {
    console.error('Delete error:', error);
    return res.status(500).json({ error: 'Error al eliminar archivo' });
  }
}
