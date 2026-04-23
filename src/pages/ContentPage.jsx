import { useState, useEffect, useRef } from 'react';
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
  const [content, setContent] = useState(initialContent);
  const [loading, setLoading] = useState(true);
  const [savingStatus, setSavingStatus] = useState(null);
  const [fileUploadStatus, setFileUploadStatus] = useState(null);

  // Cargar contenido desde el servidor al iniciar
  useEffect(() => {
    const loadContent = async () => {
      try {
        // Cargar contenido desde API Vercel
        const response = await fetch('/api/content?action=get');
        const result = await response.json();
        if (result.data && Object.keys(result.data).length > 0) {
          setContent(result.data);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.log('Server API not available:', err);
      }

      // Fallback a localStorage
      try {
        const saved = localStorage.getItem('gmlc_content');
        if (saved) {
          setContent(JSON.parse(saved));
        }
      } catch (err) {
        console.error('Error loading from localStorage:', err);
      }
      setLoading(false);
    };
    loadContent();
  }, []);

  // Guardar contenido en el servidor cuando cambie
  useEffect(() => {
    if (loading) return;
    const saveContent = async () => {
      try {
        setSavingStatus('saving');

        const response = await fetch('/api/content?action=save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: content, action: 'save' }),
        });

        if (response.ok) {
          setSavingStatus('saved');
          setTimeout(() => setSavingStatus(null), 2000);
          return;
        }

        // Fallback a localStorage si el servidor no está disponible
        localStorage.setItem('gmlc_content', JSON.stringify(content));
        setSavingStatus('saved');
        setTimeout(() => setSavingStatus(null), 2000);
      } catch (err) {
        console.error('Error saving content:', err);
        setSavingStatus('error');
      }
    };
    const timer = setTimeout(saveContent, 1000);
    return () => clearTimeout(timer);
  }, [content, loading]);
  const [newAudioUrl, setNewAudioUrl] = useState('');
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [courseEnabled, setCourseEnabled] = useState({
    mina_cabildo: true,
    mina_taltal: false,
    planta_cabildo: false,
    planta_taltal: false,
  });
  const fileInputRef = useRef(null);

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

  const uploadFileToBlob = async (file) => {
    setFileUploadStatus('uploading');
    try {
      const reader = new FileReader();
      reader.onerror = () => {
        console.error('FileReader error:', reader.error);
        setFileUploadStatus('error');
        setTimeout(() => setFileUploadStatus(null), 3000);
      };
      reader.onload = async (e) => {
        try {
          const base64Data = e.target.result;
          const base64 = base64Data.includes(',') ? base64Data.split(',')[1] : base64Data;

          if (!base64) {
            throw new Error('Failed to read file');
          }

          const uploadData = {
            filename: file.name,
            data: base64,
            moduleKey: key,
          };

          console.log('Uploading:', { filename: file.name, moduleKey: key, dataLength: base64.length });

          const response = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(uploadData),
          });

          const result = await response.json();

          console.log('Upload response:', { status: response.status, ok: response.ok, result });

          if (!response.ok) {
            throw new Error(result.error || result.details || `Upload failed: ${response.status}`);
          }

          if (!result.url && !result.ok) {
            throw new Error('No URL returned from server');
          }

          const fileUrl = result.url || `/uploads/${key}/${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

          const newFile = {
            name: file.name,
            size: (file.size / 1024 / 1024).toFixed(1) + ' MB',
            url: fileUrl,
          };
          update({ files: [...(mod.files || []), newFile] });
          setFileUploadStatus('success');
          setTimeout(() => setFileUploadStatus(null), 3000);
        } catch (err) {
          console.error('Upload processing error:', err);
          setFileUploadStatus('error');
          setTimeout(() => setFileUploadStatus(null), 4000);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('File read error:', err);
      setFileUploadStatus('error');
      setTimeout(() => setFileUploadStatus(null), 3000);
    }
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer?.files || []);
    if (!dropped.length) return;
    dropped.forEach(f => uploadFileToBlob(f));
  };

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) {
      setFileUploadStatus('error');
      setTimeout(() => setFileUploadStatus(null), 3000);
      return;
    }
    files.forEach(f => uploadFileToBlob(f));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileInput = () => {
    fileInputRef.current?.click();
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
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Btn onClick={handleSaveGeneral} style={{ padding: '10px 24px', fontSize: 14, background: C.copper, color: '#000', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>
              Guardar cambios generales
            </Btn>
            {savingStatus === 'saving' && (
              <span style={{ fontSize: 12, color: C.textMuted }}>Guardando...</span>
            )}
            {savingStatus === 'saved' && (
              <span style={{ fontSize: 12, color: C.success, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: C.success, display: 'inline-block' }} />
                Guardado
              </span>
            )}
          </div>
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

            {/* Upload notifications */}
            {fileUploadStatus === 'uploading' && (
              <div style={{
                background: C.warning + '15', border: `1px solid ${C.warning}44`, borderRadius: 8,
                padding: '12px 14px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8
              }}>
                <div style={{ width: 16, height: 16, borderRadius: '50%', border: `2px solid ${C.warning}`, borderTop: `2px solid transparent`, animation: 'spin 1s linear infinite' }} />
                <span style={{ fontSize: 13, color: C.warning, fontWeight: 600 }}>Cargando archivo...</span>
              </div>
            )}
            {fileUploadStatus === 'success' && (
              <div style={{
                background: C.success + '15', border: `1px solid ${C.success}44`, borderRadius: 8,
                padding: '12px 14px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8
              }}>
                <Icon name="check" size={16} color={C.success} />
                <span style={{ fontSize: 13, color: C.success, fontWeight: 600 }}>Archivo cargado correctamente</span>
              </div>
            )}
            {fileUploadStatus === 'error' && (
              <div style={{
                background: C.danger + '15', border: `1px solid ${C.danger}44`, borderRadius: 8,
                padding: '12px 14px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8
              }}>
                <Icon name="warning" size={16} color={C.danger} />
                <span style={{ fontSize: 13, color: C.danger, fontWeight: 600 }}>Error al cargar archivo. Intenta de nuevo.</span>
              </div>
            )}

            {/* Drop zone */}
            <div
              onDrop={handleFileDrop}
              onDragOver={e => e.preventDefault()}
              onClick={openFileInput}
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
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.docx"
              onChange={handleFileInputChange}
              style={{ display: 'none' }}
            />
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
                      {f.url ? (
                        <a href={f.url} target="_blank" rel="noopener noreferrer" style={{ color: C.copper, textDecoration: 'none', cursor: 'pointer' }}>
                          {f.name}
                        </a>
                      ) : (
                        f.name
                      )}
                      <span style={{ color: C.textMuted, fontSize: 12, marginLeft: 8 }}>— {f.size}</span>
                      {f.url && <span style={{ color: C.success, fontSize: 11, marginLeft: 8 }}>✓ Guardado</span>}
                    </div>
                    {f.url && (
                      <a href={f.url} target="_blank" rel="noopener noreferrer">
                        <Btn size="sm" variant="ghost">
                          <Icon name="download" size={12} color={C.silver} />
                        </Btn>
                      </a>
                    )}
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
