import { useState, useMemo } from 'react';
import { Btn, Card, Badge, ProgressBar, Icon } from '../components/Shared';
import { QUESTION_BANKS, FAENA_LABELS } from '../data/questions';
const C = { copper: 'var(--copper)', text: 'var(--text)', textMuted: 'var(--text-muted)', danger: 'var(--danger)', warning: 'var(--warning)', success: 'var(--success)', surface: 'var(--surface)', surface2: 'var(--surface2)', surface3: 'var(--surface3)', border: 'var(--border)', silver: 'var(--silver)', silverLt: 'var(--silver-lt)', copperLt: 'var(--copper-lt)' };

export default function QuizPage({ onNav, activeCourse }) {
  const bank = QUESTION_BANKS[activeCourse] ?? QUESTION_BANKS['mina_cabildo'];
  const faenaLabel = FAENA_LABELS[activeCourse] ?? 'Inducción';

  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [attempt, setAttempt] = useState(1);

  // 15 preguntas aleatorias del banco de 50 de esta faena, re-sorteadas por intento
  const selected15 = useMemo(
    () => [...bank].sort(() => Math.random() - 0.5).slice(0, 15),
    [attempt, activeCourse]
  );

  const q = selected15[current];
  const answered = answers[q?.id];
  const score = submitted ? selected15.filter(q => answers[q.id] === q.correct).length : 0;
  const pct = Math.round((score / 15) * 100);
  const passed = pct >= 90;

  const handleRetry = () => {
    setAnswers({});
    setCurrent(0);
    setSubmitted(false);
    setAttempt(a => a + 1);
  };

  // ── Pantalla de inicio ──────────────────────────────────────
  if (!started) return (
    <div style={{ padding: 40, maxWidth: 700 }}>
      <div style={{ marginBottom: 32 }}>
        <Badge color={C.warning}>Evaluación Final</Badge>
        <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 36, fontWeight: 800, color: C.text, marginTop: 10, marginBottom: 8 }}>
          {faenaLabel}
        </h1>
        <p style={{ color: C.textMuted, fontSize: 15, lineHeight: 1.6 }}>
          La evaluación consiste en <strong style={{ color: C.text }}>15 preguntas aleatorias</strong> del banco de <strong style={{ color: C.text }}>50 preguntas</strong> de esta faena. Necesitas responder correctamente al menos 13 (90%) para aprobar.
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Preguntas',      value: '15',           icon: 'doc' },
          { label: 'Mín. aprobación',value: '90%',          icon: 'shield' },
          { label: 'Intentos disp.', value: `${4 - attempt} de 3`, icon: 'warning' },
        ].map((s, i) => (
          <Card key={i} style={{ textAlign: 'center', padding: 20 }}>
            <Icon name={s.icon} size={24} color={C.copper} />
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 32, fontWeight: 800, color: C.text, margin: '8px 0 2px' }}>{s.value}</div>
            <div style={{ fontSize: 11, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
          </Card>
        ))}
      </div>
      <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 10, padding: '14px 18px', marginBottom: 24, fontSize: 13, color: C.textMuted, lineHeight: 1.6 }}>
        Las preguntas se seleccionan aleatoriamente del banco exclusivo de <strong style={{ color: C.copperLt }}>{faenaLabel}</strong>. Cada intento presenta una selección diferente.
      </div>
      <Btn size="lg" onClick={() => setStarted(true)}>
        Iniciar Evaluación <Icon name="chevron" size={16} color="white" />
      </Btn>
    </div>
  );

  // ── Resultados ──────────────────────────────────────────────
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
        <div style={{ marginBottom: 12 }}><ProgressBar pct={pct} color={passed ? C.success : C.danger} height={10} /></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
          <span style={{ color: C.textMuted }}>Correctas: <strong style={{ color: C.success }}>{score}</strong></span>
          <span style={{ color: C.textMuted }}>Incorrectas: <strong style={{ color: C.danger }}>{15 - score}</strong></span>
          <span style={{ color: C.textMuted }}>Intento: <strong style={{ color: C.text }}>{attempt} de 3</strong></span>
        </div>
      </Card>

      {passed ? (
        <Btn variant="success" size="lg" onClick={() => onNav('certificate')}>
          <Icon name="award" size={18} color="white" /> Ver mi Certificado
        </Btn>
      ) : (
        <div>
          {attempt < 3 ? (
            <div>
              <div style={{ background: C.warning + '15', border: `1px solid ${C.warning}44`, borderRadius: 8, padding: '12px 16px', marginBottom: 16, fontSize: 13, color: C.text }}>
                Te quedan <strong>{3 - attempt}</strong> intento{3 - attempt !== 1 ? 's' : ''}. Revisa el material del curso antes de volver a intentarlo.
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <Btn variant="ghost" onClick={() => onNav('course', activeCourse)}>Revisar módulos</Btn>
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

  // ── Pregunta activa ─────────────────────────────────────────
  return (
    <div style={{ padding: 40, maxWidth: 720 }}>
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
        <div style={{ fontSize: 11, color: C.copper, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
          Pregunta {current + 1}
        </div>
        <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 600, color: C.text, lineHeight: 1.4, marginBottom: 24 }}>
          {q.q}
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {q.opts.map((opt, i) => {
            const isSelected = answered === i;
            return (
              <button key={i}
                onClick={() => !submitted && setAnswers(a => ({ ...a, [q.id]: i }))}
                style={{
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
        <Btn variant="ghost" onClick={() => setCurrent(c => Math.max(0, c - 1))} disabled={current === 0}>
          ← Anterior
        </Btn>
        {current < 14
          ? <Btn onClick={() => setCurrent(c => c + 1)} disabled={!answered}>Siguiente →</Btn>
          : <Btn variant="success" onClick={() => setSubmitted(true)} disabled={Object.keys(answers).length < 15}>Enviar evaluación</Btn>
        }
      </div>
    </div>
  );
}
