# 📧 Email System Configuration — Complete Setup

**Status**: ✅ Ready for Deployment  
**Last Updated**: 2026-04-20  
**Deployed at**: https://mlc-phi.vercel.app/

---

## 📦 What's Included

```
📁 project/
├── 📄 .env                          # Credenciales SMTP (crear desde .env.example)
├── 📄 SETUP_EMAIL.md               # Guía técnica completa ⭐
│
├── 📁 server/
│   ├── 📄 pipe_mail.php            # ⚡ Motor principal de procesamiento
│   ├── 📁 lib/
│   │   └── 📄 SmtpMailer.php      # Helper para SMTP
│   └── 📁 data/
│       ├── 📄 students.json         # Base de datos de estudiantes
│       ├── 📄 authorized_senders.json # Whitelist de remitentes
│       ├── 📄 mail.log             # Log de eventos
│       ├── 📁 processed/           # Lotes procesados exitosamente
│       └── 📁 rejected/            # Emails rechazados
│
└── 📁 docs/
    ├── 📄 CONFIGURACION_CPANEL.md  # Pasos para cPanel
    └── 📄 GUIA_INSCRIPCION_RRHH.md # Guía para RR.HH. (DISTRIBUIR)
```

---

## 🚀 Quick Start (3 pasos)

### 1. Crear `.env`
```bash
cp .env.example .env

# Editar con tus credenciales SMTP de cPanel
SMTP_HOST=mail.tecktur.cl
SMTP_PORT=465
SMTP_USER=induccionmlc@tecktur.cl
SMTP_PASS=TU_PASSWORD
MAIL_FROM=induccionmlc@tecktur.cl
MAIL_NOTIFY=rrhh@tecktur.cl
```

### 2. Configurar cPanel Email Routing
```
Destino: induccionmlc@tecktur.cl
Tipo: Pipe to a Program
Programa: |/usr/bin/php /home/usuario/induccion/server/pipe_mail.php
```

### 3. Instalar PhpSpreadsheet
```bash
cd server/
composer require phpoffice/phpspreadsheet
```

---

## 📖 Full Documentation

| Documento | Para quién | Propósito |
|-----------|-----------|----------|
| **SETUP_EMAIL.md** | Desarrolladores | Configuración técnica completa |
| **CONFIGURACION_CPANEL.md** | DevOps / Admin | Pasos en cPanel + troubleshooting |
| **GUIA_INSCRIPCION_RRHH.md** | RR.HH. | Cómo enviar Excel para inscribir |

---

## 🔄 Flujo de Inscripción

```
RR.HH. envía Excel → induccionmlc@tecktur.cl
           ↓
Sistema valida remitente
           ↓
Parsea archivo Excel
           ↓
Inscribe automáticamente
           ↓
Envía credenciales a estudiantes
           ↓
Notifica al remitente
```

---

## ✉️ Ejemplo: Inscribir 3 personas

1. **RR.HH. prepara Excel**
   ```
   Nombre | RUT | Email | Cursos
   Juan Pérez | 14.523.867-3 | j.perez@mail.cl | Mina Cabildo, Mina Taltal
   María González | 16.789.012-5 | m.gonzalez@mail.cl | Planta Cabildo
   Pedro Ramírez | 12.901.234-7 | p.ramirez@mail.cl | Mina Cabildo
   ```

2. **Envía por email**
   - A: induccionmlc@tecktur.cl
   - Asunto: "Inscripción Batch 001"
   - Adjunto: Excel

3. **Sistema procesa en segundos**
   - Valida que RR.HH. esté autorizado
   - Parsea Excel
   - Genera contraseñas
   - Envía emails a los 3 estudiantes
   - Notifica a RR.HH.

4. **Resultado**
   - 3 estudiantes inscritos ✅
   - 3 correos enviados con credenciales ✅
   - Confirmación para RR.HH. ✅

---

## 🔐 Seguridad

- ✅ Solo remitentes autorizados pueden inscribir
- ✅ Las contraseñas se encriptan con bcrypt
- ✅ Validación de formato Excel
- ✅ Log de auditoría en `mail.log`
- ✅ Plazo de 15 días para completar inducción
- ✅ Archivos rechazados se guardan para revisión

---

## 📊 Variables de Entorno

```bash
# Email SMTP
SMTP_HOST=mail.tecktur.cl
SMTP_PORT=465
SMTP_USER=induccionmlc@tecktur.cl
SMTP_PASS=contraseña
MAIL_FROM=induccionmlc@tecktur.cl
MAIL_NOTIFY=rrhh@tecktur.cl

# API (ya configurado)
VITE_API_BASE_URL=https://induccion-api-xxxx-uc.a.run.app
VITE_GCS_BUCKET=gmlc-induccion-media
```

---

## 📁 Estructura de Datos

### `authorized_senders.json`
```json
[
  {
    "email": "rrhh@tecktur.cl",
    "nombre": "Departamento RR.HH.",
    "area": "Recursos Humanos",
    "activo": true
  }
]
```

### `students.json`
```json
[
  {
    "nombre": "Juan Pérez",
    "rut": "14523867-3",
    "email": "j.perez@minera.cl",
    "password": "$2y$10$...",
    "cursos": ["mina_cabildo"],
    "inscrito": "2026-04-20",
    "vencimiento": "2026-05-05",
    "estado": "pendiente"
  }
]
```

---

## 🛠️ API Endpoints Relacionados

```
POST /api/senders.php         # Gestionar remitentes autorizados
GET  /api/get_batch.php       # Obtener detalles de un lote
POST /api/confirm_batch.php   # Confirmar inscripción manual
```

---

## ✅ Deployment Checklist

- [ ] `.env` configurado con credenciales reales
- [ ] `authorized_senders.json` con remitentes de tu empresa
- [ ] Email Routing activo en cPanel
- [ ] PhpSpreadsheet instalado
- [ ] Carpetas `processed/` y `rejected/` creadas
- [ ] Permisos 755 en scripts
- [ ] Permisos 644 en archivos JSON
- [ ] Prueba exitosa con Excel de ejemplo
- [ ] Guía compartida con RR.HH.

---

## 🆘 Troubleshooting

### Email no se procesa
1. Verificar Email Routing está **Active**
2. Verificar ruta del script es correcta
3. Revisar `mail.log` para errores

### Excel no reconocido
- Debe ser `.xlsx` o `.csv`
- Debe tener exactamente 4 columnas
- Fila 1 = encabezados

### Credenciales no se envían
1. Verificar `MAIL_FROM` es válido
2. Verificar `authorized_senders.json` tiene el remitente
3. Revisar log: `tail -f server/data/mail.log`

---

## 📞 Support

- **Docs**: Lee los archivos `.md` en la carpeta `docs/`
- **Logs**: Revisa `server/data/mail.log`
- **Debugging**: Verifica `server/data/processed/*.json`

---

## 🎓 Próximos Pasos

1. ✅ Completar configuración en cPanel
2. ✅ Prueba con datos de ejemplo
3. ✅ Distribuir guía RR.HH.
4. ✅ Monitorear logs primeros días
5. ✅ Documentar procesos internos

---

**Sistema listo para producción** 🚀

