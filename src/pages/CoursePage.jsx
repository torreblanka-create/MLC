import { useState, useEffect } from 'react';
import { Btn, Card, Badge, Tag, ProgressBar, Icon } from '../components/Shared';
const C = { copper: 'var(--copper)', text: 'var(--text)', textMuted: 'var(--text-muted)', danger: 'var(--danger)', warning: 'var(--warning)', success: 'var(--success)', surface: 'var(--surface)', surface2: 'var(--surface2)', surface3: 'var(--surface3)', border: 'var(--border)', silver: 'var(--silver)', silverLt: 'var(--silver-lt)', copperLt: 'var(--copper-lt)' };

import { QUESTION_BANKS } from '../data/questions';

const modules = [
  { id: 1, title: 'Introducción a la seguridad minera',      contentIdx: 0, done: true,  duration: '8 min' },
  { id: 2, title: 'Riesgos críticos en faena subterránea',   contentIdx: 1, done: true,  duration: '12 min' },
  { id: 3, title: 'Equipos de protección personal (EPP)',    contentIdx: 2, done: false, duration: '10 min', active: true },
  { id: 4, title: 'Procedimientos de emergencia',            contentIdx: 3, done: false, duration: '9 min' },
  { id: 5, title: 'Prueba Corta 1',                          type: 'quiz', done: false, duration: '5 min' },
  { id: 6, title: 'Señalética y zonas de peligro',           contentIdx: 4, done: false, duration: '7 min' },
  { id: 7, title: 'Comunicación en faena',                   contentIdx: 5, done: false, duration: '6 min' },
  { id: 8, title: 'Normativa y reglamento interno',          contentIdx: 6, done: false, duration: '11 min' },
  { id: 9, title: 'Revisión y cierre',                       contentIdx: 7, done: false, duration: '5 min' },
  { id: 10, title: 'Prueba Corta 2',                         type: 'quiz', done: false, duration: '5 min' },
];

const eppItems = [
  { title: 'Casco de Seguridad',   desc: 'Obligatorio en todas las zonas de la faena. Clase A para trabajos subterráneos.',              icon: 'hard_hat' },
  { title: 'Protección Visual',    desc: 'Lentes de seguridad con certificación ANSI Z87.1. Protección contra impactos y UV.',            icon: 'eye' },
  { title: 'Calzado de Seguridad', desc: 'Punta de acero y suela antiperforación. Resistente a hidrocarburos.',                           icon: 'shield' },
  { title: 'Chaleco Reflectante',  desc: 'Clase 2 o superior. Visibilidad mínima a 100 metros en condiciones de baja luminosidad.',       icon: 'warning' },
];

const rules = [
  { icon: 'warning',  text: 'No puedes cambiar de pestaña ni salir de esta ventana. Cada evento queda registrado y notifica a tu supervisor.' },
  { icon: 'play',     text: 'El avance es secuencial. No es posible saltar módulos ni adelantar el contenido.' },
  { icon: 'camera',   text: 'La cámara permanece activa durante todo el curso. El sistema verifica tu presencia cada 5 minutos.' },
  { icon: 'shield',   text: 'Completar el curso en orden es requisito obligatorio para rendir la evaluación final.' },
];

function EntryWarningModal({ onAccept }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(6,12,20,0.92)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: C.surface, border: `1px solid ${C.copper}55`,
        borderRadius: 16, padding: '44px 48px', maxWidth: 560, width: '90%',
        boxShadow: `0 8px 60px rgba(0,0,0,0.6), 0 0 0 1px ${C.copper}22`,
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
          <div style={{ width: 52, height: 52, borderRadius: 12, background: C.copper + '20', border: `1px solid ${C.copper}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="warning" size={26} color={C.copper} />
          </div>
          <div>
            <div style={{ fontSize: 10, color: C.copper, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Antes de comenzar</div>
            <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 26, fontWeight: 800, color: C.text, lineHeight: 1 }}>Condiciones del curso</h2>
          </div>
        </div>

        {/* Rules */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
          {rules.map((r, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '14px 16px', background: C.surface2, borderRadius: 10, border: `1px solid ${C.border}` }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: C.copper + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                <Icon name={r.icon} size={15} color={C.copper} />
              </div>
              <p style={{ fontSize: 13.5, color: C.silver, lineHeight: 1.55, margin: 0 }}>{r.text}</p>
            </div>
          ))}
        </div>

        <div style={{ padding: '14px 16px', background: C.danger + '12', border: `1px solid ${C.danger}33`, borderRadius: 10, marginBottom: 28 }}>
          <p style={{ fontSize: 12.5, color: C.silver, lineHeight: 1.5, margin: 0 }}>
            Al hacer clic en <strong style={{ color: C.text }}>"Entendido, comenzar"</strong> confirmas que has leído y aceptas estas condiciones. El incumplimiento queda registrado en tu ficha de inducción.
          </p>
        </div>

        <Btn onClick={onAccept} style={{ width: '100%' }} size="lg">
          Entendido, comenzar curso <Icon name="chevron" size={16} color="white" />
        </Btn>
      </div>
    </div>
  );
}

function StyleToggle({ courseStyle, onStyleChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: C.surface3, borderRadius: 8, padding: 3, border: `1px solid ${C.border}` }}>
      {['aula', 'reel'].map(s => (
        <button key={s} onClick={() => onStyleChange(s)} style={{
          padding: '5px 14px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600,
          fontFamily: "'DM Sans', sans-serif",
          background: courseStyle === s ? C.copper : 'transparent',
          color: courseStyle === s ? 'white' : C.textMuted,
          transition: 'all .15s',
        }}>
          {s === 'aula' ? 'Aula Virtual' : 'Reel'}
        </button>
      ))}
    </div>
  );
}

function VideoPlayer({ url }) {
  if (!url) return null;
  const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
  const isVimeo = url.includes('vimeo.com');
  
  if (isYouTube) {
    let videoId = '';
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1]?.split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    }
    return (
      <iframe 
        width="100%" height="100%" 
        src={`https://www.youtube.com/embed/${videoId}?autoplay=0`} 
        title="Video" 
        frameBorder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowFullScreen 
        style={{ position: 'absolute', inset: 0 }}
      />
    );
  }
  
  if (isVimeo) {
    const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
    return (
      <iframe 
        src={`https://player.vimeo.com/video/${videoId}`} 
        width="100%" height="100%" 
        frameBorder="0" 
        allow="autoplay; fullscreen; picture-in-picture" 
        allowFullScreen
        style={{ position: 'absolute', inset: 0 }}
      />
    );
  }

  return (
    <video controls style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, objectFit: 'contain' }}>
      <source src={url} />
      Tu navegador no soporta el elemento video.
    </video>
  );
}

function MiniQuiz({ courseId, quizIndex, onPass }) {
  const bank = QUESTION_BANKS[courseId] || [];
  const startIdx = quizIndex === 0 ? 0 : 4;
  const qList = bank.slice(startIdx, startIdx + 4);
  
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  
  const score = Object.keys(answers).reduce((acc, qIdx) => {
    return acc + (answers[qIdx] === qList[qIdx].correct ? 1 : 0);
  }, 0);
  const pct = (score / 4) * 100;
  
  const submit = () => {
    if (Object.keys(answers).length < 4) {
      alert("Por favor responde todas las 4 preguntas para evaluar.");
      return;
    }
    setSubmitted(true);
    if (pct >= 75) {
      onPass();
    }
  };

  return (
    <div style={{ background: C.surface3, padding: 32, borderRadius: 12, border: `1px solid ${C.border}` }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20 }}>
        <Icon name="doc" size={24} color={C.copper} />
        <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 28, color: C.text, margin: 0 }}>Prueba Corta de Avance</h2>
      </div>
      <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 24 }}>Debes obtener al menos un 75% (3/4 correctas) para desbloquear el siguiente módulo.</p>

      {submitted && (
        <div style={{ padding: 16, borderRadius: 8, marginBottom: 24, background: pct >= 75 ? C.success + '22' : C.danger + '22', border: `1px solid ${pct >= 75 ? C.success : C.danger}` }}>
          <div style={{ fontSize: 18, color: pct >= 75 ? C.success : C.danger, fontWeight: 700 }}>
            {pct >= 75 ? '¡Prueba Aprobada!' : 'Prueba Reprobada'} ({pct}%)
          </div>
          <div style={{ fontSize: 14, color: C.text, marginTop: 4 }}>
            {pct >= 75 ? 'Excelente. Ya puedes avanzar al siguiente módulo.' : 'No alcanzaste el mínimo requerido. Revisa el contenido e intenta nuevamente.'}
          </div>
          {pct < 75 && <Btn size="sm" onClick={() => { setSubmitted(false); setAnswers({}); }} style={{ marginTop: 12 }} variant="ghost">Reintentar</Btn>}
        </div>
      )}
      
      {qList.map((q, i) => (
        <div key={i} style={{ marginBottom: 24, opacity: submitted ? 0.6 : 1, pointerEvents: submitted ? 'none' : 'auto' }}>
          <div style={{ fontSize: 15, color: C.text, fontWeight: 500, marginBottom: 12 }}>{i + 1}. {q.q}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {q.opts.map((opt, optIdx) => {
              const isSelected = answers[i] === optIdx;
              const isCorrect = optIdx === q.correct;
              let color = isSelected ? C.copper : C.textMuted;
              let bg = isSelected ? C.copper + '15' : 'transparent';
              
              if (submitted && isSelected) {
                color = isCorrect ? C.success : C.danger;
                bg = isCorrect ? C.success + '22' : C.danger + '22';
              } else if (submitted && isCorrect) {
                color = C.success;
                bg = C.success + '11';
              }

              return (
                <label key={optIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', padding: '10px 14px', borderRadius: 8, background: bg, border: `1px solid ${isSelected ? color : C.border}`, transition: 'all 0.2s' }}>
                  <input type="radio" checked={isSelected} onChange={() => setAnswers(prev => ({ ...prev, [i]: optIdx }))} style={{ marginTop: 4 }} />
                  <span style={{ fontSize: 14, color: submitted ? color : C.silver, fontWeight: isSelected ? 600 : 400 }}>{opt}</span>
                </label>
              );
            })}
          </div>
        </div>
      ))}
      
      {!submitted && (
        <Btn onClick={submit} style={{ width: '100%' }}>Finalizar y Evaluar</Btn>
      )}
    </div>
  );
}

function AulaStyle({ activeModule, setActiveModule, maxModule, setMaxModule, onNav, tabWarning, warnings, courseStyle, onStyleChange, courseContent, activeCourse, passedQuizzes, setPassedQuizzes }) {
  const [videoProgress, setVideoProgress] = useState(0);
  const [isPlayingDummy, setIsPlayingDummy] = useState(false);

  useEffect(() => {
    let timer;
    if (isPlayingDummy && videoProgress < 100) {
      timer = setInterval(() => setVideoProgress(p => Math.min(100, p + 1)), 600);
    } else if (videoProgress >= 100) {
      setIsPlayingDummy(false);
    }
    return () => clearInterval(timer);
  }, [isPlayingDummy, videoProgress]);

  const downloadSimulated = (filename) => {
    const blob = new Blob([`Contenido simulado para el archivo: ${filename}\nGenerado por Plataforma Inducción GMLC.`], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(a.href);
  };

  const AudioItem = ({ af, textToRead }) => {
    const [playing, setPlaying] = useState(false);
    
    const togglePlay = () => {
      if (playing) {
        window.speechSynthesis.cancel();
        setPlaying(false);
      } else {
        window.speechSynthesis.cancel(); // Detener audios anteriores
        const msg = textToRead || "No hay texto disponible para leer en este módulo.";
        const u = new SpeechSynthesisUtterance(`Reproduciendo simulación de audio para ${af.name}. ${msg}`);
        u.lang = 'es-ES';
        u.rate = 1.05;
        u.onend = () => setPlaying(false);
        window.speechSynthesis.speak(u);
        setPlaying(true);
      }
    };
  
    useEffect(() => {
      return () => { if (playing) window.speechSynthesis.cancel(); };
    }, [playing]);
  
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: C.surface3, borderRadius: 8, border: `1px solid ${C.border}` }}>
        <Icon name="doc" size={18} color={C.copper} />
        <div style={{ flex: 1, fontSize: 14, color: C.text }}>{af.name} <span style={{ color: C.textMuted, fontSize: 12 }}>— {af.size}</span></div>
        <Btn size="sm" variant="ghost" onClick={togglePlay}>
          <Icon name={playing ? "pause" : "play"} size={14} color={C.copper} /> {playing ? 'Pausar' : 'Reproducir'}
        </Btn>
      </div>
    );
  };
  const mod = modules[activeModule];
  const isLast = activeModule === modules.length - 1;
  const modContentKey = mod.contentIdx !== undefined ? `${activeCourse}_${mod.contentIdx}` : null;
  const modContent = modContentKey ? courseContent?.[modContentKey] : null;

  const goNext = () => {
    if (mod.type === 'quiz' && !passedQuizzes[`${activeCourse}_${activeModule}`]) {
      alert("Debes aprobar la prueba corta para avanzar.");
      return;
    }
    if (!isLast) {
      setActiveModule(a => a + 1);
      setMaxModule(m => Math.max(m, activeModule + 1));
    }
  };

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* Module sidebar */}
      <div style={{ width: 280, background: C.surface, borderRight: `1px solid ${C.border}`, overflow: 'auto', flexShrink: 0 }}>
        <div style={{ padding: '20px 20px 16px', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <div style={{ fontSize: 10, color: C.copper, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Inducción Mina Cabildo</div>
            <StyleToggle courseStyle={courseStyle} onStyleChange={onStyleChange} />
          </div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 18, fontWeight: 700, color: C.text }}>Módulos del curso</div>
          <div style={{ marginTop: 10 }}>
            <ProgressBar pct={Math.round((maxModule / modules.length) * 100)} color={C.copper} />
            <div style={{ fontSize: 11, color: C.textMuted, marginTop: 5 }}>{maxModule} de {modules.length} completados · {Math.round((maxModule / modules.length) * 100)}%</div>
          </div>
        </div>
        <div style={{ padding: '12px 12px' }}>
          {modules.map((m, i) => {
            const accessible = i <= maxModule; // access up to furthest reached
            return (
              <button key={m.id}
                onClick={() => accessible && setActiveModule(i)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                  borderRadius: 8, border: 'none',
                  cursor: accessible ? 'pointer' : 'not-allowed',
                  background: i === activeModule ? C.copper + '20' : 'transparent',
                  marginBottom: 2, textAlign: 'left',
                  opacity: accessible ? 1 : 0.35,
                }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', flexShrink: 0, background: m.done ? C.success : i === activeModule ? C.copper : C.surface3, border: `2px solid ${m.done ? C.success : i === activeModule ? C.copper : C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {m.done
                    ? <Icon name="check" size={12} color="white" />
                    : i > maxModule
                      ? <Icon name="lock" size={11} color={C.textMuted} />
                      : m.type === 'quiz' 
                        ? <Icon name="award" size={12} color={i === activeModule ? 'white' : C.textMuted} />
                        : <span style={{ fontSize: 10, color: i === activeModule ? 'white' : C.textMuted, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}>{m.id}</span>
                  }
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: i === activeModule ? 600 : 400, color: i === activeModule ? (m.type === 'quiz' ? C.warning : C.text) : C.silver, lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.title}</div>
                  <div style={{ fontSize: 10, color: C.textMuted, marginTop: 1 }}>
                    {i > maxModule ? 'Bloqueado' : m.duration}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
        {tabWarning && (
          <div style={{ background: C.danger, padding: '10px 24px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Icon name="warning" size={16} color="white" />
            <span style={{ fontSize: 13, color: 'white', fontWeight: 600 }}>⚠ Módulo pausado — Cambio de ventana detectado ({warnings} evento{warnings > 1 ? 's' : ''} registrado{warnings > 1 ? 's' : ''}). Regresa al curso.</span>
          </div>
        )}
        <div style={{ padding: 32, flex: 1 }}>
          {mod.type === 'quiz' ? (
            <div style={{ marginBottom: 24 }}>
              <MiniQuiz 
                courseId={activeCourse} 
                quizIndex={activeModule < 6 ? 0 : 1} 
                onPass={() => {
                  setPassedQuizzes(p => ({ ...p, [`${activeCourse}_${activeModule}`]: true }));
                  if (!isLast) setMaxModule(m => Math.max(m, activeModule + 1));
                }}
              />
            </div>
          ) : (
            <>
              {/* Video player */}
          <div style={{ borderRadius: 12, overflow: 'hidden', background: '#000', marginBottom: 24, position: 'relative', aspectRatio: '16/9' }}>
            {modContent?.videoUrl ? (
              <VideoPlayer url={modContent.videoUrl} />
            ) : (
              <div style={{ width: '100%', height: '100%', background: `linear-gradient(135deg, #0A1520 0%, ${C.copperDk || '#2a1a12'}55 50%, #0C1822 100%)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 360 }}>
                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.07 }} viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice">
                  {Array.from({ length: 30 }, (_, i) => (
                    <polygon key={i} points="40,0 80,23 80,69 40,92 0,69 0,23"
                      transform={`translate(${(i % 10) * 90 - 10}, ${Math.floor(i / 10) * 95 + (i % 2 === 0 ? 0 : 47)})`}
                      fill="none" stroke={C.copper} strokeWidth="1" />
                  ))}
                </svg>
                <div style={{ fontSize: 11, color: C.copper, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 16 }}>Módulo {mod?.id} — Video explicativo</div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 28, fontWeight: 700, color: C.text, textAlign: 'center', marginBottom: 8 }}>{mod?.title}</div>
                <div style={{ fontSize: 14, color: C.textMuted, marginBottom: 28 }}>{mod?.duration}</div>
                <button onClick={() => setIsPlayingDummy(v => !v)} style={{ width: 64, height: 64, borderRadius: '50%', background: C.copper + 'CC', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 32px ${C.copper}66`, transition: 'transform 0.2s' }}>
                  <Icon name={isPlayingDummy ? "pause" : "play"} size={28} color="white" />
                </button>
              </div>
            )}
            <div style={{ position: 'absolute', top: 12, right: 12, background: C.danger + 'CC', borderRadius: 6, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 6, zIndex: 10 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'white', animation: 'pulse 1.5s infinite' }} />
              <span style={{ fontSize: 11, color: 'white', fontWeight: 600 }}>CAM ACTIVA</span>
            </div>
            {!modContent?.videoUrl && (
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '8px 16px', background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', zIndex: 10 }}>
                <ProgressBar pct={videoProgress} color={C.copper} height={4} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 11, color: C.textMuted }}>
                  <span>3:50 / 10:00</span><span>{videoProgress}% completado</span>
                </div>
              </div>
            )}
          </div>

          {modContent?.text && (
            <div style={{ background: C.surface3, borderRadius: 10, padding: 24, marginBottom: 24, border: `1px solid ${C.border}`, fontSize: 15, color: C.silver, lineHeight: 1.6 }}>
              {modContent.text.split('\n').map((line, i) => <p key={i} style={{ margin: i === 0 ? 0 : '16px 0 0' }}>{line}</p>)}
            </div>
          )}

          {modContent?.audioFiles?.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 14, color: C.copper, fontWeight: 700, marginBottom: 12, fontFamily: "'Barlow Condensed', sans-serif" }}>AUDIOS DEL MÓDULO</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {modContent.audioFiles.map((af, i) => (
                  <AudioItem key={i} af={af} textToRead={modContent?.text} />
                ))}
              </div>
            </div>
          )}

          {modContent?.files?.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 14, color: C.copper, fontWeight: 700, marginBottom: 12, fontFamily: "'Barlow Condensed', sans-serif" }}>DOCUMENTOS ADJUNTOS</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {modContent.files.map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: C.surface3, borderRadius: 8, border: `1px solid ${C.border}` }}>
                    <Icon name="doc" size={18} color={C.copper} />
                    <div style={{ flex: 1, fontSize: 14, color: C.text }}>
                      {f.url ? (
                        <a href={f.url} target="_blank" rel="noopener noreferrer" style={{ color: C.copper, textDecoration: 'none', cursor: 'pointer' }}>
                          {f.name}
                        </a>
                      ) : (
                        f.name
                      )}
                      <span style={{ color: C.textMuted, fontSize: 12, marginLeft: 8 }}>— {f.size}</span>
                      {f.url && <span style={{ color: C.success, fontSize: 11, marginLeft: 8 }}>✓</span>}
                    </div>
                    {f.url ? (
                      <a href={f.url} download={f.name} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                        <Btn size="sm" variant="ghost">
                          <Icon name="download" size={14} color={C.copper} /> Descargar
                        </Btn>
                      </a>
                    ) : (
                      <Btn size="sm" variant="ghost" onClick={() => downloadSimulated(f.name)}>
                        <Icon name="download" size={14} color={C.copper} /> Descargar
                      </Btn>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {!modContent?.text && mod.type !== 'quiz' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
              {eppItems.map((item, i) => (
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
          )}
          </>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Btn variant="ghost" onClick={() => setActiveModule(a => Math.max(0, a - 1))} disabled={activeModule === 0}>
              ← Módulo anterior
            </Btn>
            {isLast
              ? <Btn onClick={() => onNav('quiz')} disabled={mod.type === 'quiz' && !passedQuizzes[`${activeCourse}_${activeModule}`]}>Ir a Evaluación Final <Icon name="chevron" size={15} color="white" /></Btn>
              : <Btn onClick={goNext} disabled={mod.type === 'quiz' && !passedQuizzes[`${activeCourse}_${activeModule}`]}>Siguiente módulo <Icon name="chevron" size={15} color="white" /></Btn>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

function ReelStyle({ onNav, tabWarning, warnings, courseStyle, onStyleChange }) {
  const cards = [
    { type: 'video', title: 'Riesgo de caída de rocas', tag: 'Riesgo crítico #1', bg: `linear-gradient(160deg, #0A1520, ${C.copperDk}66)` },
    { type: 'stat',  title: '94%', sub: 'de accidentes son prevenibles con EPP correcto', tag: 'Dato clave', bg: `linear-gradient(160deg, #0A1520, #1B2C1A)` },
    { type: 'info',  title: 'Zona roja: acceso restringido', sub: 'Solo personal autorizado con permiso de trabajo vigente', tag: 'Señalética', bg: `linear-gradient(160deg, #0A1520, #2C1B1A)` },
    { type: 'check', title: 'Revisión de EPP diaria', items: ['Casco sin grietas', 'Lentes limpios', 'Zapatos abrochados', 'Chaleco limpio'], tag: 'Check list', bg: `linear-gradient(160deg, #0A1520, #1A1B2C)` },
  ];
  const [cur, setCur] = useState(0);
  const card = cards[cur];

  const goNext = () => setCur(c => Math.min(cards.length - 1, c + 1));

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {tabWarning && (
        <div style={{ background: C.danger, padding: '8px 20px', fontSize: 13, color: 'white', fontWeight: 600 }}>
          ⚠ Módulo pausado — Cambio de ventana detectado ({warnings} evento{warnings > 1 ? 's' : ''} registrado{warnings > 1 ? 's' : ''})
        </div>
      )}
      <div style={{ flex: 1, display: 'flex', gap: 16, padding: 20, overflow: 'hidden' }}>
        <div style={{ width: 340, display: 'flex', flexDirection: 'column', gap: 12, overflow: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <div style={{ fontSize: 10, color: C.copper, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Inducción Mina Cabildo · Módulo 3</div>
            <StyleToggle courseStyle={courseStyle} onStyleChange={onStyleChange} />
          </div>
          {cards.map((c, i) => {
            const accessible = i <= cur;
            return (
              <div key={i} onClick={() => accessible && setCur(i)} style={{
                borderRadius: 12, padding: 20,
                cursor: accessible ? 'pointer' : 'not-allowed',
                border: `1px solid ${i === cur ? C.copper : C.border}`,
                background: i === cur ? C.copper + '15' : C.surface2,
                opacity: accessible ? 1 : 0.4,
                transition: 'all .2s',
              }}>
                <Badge color={i === cur ? C.copper : C.textMuted}>{c.tag}</Badge>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 20, fontWeight: 700, color: C.text, marginTop: 10 }}>{c.title}</div>
                {i > cur && <div style={{ fontSize: 11, color: C.textMuted, marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}><Icon name="lock" size={11} color={C.textMuted} /> Bloqueado</div>}
              </div>
            );
          })}
        </div>

        <div style={{ flex: 1, borderRadius: 16, background: card.bg, border: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 40, position: 'relative' }}>
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
            <Btn variant="ghost" size="sm" onClick={() => setCur(c => Math.max(0, c - 1))} disabled={cur === 0}>←</Btn>
            {cur < cards.length - 1
              ? <Btn size="sm" onClick={goNext}>Siguiente →</Btn>
              : <Btn size="sm" onClick={() => onNav('quiz')}>Ir a Evaluación →</Btn>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CoursePage({ courseStyle, onStyleChange, onNav, activeCourse = 'mina_cabildo' }) {
  const [showWarning, setShowWarning] = useState(true);
  const [activeModule, setActiveModule] = useState(2);
  const [maxModule, setMaxModule] = useState(2);
  const [passedQuizzes, setPassedQuizzes] = useState({});
  const [tabWarning, setTabWarning] = useState(false);
  const [warnings, setWarnings] = useState(0);
  const [courseContent, setCourseContent] = useState({});
  const [courseEnabled, setCourseEnabled] = useState({});
  const [contentLoaded, setContentLoaded] = useState(false);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch('/api/content?action=get', { cache: 'no-store' });
        const result = await response.json();
        const remoteContent = result?.data?.content;
        const remoteEnabled = result?.data?.courseEnabled;
        if (remoteContent && Object.keys(remoteContent).length > 0) {
          setCourseContent(remoteContent);
        }
        if (remoteEnabled) setCourseEnabled(remoteEnabled);
        setContentLoaded(true);
        return;
      } catch (err) {
        console.warn('Content API no disponible, usando localStorage:', err);
      }

      try {
        const saved = localStorage.getItem('gmlc_content');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.content) setCourseContent(parsed.content);
          if (parsed.courseEnabled) setCourseEnabled(parsed.courseEnabled);
        }
      } catch (e) {
        console.error('Error parsing content', e);
      }
      setContentLoaded(true);
    };
    loadContent();
  }, [activeCourse]);

  useEffect(() => {
    const onBlur  = () => { setTabWarning(true); setWarnings(w => w + 1); };
    const onFocus = () => setTabWarning(false);
    window.addEventListener('blur', onBlur);
    window.addEventListener('focus', onFocus);
    return () => { window.removeEventListener('blur', onBlur); window.removeEventListener('focus', onFocus); };
  }, []);

  const isDisabled = contentLoaded && courseEnabled && Object.keys(courseEnabled).length > 0 && courseEnabled[activeCourse] === false;

  if (isDisabled) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', padding: 40 }}>
        <div style={{ textAlign: 'center', maxWidth: 480 }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: C.warning + '22', border: `1px solid ${C.warning}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <Icon name="lock" size={28} color={C.warning} />
          </div>
          <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 12 }}>
            Curso no disponible aún
          </h2>
          <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.5, marginBottom: 24 }}>
            Este curso todavía no ha sido habilitado por el administrador. Vuelve más tarde o contacta a tu supervisor.
          </p>
          <Btn variant="ghost" onClick={() => onNav('dashboard')}>← Volver al panel</Btn>
        </div>
      </div>
    );
  }

  return (
    <>
      {showWarning && <EntryWarningModal onAccept={() => setShowWarning(false)} />}
      {courseStyle === 'reel'
        ? <ReelStyle onNav={onNav} tabWarning={tabWarning} warnings={warnings} courseStyle={courseStyle} onStyleChange={onStyleChange} />
        : <AulaStyle activeModule={activeModule} setActiveModule={setActiveModule} maxModule={maxModule} setMaxModule={setMaxModule} onNav={onNav} tabWarning={tabWarning} warnings={warnings} courseStyle={courseStyle} onStyleChange={onStyleChange} courseContent={courseContent} activeCourse={activeCourse} passedQuizzes={passedQuizzes} setPassedQuizzes={setPassedQuizzes} />
      }
    </>
  );
}
