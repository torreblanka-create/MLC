/**
 * Vercel Serverless Function - API de Contenidos
 * Fuente única de verdad para admin y alumno.
 * Usa Vercel Blob Storage con allowOverwrite para persistir JSON.
 *
 * URL: /api/content?action=get|save
 * Estructura: { content: { [courseId_moduleIdx]: {...} }, courseEnabled: {...} }
 */

import { put, list, head } from '@vercel/blob';

const CONTENT_PATH = 'gmlc/content.json';

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req, res) {
  cors(res);

  if (req.method === 'OPTIONS') return res.status(200).end();

  let body = req.body;
  if (Buffer.isBuffer(body)) body = JSON.parse(body.toString('utf-8'));
  else if (typeof body === 'string' && body) { try { body = JSON.parse(body); } catch { body = {}; } }

  const action = req.query?.action || body?.action;

  if (action === 'get')  return handleGet(req, res);
  if (action === 'save') return handleSave(req, res, body);
  return res.status(400).json({ error: 'Invalid action' });
}

async function handleGet(req, res) {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return res.status(200).json({
        data: { content: {}, courseEnabled: {} },
        storage: 'none',
        warning: 'BLOB_READ_WRITE_TOKEN no configurado — contenido no persiste entre sesiones/navegadores',
      });
    }

    const { blobs } = await list({ prefix: CONTENT_PATH, limit: 1 });
    if (!blobs || blobs.length === 0) {
      return res.status(200).json({ data: { content: {}, courseEnabled: {} }, storage: 'blob' });
    }

    const r = await fetch(blobs[0].url, { cache: 'no-store' });
    if (!r.ok) throw new Error(`Blob fetch failed: ${r.status}`);
    const data = await r.json();

    return res.status(200).json({
      data: normalizeData(data),
      storage: 'blob',
      updatedAt: blobs[0].uploadedAt,
    });
  } catch (error) {
    console.error('content get error:', error.message);
    return res.status(200).json({
      data: { content: {}, courseEnabled: {} },
      storage: 'none',
      error: error.message,
    });
  }
}

async function handleSave(req, res, body) {
  try {
    const payload = body?.data;
    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ error: 'Invalid data format' });
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return res.status(503).json({
        status: 'error',
        error: 'BLOB_READ_WRITE_TOKEN no configurado en Vercel. Configura Blob Storage para persistir.',
      });
    }

    const normalized = normalizeData(payload);
    const blob = await put(CONTENT_PATH, JSON.stringify(normalized), {
      access: 'public',
      contentType: 'application/json; charset=utf-8',
      allowOverwrite: true,
      addRandomSuffix: false,
      cacheControlMaxAge: 0,
    });

    return res.status(200).json({
      status: 'saved',
      storage: 'blob',
      url: blob.url,
    });
  } catch (error) {
    console.error('content save error:', error.message);
    return res.status(500).json({ error: error.message });
  }
}

function normalizeData(raw) {
  if (raw && typeof raw === 'object' && (raw.content || raw.courseEnabled)) {
    return {
      content: raw.content && typeof raw.content === 'object' ? raw.content : {},
      courseEnabled: raw.courseEnabled && typeof raw.courseEnabled === 'object' ? raw.courseEnabled : {},
    };
  }
  return { content: raw && typeof raw === 'object' ? raw : {}, courseEnabled: {} };
}
