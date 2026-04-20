// Quiz + Certificate screens

const SAMPLE_QUESTIONS = [
  { id: 1, q: '¿Cuál es el protocolo correcto ante una emergencia de derrumbe en faena subterránea?', opts: ['Continuar trabajando y avisar al turno siguiente', 'Evacuar inmediatamente por la ruta de escape designada y activar alarma', 'Esperar instrucciones antes de actuar', 'Intentar despejar el área solo'], correct: 1 },
  { id: 2, q: 'El EPP básico obligatorio en zona subterránea incluye:', opts: ['Casco, guantes de cuero y botas de goma', 'Casco clase A, lentes de seguridad, calzado con punta de acero y chaleco reflectante', 'Cualquier calzado cerrado y casco de construcción', 'Solo casco y chaleco en zonas de bajo riesgo'], correct: 1 },
  { id: 3, q: '¿Cuál es el porcentaje mínimo de aprobación de la evaluación de inducción?', opts: ['70%', '80%', '90%', '100%'], correct: 2 },
  { id: 4, q: 'Ante un derrame de sustancia peligrosa en faena, lo primero es:', opts: ['Limpiar el derrame con los elementos disponibles', 'Alejarse del área, alertar a supervisores y no tocar la sustancia', 'Identificar la sustancia antes de actuar', 'Buscar la hoja de datos de seguridad (HDS) antes de evacuar'], correct: 1 },
  { id: 5, q: '¿Qué significa la señal de advertencia con fondo amarillo y pictograma negro?', opts: ['Prohibición de acceso', 'Riesgo o peligro potencial', 'Equipo de protección obligatorio', 'Punto de reunión de emergencia'], correct: 1 },
  { id: 6, q: 'El bloqueo y etiquetado (LOTO) se aplica para:', opts: ['Identificar áreas de descanso', 'Controlar energías peligrosas durante mantenimiento', 'Señalizar equipos en uso', 'Demarcar zonas de tránsito peatonal'], correct: 1 },
  { id: 7, q: '¿Con qué frecuencia se deben realizar los simulacros de evacuación en faena?', opts: ['Una vez al año', 'Cada 6 meses como mínimo', 'Solo cuando la autoridad lo exige', 'Cada 2 años'], correct: 1 },
  { id: 8, q: 'ISO 45001 es una norma internacional sobre:', opts: ['Gestión de calidad de productos mineros', 'Sistemas de gestión de seguridad y salud en el trabajo', 'Gestión ambiental en industria extractiva', 'Normas de exportación de minerales'], correct: 1 },
  { id: 9, q: 'Ante un accidente con lesionado, la secuencia correcta es:', opts: ['Mover al lesionado, avisar y esperar', 'No mover al lesionado, avisar de inmediato y esperar a personal capacitado', 'Aplicar primeros auxilios sin avisar para ahorrar tiempo', 'Evaluar la gravedad y decidir si llamar o no'], correct: 1 },
  { id: 10, q: '¿Qué es un "Permiso de Trabajo en Caliente" (PTC)?', opts: ['Autorización para trabajar en zonas de alta temperatura', 'Documento que autoriza trabajos con riesgo de fuego, chispas o llamas', 'Permiso especial para turnos nocturnos en faena', 'Autorización para operar equipos sin experiencia previa'], correct: 1 },
  { id: 11, q: 'La ventilación en labores subterráneas tiene como objetivo principal:', opts: ['Reducir la temperatura ambiental', 'Mantener calidad del aire y diluir gases nocivos', 'Proporcionar iluminación de emergencia', 'Controlar el polvo superficial'], correct: 1 },
  { id: 12, q: 'Ante una exposición al riesgo de SARS o enfermedades respiratorias en faena:', opts: ['Usar la mascarilla solo en zonas de polvo visible', 'Cumplir protocolos de prevención y usar EPP respiratorio indicado', 'Informar al médico solo si hay síntomas severos', 'El riesgo respiratorio no aplica en minería'], correct: 1 },
  { id: 13, q: '¿Quién es responsable de la seguridad en el área de trabajo?', opts: ['Solo el jefe de turno y el prevencionista', 'Exclusivamente el Departamento de Seguridad', 'Cada trabajador en su área, en conjunto con supervisores y empresa', 'Solo la empresa, no el trabajador'], correct: 2 },
  { id: 14, q: 'El factor humano en accidentes mineros representa aproximadamente:', opts: ['Menos del 20% de los casos', 'Entre el 80% y 96% de los accidentes', 'Exactamente el 50%', 'No es un factor relevante en minería moderna'], correct: 1 },
  { id: 15, q: 'Al ingresar a una labor minera marcada con cinta roja, debes:', opts: ['Ingresar con precaución y rapidez', 'No ingresar; la cinta roja indica acceso restringido o prohibido', 'Ingresar solo si tienes EPP completo', 'Consultar primero al compañero más cercano'], correct: 1 },
];

const QuizScreen = ({ onNav }) => {
  const { C, Btn, Card, Badge, Tag, ProgressBar, Icon } = window;
  const [started, setStarted] = React.useState(false);
  const [current, setCurrent] = React.useState(0);
  const [answers, setAnswers] = React.useState({});
  const [submitted, setSubmitted] = React.useState(false);
  const [attempt, setAttempt] = React.useState(1);

  const selected15 = React.useMemo(() => {
    const shuffled = [...SAMPLE_QUESTIONS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 15);
  }, [attempt]);

  const q = selected15[current];
  const answered = answers[q?.id];
  const score = submitted ? selected15.filter(q => answers[q.id] === q.correct).length : 0;
  const pct = Math.round((score / 15) * 100);
  const passed = pct >= 90;

  const handleAnswer = (idx) => {
    if (submitted) return;
    setAnswers(a => ({ ...a, [q.id]: idx }));
  };

  const handleSubmit = () => setSubmitted(true);

  const handleRetry = () => {
    setAnswers({});
    setCurrent(0);
    setSubmitted(false);
    setAttempt(a => a + 1);
  };

  if (!started) return (
    <div style={{ padding: 40, maxWidth: 700 }}>
      <div style={{ marginBottom: 32 }}>
        <Badge color={C.warning}>Evaluación Final</Badge>
        <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 36, fontWeight: 800, color: C.text, marginTop: 10, marginBottom: 8 }}>
          Inducción Mina Cabildo
        </h1>
        <p style={{ color: C.textMuted, fontSize: 15, lineHeight: 1.6 }}>
          La evaluación consiste en 15 preguntas aleatorias del banco de 50. Necesitas responder correctamente al menos 13 preguntas (90%) para aprobar.
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Preguntas', value: '15', icon: 'doc' },
          { label: 'Mín. aprobación', value: '90%', icon: 'shield' },
          { label: 'Intentos disp.', value: `${4 - attempt} de 3`, icon: 'warning' },
        ].map((s, i) => (
          <Card key={i} style={{ textAlign: 'center', padding: 20 }}>
            <Icon name={s.icon} size={24} color={C.copper} />
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 32, fontWeight: 800, color: C.text, margin: '8px 0 2px' }}>{s.value}</div>
            <div style={{ fontSize: 11, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
          </Card>
        ))}
      </div>
      <Btn size="lg" onClick={() => setStarted(true)}>Iniciar Evaluación <Icon name="chevron" size={16} color="white" /></Btn>
    </div>
  );

  if (submitted) return (
    <div style={{ padding: 40, maxWidth: 640 }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ width: 100, height: 100, borderRadius: '50%', background: (passed ? C.success : C.danger) + '18', border: `2px solid ${passed ? C.success : C.danger}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <Icon name={passed ? 'award' : 'x'} size={44} color={passed ? C.success : C.danger} />
        </div>
        <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 36, fontWeight: 800, color: C.text, marginBottom: 8 }}>
          {passed ? '¡Evaluación aprobada!' : 'Evaluación no aprobada'}
        </h2>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 64, fontWeight: 800, color: passed ? C.success : C.danger, lineHeight: 1 }}>{pct}%</div>
        <div style={{ color: C.textMuted, fontSize: 15, marginTop: 4 }}>{score} de 15 correctas</div>
      </div>

      <Card style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 12 }}>
          <ProgressBar pct={pct} color={passed ? C.success : C.danger} height={10} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
          <span style={{ color: C.textMuted }}>Correctas: <strong style={{ color: C.success }}>{score}</strong></span>
          <span style={{ color: C.textMuted }}>Incorrectas: <strong style={{ color: C.danger }}>{15 - score}</strong></span>
          <span style={{ color: C.textMuted }}>Intento: <strong style={{ color: C.text }}>{attempt} de 3</strong></span>
        </div>
      </Card>

      {passed ? (
        <div style={{ display: 'flex', gap: 12 }}>
          <Btn variant="success" size="lg" onClick={() => onNav('certificate')}>
            <Icon name="award" size={18} color="white" /> Ver mi Certificado
          </Btn>
        </div>
      ) : (
        <div>
          {attempt < 3 ? (
            <div>
              <div style={{ background: C.warning + '15', border: `1px solid ${C.warning}44`, borderRadius: 8, padding: '12px 16px', marginBottom: 16, fontSize: 13, color: C.text }}>
                Te quedan <strong>{3 - attempt}</strong> intento{3 - attempt !== 1 ? 's' : ''}. Revisa el material antes de intentarlo de nuevo.
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <Btn variant="ghost" onClick={() => onNav('course')}>Revisar módulos</Btn>
                <Btn onClick={handleRetry}>Reintentar evaluación</Btn>
              </div>
            </div>
          ) : (
            <div style={{ background: C.danger + '15', border: `1px solid ${C.danger}44`, borderRadius: 8, padding: '16px', fontSize: 13, color: C.text }}>
              <strong>Has agotado los 3 intentos.</strong> Se ha notificado a tu jefe de área. Deberás rehacer el curso completo. El administrador recibirá notificación por correo.
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ padding: 40, maxWidth: 720 }}>
      {/* Progress */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: C.textMuted, marginBottom: 8 }}>
          <span>Pregunta {current + 1} de 15</span>
          <span style={{ color: C.text }}>{Object.keys(answers).length} respondidas</span>
        </div>
        <ProgressBar pct={((current + 1) / 15) * 100} color={C.copper} />
        <div style={{ display: 'flex', gap: 4, marginTop: 10 }}>
          {selected15.map((_, i) => (
            <div key={i} style={{
              flex: 1, height: 4, borderRadius: 99,
              background: answers[selected15[i].id] !== undefined ? C.copper : i === current ? C.border : C.surface3,
              transition: 'background .2s',
            }} />
          ))}
        </div>
      </div>

      <Card style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: C.copper, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Pregunta {current + 1}</div>
        <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 600, color: C.text, lineHeight: 1.4, marginBottom: 24 }}>
          {q.q}
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {q.opts.map((opt, i) => {
            const isSelected = answered === i;
            return (
              <button key={i} onClick={() => handleAnswer(i)} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px',
                borderRadius: 8, border: `1.5px solid ${isSelected ? C.copper : C.border}`,
                background: isSelected ? C.copper + '18' : C.surface3,
                cursor: 'pointer', textAlign: 'left', fontFamily: "'DM Sans', sans-serif",
                transition: 'all .15s', color: C.text, fontSize: 14,
              }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', flexShrink: 0, border: `2px solid ${isSelected ? C.copper : C.border}`, background: isSelected ? C.copper : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {isSelected && <Icon name="check" size={11} color="white" />}
                </div>
                {opt}
              </button>
            );
          })}
        </div>
      </Card>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Btn variant="ghost" onClick={() => setCurrent(c => Math.max(0, c - 1))} disabled={current === 0}>← Anterior</Btn>
        {current < 14
          ? <Btn onClick={() => setCurrent(c => c + 1)} disabled={!answered}>Siguiente →</Btn>
          : <Btn variant="success" onClick={handleSubmit} disabled={Object.keys(answers).length < 15}>Enviar evaluación</Btn>
        }
      </div>
    </div>
  );
};

// Certificate
const CertificateScreen = () => {
  const { C, Btn, Card, Badge, Icon } = window;
  const [showFull, setShowFull] = React.useState(false);
  return (
    <div style={{ padding: 40, maxWidth: 800 }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Badge color={C.success}>Aprobado · 93%</Badge>
          <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 32, fontWeight: 800, color: C.text, marginTop: 8 }}>Certificado de Aprobación</h1>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Btn variant="ghost" size="sm"><Icon name="mail" size={14} color={C.silver} /> Enviar por email</Btn>
          <Btn size="sm"><Icon name="doc" size={14} color="white" /> Descargar PDF</Btn>
        </div>
      </div>

      {/* Certificate */}
      <div style={{
        background: 'white', borderRadius: 12, overflow: 'hidden',
        boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
        border: `1px solid ${C.border}`,
      }}>
        {/* Header band */}
        <div style={{ background: `linear-gradient(135deg, #0C1520 0%, #1B2A3E 50%, ${C.copperDk} 100%)`, padding: '32px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <img src="assets/logo-lc.png" alt="Grupo Minero Las Cenizas" style={{ height: 52, filter: 'brightness(1.2)' }} />
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Certificado N°</div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 18, color: C.copper, fontWeight: 700 }}>GLC-2025-04-1847</div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '40px 48px', textAlign: 'center' }}>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7A6A50', marginBottom: 8 }}>
            Grupo Minero Las Cenizas certifica que
          </div>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 38, fontWeight: 700, color: '#1A1A1A', marginBottom: 4, lineHeight: 1.1 }}>
            Juan Andrés Pérez Soto
          </div>
          <div style={{ fontSize: 14, color: '#666', marginBottom: 28 }}>RUN: 14.523.867-3</div>

          <div style={{ fontSize: 14, color: '#444', lineHeight: 1.7, maxWidth: 520, margin: '0 auto 28px' }}>
            ha completado satisfactoriamente el curso de
          </div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 28, fontWeight: 800, color: C.copperDk, marginBottom: 8 }}>
            INDUCCIÓN MINA CABILDO
          </div>
          <div style={{ fontSize: 13, color: '#666', marginBottom: 32 }}>
            Obteniendo una calificación de <strong style={{ color: C.copperDk }}>93%</strong> (14 de 15 correctas)
          </div>

          {/* Decorative divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
            <div style={{ flex: 1, height: 1, background: '#E0D4C0' }} />
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.copper }} />
            <div style={{ flex: 1, height: 1, background: '#E0D4C0' }} />
          </div>

          {/* Signature area */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ height: 48, borderBottom: '1px solid #CCC', marginBottom: 6, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 4 }}>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: '#333', transform: 'rotate(-3deg)' }}>Rodrigo Contreras V.</div>
              </div>
              <div style={{ fontSize: 11, color: '#888' }}>Rodrigo Contreras Vargas</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.copperDk }}>Prevencionista de Riesgos</div>
              <div style={{ fontSize: 10, color: '#999' }}>Reg. MINSAL N° 45.281</div>
              <Badge color={C.copper} style={{ marginTop: 8 }}>✓ Firma Digital Avanzada</Badge>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ height: 48, borderBottom: '1px solid #CCC', marginBottom: 6, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 4 }}>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: '#333', transform: 'rotate(2deg)' }}>Felipe Mora A.</div>
              </div>
              <div style={{ fontSize: 11, color: '#888' }}>Felipe Mora Araya</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.copperDk }}>Gerente de Operaciones</div>
              <div style={{ fontSize: 10, color: '#999' }}>Grupo Minero Las Cenizas</div>
            </div>
          </div>

          <div style={{ marginTop: 32, paddingTop: 20, borderTop: '1px solid #EEE', fontSize: 11, color: '#AAA', display: 'flex', justifyContent: 'space-between' }}>
            <span>Emisión: 19 de abril de 2025</span>
            <span>Válido por 12 meses</span>
            <span>Verificar en: tecktur.cl/verificar/GLC-2025-04-1847</span>
          </div>
        </div>

        {/* Footer */}
        <div style={{ background: '#F7F4F0', padding: '14px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: '#999' }}>Plataforma de inducción desarrollada por Tecktur SpA</span>
          <span style={{ fontSize: 11, color: '#999' }}>ISO 45001 · Sistema de Gestión de Seguridad</span>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { QuizScreen, CertificateScreen });
