import { C, Btn, Badge, Icon } from '../components/Shared';
import { useState } from 'react';

export default function CertificatePage() {
  const [descargando, setDescargando] = useState(false);

  const descargarPDF = async () => {
    setDescargando(true);
    try {
      const res = await fetch('/api/generate_certificate.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rut: '14.523.867-3', // desde contexto del usuario
          curso: 'mina_cabildo',
          calificacion: 93
        })
      });

      if (!res.ok) throw new Error('Error al generar certificado');

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Certificado_14.523.867-3.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Error al descargar el certificado');
    } finally {
      setDescargando(false);
    }
  };

  const enviarEmail = async () => {
    alert('Funcionalidad de envío por email próximamente disponible');
  };

  return (
    <div style={{ padding: 40, maxWidth: 800 }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Badge color={C.success}>Aprobado · 93%</Badge>
          <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 32, fontWeight: 800, color: C.text, marginTop: 8 }}>Certificado de Aprobación</h1>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Btn variant="ghost" size="sm" onClick={enviarEmail}><Icon name="mail" size={14} color={C.silver} /> Enviar por email</Btn>
          <Btn size="sm" onClick={descargarPDF} disabled={descargando}><Icon name="doc" size={14} color="white" /> {descargando ? 'Generando...' : 'Descargar PDF'}</Btn>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: 12, overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.4)', border: `1px solid ${C.border}` }}>
        {/* Header */}
        <div style={{ background: `linear-gradient(135deg, #0C1520 0%, #1B2A3E 50%, ${C.copperDk} 100%)`, padding: '32px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <img src="/assets/logo-lc.png" alt="Tecktur SpA" style={{ height: 52, filter: 'brightness(1.2)' }} />
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Certificado N°</div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 18, color: C.copper, fontWeight: 700 }}>GLC-2025-04-1847</div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '40px 48px', textAlign: 'center' }}>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7A6A50', marginBottom: 8 }}>
            Tecktur SpA certifica que
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

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
            <div style={{ flex: 1, height: 1, background: '#E0D4C0' }} />
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.copper }} />
            <div style={{ flex: 1, height: 1, background: '#E0D4C0' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ height: 48, borderBottom: '1px solid #CCC', marginBottom: 6, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 4 }}>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: '#333' }}>Rodrigo Contreras V.</div>
              </div>
              <div style={{ fontSize: 11, color: '#888' }}>Rodrigo Contreras Vargas</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.copperDk }}>Prevencionista de Riesgos</div>
              <div style={{ fontSize: 10, color: '#999' }}>Reg. MINSAL N° 45.281</div>
              <Badge color={C.copper} style={{ marginTop: 8 }}>✓ Firma Digital Avanzada</Badge>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ height: 48, borderBottom: '1px solid #CCC', marginBottom: 6, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 4 }}>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: '#333' }}>Felipe Mora A.</div>
              </div>
              <div style={{ fontSize: 11, color: '#888' }}>Felipe Mora Araya</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.copperDk }}>Gerente de Operaciones</div>
              <div style={{ fontSize: 10, color: '#999' }}>Tecktur SpA</div>
            </div>
          </div>

          <div style={{ marginTop: 32, paddingTop: 20, borderTop: '1px solid #EEE', fontSize: 11, color: '#AAA', display: 'flex', justifyContent: 'space-between' }}>
            <span>Emisión: 19 de abril de 2025</span>
            <span>Válido por 24 meses</span>
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
}
