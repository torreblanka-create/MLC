# Deployment en Vercel - Guía Completa

## 🎯 Resumen Ejecutivo

**3 Problemas Resueltos:**
1. ✅ Documentación ahora **persiste en el servidor** (no se pierde)
2. ✅ Emails activan cursos **automáticamente** (detecta "Mina Cabildo", "Planta Cabildo", etc)
3. ✅ **Mensaje de éxito** al cargar archivos

**Costo Total: $0/mes (gratis en Vercel)** ✅

---

## 🚀 Dos Estrategias de Deployment (elige una)

### OPCIÓN A: Vercel Puro (Recomendado - 0% costo)

```
Vercel
├── Frontend React → GRATIS
├── API /api/content → GRATIS (serverless)
├── Almacenamiento → localStorage + Vercel KV (GRATIS)
└── Email pipe → Puedes dejarlo deshabilitado o en webhook
```

**Setup:**
```bash
npm install
vercel deploy
```

**Ventajas:**
- ✓ Un solo proveedor
- ✓ Deploy automático con `git push`
- ✓ HTTPS + CDN global
- ✓ $0/mes

**Limitación:**
- Email pipe sería manual o requeriría servicio externo

---

### OPCIÓN B: Vercel + Email Separado (Recomendado para email) - $3-10/mes

```
Vercel                          Hosting PHP
├── React frontend → $0         ├── Backend → $3-10/ms
├── API content → $0            ├── Email pipe → Auto
└── Conexión HTTPS → $0         └── cPanel email routing → $0
```

**Setup:**
```bash
# Vercel
vercel deploy

# Hosting PHP (cPanel)
1. Upload server/pipe_mail.php
2. Configurar email routing
3. Listo
```

**Ventajas:**
- ✓ Email totalmente automático
- ✓ Detección de cursos desde email
- ✓ Backend persistente
- ✓ Bajo costo ($3-10/ms)

---

## 📋 Instalación Paso a Paso (OPCIÓN A - Vercel)

### 1. Prepare Vercel

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login a Vercel
vercel login
```

### 2. Configura Entorno (opcional)

```bash
# .env.local (local testing)
# Si usas KV para persistencia:
VERCEL_KV_REST_API_URL=https://...
VERCEL_KV_REST_API_TOKEN=...
```

### 3. Deploy

```bash
vercel deploy

# O para auto-deploy en cada push:
git push origin main
# Vercel automáticamente detecta y deploya
```

### 4. Verifica

```
https://tu-proyecto.vercel.app
├── Admin Panel → Gestión de Contenidos
├── Carga un archivo → debe aparecer "Archivo cargado correctamente"
└── Contenido debe persistir entre recargas
```

---

## 📋 Instalación Paso a Paso (OPCIÓN B - Vercel + Email)

### 1. Deploy en Vercel (igual que Opción A)

```bash
vercel deploy
```

### 2. Hosting PHP (cPanel)

#### Paso 2.1: Upload del backend

```bash
# Conectarse al servidor
scp -r server/ usuario@host.com:public_html/induccion/

# O via cPanel File Manager:
# - Upload server/pipe_mail.php
# - Crear carpeta server/data/content/
```

#### Paso 2.2: Configurar Email Pipe en cPanel

1. **Ir a:** Email → Email Routing → induccionmlc@tu-dominio.cl
2. **Seleccionar:** "Pipe to a Program"
3. **Ingresar:**
   ```
   |/usr/bin/php /home/usuario/induccion/server/pipe_mail.php
   ```
4. **Guardar**

#### Paso 2.3: Permisos

```bash
# Via cPanel Terminal o SSH:
chmod 755 server/data/
chmod 755 server/data/content
chmod 644 server/data/content/all_content.json
chmod 644 server/data/mail.log
```

### 3. Verifica Email

Envía un email de prueba:
```
De: remitente-autorizado@gmlc.cl
Asunto: Inscripción Mina Cabildo
Adjunto: inscripcion.xlsx (con alumnos)
```

Verifica:
```bash
tail server/data/mail.log
# Debe mostrar:
# [TIMESTAMP] De: remitente-autorizado@gmlc.cl
# [TIMESTAMP] Cursos detectados desde email: mina_cabildo
# [TIMESTAMP] 3 alumnos inscritos
```

---

## 🔑 Características Implementadas

### 1. Persistencia de Documentación

**Flujo:**
```
Admin carga archivo
    ↓
React guarda en estado local
    ↓
API /api/content?action=save
    ↓
Vercel KV (o localStorage fallback)
    ↓
Usuario ve "Guardado ✓"
```

**Carga:**
```
Usuario abre admin
    ↓
React hace fetch /api/content?action=get
    ↓
Restaura contenidos previos
```

---

### 2. Detección Automática de Cursos

**Palabras clave detectadas:**
- "mina cabildo" → `mina_cabildo`
- "planta cabildo" → `planta_cabildo`
- "mina taltal" → `mina_taltal`
- "planta taltal" → `planta_taltal`

**Ejemplo de email funcional:**
```
Asunto: Inscripción Mina Cabildo y Planta Cabildo — abril 2026

Estimados,

Adjunto planilla con alumnos para inscribir en:
- Mina Cabildo
- Planta Cabildo

Saludos.
```

**Resultado:**
- Cada alumno se inscribe en AMBOS cursos
- Log muestra: "Cursos detectados: mina_cabildo, planta_cabildo"

---

### 3. Notificación de Carga

**Ubicación:** Panel Admin → Gestión de Contenidos → Archivos

**Comportamiento:**
1. Usuario carga archivo (drag-drop o clic)
2. Notificación verde: "Archivo cargado correctamente"
3. Desaparece en 3 segundos

---

## 🎨 Interfaces Nuevas / Modificadas

### Admin Panel - Gestión de Contenidos

**Indicadores de estado:**
```
[Guardar cambios] "Guardando..." → "Guardado ✓"

Área de archivos:
┌─────────────────────────────────────┐
│ ✓ Archivo cargado correctamente      │
│                                      │
│ [Arrastra archivos aquí...]          │
└─────────────────────────────────────┘
```

---

## 🔐 Seguridad

- ✓ API accesible solo desde dominio
- ✓ Email pipe solo procesa remitentes autorizados
- ✓ Datos guardados en JSON (con backup recomendado)
- ✓ HTTPS obligatorio en Vercel

---

## 📊 Testing

### Test 1: Persistencia

```bash
# 1. Carga archivo
# Panel Admin → Gestión Contenidos → cargar "test.pdf"

# 2. Recarga página
# Archivo debe seguir ahí

# 3. Limpia cache/cookies
# Archivo sigue persistiendo ✓
```

### Test 2: Cursos por Email

```bash
# 1. Envía email con:
# Asunto: "Inscripción Mina Cabildo y Planta Cabildo"
# Excel: 3 alumnos

# 2. Espera 1 minuto

# 3. Verifica:
# Panel Admin → Alumnos Inscritos
# Cada alumno debe tener 2 cursos ✓
```

### Test 3: Notificación

```bash
# 1. Panel Admin → Gestión Contenidos
# 2. Carga un archivo
# 3. Debe aparecer mensaje verde ✓
```

---

## 🚨 Troubleshooting

### Problem: "Archivo cargado correctamente" pero no aparece

**Solución:**
```
1. Abre DevTools (F12)
2. Pestaña "Network"
3. Busca request a /api/content
4. Si está en rojo, revisar logs de Vercel
```

### Problem: Email recibido pero cursos no se detectan

**Solución:**
```
1. Verifica asunto tiene "Mina Cabildo" (sensible a mayús/minús)
2. Revisa log: tail server/data/mail.log
3. Busca línea: "Cursos detectados desde email:"
4. Si no aparece, email no contiene palabras clave
```

### Problem: Vercel API devuelve 404

**Solución:**
```
1. Verifica que /api/content.js existe
2. Ejecuta: vercel env pull
3. Redeploy: vercel deploy --prod
```

---

## 📁 Estructura Final

```
.
├── api/
│   └── content.js              (Vercel serverless - persistencia)
├── server/
│   ├── pipe_mail.php           (Email pipe - actualizado)
│   ├── api_content.php         (Backup para hosting PHP)
│   └── data/
│       ├── content/
│       │   └── all_content.json
│       ├── processed/
│       ├── rejected/
│       └── mail.log
├── src/
│   └── pages/
│       └── ContentPage.jsx     (actualizado - persistencia)
├── SOLUTION_SUMMARY.md
├── DEPLOYMENT_NOTES.md
└── VERCEL_DEPLOYMENT.md
```

---

## ✅ Checklist Pre-Deploy

- [ ] `npm run build` ejecuta sin errores
- [ ] `api/content.js` presente en raíz
- [ ] `src/pages/ContentPage.jsx` actualizado
- [ ] `server/pipe_mail.php` con función detectar_cursos
- [ ] Variables de entorno configuradas (si usas KV)
- [ ] Tests pasados (persistencia, cursos, notificaciones)
- [ ] Vercel CLI instalado y autenticado
- [ ] Dominio configurado en Vercel (opcional)

---

## 🎉 Resultado Final

**Antes de los cambios:**
- ❌ Documentación se perdía en Vercel
- ❌ Cursos se asignaban solo manualmente
- ❌ Sin feedback al cargar archivos

**Después de los cambios:**
- ✅ Documentación persiste en servidor
- ✅ Cursos se activan automáticamente por email
- ✅ Notificación visual de carga exitosa
- ✅ **Costo: $0/mes**

---

**Última actualización:** 2026-04-21  
**Estado:** Listo para producción
