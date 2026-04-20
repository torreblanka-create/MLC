import { Badge, Icon } from './Shared';
import ThemeToggle from './ThemeToggle';

const adminLinks = [
  { id: 'admin',           label: 'Tablero',         icon: 'chart' },
  { id: 'admin_users',     label: 'Alumnos',         icon: 'users' },
  { id: 'admin_email',     label: 'Inscripción',     icon: 'mail' },
  { id: 'admin_content',   label: 'Contenidos',     icon: 'play' },
  { id: 'admin_questions', label: 'Banco Preguntas', icon: 'doc' },
  { id: 'settings',        label: 'Configuración',   icon: 'settings' },
];

const alumnoLinks = [
  { id: 'dashboard',   label: 'Mis Cursos',      icon: 'book' },
  { id: 'course',      label: 'Módulos Activos', icon: 'play' },
  { id: 'quiz',        label: 'Evaluación',      icon: 'shield' },
  { id: 'certificate', label: 'Certificados',    icon: 'award' },
];

export default function Shell({ screen, onNav, role, children }) {
  const links = role === 'admin' ? adminLinks : alumnoLinks;

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar */}
      <aside style={{
        width: 230, background: 'var(--surface)', borderRight: `1px solid var(--border)`,
        display: 'flex', flexDirection: 'column', flexShrink: 0, overflow: 'hidden',
      }}>
        {/* Brand */}
        <div style={{ padding: '22px 20px 18px', borderBottom: `1px solid var(--border)`, textAlign: 'center' }}>
          <img src="/assets/logo-lc.png" alt="Grupo Minero Las Cenizas"
            style={{ width: 195, display: 'block', margin: '0 auto 10px' }} />
        </div>

        {/* Role badge */}
        <div style={{ padding: '12px 20px 0' }}>
          <Badge color={role === 'admin' ? 'var(--copper)' : 'var(--silver)'}>
            {role === 'admin' ? '⚙ Administrador' : '👷 Alumno'}
          </Badge>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '14px 10px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {links.map(l => {
            const active = screen === l.id;
            return (
              <button key={l.id} onClick={() => onNav(l.id)} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                borderRadius: 8, border: 'none', cursor: 'pointer',
                background: active ? 'rgba(212, 134, 79, 0.15)' : 'transparent',
                color: active ? 'var(--copper-lt)' : 'var(--silver)',
                fontFamily: "'DM Sans', sans-serif", fontSize: 13.5,
                fontWeight: active ? 600 : 400, textAlign: 'left', transition: 'all .15s',
              }}>
                <Icon name={l.icon} size={15} color={active ? 'var(--copper)' : 'var(--text-muted)'} />
                {l.label}
                {active && <div style={{ marginLeft: 'auto', width: 5, height: 5, borderRadius: '50%', background: 'var(--copper)' }} />}
              </button>
            );
          })}
        </nav>

        {/* Bottom: user + tecktur + theme */}
        <div style={{ borderTop: `1px solid var(--border)`, padding: '14px 14px 10px' }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', padding: '0 6px 8px' }}>
            {role === 'admin' ? 'Admin GMLC' : 'Juan A. Pérez · 14.523.867-3'}
          </div>
          <button onClick={() => onNav('login')} style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', width: '100%',
            borderRadius: 8, border: 'none', cursor: 'pointer', background: 'transparent',
            color: 'var(--text-muted)', fontSize: 13, fontFamily: "'DM Sans', sans-serif",
          }}>
            <Icon name="logout" size={14} color="var(--text-muted)" /> Cerrar sesión
          </button>
          <div style={{ marginTop: 10, borderTop: `1px solid var(--border)`, paddingTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
              <img src="/assets/logo-tecktur.jpg" alt="Tecktur SpA." style={{ height: 35, borderRadius: 4, opacity: 0.85 }} />
              <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>Tecktur</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {children}
      </main>
    </div>
  );
}
