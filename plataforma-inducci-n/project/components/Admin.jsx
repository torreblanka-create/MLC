// Admin Panel screens

const AdminDashboard = ({ onNav }) => {
  const { C, Btn, Card, Badge, Tag, ProgressBar, Icon } = window;
  const stats = [
    { label: 'Alumnos activos', value: '124', icon: 'users', color: C.copper },
    { label: 'Cursos en progreso', value: '87', icon: 'book', color: C.warning },
    { label: 'Aprobados este mes', value: '43', icon: 'award', color: C.success },
    { label: 'Reprobados (3 int.)', value: '6', icon: 'warning', color: C.danger },
  ];
  const recentActivity = [
    { name: 'Carlos Muñoz R.', rut: '12.345.678-9', curso: 'Mina Cabildo', estado: 'Aprobado', pct: '93%', hora: 'hace 12 min', color: C.success },
    { name: 'Andrea Soto V.', rut: '15.234.567-K', curso: 'Planta Taltal', estado: 'En evaluación', pct: '—', hora: 'hace 28 min', color: C.warning },
    { name: 'Felipe Torres M.', rut: '11.876.543-2', curso: 'Mina Taltal', estado: 'Reprobado (3/3)', pct: '60%', hora: 'hace 1h', color: C.danger },
    { name: 'Rosa Díaz A.', rut: '17.456.789-1', curso: 'Planta Cabildo', estado: 'En módulo 5', pct: '—', hora: 'hace 2h', color: C.copper },
    { name: 'Luis Araya P.', rut: '13.654.321-5', curso: 'Mina Cabildo', estado: 'Aprobado', pct: '100%', hora: 'hace 3h', color: C.success },
  ];

  return (
    <div style={{ padding: 40, maxWidth: 1100 }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, color: C.copper, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Panel de control</div>
        <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 36, fontWeight: 800, color: C.text }}>Tablero Administrador</h1>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {stats.map((s, i) => (
          <Card key={i} style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: s.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={s.icon} size={20} color={s.color} />
              </div>
            </div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 40, fontWeight: 800, color: C.text, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        {/* Approval by course */}
        <Card style={{ padding: 24 }}>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 20 }}>Aprobación por curso</div>
          {[
            { curso: 'Inducción Mina Cabildo', pct: 78 },
            { curso: 'Inducción Mina Taltal', pct: 65 },
            { curso: 'Inducción Planta Cabildo', pct: 82 },
            { curso: 'Inducción Planta Taltal', pct: 71 },
          ].map((c, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: C.text, marginBottom: 5 }}>
                <span>{c.curso}</span><span style={{ color: C.copper, fontWeight: 600 }}>{c.pct}%</span>
              </div>
              <ProgressBar pct={c.pct} color={c.pct >= 75 ? C.success : C.warning} height={8} />
            </div>
          ))}
        </Card>

        {/* Pending actions */}
        <Card style={{ padding: 24 }}>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 20 }}>Acciones pendientes</div>
          {[
            { text: 'Felipe Torres M. reprobó 3/3 en Mina Taltal', action: 'Autorizar 3ª repetición', color: C.danger },
            { text: '2 certificados pendientes de firma digital', action: 'Firmar', color: C.warning },
            { text: 'Lote de inscripción recibido: 12 alumnos', action: 'Revisar', color: C.copper },
          ].map((a, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < 2 ? `1px solid ${C.border}` : 'none' }}>
              <div style={{ flex: 1, fontSize: 13, color: C.text, marginRight: 12, lineHeight: 1.4 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: a.color, display: 'inline-block', marginRight: 8 }} />
                {a.text}
              </div>
              <Btn size="sm" variant="ghost">{a.action}</Btn>
            </div>
          ))}
        </Card>
      </div>

      {/* Recent activity */}
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
};

const AdminUsers = ({ onNav }) => {
  const { C, Btn, Card, Badge, Icon } = window;
  const [search, setSearch] = React.useState('');
  const alumnos = [
    { name: 'Carlos Muñoz R.', rut: '12.345.678-9', email: 'c.munoz@empresa.cl', curso: 'Mina Cabildo', estado: 'aprobado', intentos: 1, cert: true },
    { name: 'Andrea Soto V.', rut: '15.234.567-K', email: 'a.soto@empresa.cl', curso: 'Planta Taltal', estado: 'en_progreso', intentos: 0, cert: false },
    { name: 'Felipe Torres M.', rut: '11.876.543-2', email: 'f.torres@empresa.cl', curso: 'Mina Taltal', estado: 'reprobado', intentos: 3, cert: false },
    { name: 'Rosa Díaz A.', rut: '17.456.789-1', email: 'r.diaz@empresa.cl', curso: 'Planta Cabildo', estado: 'en_progreso', intentos: 1, cert: false },
    { name: 'Luis Araya P.', rut: '13.654.321-5', email: 'l.araya@empresa.cl', curso: 'Mina Cabildo', estado: 'aprobado', intentos: 2, cert: true },
    { name: 'Bárbara Vega C.', rut: '16.123.456-7', email: 'b.vega@empresa.cl', curso: 'Mina Taltal', estado: 'pendiente', intentos: 0, cert: false },
  ];
  const estadoColor = { aprobado: C.success, en_progreso: C.warning, reprobado: C.danger, pendiente: C.textMuted };
  const estadoLabel = { aprobado: 'Aprobado', en_progreso: 'En progreso', reprobado: 'Reprobado', pendiente: 'Pendiente' };

  const filtered = alumnos.filter(a => a.name.toLowerCase().includes(search.toLowerCase()) || a.rut.includes(search));

  return (
    <div style={{ padding: 40, maxWidth: 1050 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <div style={{ fontSize: 11, color: C.copper, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Gestión</div>
          <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 34, fontWeight: 800, color: C.text }}>Alumnos Inscritos</h1>
        </div>
        <Btn onClick={() => onNav('admin_email')}><Icon name="upload" size={15} color="white" /> Inscribir por lote</Btn>
      </div>

      <div style={{ marginBottom: 20 }}>
        <input placeholder="Buscar por nombre o RUT..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', maxWidth: 380, background: C.surface3, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, padding: '10px 16px', fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: 'none' }} />
      </div>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: C.surface3 }}>
              {['Alumno', 'RUT', 'Correo', 'Curso', 'Estado', 'Intentos', 'Cert.', 'Acciones'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((a, i) => (
              <tr key={i} style={{ borderTop: `1px solid ${C.border}` }}>
                <td style={{ padding: '12px 14px', fontSize: 14, color: C.text, fontWeight: 500 }}>{a.name}</td>
                <td style={{ padding: '12px 14px', fontSize: 12, color: C.textMuted }}>{a.rut}</td>
                <td style={{ padding: '12px 14px', fontSize: 12, color: C.textMuted }}>{a.email}</td>
                <td style={{ padding: '12px 14px', fontSize: 13, color: C.text }}>{a.curso}</td>
                <td style={{ padding: '12px 14px' }}><Badge color={estadoColor[a.estado]}>{estadoLabel[a.estado]}</Badge></td>
                <td style={{ padding: '12px 14px', textAlign: 'center', fontSize: 14, color: a.intentos >= 3 ? C.danger : C.text, fontWeight: a.intentos >= 3 ? 700 : 400 }}>{a.intentos}/3</td>
                <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                  {a.cert ? <Icon name="check" size={16} color={C.success} /> : <Icon name="x" size={16} color={C.border} />}
                </td>
                <td style={{ padding: '12px 14px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {a.estado === 'reprobado' && a.intentos >= 3 && (
                      <Btn size="sm" variant="danger">Autorizar</Btn>
                    )}
                    {a.cert && <Btn size="sm" variant="ghost"><Icon name="doc" size={12} color={C.silver} /></Btn>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

const AdminEmailFlow = () => {
  const { C, Btn, Card, Badge, Icon } = window;
  const [stage, setStage] = React.useState('inbox'); // inbox | preview | done
  const mockExcel = [
    { nombre: 'Juan Pérez Soto', run: '14.523.867-3', email: 'j.perez@minera.cl', curso: 'Inducción Mina Cabildo' },
    { nombre: 'María González L.', run: '16.789.012-5', email: 'm.gonzalez@minera.cl', curso: 'Inducción Planta Taltal' },
    { nombre: 'Pedro Ramírez V.', run: '12.901.234-7', email: 'p.ramirez@minera.cl', curso: 'Inducción Mina Cabildo' },
    { nombre: 'Carla Fuentes M.', run: '18.345.678-K', email: 'c.fuentes@minera.cl', curso: 'Inducción Planta Cabildo' },
  ];

  return (
    <div style={{ padding: 40, maxWidth: 860 }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, color: C.copper, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Inscripción automática</div>
        <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 34, fontWeight: 800, color: C.text }}>Inscripción por Lote</h1>
      </div>

      {/* Flow diagram */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
        {['Email recibido', 'Excel detectado', 'Datos validados', 'Alumnos inscritos', 'Credenciales enviadas'].map((s, i) => (
          <React.Fragment key={i}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 99, background: stage === 'done' || (stage === 'preview' && i < 3) || (stage === 'inbox' && i < 1) ? C.copper + '22' : C.surface3, border: `1px solid ${stage === 'done' || (stage === 'preview' && i < 3) || (stage === 'inbox' && i < 1) ? C.copper : C.border}` }}>
              <span style={{ fontSize: 12, color: C.text }}>{s}</span>
            </div>
            {i < 4 && <Icon name="chevron" size={14} color={C.textMuted} />}
          </React.Fragment>
        ))}
      </div>

      {stage === 'inbox' && (
        <div>
          {/* Simulated email */}
          <Card style={{ marginBottom: 20, border: `1px solid ${C.copper}44` }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: C.copper + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name="mail" size={18} color={C.copper} />
              </div>
              <div>
                <div style={{ fontWeight: 600, color: C.text, fontSize: 14 }}>Nuevo correo de inscripción detectado</div>
                <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>De: supervisor.rrhh@gmlc.cl · Hace 5 minutos</div>
              </div>
              <Badge color={C.success} style={{ marginLeft: 'auto' }}>Excel adjunto</Badge>
            </div>
            <div style={{ background: C.surface3, borderRadius: 8, padding: 16, fontSize: 13, color: C.text, lineHeight: 1.7 }}>
              <strong>Asunto:</strong> Inscripción inducción — lote abril 2025<br />
              <strong>Adjunto:</strong> inscripcion_lote_abr2025.xlsx (4 alumnos)<br /><br />
              Estimados, adjunto planilla con los alumnos para inscribir en sus respectivos cursos de inducción. Favor procesar a la brevedad.<br />
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
          <Card style={{ padding: 0, overflow: 'hidden', marginBottom: 20 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: C.surface3 }}>
                  {['Nombre', 'RUN', 'Correo', 'Curso asignado'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockExcel.map((a, i) => (
                  <tr key={i} style={{ borderTop: `1px solid ${C.border}` }}>
                    <td style={{ padding: '11px 14px', fontSize: 14, color: C.text }}>{a.nombre}</td>
                    <td style={{ padding: '11px 14px', fontSize: 13, color: C.textMuted }}>{a.run}</td>
                    <td style={{ padding: '11px 14px', fontSize: 13, color: C.textMuted }}>{a.email}</td>
                    <td style={{ padding: '11px 14px' }}><Badge color={C.copper}>{a.curso}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
          <div style={{ display: 'flex', gap: 12 }}>
            <Btn variant="ghost" onClick={() => setStage('inbox')}>← Volver</Btn>
            <Btn variant="success" onClick={() => setStage('done')}><Icon name="check" size={15} color="white" /> Confirmar inscripción</Btn>
          </div>
        </div>
      )}

      {stage === 'done' && (
        <div>
          <div style={{ background: C.success + '15', border: `1px solid ${C.success}44`, borderRadius: 12, padding: 24, marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
              <Icon name="check" size={24} color={C.success} />
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 700, color: C.text }}>Inscripción completada</div>
            </div>
            <ul style={{ fontSize: 13, color: C.text, lineHeight: 1.9, paddingLeft: 20 }}>
              <li>4 alumnos inscritos correctamente</li>
              <li>Credenciales de acceso enviadas a cada alumno por correo</li>
              <li>Confirmación enviada a <strong>supervisor.rrhh@gmlc.cl</strong></li>
              <li>Alumnos quedan habilitados para iniciar su curso inmediatamente</li>
            </ul>
          </div>
          <Btn variant="ghost" onClick={() => setStage('inbox')}>← Nueva inscripción</Btn>
        </div>
      )}
    </div>
  );
};

Object.assign(window, { AdminDashboard, AdminUsers, AdminEmailFlow });
