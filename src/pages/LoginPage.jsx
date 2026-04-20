import { useState, useRef, useEffect } from 'react';
import { C, Btn, Badge, Icon, ProgressBar } from '../components/Shared';

// First-time login: Credenciales → Cédula → Facial
// Returning user: Credenciales only (isReturning = true from localStorage)

const inputStyle = {
  width: '100%', background: 'rgba(20,32,48,0.9)', border: `1px solid rgba(196,116,42,0.25)`,
  borderRadius: 8, color: '#EDE8E2', padding: '13px 16px 13px 44px',
  fontSize: 15, fontFamily: "'DM Sans', sans-serif", outline: 'none',
};

function formatRut(val) {
  let clean = val.replace(/[^0-9kK]/g, '');
  if (clean.length > 9) clean = clean.slice(0, 9);
  if (clean.length > 1) {
    const body = clean.slice(0, -1).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return body + '-' + clean.slice(-1).toUpperCase();
  }
  return clean;
}

export default function LoginPage({ onLogin }) {
  const isReturning = !!localStorage.getItem('ind_tutorial_seen');

  // Admin: credenciales → success (always)
  // Returning alumno: credenciales → success
  // First-time alumno: credenciales → cedula → facial → success
  const [step, setStep] = useState('credenciales');
  const [rut, setRut] = useState('');
  const [pass, setPass] = useState('');
  const [numDoc, setNumDoc] = useState('');
  const [scanPct, setScanPct] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const videoRef = useRef(null);
  const intervalRef = useRef(null);

  const isAdmin = rut.startsWith('12');

  const handleCredSubmit = () => {
    if (!rut || rut.length < 9) { setError('Ingresa un RUT válido'); return; }
    if (!pass || pass.length < 4) { setError('Ingresa tu contraseña'); return; }
    setError('');
    if (isAdmin || isReturning) {
      setStep('success');
      setTimeout(() => onLogin(isAdmin ? 'admin' : 'alumno'), 1200);
    } else {
      setStep('cedula');
    }
  };

  const handleCedulaSubmit = () => {
    if (!numDoc || numDoc.length < 6) { setError('Ingresa el número de documento'); return; }
    setError('');
    setStep('facial');
    startCamera();
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch { /* demo mode */ }
    setTimeout(() => startScan(), 1000);
  };

  const startScan = () => {
    setScanning(true); setScanPct(0);
    intervalRef.current = setInterval(() => {
      setScanPct(p => {
        if (p >= 100) {
          clearInterval(intervalRef.current);
          if (videoRef.current?.srcObject)
            videoRef.current.srcObject.getTracks().forEach(t => t.stop());
          setTimeout(() => {
            setStep('success');
            setTimeout(() => onLogin(rut.startsWith('12') ? 'admin' : 'alumno'), 1200);
          }, 600);
          return 100;
        }
        return p + 2;
      });
    }, 50);
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  // Step labels — show all 3 only for first-time alumnos
  const stepLabels = (isReturning || isAdmin)
    ? ['Usuario y Contraseña']
    : ['Usuario y Contraseña', 'Cédula de Identidad', 'Reconocimiento Facial'];

  const stepIdx = { credenciales: 0, cedula: 1, facial: 2, success: isReturning ? 0 : 2 };
  const curIdx = stepIdx[step] ?? 0;

  return (
    <div style={{
      minHeight: '100vh', width: '100%',
      backgroundImage: 'url(/assets/bg-faena.webp)',
      backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
      display: 'flex', alignItems: 'stretch',
    }}>
      {/* Left brand panel */}
      <div style={{
        flex: 1, borderRight: `1px solid rgba(196,116,42,0.2)`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '60px 80px', position: 'relative', overflow: 'hidden', textAlign: 'center',
        background: 'rgba(10,20,30,0.55)', backdropFilter: 'blur(2px)',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(6,12,20,0.78) 0%, rgba(10,18,28,0.72) 60%, rgba(60,30,8,0.68) 100%)' }} />
        <img src="/assets/logo-lc.png" alt="Grupo Minero Las Cenizas"
          style={{ width: 380, marginBottom: 40, position: 'relative', zIndex: 1, filter: 'drop-shadow(0 4px 24px rgba(0,0,0,0.7))' }} />
        <div style={{ width: 60, height: 2, background: `linear-gradient(90deg, transparent, #C4742A, transparent)`, marginBottom: 24, position: 'relative', zIndex: 1 }} />
        <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 38, fontWeight: 800, color: '#EDE8E2', textAlign: 'center', lineHeight: 1.15, marginBottom: 16, position: 'relative', zIndex: 1, textShadow: '0 2px 16px rgba(0,0,0,0.8)', letterSpacing: '0.03em', whiteSpace: 'nowrap' }}>
          <span style={{ color: '#D4924A' }}>INDUCCIÓN</span> PERSONA NUEVA
        </h1>
        <p style={{ color: 'rgba(180,195,215,0.9)', textAlign: 'center', fontSize: 14, maxWidth: 320, lineHeight: 1.7, position: 'relative', zIndex: 1, textShadow: '0 1px 8px rgba(0,0,0,0.9)' }}>
          Para personal propio como de Empresas Contratistas de Grupo Minero Las Cenizas.
        </p>
        <div style={{ position: 'absolute', bottom: 24, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, zIndex: 1 }}>
          <img src="/assets/logo-tecktur.jpg" alt="Tecktur SpA." style={{ height: 48, borderRadius: 6, opacity: 0.85 }} />
          <span style={{ fontSize: 14, color: '#8A9BB0' }}>by <span style={{ color: '#C4742A' }}>Tecktur SpA.</span></span>
        </div>
      </div>

      {/* Right form panel */}
      <div style={{ width: 500, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', padding: '10vh 52px 40px', background: 'rgba(8,16,26,0.82)', backdropFilter: 'blur(20px)', borderLeft: '1px solid rgba(196,116,42,0.15)' }}>

        {/* Step indicator */}
        {step !== 'success' && stepLabels.length > 1 && (
          <div style={{ width: '100%', marginBottom: 36 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0, marginBottom: 10 }}>
              {stepLabels.map((label, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', flex: i < stepLabels.length - 1 ? '1 1 auto' : '0 0 auto' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: i < curIdx ? '#3DAA6B' : i === curIdx ? '#C4742A' : 'rgba(36,51,72,1)',
                      border: `2px solid ${i < curIdx ? '#3DAA6B' : i === curIdx ? '#C4742A' : '#243348'}`,
                      fontSize: 12, fontWeight: 700, color: i <= curIdx ? 'white' : '#6B7E95', transition: 'all .3s',
                    }}>
                      {i < curIdx ? <Icon name="check" size={13} color="white" /> : i + 1}
                    </div>
                    <span style={{ fontSize: 10, color: i === curIdx ? '#D4924A' : i < curIdx ? '#3DAA6B' : '#6B7E95', textAlign: 'center', lineHeight: 1.2, letterSpacing: '0.04em', maxWidth: 80 }}>{label}</span>
                  </div>
                  {i < stepLabels.length - 1 && (
                    <div style={{ height: 2, flex: 1, background: i < curIdx ? '#3DAA6B' : '#243348', margin: '13px 6px 0', transition: 'background .3s', minWidth: 20 }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Credentials */}
        {step === 'credenciales' && (
          <div style={{ width: '100%' }}>
            <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 32, fontWeight: 700, color: '#EDE8E2', marginBottom: 6 }}>
              {isReturning ? 'Iniciar Sesión' : 'Identificación'}
            </h2>
            <p style={{ color: '#6B7E95', fontSize: 14, marginBottom: 28 }}>
              {isReturning ? 'Ingresa tu RUT y contraseña para continuar.' : 'Ingresa tu RUT y contraseña para continuar.'}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}><Icon name="user" size={16} color="#6B7E95" /></div>
                <input placeholder="12.345.678-9" value={rut} onChange={e => setRut(formatRut(e.target.value))} style={inputStyle} />
                <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 10, color: '#6B7E95', textTransform: 'uppercase', letterSpacing: '0.05em' }}>RUT</div>
              </div>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}><Icon name="lock" size={16} color="#6B7E95" /></div>
                <input type="password" placeholder="Contraseña" value={pass} onChange={e => setPass(e.target.value)}
                  style={inputStyle} onKeyDown={e => e.key === 'Enter' && handleCredSubmit()} />
              </div>
            </div>
            {error && <div style={{ color: '#D94F3D', fontSize: 13, marginBottom: 12, padding: '8px 12px', background: '#D94F3D15', borderRadius: 6 }}>{error}</div>}
            <Btn onClick={handleCredSubmit} style={{ width: '100%' }} size="lg">
              {isReturning ? 'Acceder' : 'Continuar'} <Icon name="chevron" size={16} color="white" />
            </Btn>
            {!isReturning && !isAdmin && (
              <div style={{ marginTop: 18, padding: 14, background: 'rgba(196,116,42,0.08)', borderRadius: 8, border: `1px solid rgba(196,116,42,0.2)` }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <Icon name="camera" size={15} color="#C4742A" />
                  <p style={{ fontSize: 12, color: '#6B7E95', lineHeight: 1.5, textAlign: 'justify' }}>
                    El sistema verificará tu identidad mediante Cédula de Identidad y Reconocimiento Facial. Asegúrate de estar en un lugar bien iluminado.
                  </p>
                </div>
              </div>
            )}
            <div style={{ marginTop: 14, textAlign: 'center', fontSize: 11, color: '#6B7E95' }}>
              <span style={{ color: '#D4924A' }}>Admin demo:</span> RUT comenzando en 12 · <span style={{ color: '#D4924A' }}>Alumno:</span> cualquier otro
            </div>
          </div>
        )}

        {/* Step 2: Cédula */}
        {step === 'cedula' && (
          <div style={{ width: '100%' }}>
            <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 32, fontWeight: 700, color: '#EDE8E2', marginBottom: 6 }}>Cédula de Identidad</h2>
            <p style={{ color: '#6B7E95', fontSize: 14, marginBottom: 28 }}>Ingresa el número al dorso de tu cédula.</p>
            <div style={{ position: 'relative', marginBottom: 20 }}>
              <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}><Icon name="doc" size={16} color="#6B7E95" /></div>
              <input placeholder="Nº Documento (ej: 123456789)" value={numDoc}
                onChange={e => setNumDoc(e.target.value.replace(/\D/g,'').slice(0,9))}
                style={inputStyle} onKeyDown={e => e.key === 'Enter' && handleCedulaSubmit()} />
              <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 10, color: '#6B7E95', textTransform: 'uppercase', letterSpacing: '0.05em' }}>N° DOC</div>
            </div>
            {error && <div style={{ color: '#D94F3D', fontSize: 13, marginBottom: 12, padding: '8px 12px', background: '#D94F3D15', borderRadius: 6 }}>{error}</div>}
            <Btn onClick={handleCedulaSubmit} style={{ width: '100%' }} size="lg">Validar Cédula <Icon name="chevron" size={16} color="white" /></Btn>
          </div>
        )}

        {/* Step 3: Facial */}
        {step === 'facial' && (
          <div style={{ width: '100%', textAlign: 'center' }}>
            <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 30, fontWeight: 700, color: '#EDE8E2', marginBottom: 6 }}>Reconocimiento Facial</h2>
            <p style={{ color: '#6B7E95', fontSize: 13, marginBottom: 24 }}>Mira directamente a la cámara sin moverte</p>
            <div style={{ position: 'relative', width: 220, height: 220, margin: '0 auto 20px', borderRadius: '50%', overflow: 'hidden', border: `3px solid ${scanPct === 100 ? '#3DAA6B' : '#C4742A'}`, boxShadow: `0 0 36px ${scanPct === 100 ? '#3DAA6B44' : '#C4742A44'}` }}>
              <video ref={videoRef} autoPlay muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <svg viewBox="0 0 220 220" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                <circle cx="110" cy="110" r="105" fill="none" stroke="#C4742A" strokeWidth="3"
                  strokeDasharray={`${2 * Math.PI * 105 * scanPct / 100} ${2 * Math.PI * 105}`}
                  strokeLinecap="round" transform="rotate(-90 110 110)" style={{ transition: 'stroke-dasharray .1s' }} />
              </svg>
              {scanning && scanPct < 100 && (
                <div style={{ position: 'absolute', left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, #C4742A, transparent)', top: `${scanPct}%`, transition: 'top .1s' }} />
              )}
              {scanPct === 100 && (
                <div style={{ position: 'absolute', inset: 0, background: '#3DAA6BAA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="check" size={56} color="white" />
                </div>
              )}
            </div>
            <ProgressBar pct={scanPct} color={scanPct === 100 ? '#3DAA6B' : '#C4742A'} height={8} />
            <div style={{ marginTop: 8, fontSize: 13, color: '#6B7E95', marginBottom: 16 }}>
              {scanPct < 100 ? `Analizando... ${scanPct}%` : '✓ Identidad facial verificada'}
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
              {['Rostro detectado', 'Iluminación OK', 'Análisis biométrico'].map((t, i) => (
                <Badge key={i} color={scanPct > i * 33 ? '#3DAA6B' : '#6B7E95'}>{t}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Success */}
        {step === 'success' && (
          <div style={{ textAlign: 'center', marginTop: '20vh' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#3DAA6B22', border: '2px solid #3DAA6B', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Icon name="check" size={36} color="#3DAA6B" />
            </div>
            <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 28, color: '#EDE8E2' }}>Acceso concedido</h2>
            <p style={{ color: '#6B7E95', marginTop: 6 }}>Cargando plataforma...</p>
          </div>
        )}
      </div>
    </div>
  );
}
