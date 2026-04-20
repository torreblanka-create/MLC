import { useState, useEffect } from 'react';
import { Btn, Card, Badge, Icon } from '../components/Shared';
const C = { copper: 'var(--copper)', text: 'var(--text)', textMuted: 'var(--text-muted)', danger: 'var(--danger)', warning: 'var(--warning)', success: 'var(--success)', surface: 'var(--surface)', surface2: 'var(--surface2)', surface3: 'var(--surface3)', border: 'var(--border)', silver: 'var(--silver)', silverLt: 'var(--silver-lt)', copperLt: 'var(--copper-lt)' };

const COURSES = [
  { id: 'mina_cabildo',   label: 'Mina Cabildo' },
  { id: 'mina_taltal',    label: 'Mina Taltal' },
  { id: 'planta_cabildo', label: 'Planta Cabildo' },
  { id: 'planta_taltal',  label: 'Planta Taltal' },
];

const MODULE_TITLES = [
  'Introducción a la seguridad minera',
  'Riesgos críticos en faena subterránea',
  'Equipos de protección personal (EPP)',
  'Procedimientos de emergencia',
  'Señalética y zonas de peligro',
  'Comunicación en faena',
  'Normativa y reglamento interno',
  'Revisión y cierre',
];

// Pre-populated mock content
const initialContent = {
  'mina_cabildo_0': {
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    audioFiles: [{ name: 'intro_audio.mp3', size: '2.4 MB' }],
    text: 'Bienvenido a la inducción de Mina Cabildo. Este módulo cubre los principios fundamentales de seguridad en operaciones mineras subterráneas. El objetivo principal es que cada trabajador comprenda los protocolos básicos de seguridad antes de ingresar a faena.',
    files: [
      { name: 'EPP_Requisitos.pdf', size: '1.2 MB' },
      { name: 'Reglamento_Interno_v3.pdf', size: '3.8 MB' },
    ],
  },
  'mina_cabildo_1': {
    videoUrl: 'https://vimeo.com/123456789',
    audioFiles: [],
    text: 'Los riesgos críticos en faena subterránea incluyen: caída de rocas, atrapamiento por equipos, exposición a gases nocivos y trabajo en espacios confinados. Cada trabajador debe conocer los protocolos de respuesta para cada uno de estos escenarios.',
    files: [
      { name: 'Mapa_Riesgos_Cabildo.pdf', size: '2.1 MB' },
    ],
  },
  'mina_cabildo_2': {
    videoUrl: '',
    audioFiles: [{ name: 'epp_instrucciones.mp3', size: '1.8 MB' }],
    text: 'El equipo de protección personal obligatorio en Mina Cabildo incluye: casco clase A, lentes de seguridad certificados ANSI Z87.1, calzado con punta de acero, chaleco reflectante clase 2 y protección auditiva en zonas de ruido elevado.',
    files: [
      { name: 'Catalogo_EPP_GMLC.pdf', size: '4.5 MB' },
      { name: 'Check_EPP_Diario.jpg', size: '0.3 MB' },
    ],
  },
  'mina_taltal_0': {
    videoUrl: 'https://www.youtube.com/watch?v=abc123',
    audioFiles: [],
    text: 'Introducción a las operaciones de Mina Taltal. El contexto geológico y climático costero presenta desafíos únicos que requieren protocolos específicos de seguridad.',
    files: [
      { name: 'Intro_Taltal.pdf', size: '1.9 MB' },
    ],
  },
};

export default function ContentPage() {
  const [activeCourse, setActiveCourse] = useState('mina_cabildo');
  const [activeModule, setActiveModule] = useState(0);
  const [content, setContent] = useState(() => {
    const saved = localStorage.getItem('gmlc_content');
    return saved ? JSON.parse(saved) : initialContent;
  });

  // Guardar en localStorage cuando content cambie
  useEffect(() => {
    localStorage.setItem('gmlc_content', JSON.stringify(content));
  }, [content]);
  const [newAudioUrl, setNewAudioUrl] = useState('');
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [courseEnabled, setCourseEnabled] = useState({
    mina_cabildo: true,
    mina_taltal: false,
    planta_cabildo: false,
    planta_taltal: false,
  });

  const handleSaveGeneral = () => {
    // Al guardar, se habilita automáticamente para el alumno según requerimiento
    setCourseEnabled(prev => ({ ...prev, [activeCourse]: true }));
    alert(`Cambios guardados exitosamente.\nEl curso "${COURSES.find(c => c.id === activeCourse)?.label}" ahora está habilitado para los alumnos.`);
  };

  const key = `${activeCourse}_${activeModule}`;
  const mod = content[key] || { videoUrl: '', audioFiles: [], text: '', files: [] };

  const update = (patch) => {
    setContent(prev => ({
      ...prev,
      [key]: { ...mod, ...patch },
    }));
  };

  const hasContent = (courseId, modIdx) => {
    const k = `${courseId}_${modIdx}`;
    const m = content[k];
    if (!m) return false;
    return !!(m.videoUrl || m.text || (m.audioFiles && m.audioFiles.length) || (m.files && m.files.length));
  };

  const addAudioFile = () => {
    if (!newAudioUrl.trim()) return;
    const name = newAudioUrl.split('/').pop() || 'audio_file.mp3';
    update({ audioFiles: [...(mod.audioFiles || []), { name, size: '— MB' }] });
    setNewAudioUrl('');
  };

  const removeAudio = (idx) => {
    const files = [...(mod.audioFiles || [])];
    files.splice(idx, 1);
    update({ audioFiles: files });
  };

  const removeFile = (idx) => {
    const files = [...(mod.files || [])];
    files.splice(idx, 1);
    update({ files });
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer?.files || []);
    if (!dropped.length) return;
    const newFiles = dropped.map(f => ({ name: f.name, size: (f.size / 1024 / 1024).toFixed(1) + ' MB' }));
    update({ files: [...(mod.files || []), ...newFiles] });
  };

  const mockFileInput = () => {
    const mockFile = { name: 'Documento_Nuevo.pdf', size: '0.9 MB' };
    update({ files: [...(mod.files || []), mockFile] });
  };

  const inputStyle = {
    width: '100%', boxSizing: 'border-box',
    background: C.surface3, border: `1px solid ${C.border}`,
    borderRadius: 8, color: C.text, padding: '10px 14px',
    fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: 'none',
  };

  return (
    <div style={{ padding: 40, maxWidth: 1200 }}>
      {/* Header */}
      <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 11, color: C.copper, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Administración</div>
          <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 36, fontWeight: 800, color: C.text, margin: 0 }}>
            Gestión de Contenidos
          </h1>
          <p style={{ fontSize: 13, color: C.textMuted, marginTop: 6 }}>
            Carga y organiza el material de cada módulo por faena
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
          <Btn onClick={handleSaveGeneral} style={{ padding: '10px 24px', fontSize: 14, background: C.copper, color: '#000', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>
            Guardar cambios generales
          </Btn>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} onClick={(e) => { e.preventDefault(); setCourseEnabled(prev => ({ ...prev, [activeCourse]: !prev[activeCourse] })); }}>
            <div style={{ position: 'relative', width: 36, height: 20, background: courseEnabled[activeCourse] ? C.success : C.surface3, borderRadius: 10, transition: 'background .2s' }}>
              <div style={{ position: 'absolute', top: 2, left: courseEnabled[activeCourse] ? 18 : 2, width: 16, height: 16, background: 'white', borderRadius: '50%', transition: 'left .2s' }} />
            </div>
            <span style={{ fontSize: 13, color: courseEnabled[activeCourse] ? C.success : C.textMuted, fontWeight: courseEnabled[activeCourse] ? 600 : 400 }}>
              {courseEnabled[activeCourse] ? 'Habilitado para alumnos' : 'Deshabilitado para alumnos'}
            </span>
          </label>
        </div>
      </div>

      {/* Course selector tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 28, borderBottom: `1px solid ${C.border}`, paddingBottom: 0 }}>
        {COURSES.map(c => (
          <button key={c.id} onClick={() => { setActiveCourse(c.id); setActiveModule(0); }} style={{
            padding: '10px 20px', border: 'none', background: 'transparent', cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif", fontSize: 14,
            fontWeight: activeCourse === c.id ? 700 : 400,
            color: activeCourse === c.id ? C.copperLt : C.textMuted,
            borderBottom: `2px solid ${activeCourse === c.id ? C.copper : 'transparent'}`,
            marginBottom: -1, transition: 'all .15s',
          }}>{c.label}</button>
        ))}
      </div>

      {/* Two-column layout */}
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>

        {/* Left: Module list */}
        <div style={{ width: 260, flexShrink: 0 }}>
          <Card style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '14px 16px', borderBottom: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 11, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                Módulos — {COURSES.find(c => c.id === activeCourse)?.label}
              </div>
            </div>
            {MODULE_TITLES.map((title, idx) => {
              const isActive = activeModule === idx;
              const hasCont = hasContent(activeCourse, idx);
              const circleColor = isActive ? C.copper : hasCont ? C.success : C.surface3;
              const circleBorder = isActive ? C.copper : hasCont ? C.success : C.border;
              return (
                <button key={idx} onClick={() => setActiveModule(idx)} style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '12px 16px', border: 'none', cursor: 'pointer',
                  background: isActive ? C.copper + '15' : 'transparent',
                  borderBottom: `1px solid ${C.border}`, textAlign: 'left',
                  transition: 'background .15s',
                }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                    background: circleColor, border: `2px solid ${circleBorder}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {hasCont && !isActive
                      ? <Icon name="check" size={12} color="white" />
                      : <span style={{ fontSize: 10, color: isActive ? 'white' : C.textMuted, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}>{idx + 1}</span>
                    }
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: isActive ? 600 : 400, color: isActive ? C.text : C.silver, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {title}
                    </div>
                    <div style={{ marginTop: 3 }}>
                      {hasCont
                        ? <Badge color={C.success} style={{ fontSize: 9, padding: '1px 6px' }}>Con contenido</Badge>
                        : <Badge color={C.textMuted} style={{ fontSize: 9, padding: '1px 6px' }}>Sin contenido</Badge>
                      }
                    </div>
                  </div>
                </button>
              );
            })}
          </Card>
        </div>

        {/* Right: Content editor */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: C.copper + '20', border: `1px solid ${C.copper}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, color: C.copper, fontSize: 14 }}>{activeModule + 1}</span>
            </div>
            <div>
              <div style={{ fontSize: 11, color: C.copper, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Editando módulo</div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 20, fontWeight: 700, color: C.text }}>{MODULE_TITLES[activeModule]}</div>
            </div>
          </div>

          {/* Section 1 — Video */}
          <Card>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, fontWeight: 700, color: C.copper, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="play" size={16} color={C.copper} /> Video
            </div>
            <div style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 12, color: C.textMuted, display: 'block', marginBottom: 6 }}>URL del video (YouTube, Vimeo, MP4 directo)</label>
              <input
                value={mod.videoUrl || ''}
                onChange={e => update({ videoUrl: e.target.value })}
                placeholder="https://www.youtube.com/watch?v=..."
                style={inputStyle}
              />
              <div style={{ fontSize: 11, color: C.textMuted, marginTop: 5 }}>
                Formatos soportados: YouTube, Vimeo, MP4 · Recomendado: 720p mínimo
              </div>
            </div>
            {/* Video preview */}
            <div style={{
              background: '#0A1218', borderRadius: 10, aspectRatio: '16/9', maxHeight: 220,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: `1px solid ${C.border}`, marginBottom: 12, position: 'relative', overflow: 'hidden',
            }}>
              {mod.videoUrl ? (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: C.copper + '33', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                    <Icon name="play" size={22} color={C.copper} />
                  </div>
                  <div style={{ fontSize: 12, color: C.copper, fontFamily: 'monospace', padding: '0 16px', wordBreak: 'break-all' }}>{mod.videoUrl}</div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', color: C.textMuted }}>
                  <Icon name="play" size={28} color={C.textMuted} />
                  <div style={{ fontSize: 13, marginTop: 8 }}>Vista previa del video</div>
                </div>
              )}
            </div>
            <Btn size="sm" onClick={() => {/* save is automatic via state */}}>Guardar URL</Btn>
          </Card>

          {/* Section 2 — Audio */}
          <Card>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, fontWeight: 700, color: C.copper, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="doc" size={16} color={C.copper} /> Audio complementario
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <input
                value={newAudioUrl}
                onChange={e => setNewAudioUrl(e.target.value)}
                placeholder="URL del archivo de audio..."
                style={{ ...inputStyle, flex: 1 }}
              />
              <Btn size="sm" onClick={addAudioFile}>Agregar</Btn>
            </div>
            <button onClick={() => {
              update({ audioFiles: [...(mod.audioFiles || []), { name: 'audio_modulo_' + (activeModule + 1) + '.mp3', size: '2.2 MB' }] });
            }} style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '9px 16px',
              background: C.surface3, border: `1px dashed ${C.border}`, borderRadius: 8,
              color: C.textMuted, fontSize: 13, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', marginBottom: 12,
            }}>
              <Icon name="upload" size={14} color={C.textMuted} /> Subir archivo MP3/WAV
            </button>
            {(mod.audioFiles || []).length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {(mod.audioFiles || []).map((af, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px 5px 12px',
                    background: C.surface3, border: `1px solid ${C.border}`, borderRadius: 20, fontSize: 12, color: C.text,
                  }}>
                    <Icon name="doc" size={12} color={C.copper} />
                    {af.name} <span style={{ color: C.textMuted }}>— {af.size}</span>
                    <button onClick={() => removeAudio(i)} style={{
                      border: 'none', background: 'transparent', cursor: 'pointer', padding: '0 0 0 4px', color: C.textMuted, display: 'flex', alignItems: 'center',
                    }}>
                      <Icon name="x" size={12} color={C.textMuted} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Section 3 — Text */}
          <Card>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, fontWeight: 700, color: C.copper, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="doc" size={16} color={C.copper} /> Material de lectura
            </div>
            <textarea
              value={mod.text || ''}
              onChange={e => update({ text: e.target.value })}
              placeholder="Escribe o pega el contenido del módulo aquí. Soporta texto enriquecido básico."
              rows={8}
              style={{
                ...inputStyle, resize: 'vertical', minHeight: 200, lineHeight: 1.6,
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
              <span style={{ fontSize: 12, color: C.textMuted }}>{(mod.text || '').length} caracteres</span>
              <Btn size="sm" onClick={() => {/* save is automatic via state */}}>Guardar texto</Btn>
            </div>
          </Card>

          {/* Section 4 — Files */}
          <Card>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, fontWeight: 700, color: C.copper, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="folder" size={16} color={C.copper} /> Archivos adjuntos (PDF, imágenes)
            </div>
            {/* Drop zone */}
            <div
              onDrop={handleFileDrop}
              onDragOver={e => e.preventDefault()}
              onClick={mockFileInput}
              style={{
                border: `2px dashed ${C.border}`, borderRadius: 10, padding: '28px 20px',
                textAlign: 'center', cursor: 'pointer', marginBottom: 16,
                background: C.surface3, transition: 'border-color .15s',
              }}
            >
              <Icon name="upload" size={24} color={C.textMuted} />
              <div style={{ fontSize: 13, color: C.textMuted, marginTop: 10 }}>
                Arrastra archivos aquí o haz clic para seleccionar
              </div>
              <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>
                Acepta: .pdf, .jpg, .png, .docx
              </div>
            </div>
            {/* File list */}
            {(mod.files || []).length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {(mod.files || []).map((f, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                    background: C.surface3, border: `1px solid ${C.border}`, borderRadius: 8,
                  }}>
                    <Icon name="doc" size={16} color={C.copper} />
                    <div style={{ flex: 1, fontSize: 13, color: C.text }}>
                      {f.name}
                      <span style={{ color: C.textMuted, fontSize: 12, marginLeft: 8 }}>— {f.size}</span>
                    </div>
                    <Btn size="sm" variant="ghost">
                      <Icon name="upload" size={12} color={C.silver} />
                    </Btn>
                    <Btn size="sm" variant="danger" onClick={() => removeFile(i)}>
                      <Icon name="x" size={12} color="white" />
                    </Btn>
                  </div>
                ))}
              </div>
            )}
            {(mod.files || []).length === 0 && (
              <div style={{ fontSize: 13, color: C.textMuted, textAlign: 'center', padding: '8px 0' }}>
                Sin archivos adjuntos aún
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
