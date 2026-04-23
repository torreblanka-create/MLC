# Configurar Vercel Blob Storage

Sin esto, los archivos NO persisten y los alumnos no pueden descargarlos.

## 🔧 Pasos de Configuración

### 1. En Vercel Dashboard

1. Ve a: https://vercel.com/torreblanka-create/mlc-phi/settings/storage
2. Click en **"Create Database"** (parte de Blob Storage)
3. Elige un nombre (ej: `mlc-blob-storage`)
4. Vercel genera automáticamente `BLOB_READ_WRITE_TOKEN`

### 2. Copiar Token

Vercel muestra algo como:
```
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxx_xxxxxxxxxxxxxxxx
```

Cópialo exactamente.

### 3. Agregar a Vercel

```bash
vercel env add BLOB_READ_WRITE_TOKEN
# O en Vercel Dashboard:
# Settings → Environment Variables → agregar manualmente
```

Pega el token cuando pida.

### 4. Re-deploy

```bash
git push origin main
```

Vercel auto-detecta el token y redeploy.

### 5. Verificar

- Sube un archivo en Admin Panel
- Alumno descarga desde el curso
- ✅ Debe funcionar sin 404

---

## 📊 Almacenamiento Gratuito

Vercel Blob incluye:
- ✅ 100 GB/mes gratis (suficiente para inducción)
- ✅ Almacenamiento persistente
- ✅ CDN global (rápido en cualquier país)
- ✅ Sin costo adicional

---

## 🚨 Si No Configuras Blob

- ❌ Los alumnos verán 404 al descargar
- ❌ Los archivos se pierden cada vez que Vercel reinicia
- ❌ Solo funcionan en sesión actual del Admin

**Es OBLIGATORIO configurar para producción.**

---

## Troubleshooting

**P: El token no aparece en Vercel Dashboard**
R: Espera 30 segundos y recarga. A veces tarda.

**P: Sigue dando 404**
R: Asegúrate que:
1. El token está en `BLOB_READ_WRITE_TOKEN` (exacto)
2. Se re-deployó después de agregar el token
3. El nuevo deploy dice "Ready" (verde)

**P: ¿Cómo borro archivos antiguos?**
R: Usa Vercel Dashboard → Storage → Blob → elimina files manualmente.

---

**Documentación oficial:** https://vercel.com/docs/storage/vercel-blob
