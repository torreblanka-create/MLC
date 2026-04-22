# 🚀 Actualizar App en Vercel (Manual)

## ✅ Estado Actual

- **GitHub:** ✅ Actualizado (commit `4fac3c6`)
- **Vercel:** ❌ Necesita redeploy manual
- **Build Local:** ✅ Compila correctamente

---

## 📋 Opción 1: Deploy desde Dashboard Vercel (Más Fácil)

### Paso 1: Ir a Vercel Dashboard
```
https://vercel.com/dashboard
```

### Paso 2: Selecciona tu proyecto MLC
- Click en el proyecto "MLC" o similar

### Paso 3: Click en "Redeploy"
- Arriba a la derecha, busca botón "Redeploy"
- O ve a "Deployments" tab
- Click en "Redeploy" en el último deployment

### Paso 4: Confirma
- Espera ~2-3 minutos a que compile
- Debería pasar a estado "Ready"

**¡Listo!** La app está actualizada ✅

---

## 📋 Opción 2: Deploy Automático (Recomendado)

Para que se auto-actualice cada vez que hagas `git push`:

### Paso 1: Vercel Dashboard
```
https://vercel.com/dashboard
```

### Paso 2: Project Settings
- Selecciona MLC
- Click en "Settings"

### Paso 3: Git Configuration
- Busca sección "Git Deployments"
- Verifica que GitHub esté conectado
- Verifica que "Deploy on Push" esté **ENABLED** (verde)

### Paso 4: Confirma
```bash
# En tu terminal local:
git log --oneline -1
# Debería mostrar:
# 4fac3c6 Feat: Resolver 3 problemas críticos...

# Si ves eso, GitHub está actualizado ✅
```

---

## 📋 Opción 3: Deploy CLI Vercel (Para desarrolladores)

Si tienes Vercel CLI instalado:

```bash
# Login si no lo has hecho
vercel login

# Deploy
vercel deploy --prod

# O redeploy sin cambios
vercel deploy --prod --force
```

---

## 🔍 Verificar que se Actualizó

### 1. Abre la app
```
https://induccion.vercel.app
(o tu dominio personalizado)
```

### 2. Ve al Panel Admin
- Login con RUT que empiece en 12
- Ir a "Gestión de Contenidos"

### 3. Prueba las 3 funciones nuevas

**Test 1: Carga archivo**
```
→ Debe aparecer mensaje verde:
  "✓ Archivo cargado correctamente"
```

**Test 2: Persistencia**
```
→ Carga un archivo
→ Recarga la página (F5)
→ El archivo debe seguir ahí ✅
```

**Test 3: Email automático**
```
→ Envía email con:
  Asunto: "Inscripción Mina Cabildo y Planta Cabildo"
  Adjunto: Excel con alumnos
  
→ Cada alumno debe tener ambos cursos ✅
```

---

## ❌ Si NO se Actualiza

### Problema: Vercel dice "Building" pero tarda mucho

**Solución:**
```bash
# En local, verifica que build funciona:
npm ci
npm run build

# Si hay error, muestra el error aquí
```

### Problema: Vercel dice "Build failed"

**Solución:**
```bash
# Verifica que no hay errores de sintaxis:
npm run build

# Si hay error, debería aparecer aquí
# Comparte el error conmigo
```

### Problema: Se deploya pero la app no cambió

**Solución:**
1. Limpia cache del navegador: `Ctrl+Shift+Del` (o Cmd+Shift+Delete en Mac)
2. Abre en incógnito: `Ctrl+Shift+N`
3. Si sigue igual, revisa:
   - `https://induccion.vercel.app/_next/static` debería mostrar cambios
   - O revisa en DevTools qué versión de `index.js` está cargando

---

## 📊 URLs Importantes

| Servicio | URL |
|----------|-----|
| **GitHub** | https://github.com/torreblanka-create/MLC |
| **Vercel Dashboard** | https://vercel.com/dashboard |
| **Vercel Project** | https://vercel.com/torreblanka-create/MLC |
| **App Producción** | https://induccion.vercel.app |

---

## ✅ Checklist Post-Deploy

- [ ] Dashboard Vercel muestra "Ready" (verde)
- [ ] App abre sin errores
- [ ] Panel Admin accesible (RUT 12...)
- [ ] Mensaje de carga de archivo aparece
- [ ] Archivos persisten tras reload
- [ ] Email con "Mina Cabildo" asigna curso correctamente

---

**Tiempo estimado:** 2-5 minutos (dependiendo de opción)

¿Cuál opción prefieres? Avísame si necesitas ayuda con alguna.
