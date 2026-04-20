// Tutorial + Dashboard screen
const _shared = () => ({ C: window.C, Btn: window.Btn, Card: window.Card, Badge: window.Badge, Tag: window.Tag, ProgressBar: window.ProgressBar, Icon: window.Icon });

const TutorialScreen = ({ onDone }) => {
  const { C, Btn, Card, Icon } = _shared();
  const [step, setStep] = React.useState(0);
  const steps = [
    {
      icon: 'hard_hat', title: 'Bienvenido a Inducción Minera',
      body: 'Esta plataforma certifica tus conocimientos de seguridad para operar en faenas de Grupo Minero Las Cenizas. Completa cada módulo y aprueba la evaluación final para obtener tu certificado digital.',
      color: C.copper,
    },
    {
      icon: 'eye', title: 'Verificación continua de presencia',
      body: 'La cámara permanecerá activa durante el curso. Si cambias de pestaña o aplicación, el módulo se pausará automáticamente y se registrará el evento. Mantén el foco en el contenido.',
      color: C.warning,
    },
    {
      icon: 'shield', title: 'Evaluación y aprobación',
      body: '15 preguntas aleatorias de un banco de 50. Necesitas un 90% (13/15) para aprobar. Tienes 3 oportunidades por curso. Si repruebas, podrás repetir el curso antes de intentarlo nuevamente.',
      color: C.silver,
    },
    {
      icon: 'award', title: 'Certificado digital con firma avanzada',
      body: 'Al aprobar recibirás un certificado con firma digital avanzada, emitido por el profesional de prevención de riesgos de la empresa. También llega a tu correo automáticamente.',
      color: C.success,
    },
    {
      icon: 'folder', title: 'Repositorio de documentos',
      body: 'Tendrás acceso al repositorio de documentos de seguridad de la empresa, basados en ISO 45001 y el sistema de gestión propio. Puedes consultarlos en cualquier momento.',
      color: C.copperLt,
    },
  ];
  const current = steps[step];
  return (
    <div style={{
      minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{ maxWidth: 560, width: '100%' }}>
        {/* Progress dots */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 40 }}>
          {steps.map((_, i) => (
            <div key={i} style={{
              height: 4, borderRadius: 99, transition: 'all .3s',
              width: i === step ? 32 : 12,
              background: i <= step ? C.copper : C.border,
            }} />
          ))}
        </div>

        <Card style={{ textAlign: 'center', padding: '48px 40px' }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%', margin: '0 auto 24px',
            background: current.color + '18', border: `2px solid ${current.color}44`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name={current.icon} size={36} color={current.color} />
          </div>
          <h2 style={{
            fontFamily: "'Barlow Condensed', sans-serif", fontSize: 30, fontWeight: 700,
            color: C.text, marginBottom: 16, lineHeight: 1.15,
          }}>{current.title}</h2>
          <p style={{ color: C.silver, fontSize: 15, lineHeight: 1.7, marginBottom: 36 }}>{current.body}</p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            {step > 0 && (
              <Btn variant="ghost" onClick={() => setStep(s => s - 1)}>Anterior</Btn>
            )}
            {step < steps.length - 1
              ? <Btn onClick={() => setStep(s => s + 1)}>Siguiente <Icon name="chevron" size={15} color="white" /></Btn>
              : <Btn onClick={onDone} size="lg">Comenzar <Icon name="play" size={15} color="white" /></Btn>
            }
          </div>
        </Card>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: C.textMuted }}>
          {step + 1} de {steps.length} · Tutorial de bienvenida
        </div>
      </div>
    </div>
  );
};

// Student dashboard
const DashboardScreen = ({ onNav, courseStyle }) => {
  const { C, Btn, Card, Badge, Tag, ProgressBar, Icon } = window;
  const cursos = [
    { id: 'mina_cabildo', title: 'Inducción Mina Cabildo', estado: 'en_progreso', pct: 45, intentos: 0 },
    { id: 'mina_taltal', title: 'Inducción Mina Taltal', estado: 'bloqueado', pct: 0, intentos: 0 },
    { id: 'planta_cabildo', title: 'Inducción Planta Cabildo', estado: 'bloqueado', pct: 0, intentos: 0 },
    { id: 'planta_taltal', title: 'Inducción Planta Taltal', estado: 'bloqueado', pct: 0, intentos: 0 },
  ];
  const estadoLabel = { en_progreso: 'En progreso', bloqueado: 'No iniciado', aprobado: 'Aprobado', reprobado: 'Reprobado' };
  const estadoColor = { en_progreso: C.warning, bloqueado: C.textMuted, aprobado: C.success, reprobado: C.danger };

  return (
    <div style={{ padding: 40, maxWidth: 900 }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 12, color: C.copper, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
          Bienvenido de vuelta
        </div>
        <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 36, fontWeight: 800, color: C.text }}>
          Inducción Persona Nueva
        </h1>
      </div>

      {/* Alert card */}
      <div style={{ background: C.copper + '15', border: `1px solid ${C.copper}44`, borderRadius: 10, padding: '14px 20px', marginBottom: 32, display: 'flex', gap: 12, alignItems: 'center' }}>
        <Icon name="warning" size={18} color={C.copper} />
        <span style={{ fontSize: 13, color: C.text }}>
          La cámara permanece activa durante el estudio. Cambiar de pestaña <strong>pausa el módulo</strong> automáticamente.
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 20 }}>
        {cursos.map((c, i) => (
          <Card key={c.id} style={{ cursor: c.estado !== 'bloqueado' ? 'pointer' : 'default', opacity: c.estado === 'bloqueado' && i > 0 ? 0.55 : 1 }}
            onClick={c.estado !== 'bloqueado' ? () => onNav('course') : undefined}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                  {c.id.includes('mina') ? '⛏ Faena Mina' : '🏭 Planta de Proceso'}
                </div>
                <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 700, color: C.text, lineHeight: 1.2 }}>{c.title}</h3>
              </div>
              <Badge color={estadoColor[c.estado]}>{estadoLabel[c.estado]}</Badge>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: C.textMuted, marginBottom: 6 }}>
                <span>Progreso de módulos</span><span style={{ color: C.text }}>{c.pct}%</span>
              </div>
              <ProgressBar pct={c.pct} color={c.estado === 'aprobado' ? C.success : C.copper} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 16 }}>
                <Tag label="Módulos" value="8 / 8" />
                <Tag label="Intentos" value={`${c.intentos} / 3`} />
              </div>
              {c.estado !== 'bloqueado' && (
                <Btn size="sm" onClick={() => onNav('course')}>
                  {c.estado === 'en_progreso' ? 'Continuar' : 'Ver'} <Icon name="chevron" size={13} color="white" />
                </Btn>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

Object.assign(window, { TutorialScreen, DashboardScreen });
