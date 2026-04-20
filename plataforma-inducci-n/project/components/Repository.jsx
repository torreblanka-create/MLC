// Repository + Settings screens

const RepositoryScreen = () => {
  const { C, Btn, Card, Badge, Icon } = window;
  const [activeFolder, setActiveFolder] = React.useState('iso');
  const [search, setSearch] = React.useState('');

  const folders = [
    { id: 'iso', label: 'ISO 45001', icon: 'shield', count: 12 },
    { id: 'sgsst', label: 'SGSST Interno', icon: 'book', count: 8 },
    { id: 'reglamentos', label: 'Reglamentos', icon: 'doc', count: 6 },
    { id: 'procedimientos', label: 'Procedimientos', icon: 'folder', count: 15 },
    { id: 'emergencias', label: 'Emergencias', icon: 'warning', count: 5 },
  ];

  const docs = {
    iso: [
      { name: 'ISO 45001:2018 — Requisitos del sistema de gestión SST', tipo: 'PDF', size: '2.4 MB', fecha: '01/03/2025', nuevo: false },
      { name: 'Guía de implementación ISO 45001 — Minería', tipo: 'PDF', size: '1.8 MB', fecha: '15/01/2025', nuevo: false },
      { name: 'Política de SST — GMLC 2025', tipo: 'PDF', size: '340 KB', fecha: '02/04/2025', nuevo: true },
      { name: 'Matriz de riesgos ISO 45001 — Faena Cabildo', tipo: 'XLSX', size: '890 KB', fecha: '10/02/2025', nuevo: false },
      { name: 'Auditoría interna ISO 45001 — Q1 2025', tipo: 'PDF', size: '1.2 MB', fecha: '05/04/2025', nuevo: true },
      { name: 'Objetivos SST 2025 — Grupo Minero Las Cenizas', tipo: 'PDF', size: '560 KB', fecha: '03/01/2025', nuevo: false },
    ],
    sgsst: [
      { name: 'Manual del Sistema de Gestión SST — GMLC', tipo: 'PDF', size: '3.1 MB', fecha: '15/02/2025', nuevo: false },
      { name: 'Programa anual de SST 2025', tipo: 'PDF', size: '980 KB', fecha: '02/01/2025', nuevo: false },
      { name: 'Indicadores de desempeño SST — Mar 2025', tipo: 'XLSX', size: '420 KB', fecha: '01/04/2025', nuevo: true },
      { name: 'Revisión gerencial SST — Marzo 2025', tipo: 'PDF', size: '760 KB', fecha: '28/03/2025', nuevo: true },
    ],
    reglamentos: [
      { name: 'Reglamento Interno de Orden, Higiene y Seguridad', tipo: 'PDF', size: '1.4 MB', fecha: '01/01/2025', nuevo: false },
      { name: 'Reglamento de Contratistas y Subcontratistas', tipo: 'PDF', size: '680 KB', fecha: '15/01/2025', nuevo: false },
      { name: 'Reglamento de tránsito en faena — Mina Cabildo', tipo: 'PDF', size: '540 KB', fecha: '01/03/2025', nuevo: false },
    ],
    procedimientos: [
      { name: 'Procedimiento de bloqueo y etiquetado (LOTO)', tipo: 'PDF', size: '890 KB', fecha: '10/01/2025', nuevo: false },
      { name: 'Procedimiento de trabajo en altura', tipo: 'PDF', size: '760 KB', fecha: '10/01/2025', nuevo: false },
      { name: 'Procedimiento de manejo de explosivos', tipo: 'PDF', size: '1.1 MB', fecha: '20/02/2025', nuevo: false },
      { name: 'Procedimiento de espacios confinados', tipo: 'PDF', size: '940 KB', fecha: '10/01/2025', nuevo: false },
      { name: 'Procedimiento de trabajos en caliente', tipo: 'PDF', size: '820 KB', fecha: '10/01/2025', nuevo: false },
    ],
    emergencias: [
      { name: 'Plan de emergencia y evacuación — Mina Cabildo', tipo: 'PDF', size: '2.2 MB', fecha: '01/01/2025', nuevo: false },
      { name: 'Plan de emergencia y evacuación — Mina Taltal', tipo: 'PDF', size: '2.0 MB', fecha: '01/01/2025', nuevo: false },
      { name: 'Protocolo de primeros auxilios en faena', tipo: 'PDF', size: '980 KB', fecha: '15/01/2025', nuevo: false },
      { name: 'Directorio de emergencias — GMLC 2025', tipo: 'PDF', size: '220 KB', fecha: '02/01/2025', nuevo: true },
    ],
  };

  const tipoColor = { PDF: C.danger, XLSX: C.success, DOCX: C.copper };
  const currentDocs = (docs[activeFolder] || []).filter(d => d.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ padding: 40, maxWidth: 1000 }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, color: C.copper, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Grupo Minero Las Cenizas</div>
        <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 34, fontWeight: 800, color: C.text }}>Repositorio de Documentos de Seguridad</h1>
        <p style={{ color: C.textMuted, fontSize: 14, marginTop: 4 }}>ISO 45001 · Sistema de Gestión de Seguridad y Salud en el Trabajo</p>
      </div>

      <div style={{ display: 'flex', gap: 24 }}>
        {/* Folder sidebar */}
        <div style={{ width: 220, flexShrink: 0 }}>
          <div style={{ fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 10, paddingLeft: 4 }}>Categorías</div>
          {folders.map(f => (
            <button key={f.id} onClick={() => setActiveFolder(f.id)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
              borderRadius: 8, border: 'none', cursor: 'pointer', marginBottom: 3,
              background: activeFolder === f.id ? C.copper + '20' : 'transparent',
              color: activeFolder === f.id ? C.copperLt : C.silver, textAlign: 'left',
              fontFamily: "'DM Sans', sans-serif", fontSize: 13, transition: 'all .15s',
            }}>
              <Icon name={f.icon} size={15} color={activeFolder === f.id ? C.copper : C.textMuted} />
              <span style={{ flex: 1 }}>{f.label}</span>
              <span style={{ fontSize: 10, background: C.surface3, borderRadius: 99, padding: '1px 7px', color: C.textMuted }}>{f.count}</span>
            </button>
          ))}
        </div>

        {/* Document list */}
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: 16 }}>
            <input placeholder="Buscar documentos..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', background: C.surface3, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, padding: '9px 14px', fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: 'none' }} />
          </div>

          <Card style={{ padding: 0, overflow: 'hidden' }}>
            {currentDocs.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: C.textMuted }}>No se encontraron documentos</div>
            ) : currentDocs.map((doc, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', borderTop: i > 0 ? `1px solid ${C.border}` : 'none', transition: 'background .15s' }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: (tipoColor[doc.tipo] || C.copper) + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name="doc" size={16} color={tipoColor[doc.tipo] || C.copper} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 14, color: C.text, fontWeight: 500, lineHeight: 1.3 }}>{doc.name}</span>
                    {doc.nuevo && <Badge color={C.success}>Nuevo</Badge>}
                  </div>
                  <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{doc.size} · Actualizado {doc.fecha}</div>
                </div>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4, background: (tipoColor[doc.tipo] || C.copper) + '22', color: tipoColor[doc.tipo] || C.copper }}>{doc.tipo}</span>
                  <Btn size="sm" variant="ghost"><Icon name="eye" size={12} color={C.silver} /> Ver</Btn>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
};

const SettingsScreen = () => {
  const { C, Btn, Card } = window;
  return (
  <div style={{ padding: 40, maxWidth: 700 }}>

    <div style={{ marginBottom: 28 }}>
      <div style={{ fontSize: 11, color: C.copper, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Sistema</div>
      <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 34, fontWeight: 800, color: C.text }}>Configuración</h1>
    </div>
    {[
      { section: 'Firma Digital', items: [
        { label: 'Profesional firmante', value: 'Rodrigo Contreras Vargas — Reg. MINSAL N° 45.281' },
        { label: 'Proveedor firma digital', value: 'e-certchile.cl (FEA)' },
        { label: 'Vigencia del certificado', value: '12 meses desde emisión' },
      ]},
      { section: 'Evaluaciones', items: [
        { label: 'Preguntas por evaluación', value: '15 (aleatorias del banco de 50)' },
        { label: 'Porcentaje de aprobación', value: '90% mínimo (13/15)' },
        { label: 'Intentos por alumno', value: '3 intentos por curso' },
      ]},
      { section: 'Correo (cPanel — Hostingplus)', items: [
        { label: 'Servidor SMTP', value: 'mail.gmlc.cl · Puerto 465 SSL' },
        { label: 'Cuenta remitente', value: 'induccion@gmlc.cl' },
        { label: 'Email notificaciones admin', value: 'rrhh@gmlc.cl' },
      ]},
      { section: 'Seguridad y monitoreo', items: [
        { label: 'Verificación facial', value: 'Activa en cada inicio de sesión' },
        { label: 'Cámara durante curso', value: 'Activa (captura cada 5 min)' },
        { label: 'Detección cambio de ventana', value: 'Activa — pausa automática' },
      ]},
    ].map((group, gi) => (
      <Card key={gi} style={{ marginBottom: 16 }}>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, fontWeight: 700, color: C.copper, marginBottom: 14, letterSpacing: '0.04em' }}>{group.section}</div>
        {group.items.map((item, ii) => (
          <div key={ii} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: ii > 0 ? `1px solid ${C.border}` : 'none', gap: 16 }}>
            <span style={{ fontSize: 13, color: C.textMuted, flexShrink: 0 }}>{item.label}</span>
            <span style={{ fontSize: 13, color: C.text, textAlign: 'right' }}>{item.value}</span>
          </div>
        ))}
      </Card>
    ))}
    <div style={{ marginTop: 8, display: 'flex', gap: 12 }}>
      <Btn>Guardar cambios</Btn>
      <Btn variant="ghost">Cancelar</Btn>
    </div>
  </div>
  );
};

Object.assign(window, { RepositoryScreen, SettingsScreen });
