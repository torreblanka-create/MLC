import { useState } from 'react';
import { Btn, Card, Badge, Tag, ProgressBar, Icon } from '../components/Shared';
import { QUESTION_BANKS, FAENA_LABELS } from '../data/questions';
const C = { copper: 'var(--copper)', text: 'var(--text)', textMuted: 'var(--text-muted)', danger: 'var(--danger)', warning: 'var(--warning)', success: 'var(--success)', surface: 'var(--surface)', surface2: 'var(--surface2)', surface3: 'var(--surface3)', border: 'var(--border)', silver: 'var(--silver)', silverLt: 'var(--silver-lt)', copperLt: 'var(--copper-lt)' };

const CURSOS_LABEL = {
  mina_cabildo:   'Mina Cabildo',
  mina_taltal:    'Mina Taltal',
  planta_cabildo: 'Planta Cabildo',
  planta_taltal:  'Planta Taltal',
};

const CURSOS_COLOR = {
  mina_cabildo:   C.copper,
  mina_taltal:    '#6B9EC4',
  planta_cabildo: C.success,
  planta_taltal:  '#A06BC4',
};

function diasColor(d) {
  if (d < 0)  return C.danger;
  if (d <= 3) return C.danger;
  if (d <= 7) return C.warning;
  return C.success;
}

function DiasPlazoBadge({ dias, vencido }) {
  if (vencido || dias < 0) return <Badge color={C.danger}>Vencido</Badge>;
  const color = diasColor(dias);
  return (
    <span style={{ fontSize: 12, fontWeight: 700, color, display: 'flex', alignItems: 'center', gap: 4 }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, display: 'inline-block' }} />
      {dias} día{dias !== 1 ? 's' : ''}
    </span>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────
function AdminDashboard({ onNav }) {
  const stats = [
    { label: 'Alumnos activos',    value: '124', icon: 'users',   color: C.copper },
    { label: 'Cursos en progreso', value: '87',  icon: 'book',    color: C.warning },
    { label: 'Aprobados este mes', value: '43',  icon: 'award',   color: C.success },
    { label: 'Plazo vencido',      value: '5',   icon: 'warning', color: C.danger },
  ];
  const recentActivity = [
    { name: 'Carlos Muñoz R.',  rut: '12.345.678-9', curso: 'Mina Cabildo',   estado: 'Aprobado',       pct: '93%', hora: 'hace 12 min', color: C.success },
    { name: 'Andrea Soto V.',   rut: '15.234.567-K', curso: 'Planta Taltal',  estado: 'En evaluación',  pct: '—',   hora: 'hace 28 min', color: C.warning },
    { name: 'Felipe Torres M.', rut: '11.876.543-2', curso: 'Mina Taltal',    estado: 'Reprobado (3/3)',pct: '60%', hora: 'hace 1h',     color: C.danger },
    { name: 'Rosa Díaz A.',     rut: '17.456.789-1', curso: 'Planta Cabildo', estado: 'En módulo 5',    pct: '—',   hora: 'hace 2h',     color: C.copper },
    { name: 'Luis Araya P.',    rut: '13.654.321-5', curso: 'Mina Cabildo',   estado: 'Aprobado',       pct: '100%',hora: 'hace 3h',     color: C.success },
  ];

  return (
    <div style={{ padding: 40, maxWidth: 1100 }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, color: C.copper, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Panel de control</div>
        <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 36, fontWeight: 800, color: C.text }}>Tablero Administrador</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {stats.map((s, i) => (
          <Card key={i} style={{ padding: 20 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: s.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <Icon name={s.icon} size={20} color={s.color} />
            </div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 40, fontWeight: 800, color: C.text, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>{s.label}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <Card style={{ padding: 24 }}>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 20 }}>Aprobación por curso</div>
          {[{ curso: 'Inducción Mina Cabildo', pct: 78 }, { curso: 'Inducción Mina Taltal', pct: 65 }, { curso: 'Inducción Planta Cabildo', pct: 82 }, { curso: 'Inducción Planta Taltal', pct: 71 }].map((c, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: C.text, marginBottom: 5 }}>
                <span>{c.curso}</span><span style={{ color: C.copper, fontWeight: 600 }}>{c.pct}%</span>
              </div>
              <ProgressBar pct={c.pct} color={c.pct >= 75 ? C.success : C.warning} height={8} />
            </div>
          ))}
        </Card>

        <Card style={{ padding: 24 }}>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 20 }}>Acciones pendientes</div>
          {[
            { text: 'Felipe Torres M. reprobó 3/3 en Mina Taltal', action: 'Autorizar', color: C.danger, path: 'admin_users' },
            { text: '5 alumnos con plazo vencido sin completar', action: 'Ver', color: C.danger, path: 'admin_users' },
            { text: '2 certificados pendientes de firma digital', action: 'Firmar', color: C.warning, path: 'admin_users' },
            { text: 'Lote de inscripción recibido: 4 alumnos', action: 'Revisar', color: C.copper, path: 'admin_email' },
          ].map((a, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: i < 3 ? `1px solid ${C.border}` : 'none' }}>
              <div style={{ flex: 1, fontSize: 13, color: C.text, marginRight: 12, lineHeight: 1.4 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: a.color, display: 'inline-block', marginRight: 8 }} />
                {a.text}
              </div>
              <Btn size="sm" variant="ghost" onClick={() => onNav(a.path)}>{a.action}</Btn>
            </div>
          ))}
        </Card>
      </div>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 18, fontWeight: 700, color: C.text }}>Actividad reciente</div>
          <Btn size="sm" variant="ghost" onClick={() => onNav('admin_users')}>Ver todos →</Btn>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: C.surface3 }}>
              {['Alumno', 'RUT', 'Curso', 'Estado', 'Resultado', 'Hora'].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentActivity.map((r, i) => (
              <tr key={i} style={{ borderTop: `1px solid ${C.border}` }}>
                <td style={{ padding: '12px 16px', fontSize: 14, color: C.text, fontWeight: 500 }}>{r.name}</td>
                <td style={{ padding: '12px 16px', fontSize: 13, color: C.textMuted }}>{r.rut}</td>
                <td style={{ padding: '12px 16px', fontSize: 13, color: C.text }}>{r.curso}</td>
                <td style={{ padding: '12px 16px' }}><Badge color={r.color}>{r.estado}</Badge></td>
                <td style={{ padding: '12px 16px', fontSize: 14, color: r.color, fontWeight: 700 }}>{r.pct}</td>
                <td style={{ padding: '12px 16px', fontSize: 12, color: C.textMuted }}>{r.hora}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ─── USERS ────────────────────────────────────────────────
function AdminUsers({ onNav }) {
  const [search, setSearch] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');

  const [alumnos, setAlumnos] = useState([
    { name: 'Carlos Muñoz R.',  rut: '12.345.678-9', email: 'c.munoz@empresa.cl',  cursos: ['mina_cabildo'],                    estados: { mina_cabildo: 'aprobado' },                    inscrito: '2026-04-04', diasRestantes: 0,  vencido: false, inscritor: 'jorge.sandoval@gmlc.cl', intentos: 1 },
    { name: 'Andrea Soto V.',   rut: '15.234.567-K', email: 'a.soto@empresa.cl',   cursos: ['planta_taltal', 'planta_cabildo'],  estados: { planta_taltal: 'en_progreso', planta_cabildo: 'pendiente' }, inscrito: '2026-04-14', diasRestantes: 10, vencido: false, inscritor: 'jorge.sandoval@gmlc.cl', intentos: 0 },
    { name: 'Felipe Torres M.', rut: '11.876.543-2', email: 'f.torres@empresa.cl', cursos: ['mina_taltal'],                     estados: { mina_taltal: 'reprobado' },                    inscrito: '2026-04-10', diasRestantes: 6,  vencido: false, inscritor: 'rrhh@gmlc.cl', intentos: 3 },
    { name: 'Rosa Díaz A.',     rut: '17.456.789-1', email: 'r.diaz@empresa.cl',   cursos: ['planta_cabildo', 'mina_cabildo'],  estados: { planta_cabildo: 'en_progreso', mina_cabildo: 'pendiente' }, inscrito: '2026-04-15', diasRestantes: 11, vencido: false, inscritor: 'rrhh@gmlc.cl', intentos: 1 },
    { name: 'Luis Araya P.',    rut: '13.654.321-5', email: 'l.araya@empresa.cl',  cursos: ['mina_cabildo'],                    estados: { mina_cabildo: 'aprobado' },                    inscrito: '2026-04-02', diasRestantes: 0,  vencido: false, inscritor: 'jorge.sandoval@gmlc.cl', intentos: 2 },
    { name: 'Bárbara Vega C.',  rut: '16.123.456-7', email: 'b.vega@empresa.cl',   cursos: ['mina_taltal', 'mina_cabildo'],     estados: { mina_taltal: 'pendiente', mina_cabildo: 'pendiente' },   inscrito: '2026-04-02', diasRestantes: -2, vencido: true,  inscritor: 'rrhh@gmlc.cl', intentos: 0 },
    { name: 'Marco Pizarro A.', rut: '14.887.321-K', email: 'm.pizarro@empresa.cl',cursos: ['mina_cabildo', 'planta_cabildo', 'mina_taltal', 'planta_taltal'], estados: { mina_cabildo: 'en_progreso', planta_cabildo: 'pendiente', mina_taltal: 'pendiente', planta_taltal: 'pendiente' }, inscrito: '2026-04-17', diasRestantes: 13, vencido: false, inscritor: 'jorge.sandoval@gmlc.cl', intentos: 0 },
    { name: 'Claudia Reyes T.', rut: '15.772.440-3', email: 'c.reyes@empresa.cl',  cursos: ['planta_taltal'],                   estados: { planta_taltal: 'pendiente' },                  inscrito: '2026-04-03', diasRestantes: -1, vencido: true,  inscritor: 'rrhh@gmlc.cl', intentos: 0 },
  ]);

  const reinscribir = (rut) => {
    setAlumnos(prev => prev.map(a => 
      a.rut === rut ? { ...a, vencido: false, diasRestantes: 15, inscrito: new Date().toISOString().slice(0, 10), estados: Object.keys(a.estados).reduce((acc, k) => ({ ...acc, [k]: a.estados[k] === 'aprobado' ? 'aprobado' : 'pendiente' }), {}) } : a
    ));
    alert('Alumno re-inscrito correctamente. Se han restablecido sus plazos y notificado por correo.');
  };

  const autorizar = (rut) => {
    setAlumnos(prev => prev.map(a => 
      a.rut === rut ? { ...a, intentos: 0, estados: Object.keys(a.estados).reduce((acc, k) => ({ ...acc, [k]: a.estados[k] === 'reprobado' ? 'pendiente' : a.estados[k] }), {}) } : a
    ));
    alert('Intento adicional autorizado. El alumno puede volver a rendir la evaluación.');
  };

  const filtros = [
    { id: 'todos', label: 'Todos' },
    { id: 'vencido', label: 'Vencidos' },
    { id: 'en_progreso', label: 'En progreso' },
    { id: 'pendiente', label: 'Pendientes' },
    { id: 'aprobado', label: 'Aprobados' },
  ];

  const filtered = alumnos.filter(a => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.rut.includes(search);
    if (!matchSearch) return false;
    if (filtroEstado === 'todos') return true;
    if (filtroEstado === 'vencido') return a.vencido;
    return Object.values(a.estados).some(e => e === filtroEstado);
  });

  const estadoColor = { aprobado: C.success, en_progreso: C.warning, reprobado: C.danger, pendiente: C.textMuted };
  const estadoLabel = { aprobado: 'Aprobado', en_progreso: 'En progreso', reprobado: 'Reprobado', pendiente: 'Pendiente' };

  return (
    <div style={{ padding: 40, maxWidth: 1150 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <div style={{ fontSize: 11, color: C.copper, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Gestión</div>
          <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 34, fontWeight: 800, color: C.text }}>Alumnos Inscritos</h1>
          <p style={{ fontSize: 13, color: C.textMuted, marginTop: 4 }}>Plazo: 15 días desde inscripción · Los vencidos son notificados automáticamente</p>
        </div>
        <Btn onClick={() => onNav('admin_email')}><Icon name="upload" size={15} color="white" /> Inscribir por lote</Btn>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <input placeholder="Buscar por nombre o RUT..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex: '1 1 260px', maxWidth: 340, background: C.surface3, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, padding: '9px 14px', fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: 'none' }} />
        <div style={{ display: 'flex', gap: 6 }}>
          {filtros.map(f => (
            <button key={f.id} onClick={() => setFiltroEstado(f.id)} style={{
              padding: '8px 14px', borderRadius: 8, border: `1px solid ${filtroEstado === f.id ? C.copper : C.border}`,
              background: filtroEstado === f.id ? C.copper + '20' : 'transparent',
              color: filtroEstado === f.id ? C.copperLt : C.textMuted,
              fontSize: 12, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', fontWeight: filtroEstado === f.id ? 600 : 400,
            }}>{f.label}</button>
          ))}
        </div>
      </div>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: C.surface3 }}>
              {['Alumno / Correo', 'RUT', 'Cursos asignados', 'Estado cursos', 'Días plazo', 'Inscritor', 'Acciones'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((a, i) => (
              <tr key={i} style={{ borderTop: `1px solid ${C.border}`, background: a.vencido ? C.danger + '08' : 'transparent' }}>
                <td style={{ padding: '13px 14px' }}>
                  <div style={{ fontSize: 14, color: C.text, fontWeight: 500 }}>{a.name}</div>
                  <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{a.email}</div>
                </td>
                <td style={{ padding: '13px 14px', fontSize: 12, color: C.textMuted }}>{a.rut}</td>
                <td style={{ padding: '13px 14px' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {a.cursos.map(c => (
                      <span key={c} style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: CURSOS_COLOR[c] + '22', color: CURSOS_COLOR[c] }}>
                        {CURSOS_LABEL[c]}
                      </span>
                    ))}
                  </div>
                </td>
                <td style={{ padding: '13px 14px' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {Object.entries(a.estados).map(([curso, est]) => (
                      <Badge key={curso} color={estadoColor[est]}>{estadoLabel[est]}</Badge>
                    ))}
                  </div>
                </td>
                <td style={{ padding: '13px 14px' }}>
                  <DiasPlazoBadge dias={a.diasRestantes} vencido={a.vencido} />
                  <div style={{ fontSize: 10, color: C.textMuted, marginTop: 3 }}>desde {a.inscrito}</div>
                </td>
                <td style={{ padding: '13px 14px', fontSize: 11, color: C.textMuted, maxWidth: 140, wordBreak: 'break-all' }}>{a.inscritor}</td>
                <td style={{ padding: '13px 14px' }}>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {a.vencido && <Btn size="sm" variant="danger" onClick={() => reinscribir(a.rut)}>Re-inscribir</Btn>}
                    {a.intentos >= 3 && !a.vencido && <Btn size="sm" variant="danger" onClick={() => autorizar(a.rut)}>Autorizar</Btn>}
                    {Object.values(a.estados).includes('aprobado') && <Btn size="sm" variant="ghost" onClick={() => alert('Certificado emitido digitalmente para ' + a.name)}><Icon name="award" size={12} color={C.silver} /></Btn>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: C.textMuted, fontSize: 14 }}>Sin resultados para la búsqueda actual</div>
        )}
      </Card>
    </div>
  );
}

// ─── EMAIL / INSCRIPCIÓN ───────────────────────────────────
function AdminEmail() {
  const [stage, setStage] = useState('inbox');
  const [tab, setTab] = useState('inbox'); // 'inbox' | 'senders'
  const [senders, setSenders] = useState([
    { nombre: 'Jorge Sandoval',   email: 'jorge.sandoval@gmlc.cl',   area: 'RRHH Mina Cabildo',   activo: true, desde: '2025-01-15' },
    { nombre: 'Patricia Morales', email: 'p.morales@gmlc.cl',        area: 'RRHH Mina Taltal',    activo: true, desde: '2025-01-15' },
    { nombre: 'Cuenta RRHH',      email: 'rrhh@gmlc.cl',             area: 'Recursos Humanos',     activo: true, desde: '2025-01-15' },
    { nombre: 'Hernán Figueroa',  email: 'h.figueroa@contratista.cl', area: 'Contratista externo', activo: false, desde: '2025-03-10' },
  ]);
  const [newSender, setNewSender] = useState({ nombre: '', email: '', area: '' });
  const [showAddForm, setShowAddForm] = useState(false);

  const mockExcel = [
    { nombre: 'Juan Pérez Soto',   rut: '14.523.867-3', email: 'j.perez@minera.cl',   cursos: ['mina_cabildo', 'mina_taltal'] },
    { nombre: 'María González L.', rut: '16.789.012-5', email: 'm.gonzalez@minera.cl', cursos: ['planta_cabildo'] },
    { nombre: 'Pedro Ramírez V.',  rut: '12.901.234-7', email: 'p.ramirez@minera.cl',  cursos: ['mina_cabildo'] },
    { nombre: 'Carla Fuentes M.',  rut: '18.345.678-K', email: 'c.fuentes@minera.cl',  cursos: ['planta_cabildo', 'planta_taltal'] },
  ];

  const addSender = () => {
    if (!newSender.nombre || !newSender.email) return;
    setSenders(s => [...s, { ...newSender, activo: true, desde: new Date().toISOString().slice(0, 10) }]);
    setNewSender({ nombre: '', email: '', area: '' });
    setShowAddForm(false);
  };

  const toggleSender = (email) => setSenders(s => s.map(x => x.email === email ? { ...x, activo: !x.activo } : x));
  const removeSender = (email) => setSenders(s => s.filter(x => x.email !== email));

  return (
    <div style={{ padding: 40, maxWidth: 900 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: C.copper, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Inscripción automática</div>
        <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 34, fontWeight: 800, color: C.text }}>Inscripción por Lote</h1>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 28, borderBottom: `1px solid ${C.border}`, paddingBottom: 0 }}>
        {[{ id: 'inbox', label: 'Bandeja de entrada' }, { id: 'senders', label: 'Remitentes autorizados' }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '10px 18px', border: 'none', background: 'transparent', cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: tab === t.id ? 700 : 400,
            color: tab === t.id ? C.copperLt : C.textMuted,
            borderBottom: `2px solid ${tab === t.id ? C.copper : 'transparent'}`,
            marginBottom: -1,
          }}>{t.label}</button>
        ))}
      </div>

      {/* ── TAB: Bandeja de entrada ─────────────────────── */}
      {tab === 'inbox' && (
        <div>
          {/* Pipeline steps */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
            {['Email recibido', 'Excel detectado', 'Datos validados', 'Alumnos inscritos', 'Credenciales enviadas'].map((s, i) => {
              const active = (stage === 'done') || (stage === 'preview' && i < 3) || (stage === 'inbox' && i < 1);
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ padding: '6px 14px', borderRadius: 99, background: active ? C.copper + '22' : C.surface3, border: `1px solid ${active ? C.copper : C.border}` }}>
                    <span style={{ fontSize: 12, color: active ? C.copperLt : C.textMuted }}>{s}</span>
                  </div>
                  {i < 4 && <Icon name="chevron" size={14} color={C.textMuted} />}
                </div>
              );
            })}
          </div>

          {stage === 'inbox' && (
            <div>
              <Card style={{ marginBottom: 20, border: `1px solid ${C.copper}44` }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 16 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: C.copper + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon name="mail" size={18} color={C.copper} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: C.text, fontSize: 14 }}>Nuevo correo de inscripción detectado</div>
                    <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>De: jorge.sandoval@gmlc.cl · RRHH Mina Cabildo · Hace 5 minutos</div>
                  </div>
                  <Badge color={C.success}>Remitente autorizado ✓</Badge>
                </div>
                <div style={{ background: C.surface3, borderRadius: 8, padding: 16, fontSize: 13, color: C.text, lineHeight: 1.7 }}>
                  <strong>Asunto:</strong> Inscripción inducción — lote abril 2026<br />
                  <strong>Adjunto:</strong> inscripcion_lote_abr2026.xlsx (4 alumnos)<br /><br />
                  Estimados, adjunto planilla con los alumnos para inscribir en sus respectivos cursos.<br />
                  — Jorge Sandoval, RRHH Mina Cabildo
                </div>
              </Card>
              <Btn onClick={() => setStage('preview')}><Icon name="eye" size={15} color="white" /> Procesar archivo Excel</Btn>
            </div>
          )}

          {stage === 'preview' && (
            <div>
              <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 20, fontWeight: 700, color: C.text }}>Alumnos detectados: {mockExcel.length}</div>
                <Badge color={C.success}>Excel validado ✓</Badge>
              </div>
              <Card style={{ padding: 0, overflow: 'hidden', marginBottom: 16 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: C.surface3 }}>
                      {['Nombre', 'RUT', 'Correo', 'Cursos asignados'].map(h => (
                        <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {mockExcel.map((a, i) => (
                      <tr key={i} style={{ borderTop: `1px solid ${C.border}` }}>
                        <td style={{ padding: '12px 14px', fontSize: 14, color: C.text }}>{a.nombre}</td>
                        <td style={{ padding: '12px 14px', fontSize: 13, color: C.textMuted }}>{a.rut}</td>
                        <td style={{ padding: '12px 14px', fontSize: 13, color: C.textMuted }}>{a.email}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                            {a.cursos.map(c => (
                              <span key={c} style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: CURSOS_COLOR[c] + '22', color: CURSOS_COLOR[c] }}>
                                {CURSOS_LABEL[c]}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
              <div style={{ background: C.copper + '12', border: `1px solid ${C.copper}33`, borderRadius: 8, padding: '12px 16px', marginBottom: 16, fontSize: 13, color: C.text }}>
                Al confirmar, cada alumno recibirá sus credenciales por correo y tendrá <strong>15 días</strong> para completar su inducción.
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <Btn variant="ghost" onClick={() => setStage('inbox')}>← Volver</Btn>
                <Btn variant="success" onClick={() => setStage('done')}><Icon name="check" size={15} color="white" /> Confirmar inscripción</Btn>
              </div>
            </div>
          )}

          {stage === 'done' && (
            <div>
              <div style={{ background: C.success + '15', border: `1px solid ${C.success}44`, borderRadius: 12, padding: 24, marginBottom: 20 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 14 }}>
                  <Icon name="check" size={24} color={C.success} />
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 700, color: C.text }}>Inscripción confirmada</div>
                </div>
                <ul style={{ fontSize: 13, color: C.text, lineHeight: 2, paddingLeft: 20 }}>
                  <li>4 alumnos inscritos y credenciales enviadas a cada correo</li>
                  <li>Confirmación enviada a jorge.sandoval@gmlc.cl</li>
                  <li>Plazo de inducción: <strong>15 días</strong> desde hoy ({new Date(Date.now() + 15*86400000).toLocaleDateString('es-CL')})</li>
                  <li>Si algún alumno no completa a tiempo, se notificará automáticamente al inscritor y al alumno</li>
                </ul>
              </div>
              <Btn variant="ghost" onClick={() => setStage('inbox')}>← Nueva inscripción</Btn>
            </div>
          )}
        </div>
      )}

      {/* ── TAB: Remitentes autorizados ─────────────────── */}
      {tab === 'senders' && (
        <div>
          <div style={{ marginBottom: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 14, color: C.text, fontWeight: 500, marginBottom: 4 }}>Correos autorizados para enviar lotes de inscripción</div>
              <div style={{ fontSize: 12, color: C.textMuted }}>Solo se procesan Excel adjuntos de estos remitentes. Los demás son rechazados automáticamente.</div>
            </div>
            <Btn size="sm" onClick={() => setShowAddForm(v => !v)}>
              <Icon name="user" size={13} color="white" /> {showAddForm ? 'Cancelar' : 'Agregar remitente'}
            </Btn>
          </div>

          {showAddForm && (
            <Card style={{ marginBottom: 20, border: `1px solid ${C.copper}44` }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, fontWeight: 700, color: C.copper, marginBottom: 16 }}>Nuevo remitente autorizado</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
                {[
                  { key: 'nombre', placeholder: 'Nombre completo' },
                  { key: 'email',  placeholder: 'correo@empresa.cl' },
                  { key: 'area',   placeholder: 'Área o cargo' },
                ].map(f => (
                  <input key={f.key} placeholder={f.placeholder} value={newSender[f.key]}
                    onChange={e => setNewSender(s => ({ ...s, [f.key]: e.target.value }))}
                    style={{ background: C.surface3, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, padding: '10px 14px', fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: 'none' }} />
                ))}
              </div>
              <Btn onClick={addSender}><Icon name="check" size={14} color="white" /> Agregar</Btn>
            </Card>
          )}

          <Card style={{ padding: 0, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: C.surface3 }}>
                  {['Nombre', 'Correo autorizado', 'Área', 'Desde', 'Estado', 'Acciones'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {senders.map((s, i) => (
                  <tr key={i} style={{ borderTop: `1px solid ${C.border}`, opacity: s.activo ? 1 : 0.5 }}>
                    <td style={{ padding: '12px 14px', fontSize: 14, color: C.text, fontWeight: 500 }}>{s.nombre}</td>
                    <td style={{ padding: '12px 14px', fontSize: 13, color: C.textMuted, fontFamily: 'monospace' }}>{s.email}</td>
                    <td style={{ padding: '12px 14px', fontSize: 13, color: C.textMuted }}>{s.area}</td>
                    <td style={{ padding: '12px 14px', fontSize: 12, color: C.textMuted }}>{s.desde}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <Badge color={s.activo ? C.success : C.textMuted}>{s.activo ? 'Activo' : 'Inactivo'}</Badge>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Btn size="sm" variant="ghost" onClick={() => toggleSender(s.email)}>
                          {s.activo ? 'Desactivar' : 'Activar'}
                        </Btn>
                        <Btn size="sm" variant="danger" onClick={() => removeSender(s.email)}>
                          <Icon name="x" size={12} color="white" />
                        </Btn>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}
    </div>
  );
}

// ─── QUESTIONS ────────────────────────────────────────────
function AdminQuestions() {
  const FAENAS = [
    { id: 'mina_cabildo',   label: 'Mina Cabildo' },
    { id: 'mina_taltal',    label: 'Mina Taltal' },
    { id: 'planta_cabildo', label: 'Planta Cabildo' },
    { id: 'planta_taltal',  label: 'Planta Taltal' },
  ];

  const [activeFaena, setActiveFaena] = useState('mina_cabildo');
  const [questions, setQuestions] = useState(() =>
    (QUESTION_BANKS[activeFaena] || []).map(q => ({ ...q, activa: true }))
  );
  const [editingQ, setEditingQ] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [showAll, setShowAll] = useState(false);

  const switchFaena = (id) => {
    setActiveFaena(id);
    setSearch('');
    setShowAll(false);
    setQuestions((QUESTION_BANKS[id] || []).map(q => ({ ...q, activa: true })));
  };

  const openNew = () => {
    setEditingQ({ id: null, q: '', opts: ['', '', '', ''], correct: 0, activa: true });
    setShowModal(true);
  };

  const openEdit = (q) => {
    setEditingQ({ ...q });
    setShowModal(true);
  };

  const saveModal = () => {
    if (!editingQ) return;
    if (editingQ.id) {
      setQuestions(prev => prev.map(q => q.id === editingQ.id ? { ...editingQ } : q));
    } else {
      const newId = activeFaena.slice(0, 2) + String(Date.now()).slice(-4);
      setQuestions(prev => [...prev, { ...editingQ, id: newId }]);
    }
    setShowModal(false);
    setEditingQ(null);
  };

  const toggleActiva = (id) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, activa: !q.activa } : q));
  };

  const filtered = questions.filter(q =>
    q.q.toLowerCase().includes(search.toLowerCase())
  );
  const displayed = showAll ? filtered : filtered.slice(0, 20);

  const inputStyle = {
    width: '100%', boxSizing: 'border-box',
    background: C.surface3, border: `1px solid ${C.border}`,
    borderRadius: 8, color: C.text, padding: '9px 14px',
    fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: 'none',
  };

  return (
    <div style={{ padding: 40, maxWidth: 1000 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 11, color: C.copper, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 4 }}>Evaluaciones</div>
          <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 34, fontWeight: 800, color: C.text, margin: 0 }}>Banco de Preguntas</h1>
          <p style={{ color: C.textMuted, fontSize: 13, marginTop: 4 }}>
            {questions.length} preguntas · 15 se sortean por evaluación
          </p>
        </div>
        <Btn onClick={openNew}><Icon name="doc" size={15} color="white" /> Nueva pregunta</Btn>
      </div>

      {/* Faena selector */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: `1px solid ${C.border}`, paddingBottom: 0 }}>
        {FAENAS.map(f => (
          <button key={f.id} onClick={() => switchFaena(f.id)} style={{
            padding: '9px 18px', border: 'none', background: 'transparent', cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif", fontSize: 13,
            fontWeight: activeFaena === f.id ? 700 : 400,
            color: activeFaena === f.id ? C.copperLt : C.textMuted,
            borderBottom: `2px solid ${activeFaena === f.id ? C.copper : 'transparent'}`,
            marginBottom: -1, transition: 'all .15s',
          }}>{f.label}</button>
        ))}
      </div>

      {/* Search */}
      <div style={{ marginBottom: 16 }}>
        <input
          placeholder="Buscar pregunta..."
          value={search}
          onChange={e => { setSearch(e.target.value); setShowAll(false); }}
          style={{ ...inputStyle, maxWidth: 360 }}
        />
      </div>

      {/* Table */}
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: C.surface3 }}>
              {['#', 'Pregunta', 'Respuesta correcta', 'Estado', 'Acciones'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '.07em', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayed.map((q, i) => (
              <tr key={q.id} style={{ borderTop: `1px solid ${C.border}`, background: i % 2 === 0 ? 'transparent' : C.surface3 + '55' }}>
                <td style={{ padding: '11px 14px', fontSize: 12, color: C.textMuted, width: 36 }}>{i + 1}</td>
                <td style={{ padding: '11px 14px', fontSize: 13, color: C.text, maxWidth: 360 }}>
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{q.q}</div>
                </td>
                <td style={{ padding: '11px 14px', fontSize: 12, color: C.success, maxWidth: 220 }}>
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {['A', 'B', 'C', 'D'][q.correct]}: {q.opts?.[q.correct] || '—'}
                  </div>
                </td>
                <td style={{ padding: '11px 14px' }}>
                  <Badge color={q.activa !== false ? C.success : C.textMuted}>
                    {q.activa !== false ? 'Activa' : 'Inactiva'}
                  </Badge>
                </td>
                <td style={{ padding: '11px 14px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <Btn size="sm" variant="ghost" onClick={() => openEdit(q)}>Editar</Btn>
                    <Btn size="sm" variant="ghost" onClick={() => toggleActiva(q.id)}>
                      {q.activa !== false ? 'Inactivar' : 'Activar'}
                    </Btn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: '12px 16px', borderTop: `1px solid ${C.border}`, fontSize: 12, color: C.textMuted, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Mostrando {displayed.length} de {filtered.length} preguntas</span>
          {filtered.length > 20 && !showAll && (
            <span style={{ color: C.copper, cursor: 'pointer' }} onClick={() => setShowAll(true)}>Ver todas →</span>
          )}
          {showAll && filtered.length > 20 && (
            <span style={{ color: C.copper, cursor: 'pointer' }} onClick={() => setShowAll(false)}>Mostrar menos ↑</span>
          )}
        </div>
      </Card>

      {/* Modal */}
      {showModal && editingQ && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 2000,
          background: 'rgba(6,12,20,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14,
            padding: 32, width: 600, maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto',
            boxShadow: '0 8px 60px rgba(0,0,0,0.6)',
          }}>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 20 }}>
              {editingQ.id ? 'Editar pregunta' : 'Nueva pregunta'}
            </div>
            {/* Question text */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, color: C.textMuted, display: 'block', marginBottom: 6 }}>Pregunta *</label>
              <textarea
                value={editingQ.q}
                onChange={e => setEditingQ(p => ({ ...p, q: e.target.value }))}
                rows={3}
                placeholder="Escribe la pregunta aquí..."
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>
            {/* Options */}
            {['A', 'B', 'C', 'D'].map((letter, idx) => (
              <div key={idx} style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 12, color: C.textMuted, display: 'block', marginBottom: 5 }}>Opción {letter}</label>
                <input
                  value={editingQ.opts?.[idx] || ''}
                  onChange={e => {
                    const opts = [...(editingQ.opts || ['', '', '', ''])];
                    opts[idx] = e.target.value;
                    setEditingQ(p => ({ ...p, opts }));
                  }}
                  placeholder={`Opción ${letter}...`}
                  style={inputStyle}
                />
              </div>
            ))}
            {/* Correct answer selector */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: C.textMuted, display: 'block', marginBottom: 8 }}>Respuesta correcta</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {['A', 'B', 'C', 'D'].map((letter, idx) => (
                  <button key={idx} onClick={() => setEditingQ(p => ({ ...p, correct: idx }))} style={{
                    padding: '8px 18px', border: `1px solid ${editingQ.correct === idx ? C.copper : C.border}`,
                    borderRadius: 8, background: editingQ.correct === idx ? C.copper + '22' : 'transparent',
                    color: editingQ.correct === idx ? C.copperLt : C.textMuted,
                    fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 15, cursor: 'pointer',
                  }}>{letter}</button>
                ))}
              </div>
            </div>
            {/* Activa toggle */}
            <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
              <label style={{ fontSize: 13, color: C.text }}>Estado:</label>
              <button onClick={() => setEditingQ(p => ({ ...p, activa: !p.activa }))} style={{
                padding: '6px 16px', borderRadius: 20, border: `1px solid ${editingQ.activa ? C.success : C.border}`,
                background: editingQ.activa ? C.success + '22' : 'transparent',
                color: editingQ.activa ? C.success : C.textMuted,
                fontSize: 12, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', fontWeight: 600,
              }}>{editingQ.activa ? 'Activa' : 'Inactiva'}</button>
            </div>
            {/* Buttons */}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <Btn variant="ghost" onClick={() => { setShowModal(false); setEditingQ(null); }}>Cancelar</Btn>
              <Btn onClick={saveModal}>Guardar pregunta</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SETTINGS ─────────────────────────────────────────────
function SettingsPage() {
  const LS_KEY = 'ind_settings';
  const loadSaved = () => {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || 'null'); } catch { return null; }
  };

  const [fea, setFea] = useState(() => {
    const s = loadSaved();
    return s?.fea || { provider: 'e-certchile.cl', endpoint: 'https://api.ecertchile.cl/v2/sign', clientId: '', clientSecret: '', certSerial: '' };
  });
  const [feaShowSecret, setFeaShowSecret] = useState(false);
  const [feaTestStatus, setFeaTestStatus] = useState(null); // null | 'ok' | 'error'

  const [bio, setBio] = useState(() => {
    const s = loadSaved();
    return s?.bio || { ocrProvider: 'Google Vision API', ocrKey: '', faceProvider: 'face-api.js local', faceKey: '', minConfidence: 85 };
  });
  const [bioShowOcrKey, setBioShowOcrKey] = useState(false);
  const [bioShowFaceKey, setBioShowFaceKey] = useState(false);

  const [emailConfig, setEmailConfig] = useState(() => {
    const s = loadSaved();
    return s?.emailConfig || {
      smtp: 'mail.gmlc.cl · Puerto 465 SSL',
      receptora: 'induccion@gmlc.cl (Pipe a PHP)',
      remitente: 'induccion@gmlc.cl',
      notificaciones: 'rrhh@gmlc.cl',
    };
  });

  const [saved, setSaved] = useState(false);

  const faceApiLocal = bio.faceProvider === 'face-api.js local';

  const testFea = () => {
    setFeaTestStatus(null);
    setTimeout(() => {
      setFeaTestStatus(fea.clientId && fea.clientSecret ? 'ok' : 'error');
    }, 900);
  };

  const saveAll = () => {
    localStorage.setItem(LS_KEY, JSON.stringify({ fea, bio, emailConfig }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const inputStyle = {
    width: '100%', boxSizing: 'border-box',
    background: C.surface3, border: `1px solid ${C.border}`,
    borderRadius: 8, color: C.text, padding: '9px 14px',
    fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: 'none',
  };
  const labelStyle = { fontSize: 12, color: C.textMuted, display: 'block', marginBottom: 5 };
  const rowStyle = { marginBottom: 14 };
  const sectionTitle = { fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, fontWeight: 700, color: C.copper, marginBottom: 16, letterSpacing: '0.04em' };

  const staticGroups = [
    { section: 'Evaluaciones', items: [
      { label: 'Banco de preguntas',      value: '50 preguntas por faena (200 en total)' },
      { label: 'Preguntas por evaluación',value: '15 (aleatorias del banco de la faena)' },
      { label: 'Porcentaje de aprobación',value: '90% mínimo (13/15)' },
      { label: 'Intentos por alumno',     value: '3 intentos por curso' },
    ]},
    { section: 'Plazos e inscripción', items: [
      { label: 'Plazo para completar',    value: '15 días desde inscripción' },
      { label: 'Notificación al vencer',  value: 'Automática al alumno e inscritor' },
      { label: 'Acción al vencer',        value: 'Datos desactivados — requiere reinscripción' },
      { label: 'Recepción de Excel',      value: 'Via correo a induccion@gmlc.cl (Pipe cPanel)' },
    ]},
    { section: 'Seguridad y monitoreo', items: [
      { label: 'Cámara durante curso',    value: 'Activa (captura cada 5 min)' },
      { label: 'Detección cambio pestaña',value: 'Activa — pausa automática y registro' },
    ]},
  ];

  return (
    <div style={{ padding: 40, maxWidth: 760 }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, color: C.copper, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Sistema</div>
        <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 34, fontWeight: 800, color: C.text }}>Configuración</h1>
      </div>

      {/* ── Firma Digital (FEA) ── */}
      <Card style={{ marginBottom: 16 }}>
        <div style={sectionTitle}>Firma Digital (FEA Chile)</div>
        <div style={rowStyle}>
          <label style={labelStyle}>Proveedor</label>
          <select value={fea.provider} onChange={e => setFea(p => ({ ...p, provider: e.target.value }))}
            style={{ ...inputStyle }}>
            {['e-certchile.cl', 'TOC Chile', 'Acepta.com'].map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <div style={rowStyle}>
          <label style={labelStyle}>API Endpoint</label>
          <input value={fea.endpoint} onChange={e => setFea(p => ({ ...p, endpoint: e.target.value }))}
            placeholder="https://api.ecertchile.cl/v2/sign" style={inputStyle} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
          <div>
            <label style={labelStyle}>Client ID</label>
            <input value={fea.clientId} onChange={e => setFea(p => ({ ...p, clientId: e.target.value }))}
              placeholder="client_id..." style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Client Secret</label>
            <div style={{ position: 'relative' }}>
              <input
                type={feaShowSecret ? 'text' : 'password'}
                value={fea.clientSecret}
                onChange={e => setFea(p => ({ ...p, clientSecret: e.target.value }))}
                placeholder="••••••••"
                style={{ ...inputStyle, paddingRight: 40 }}
              />
              <button onClick={() => setFeaShowSecret(v => !v)} style={{
                position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                border: 'none', background: 'transparent', cursor: 'pointer', color: C.textMuted, display: 'flex',
              }}>
                <Icon name="eye" size={15} color={C.textMuted} />
              </button>
            </div>
          </div>
        </div>
        <div style={rowStyle}>
          <label style={labelStyle}>Certificate Serial</label>
          <input value={fea.certSerial} onChange={e => setFea(p => ({ ...p, certSerial: e.target.value }))}
            placeholder="CERT-SERIAL-001" style={inputStyle} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Btn size="sm" variant="ghost" onClick={testFea}>Probar conexión</Btn>
          {feaTestStatus === 'ok' && <Badge color={C.success}>Conexión exitosa ✓</Badge>}
          {feaTestStatus === 'error' && <Badge color={C.danger}>Error de conexión ✗</Badge>}
        </div>
      </Card>

      {/* ── Verificación Biométrica ── */}
      <Card style={{ marginBottom: 16 }}>
        <div style={sectionTitle}>Verificación Biométrica</div>
        <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 12 }}>Cédula OCR</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Proveedor OCR</label>
              <select value={bio.ocrProvider} onChange={e => setBio(p => ({ ...p, ocrProvider: e.target.value }))}
                style={inputStyle}>
                {['Google Vision API', 'AWS Textract', 'Azure Cognitive'].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>API Key</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={bioShowOcrKey ? 'text' : 'password'}
                  value={bio.ocrKey}
                  onChange={e => setBio(p => ({ ...p, ocrKey: e.target.value }))}
                  placeholder="••••••••"
                  style={{ ...inputStyle, paddingRight: 40 }}
                />
                <button onClick={() => setBioShowOcrKey(v => !v)} style={{
                  position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                  border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex',
                }}>
                  <Icon name="eye" size={15} color={C.textMuted} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 12 }}>Reconocimiento Facial</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <label style={labelStyle}>Proveedor</label>
              <select value={bio.faceProvider} onChange={e => setBio(p => ({ ...p, faceProvider: e.target.value }))}
                style={inputStyle}>
                {['face-api.js local', 'AWS Rekognition', 'Azure Face API'].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>API Key</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={bioShowFaceKey ? 'text' : 'password'}
                  value={bio.faceKey}
                  onChange={e => setBio(p => ({ ...p, faceKey: e.target.value }))}
                  placeholder={faceApiLocal ? 'No requerida' : '••••••••'}
                  disabled={faceApiLocal}
                  style={{ ...inputStyle, paddingRight: 40, opacity: faceApiLocal ? 0.45 : 1 }}
                />
                {!faceApiLocal && (
                  <button onClick={() => setBioShowFaceKey(v => !v)} style={{
                    position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                    border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex',
                  }}>
                    <Icon name="eye" size={15} color={C.textMuted} />
                  </button>
                )}
              </div>
              {faceApiLocal && (
                <div style={{ fontSize: 11, color: C.textMuted, marginTop: 5 }}>
                  No requiere API key — procesado en el navegador
                </div>
              )}
            </div>
          </div>
          <div style={{ maxWidth: 180 }}>
            <label style={labelStyle}>Confianza mínima (%)</label>
            <input
              type="number" min="50" max="100"
              value={bio.minConfidence}
              onChange={e => setBio(p => ({ ...p, minConfidence: Number(e.target.value) }))}
              style={inputStyle}
            />
          </div>
        </div>
      </Card>

      {/* ── Correo ── */}
      <Card style={{ marginBottom: 16 }}>
        <div style={sectionTitle}>Correo (cPanel — Hostingplus)</div>
        <div style={rowStyle}>
          <label style={labelStyle}>Servidor SMTP</label>
          <input value={emailConfig.smtp} onChange={e => setEmailConfig(p => ({ ...p, smtp: e.target.value }))} style={inputStyle} />
        </div>
        <div style={rowStyle}>
          <label style={labelStyle}>Cuenta receptora</label>
          <input value={emailConfig.receptora} onChange={e => setEmailConfig(p => ({ ...p, receptora: e.target.value }))} style={inputStyle} />
        </div>
        <div style={rowStyle}>
          <label style={labelStyle}>Cuenta remitente</label>
          <input value={emailConfig.remitente} onChange={e => setEmailConfig(p => ({ ...p, remitente: e.target.value }))} style={inputStyle} />
        </div>
        <div style={rowStyle}>
          <label style={labelStyle}>Email notificaciones</label>
          <input value={emailConfig.notificaciones} onChange={e => setEmailConfig(p => ({ ...p, notificaciones: e.target.value }))} style={inputStyle} />
        </div>
      </Card>

      {/* Static read-only sections */}
      {staticGroups.map((group, gi) => (
        <Card key={gi} style={{ marginBottom: 16 }}>
          <div style={sectionTitle}>{group.section}</div>
          {group.items.map((item, ii) => (
            <div key={ii} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: ii > 0 ? `1px solid ${C.border}` : 'none', gap: 16 }}>
              <span style={{ fontSize: 13, color: C.textMuted, flexShrink: 0 }}>{item.label}</span>
              <span style={{ fontSize: 13, color: C.text, textAlign: 'right' }}>{item.value}</span>
            </div>
          ))}
        </Card>
      ))}

      <div style={{ marginTop: 8, display: 'flex', gap: 12, alignItems: 'center' }}>
        <Btn onClick={saveAll}>Guardar cambios</Btn>
        {saved && <Badge color={C.success}>Guardado ✓</Badge>}
      </div>
    </div>
  );
}

// ─── ROUTER ───────────────────────────────────────────────
export default function AdminPage({ screen, onNav }) {
  switch (screen) {
    case 'admin_users':     return <AdminUsers onNav={onNav} />;
    case 'admin_email':     return <AdminEmail />;
    case 'admin_questions': return <AdminQuestions />;
    case 'settings':        return <SettingsPage />;
    default:                return <AdminDashboard onNav={onNav} />;
  }
}
