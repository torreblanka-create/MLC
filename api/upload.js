/**
 * File Upload API - Guardar archivos PDF en servidor local
 * Endpoint: /api/upload
 * Método: POST
 * Body: { filename, data (base64), moduleKey }
 *
 * Los archivos se guardan en /uploads/{moduleKey}/{filename}
 * y se sirven a través de /uploads/{path}
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');

// Asegurar que el directorio existe
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

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
    const { filename, data, moduleKey } = req.body;

    if (!filename || !data || !moduleKey) {
      return res.status(400).json({ error: 'Faltan parámetros: filename, data, moduleKey' });
    }

    // Validar que moduleKey no contiene caracteres peligrosos
    if (!/^[a-z0-9_]+$/.test(moduleKey)) {
      return res.status(400).json({ error: 'moduleKey inválido' });
    }

    // Crear directorio del módulo
    const moduleDir = path.join(uploadsDir, moduleKey);
    if (!fs.existsSync(moduleDir)) {
      fs.mkdirSync(moduleDir, { recursive: true });
    }

    // Decodificar base64
    const buffer = Buffer.from(data, 'base64');

    // Sanitizar nombre de archivo
    const safeName = path.basename(filename).replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = path.join(moduleDir, safeName);

    // Guardar archivo
    fs.writeFileSync(filePath, buffer);

    // Generar URL accesible
    const url = `/uploads/${moduleKey}/${safeName}`;

    return res.status(200).json({
      status: 'uploaded',
      filename: safeName,
      url,
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

    // Extraer ruta relativa de la URL
    const match = url.match(/\/uploads\/(.+)$/);
    if (!match) {
      return res.status(400).json({ error: 'URL inválida' });
    }

    const filePath = path.join(uploadsDir, match[1]);

    // Verificar que el archivo está dentro de uploadsDir (seguridad)
    if (!filePath.startsWith(uploadsDir)) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    // Eliminar archivo si existe
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return res.status(200).json({ status: 'deleted' });
  } catch (error) {
    console.error('Delete error:', error);
    return res.status(500).json({ error: 'Error al eliminar archivo' });
  }
}
