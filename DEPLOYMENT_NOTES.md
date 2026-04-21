# Notas de Deployment — MLC Inducción

## Cambios Realizados

### 1. ✅ Persistencia de Documentación (Storage del Servidor)

**Antes:** Los archivos cargados se guardaban solo en `localStorage` del navegador, lo que significa que se perdían al cambiar de navegador o en despliegues a Vercel.

**Ahora:** 
- Creado `/server/api_content.php` que persiste toda la documentación en el servidor
- Los contenidos se guardan automáticamente en `server/data/content/all_content.json`
- Se sincroniza cada cambio entre cliente y servidor
- Indicador visual "Guardando..." y "Guardado ✓" en el panel admin

**Archivos modificados:**
- `src/pages/ContentPage.jsx` — cambio a API backend
- `server/api_content.php` — nuevo archivo

---

### 2. ✅ Activación Automática de Cursos por Email

**Antes:** Los cursos se asignaban solo desde las columnas del Excel, sin procesamiento inteligente del email.

**Ahora:**
- El script `pipe_mail.php` detecta automáticamente:
  - "**Mina Cabildo**" en asunto/contenido → activa `mina_cabildo`
  - "**Planta Cabildo**" en asunto/contenido → activa `planta_cabildo`
  - "**Mina Taltal**" en asunto/contenido → activa `mina_taltal`
  - "**Planta Taltal**" en asunto/contenido → activa `planta_taltal`
- Si se mencionan múltiples (ej: "Mina Cabildo y Planta Cabildo"), **se activan ambos**
- Compatible con Excel + detección automática

**Función agregada:**
```php
detectar_cursos_desde_email($text)
```

**Ejemplo de email que funciona:**
```
Asunto: Inscripción — Mina Cabildo y Planta Cabildo

Adjunto planilla con alumnos para Mina Cabildo y Planta Cabildo...
```

**Archivos modificados:**
- `server/pipe_mail.php` — función de detección + lógica de asignación

---

### 3. ✅ Mensaje de Confirmación al Cargar Archivos

**Antes:** No había feedback visual cuando se cargaba un archivo.

**Ahora:**
- Notificación verde: "Archivo cargado correctamente" después de drag-drop o clic
- Desaparece automáticamente después de 3 segundos
- Indicador en el header del status de guardado automático

**Archivos modificados:**
- `src/pages/ContentPage.jsx` — notificación + state `fileUploadStatus`

---

## Configuración para Production (Vercel)

### Variables de Entorno Necesarias

En `.env` o en Vercel dashboard:

```env
# API Base (si usas Google Cloud o Cloud Run)
VITE_API_BASE_URL=https://tu-api-domain.com

# Email (opcional si usas cPanel local)
SMTP_HOST=mail.gmlc.cl
SMTP_PORT=465
SMTP_USER=induccionmlc@gmlc.cl
SMTP_PASS=tu_contraseña
```

### Estructura de Directorios en el Servidor

```
server/
├── api_content.php          (nueva API)
├── pipe_mail.php            (actualizado)
├── data/
│   ├── content/
│   │   └── all_content.json (documentación persistida)
│   ├── processed/           (emails procesados)
│   ├── rejected/            (emails rechazados)
│   ├── students.json        (alumnos inscritos)
│   ├── authorized_senders.json
│   └── mail.log             (log de procesamiento)
```

### Permisos Necesarios en Hosting

```bash
# En cPanel o servidor:
chmod 755 server/data/
chmod 755 server/data/content
chmod 644 server/data/content/all_content.json
chmod 755 server/data/processed
chmod 755 server/data/rejected
```

---

## Testing Local

### 1. Verificar API de Contenidos

```bash
# GET - cargar contenidos
curl http://localhost:5173/server/api_content.php?action=get

# POST - guardar contenidos
curl -X POST http://localhost:5173/server/api_content.php?action=save \
  -H "Content-Type: application/json" \
  -d '{"data":{"test":"value"}}'
```

### 2. Verificar Detección de Cursos

En `pipe_mail.php`, buscar log de:
```
Cursos detectados desde email: mina_cabildo, planta_cabildo
```

### 3. Probar Carga de Archivos

- En panel admin → Gestión de Contenidos
- Cargar un archivo (PDF, imagen, etc)
- Debería aparecer notificación verde "Archivo cargado correctamente"

---

## Notas Importantes

⚠️ **Vercel Limitations:**
- Vercel **no persiste archivos** en el filesystem entre despliegues
- La solución actual guarda en `server/data/content/` que es un filesystem local
- Para **production en Vercel**, considera:
  1. **Opción A (Recomendado):** Usar servicio backend separado (Cloud Run, Railway, Render)
  2. **Opción B:** Usar base de datos (Supabase, Firebase, MongoDB)
  3. **Opción C:** Usar storage (AWS S3, Google Cloud Storage)

✅ **Actualmente funciona bien en:**
- Hosting tradicional (cPanel, Hostingplus, etc)
- Servidores dedicados
- VPS propio

---

## Próximos Pasos Recomendados

1. **Backup:** Hacer backup de `server/data/content/all_content.json` regularmente
2. **Monitoring:** Revisar `server/data/mail.log` para verificar procesamiento de emails
3. **Testing:** Enviar email de prueba con Excel desde remitente autorizado

---

**Última actualización:** 2026-04-21
