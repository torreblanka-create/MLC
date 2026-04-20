import { useState } from 'react';
import { C } from '../tokens';

export { C };

export const Btn = ({ children, onClick, variant = 'primary', style = {}, disabled = false, size = 'md' }) => {
  const [hover, setHover] = useState(false);
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: '0.06em',
    textTransform: 'uppercase', border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
    borderRadius: 8, transition: 'all .18s', opacity: disabled ? 0.5 : 1,
    fontSize: size === 'sm' ? 13 : size === 'lg' ? 18 : 15,
    padding: size === 'sm' ? '7px 16px' : size === 'lg' ? '14px 32px' : '10px 22px',
  };
  const vars = {
    primary: { background: hover ? 'var(--copper-lt)' : 'var(--copper)', color: '#fff', boxShadow: hover ? `0 4px 20px var(--copper)66` : 'none' },
    ghost:   { background: hover ? 'var(--surface3)' : 'transparent', color: 'var(--silver-lt)', border: `1px solid var(--border)` },
    danger:  { background: hover ? '#E85F4D' : 'var(--danger)', color: '#fff' },
    success: { background: hover ? '#4DBB7B' : 'var(--success)', color: '#fff' },
    silver:  { background: hover ? 'var(--surface3)' : 'var(--surface2)', color: 'var(--silver-lt)', border: `1px solid var(--border)` },
  };
  return (
    <button style={{ ...base, ...(vars[variant] || vars.primary), ...style }}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      {children}
    </button>
  );
};

export const Card = ({ children, style = {}, onClick }) => (
  <div onClick={onClick} style={{
    background: 'var(--surface2)', border: `1px solid var(--border)`, borderRadius: 12,
    padding: 24, cursor: onClick ? 'pointer' : 'default',
    transition: 'border-color .2s', ...style,
  }}>{children}</div>
);

export const Badge = ({ children, color = 'var(--copper)', style = {} }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', padding: '3px 10px',
    borderRadius: 99, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
    textTransform: 'uppercase', background: color + '22', color,
    border: `1px solid ${color}44`, ...style,
  }}>{children}</span>
);

export const Tag = ({ label, value }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
    <span style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</span>
    <span style={{ fontSize: 14, color: 'var(--text)' }}>{value}</span>
  </div>
);

export const ProgressBar = ({ pct, color = 'var(--copper)', height = 6 }) => (
  <div style={{ background: 'var(--surface3)', borderRadius: 99, height, overflow: 'hidden', width: '100%' }}>
    <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 99, transition: 'width .4s' }} />
  </div>
);

export const Icon = ({ name, size = 18, color = 'currentColor' }) => {
  const icons = {
    user:     <svg width={size} height={size} fill="none" stroke={color} strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>,
    lock:     <svg width={size} height={size} fill="none" stroke={color} strokeWidth="1.8" viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/></svg>,
    camera:   <svg width={size} height={size} fill="none" stroke={color} strokeWidth="1.8" viewBox="0 0 24 24"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>,
    check:    <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2.2" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>,
    x:        <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2.2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>,
    chevron:  <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>,
    play:     <svg width={size} height={size} fill={color} viewBox="0 0 24 24"><path d="M5 3l14 9-14 9V3z"/></svg>,
    shield:   <svg width={size} height={size} fill="none" stroke={color} strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    mail:     <svg width={size} height={size} fill="none" stroke={color} strokeWidth="1.8" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></svg>,
    upload:   <svg width={size} height={size} fill="none" stroke={color} strokeWidth="1.8" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><path d="M17 8l-5-5-5 5"/><path d="M12 3v12"/></svg>,
    award:    <svg width={size} height={size} fill="none" stroke={color} strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>,
    warning:  <svg width={size} height={size} fill="none" stroke={color} strokeWidth="1.8" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    book:     <svg width={size} height={size} fill="none" stroke={color} strokeWidth="1.8" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>,
    folder:   <svg width={size} height={size} fill="none" stroke={color} strokeWidth="1.8" viewBox="0 0 24 24"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>,
    logout:   <svg width={size} height={size} fill="none" stroke={color} strokeWidth="1.8" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>,
    eye:      <svg width={size} height={size} fill="none" stroke={color} strokeWidth="1.8" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    settings: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
    users:    <svg width={size} height={size} fill="none" stroke={color} strokeWidth="1.8" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
    chart:    <svg width={size} height={size} fill="none" stroke={color} strokeWidth="1.8" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>,
    hard_hat: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="1.8" viewBox="0 0 24 24"><path d="M2 18h20M4 18v-4a8 8 0 0116 0v4"/><path d="M12 2v4"/><path d="M8 5.5L5 9"/><path d="M16 5.5L19 9"/></svg>,
    doc:      <svg width={size} height={size} fill="none" stroke={color} strokeWidth="1.8" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>,
  };
  return icons[name] || null;
};
