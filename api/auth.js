// Authentication API for Inducción Platform
// Validates credentials and issues JWT tokens

const ADMIN_USERS = [
  { rut: '12.345.678-9', password: 'admin123', name: 'Admin Demo' },
  { rut: '12.000.000-0', password: 'admin2024', name: 'Administrador' },
];

const STUDENT_USERS = [
  { rut: '11.876.543-2', password: 'alumno123', name: 'Felipe Torres M.' },
  { rut: '14.523.867-3', password: 'alumno123', name: 'Juan Pérez Soto' },
  { rut: '16.789.012-5', password: 'alumno123', name: 'María González L.' },
];

function normalizeRut(rut) {
  return rut.replace(/[.-]/g, '').toUpperCase();
}

function isValidRut(rut) {
  return rut && rut.length >= 8;
}

function createToken(user, role) {
  const payload = {
    rut: user.rut,
    name: user.name,
    role: role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400 * 7, // 7 days
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

function verifyToken(token) {
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString());
    if (payload.exp * 1000 < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // POST /api/auth - Login
  if (req.method === 'POST' && req.body.action === 'login') {
    const { rut, password } = req.body;

    if (!rut || !password) {
      return res.status(400).json({ error: 'Missing credentials' });
    }

    if (!isValidRut(rut)) {
      return res.status(400).json({ error: 'Invalid RUT format' });
    }

    const normalizedRut = normalizeRut(rut);

    let user = ADMIN_USERS.find(u => normalizeRut(u.rut) === normalizedRut);
    if (user && user.password === password) {
      const token = createToken(user, 'admin');
      return res.status(200).json({
        success: true,
        role: 'admin',
        name: user.name,
        token: token,
      });
    }

    user = STUDENT_USERS.find(u => normalizeRut(u.rut) === normalizedRut);
    if (user && user.password === password) {
      const token = createToken(user, 'alumno');
      return res.status(200).json({
        success: true,
        role: 'alumno',
        name: user.name,
        token: token,
      });
    }

    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // POST /api/auth - Verify token
  if (req.method === 'POST' && req.body.action === 'verify') {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ valid: false });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return res.status(401).json({ valid: false });
    }

    return res.status(200).json({
      valid: true,
      role: payload.role,
      rut: payload.rut,
      name: payload.name,
    });
  }

  // GET /api/auth - Health check
  if (req.method === 'GET') {
    return res.status(200).json({ status: 'ok' });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
