// Course Module — Aula Virtual + Reel styles

const CourseModule = ({ courseStyle, onNav }) => {
  const { C, Btn, Card, Badge, Tag, ProgressBar, Icon } = window;
  const [activeModule, setActiveModule] = React.useState(2);
  const [videoProgress, setVideoProgress] = React.useState(38);
  const [tabWarning, setTabWarning] = React.useState(false);
  const [warnings, setWarnings] = React.useState(1);

  // Simulate focus detection
  React.useEffect(() => {
    const onBlur = () => { setTabWarning(true); setWarnings(w => w + 1); };
    const onFocus = () => setTabWarning(false);
    window.addEventListener('blur', onBlur);
    window.addEventListener('focus', onFocus);
    return () => { window.removeEventListener('blur', onBlur); window.removeEventListener('focus', onFocus); };
  }, []);

  const modules = [
    { id: 1, title: 'Introducción a la seguridad minera', done: true, duration: '8 min' },
    { id: 2, title: 'Riesgos críticos en faena subterránea', done: true, duration: '12 min' },
    { id: 3, title: 'Equipos de protección personal (EPP)', done: false, duration: '10 min', active: true },
    { id: 4, title: 'Procedimientos de emergencia', done: false, duration: '9 min' },
    { id: 5, title: 'Señalética y zonas de peligro', done: false, duration: '7 min' },
    { id: 6, title: 'Comunicación en faena', done: false, duration: '6 min' },
    { id: 7, title: 'Normativa y reglamento interno', done: false, duration: '11 min' },
    { id: 8, title: 'Revisión y cierre', done: false, duration: '5 min' },
  ];
  const mod = modules[activeModule];

  if (courseStyle === 'reel') return <ReelStyle modules={modules} activeModule={activeModule} setActiveModule={setActiveModule} onNav={onNav} tabWarning={tabWarning} warnings={warnings} />;
  return <AulaStyle modules={modules} activeModule={activeModule} setActiveModule={setActiveModule} mod={mod} videoProgress={videoProgress} setVideoProgress={setVideoProgress} onNav={onNav} tabWarning={tabWarning} warnings={warnings} />;
};

const AulaStyle = ({ modules, activeModule, setActiveModule, mod, videoProgress, setVideoProgress, onNav, tabWarning, warnings }) => {
  const { C, Btn, Card, Badge, Tag, ProgressBar, Icon } = window;
  const [playing, setPlaying] = React.useState(false);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Module sidebar */}
      <div style={{ width: 280, background: C.surface, borderRight: `1px solid ${C.border}`, overflow: 'auto', flexShrink: 0 }}>
        <div style={{ padding: '20px 20px 16px', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 10, color: C.copper, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Inducción Mina Cabildo</div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 18, fontWeight: 700, color: C.text }}>Módulos del curso</div>
          <div style={{ marginTop: 10 }}>
            <ProgressBar pct={25} color={C.copper} />
            <div style={{ fontSize: 11, color: C.textMuted, marginTop: 5 }}>2 de 8 completados · 25%</div>
          </div>
        </div>
        <div style={{ padding: '12px 12px' }}>
          {modules.map((m, i) => (
            <button key={m.id} onClick={() => setActiveModule(i)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
              borderRadius: 8, border: 'none', cursor: m.done || i === activeModule || i === 2 ? 'pointer' : 'not-allowed',
              background: i === activeModule ? C.copper + '20' : 'transparent',
              marginBottom: 2, textAlign: 'left', opacity: (!m.done && i > 3) ? 0.4 : 1,
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                background: m.done ? C.success : i === activeModule ? C.copper : C.surface3,
                border: `2px solid ${m.done ? C.success : i === activeModule ? C.copper : C.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {m.done ? <Icon name="check" size={12} color="white" /> : <span style={{ fontSize: 10, color: C.textMuted, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}>{m.id}</span>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: i === activeModule ? 600 : 400, color: i === activeModule ? C.text : C.silver, lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.title}</div>
                <div style={{ fontSize: 10, color: C.textMuted, marginTop: 1 }}>{m.duration}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
        {/* Tab warning banner */}
        {tabWarning && (
          <div style={{ background: C.danger, padding: '10px 24px', display: 'flex', alignItems: 'center', gap: 10, zIndex: 10 }}>
            <Icon name="warning" size={16} color="white" />
            <span style={{ fontSize: 13, color: 'white', fontWeight: 600 }}>⚠ Módulo pausado — Cambio de ventana detectado ({warnings} evento{warnings > 1 ? 's' : ''} registrado{warnings > 1 ? 's' : ''}). Regresa al curso.</span>
          </div>
        )}

        <div style={{ padding: 32, flex: 1 }}>
          {/* Video player mock */}
          <div style={{ borderRadius: 12, overflow: 'hidden', background: '#000', marginBottom: 24, position: 'relative', aspectRatio: '16/9' }}>
            {/* Gradient video placeholder */}
            <div style={{ width: '100%', height: '100%', background: `linear-gradient(135deg, #0A1520 0%, ${C.copperDk}55 50%, #0C1822 100%)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 360 }}>
              {/* Animated hexagon grid */}
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.07 }} viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice">
                {Array.from({ length: 30 }, (_, i) => (
                  <polygon key={i} points="40,0 80,23 80,69 40,92 0,69 0,23"
                    transform={`translate(${(i % 10) * 90 - 10}, ${Math.floor(i / 10) * 95 + (i % 2 === 0 ? 0 : 47)})`}
                    fill="none" stroke={C.copper} strokeWidth="1" />
                ))}
              </svg>
              <div style={{ fontSize: 11, color: C.copper, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 16 }}>Módulo 3 — Video explicativo</div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 28, fontWeight: 700, color: C.text, textAlign: 'center', marginBottom: 8 }}>Equipos de Protección Personal</div>
              <div style={{ fontSize: 14, color: C.textMuted, marginBottom: 28 }}>Uso correcto de EPP en faena subterránea · 10 minutos</div>
              <button onClick={() => {}} style={{
                width: 64, height: 64, borderRadius: '50%', background: C.copper + 'CC',
                border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 0 32px ${C.copper}66`,
              }}>
                <Icon name="play" size={28} color="white" />
              </button>
              {/* Camera overlay indicator */}
              <div style={{ position: 'absolute', top: 12, right: 12, background: C.danger + 'CC', borderRadius: 6, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'white', animation: 'pulse 1.5s infinite' }} />
                <span style={{ fontSize: 11, color: 'white', fontWeight: 600 }}>CAM ACTIVA</span>
              </div>
            </div>
            {/* Progress bar */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '8px 16px', background: 'linear-gradient(transparent, rgba(0,0,0,0.8))' }}>
              <ProgressBar pct={videoProgress} color={C.copper} height={4} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 11, color: C.textMuted }}>
                <span>3:50 / 10:00</span>
                <span>{videoProgress}% completado</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            {[
              { title: 'Casco de Seguridad', desc: 'Obligatorio en todas las zonas de la faena. Clase A para trabajos subterráneos.', icon: 'hard_hat' },
              { title: 'Protección Visual', desc: 'Lentes de seguridad con certificación ANSI Z87.1. Protección contra impactos y UV.', icon: 'eye' },
              { title: 'Calzado de Seguridad', desc: 'Punta de acero y suela antiperforación. Resistente a hidrocarburos.', icon: 'shield' },
              { title: 'Chaleco Reflectante', desc: 'Clase 2 o superior. Visibilidad mínima a 100 metros en condiciones de baja luminosidad.', icon: 'warning' },
            ].map((item, i) => (
              <div key={i} style={{ background: C.surface3, borderRadius: 10, padding: 16, display: 'flex', gap: 12, border: `1px solid ${C.border}` }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: C.copper + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name={item.icon} size={18} color={C.copper} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: C.text, marginBottom: 4 }}>{item.title}</div>
                  <div style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Btn variant="ghost" onClick={() => setActiveModule(a => Math.max(0, a - 1))}>← Módulo anterior</Btn>
            <Btn onClick={onNav ? () => onNav('quiz') : undefined}>Ir a Evaluación <Icon name="chevron" size={15} color="white" /></Btn>
          </div>
        </div>
      </div>
    </div>
  );
};

// REEL style
const ReelStyle = ({ modules, activeModule, setActiveModule, onNav, tabWarning, warnings }) => {
  const { C, Btn, Card, Badge, Tag, ProgressBar, Icon } = window;
  const cards = [
    { type: 'video', title: 'Riesgo de caída de rocas', tag: 'Riesgo crítico #1', bg: `linear-gradient(160deg, #0A1520, ${C.copperDk}66)` },
    { type: 'stat', title: '94%', sub: 'de accidentes son prevenibles con EPP correcto', tag: 'Dato clave', bg: `linear-gradient(160deg, #0A1520, #1B2C1A)` },
    { type: 'info', title: 'Zona roja: acceso restringido', sub: 'Solo personal autorizado con permiso de trabajo vigente', tag: 'Señalética', bg: `linear-gradient(160deg, #0A1520, #2C1B1A)` },
    { type: 'check', title: 'Revisión de EPP diaria', items: ['Casco sin grietas', 'Lentes limpios', 'Zapatos abrochados', 'Chaleco limpio'], tag: 'Check list', bg: `linear-gradient(160deg, #0A1520, #1A1B2C)` },
  ];
  const [cur, setCur] = React.useState(0);
  const card = cards[cur];

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {tabWarning && (
        <div style={{ background: C.danger, padding: '8px 20px', fontSize: 13, color: 'white', fontWeight: 600 }}>
          ⚠ Módulo pausado — Cambio de ventana detectado
        </div>
      )}
      <div style={{ flex: 1, display: 'flex', gap: 16, padding: 20, overflow: 'hidden' }}>
        {/* Reel cards column */}
        <div style={{ width: 340, display: 'flex', flexDirection: 'column', gap: 12, overflow: 'auto' }}>
          <div style={{ fontSize: 10, color: C.copper, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '4px 0' }}>
            Inducción Mina Cabildo · Módulo 3
          </div>
          {cards.map((c, i) => (
            <div key={i} onClick={() => setCur(i)} style={{
              borderRadius: 12, padding: 20, cursor: 'pointer', border: `1px solid ${i === cur ? C.copper : C.border}`,
              background: i === cur ? C.copper + '15' : C.surface2, transition: 'all .2s',
            }}>
              <Badge color={i === cur ? C.copper : C.textMuted}>{c.tag}</Badge>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 20, fontWeight: 700, color: C.text, marginTop: 10 }}>{c.title}</div>
            </div>
          ))}
        </div>

        {/* Main card view */}
        <div style={{ flex: 1, borderRadius: 16, background: card.bg, border: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 40, position: 'relative' }}>
          {/* Hexagonal background decoration */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.05 }} viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice">
            {Array.from({ length: 15 }, (_, i) => (
              <polygon key={i} points="50,0 100,29 100,87 50,116 0,87 0,29"
                transform={`translate(${(i % 5) * 120}, ${Math.floor(i / 5) * 120 + (i % 2 === 0 ? 0 : 60)})`}
                fill="none" stroke={C.copper} strokeWidth="1.5" />
            ))}
          </svg>

          <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 8 }}>
            <div style={{ background: C.danger + 'BB', borderRadius: 6, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'white' }} />
              <span style={{ fontSize: 11, color: 'white', fontWeight: 600 }}>CAM</span>
            </div>
            <span style={{ fontSize: 12, color: C.textMuted, padding: '4px 10px', background: C.surface3, borderRadius: 6 }}>{cur + 1} / {cards.length}</span>
          </div>

          <Badge color={C.copper} style={{ marginBottom: 20 }}>{card.tag}</Badge>

          {card.type === 'stat' ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 96, fontWeight: 800, color: C.copper, lineHeight: 1 }}>{card.title}</div>
              <div style={{ fontSize: 20, color: C.text, marginTop: 12, maxWidth: 360, lineHeight: 1.4 }}>{card.sub}</div>
            </div>
          ) : card.type === 'check' ? (
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 40, fontWeight: 800, color: C.text, marginBottom: 28 }}>{card.title}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
                {card.items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 18, color: C.text }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: C.success + '22', border: `1.5px solid ${C.success}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name="check" size={14} color={C.success} />
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: C.copper + '22', border: `2px solid ${C.copper}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                {card.type === 'video' ? <Icon name="play" size={36} color={C.copper} /> : <Icon name="warning" size={36} color={C.danger} />}
              </div>
              <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 44, fontWeight: 800, color: C.text, marginBottom: 12 }}>{card.title}</h2>
              {card.sub && <p style={{ fontSize: 18, color: C.silver, maxWidth: 400, lineHeight: 1.5 }}>{card.sub}</p>}
            </div>
          )}

          <div style={{ position: 'absolute', bottom: 20, display: 'flex', gap: 12 }}>
            <Btn variant="ghost" size="sm" onClick={() => setCur(c => Math.max(0, c - 1))}>←</Btn>
            {cur < cards.length - 1
              ? <Btn size="sm" onClick={() => setCur(c => c + 1)}>Siguiente →</Btn>
              : <Btn size="sm" onClick={() => onNav && onNav('quiz')}>Ir a Evaluación →</Btn>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { CourseModule });
