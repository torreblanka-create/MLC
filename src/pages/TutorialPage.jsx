import { useState } from 'react';
import { C, Btn, Card, Icon } from '../components/Shared';

const steps = [
  { icon: 'hard_hat', title: 'Bienvenido a Inducción Minera', color: C.copper,
    body: 'Esta plataforma certifica tus conocimientos de seguridad para operar en faenas de Grupo Minero Las Cenizas. Completa cada módulo y aprueba la evaluación final para obtener tu certificado digital.' },
  { icon: 'eye', title: 'Verificación continua de presencia', color: C.warning,
    body: 'La cámara permanecerá activa durante el curso. Si cambias de pestaña o aplicación, el módulo se pausará automáticamente y se registrará el evento. Mantén el foco en el contenido.' },
  { icon: 'shield', title: 'Evaluación y aprobación', color: C.silver,
    body: '15 preguntas aleatorias de un banco de 50. Necesitas un 90% (13/15) para aprobar. Tienes 3 oportunidades por curso. Si repruebas, podrás repetir el curso antes de intentarlo nuevamente.' },
  { icon: 'award', title: 'Certificado digital con firma avanzada', color: C.success,
    body: 'Al aprobar recibirás un certificado con firma digital avanzada, emitido por el profesional de prevención de riesgos de la empresa. También llega a tu correo automáticamente.' },
  { icon: 'folder', title: 'Repositorio de documentos', color: C.copperLt,
    body: 'Tendrás acceso al repositorio de documentos de seguridad de la empresa, basados en ISO 45001 y el sistema de gestión propio. Puedes consultarlos en cualquier momento.' },
];

export default function TutorialPage({ onDone }) {
  const [step, setStep] = useState(0);
  const current = steps[step];

  return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ maxWidth: 560, width: '100%' }}>
        {/* Progress dots */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 40 }}>
          {steps.map((_, i) => (
            <div key={i} style={{ height: 4, borderRadius: 99, transition: 'all .3s', width: i === step ? 32 : 12, background: i <= step ? C.copper : C.border }} />
          ))}
        </div>

        <Card style={{ textAlign: 'center', padding: '48px 40px' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', margin: '0 auto 24px', background: current.color + '18', border: `2px solid ${current.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name={current.icon} size={36} color={current.color} />
          </div>
          <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 30, fontWeight: 700, color: C.text, marginBottom: 16, lineHeight: 1.15 }}>{current.title}</h2>
          <p style={{ color: C.silver, fontSize: 15, lineHeight: 1.7, marginBottom: 36 }}>{current.body}</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            {step > 0 && <Btn variant="ghost" onClick={() => setStep(s => s - 1)}>Anterior</Btn>}
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
}
