/**
 * File Upload API - Guardar archivos con Vercel Blob Storage
 * Endpoint: /api/upload
 * Método: POST
 * Body: { filename, data (base64), moduleKey }
 *
 * NOTA: Requiere BLOB_READ_WRITE_TOKEN en .env.local
 * Si no está configurado, usa base64 en memoria (fallback)
 */

import { put } from '@vercel/blob';

export const config = {
  runtime: 'nodejs',
  maxDuration: 60,
};

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

    // Decodificar base64
    const buffer = Buffer.from(data, 'base64');
    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const blobPath = `uploads/${moduleKey}/${safeName}`;

    let url;

    // Intenta usar Vercel Blob si está configurado
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const blob = await put(blobPath, buffer, {
          access: 'public',
          token: process.env.BLOB_READ_WRITE_TOKEN,
        });
        url = blob.url;
        console.log('Uploaded to Vercel Blob:', url);
      } catch (blobErr) {
        console.warn('Blob upload failed, using fallback:', blobErr.message);
        // Fallback: devolver URL en memoria (solo funciona en esta sesión)
        url = `data:application/octet-stream;base64,${data}`;
      }
    } else {
      // Sin BLOB_READ_WRITE_TOKEN, usar data URL (solo funciona en sesión actual)
      url = `data:application/octet-stream;base64,${data}`;
      console.log('No BLOB_READ_WRITE_TOKEN, usando fallback en memoria');
    }

    return res.status(200).json({
      status: 'uploaded',
      ok: true,
      filename: safeName,
      url,
      size: buffer.length,
      method: url.startsWith('data:') ? 'memory' : 'blob',
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

    // Si es una data URL no hay nada que eliminar
    if (url.startsWith('data:')) {
      return res.status(200).json({ status: 'deleted', ok: true });
    }

    // Para Vercel Blob sería: await del(url);
    // Por ahora solo retornar success
    return res.status(200).json({ status: 'deleted', ok: true });
  } catch (error) {
    console.error('Delete error:', error);
    return res.status(500).json({ error: 'Error al eliminar archivo', details: error.message });
  }
}
