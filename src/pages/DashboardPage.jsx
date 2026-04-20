import { Btn, Card, Badge, Tag, ProgressBar, Icon } from '../components/Shared';
const C = { copper: 'var(--copper)', text: 'var(--text)', textMuted: 'var(--text-muted)', danger: 'var(--danger)', warning: 'var(--warning)', success: 'var(--success)', surface3: 'var(--surface3)' };

const cursos = [
  { id: 'mina_cabildo',   title: 'Inducción Mina Cabildo',    estado: 'en_progreso', pct: 45, intentos: 0 },
  { id: 'mina_taltal',    title: 'Inducción Mina Taltal',     estado: 'bloqueado',   pct: 0,  intentos: 0 },
  { id: 'planta_cabildo', title: 'Inducción Planta Cabildo',  estado: 'bloqueado',   pct: 0,  intentos: 0 },
  { id: 'planta_taltal',  title: 'Inducción Planta Taltal',   estado: 'bloqueado',   pct: 0,  intentos: 0 },
];

const estadoLabel = { en_progreso: 'En progreso', bloqueado: 'No iniciado', aprobado: 'Aprobado', reprobado: 'Reprobado' };
const estadoColor = { en_progreso: C.warning, bloqueado: C.textMuted, aprobado: C.success, reprobado: C.danger };

// Mock: días restantes para el alumno actual (en producción viene del backend)
const DIAS_RESTANTES = 9;
const FECHA_VENCIMIENTO = '04/05/2026';

function PlazoBanner({ dias }) {
  const vencido  = dias < 0;
  const urgente  = !vencido && dias <= 3;
  const advertir = !vencido && dias <= 7;
  const color    = vencido ? C.danger : urgente ? C.danger : advertir ? C.warning : C.success;
  const pctUsado = vencido ? 100 : Math.round(((15 - dias) / 15) * 100);

  if (vencido) return (
    <div style={{ background: C.danger + '18', border: `1px solid ${C.danger}55`, borderRadius: 12, padding: '20px 24px', marginBottom: 28 }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <div style={{ width: 44, height: 44, borderRadius: 10, background: C.danger + '25', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon name="warning" size={22} color={C.danger} />
        </div>
        <div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 20, fontWeight: 800, color: C.danger }}>Plazo de inducción vencido</div>
          <div style={{ fontSize: 13, color: C.text, marginTop: 2 }}>Tu acceso ha sido desactivado. Contacta a tu supervisor para gestionar una nueva inscripción.</div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ background: color + '12', border: `1px solid ${color}44`, borderRadius: 12, padding: '18px 24px', marginBottom: 28 }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: 10, background: color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon name="warning" size={22} color={color} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 20, fontWeight: 800, color }}>
              {dias === 1 ? '¡Último día!' : urgente ? `¡Quedan solo ${dias} días!` : `${dias} días para completar tu inducción`}
            </div>
            <div style={{ fontSize: 12, color: C.textMuted }}>Vence el {FECHA_VENCIMIENTO}</div>
          </div>
          <div style={{ fontSize: 13, color: C.text, marginTop: 2 }}>
            {urgente
              ? 'Completa tu curso hoy. Al vencer el plazo, tus datos serán eliminados y deberás ser reinscrito.'
              : 'Debes completar todos tus cursos asignados antes de la fecha límite.'}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ flex: 1, height: 6, borderRadius: 99, background: C.surface3, overflow: 'hidden' }}>
          <div style={{ width: `${pctUsado}%`, height: '100%', background: color, borderRadius: 99, transition: 'width .4s' }} />
        </div>
        <span style={{ fontSize: 11, color: C.textMuted, flexShrink: 0 }}>Día {15 - dias} de 15</span>
      </div>
    </div>
  );
}

export default function DashboardPage({ onNav }) {
  return (
    <div style={{ padding: 40, maxWidth: 900 }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 12, color: C.copper, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Bienvenido de vuelta</div>
        <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 36, fontWeight: 800, color: C.text }}>Inducción Persona Nueva</h1>
      </div>

      <PlazoBanner dias={DIAS_RESTANTES} />

      <div style={{ background: C.copper + '15', border: `1px solid ${C.copper}44`, borderRadius: 10, padding: '14px 20px', marginBottom: 28, display: 'flex', gap: 12, alignItems: 'center' }}>
        <Icon name="warning" size={18} color={C.copper} />
        <span style={{ fontSize: 13, color: C.text }}>La cámara permanece activa durante el estudio. Cambiar de pestaña <strong>pausa el módulo</strong> automáticamente.</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 20 }}>
        {cursos.map((c, i) => (
          <Card key={c.id}
            style={{ cursor: c.estado !== 'bloqueado' ? 'pointer' : 'default', opacity: c.estado === 'bloqueado' && i > 0 ? 0.55 : 1 }}
            onClick={c.estado !== 'bloqueado' ? () => onNav('course', c.id) : undefined}>
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
                <Btn size="sm" onClick={() => onNav('course', c.id)}>
                  {c.estado === 'en_progreso' ? 'Continuar' : 'Ver'} <Icon name="chevron" size={13} color="white" />
                </Btn>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
