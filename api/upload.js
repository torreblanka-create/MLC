/**
 * File Upload API — Vercel Blob Storage
 * Almacena archivos en Blob y retorna una URL pública descargable.
 * Fallback: data URL (cuando BLOB_READ_WRITE_TOKEN no está configurado).
 */

import { put } from '@vercel/blob';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    let body = req.body;
    if (Buffer.isBuffer(body)) body = JSON.parse(body.toString('utf-8'));
    else if (typeof body === 'string') body = JSON.parse(body);

    const { filename, data, moduleKey } = body || {};

    if (!filename || !data || !moduleKey) {
      return res.status(400).json({ error: 'Faltan parámetros (filename, data, moduleKey)' });
    }
    if (!/^[a-z0-9_]+$/.test(moduleKey)) {
      return res.status(400).json({ error: 'moduleKey inválido' });
    }

    const cleanBase64 = String(data).replace(/\s+/g, '');
    let buffer;
    try {
      buffer = Buffer.from(cleanBase64, 'base64');
    } catch (e) {
      return res.status(400).json({ error: 'Base64 inválido' });
    }
    if (!buffer || buffer.length === 0) {
      return res.status(400).json({ error: 'Archivo vacío o base64 inválido' });
    }

    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const mimeType = getMimeType(filename);

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`gmlc/files/${moduleKey}/${safeName}`, buffer, {
        access: 'public',
        contentType: mimeType,
        addRandomSuffix: true,
        cacheControlMaxAge: 60 * 60 * 24 * 30,
      });

      return res.status(200).json({
        ok: true,
        status: 'uploaded',
        filename: safeName,
        url: blob.url,
        size: buffer.length,
        method: 'vercel-blob',
      });
    }

    const dataUrl = `data:${mimeType};base64,${cleanBase64}`;
    return res.status(200).json({
      ok: true,
      status: 'uploaded',
      filename: safeName,
      url: dataUrl,
      size: buffer.length,
      method: 'data-url',
      warning: 'BLOB_READ_WRITE_TOKEN no configurado — archivo persiste sólo como data URL en el cliente',
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: error.message || 'Upload failed' });
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
    webp: 'image/webp',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    mp4: 'video/mp4',
  };
  return types[ext] || 'application/octet-stream';
}
