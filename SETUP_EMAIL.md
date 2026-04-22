# 📧 Configuración de Sistema de Email para Inscripción Automática

## 🎯 Flujo General

1. **RR.HH. envía Excel** → `induccion@gmlc.cl`
2. **Sistema parsea** → valida remitente + archivo
3. **Inscribe automáticamente** → genera contraseñas
4. **Envía credenciales** → a cada estudiante
5. **Notifica** → al remitente del lote

---

## ✅ PASO 1: Configurar Variables de Entorno

**Archivo: `.env`** (cópialo de `.env.example`)

```bash
# ─── Email / cPanel ─────────────────────────────
SMTP_HOST=mail.tecktur.cl
SMTP_PORT=465
SMTP_USER=induccionmlc@tecktur.cl
SMTP_PASS=TU_CONTRASEÑA_AQUI
MAIL_FROM=induccionmlc@tecktur.cl
MAIL_NOTIFY=rrhh@tecktur.cl
```

### 📋 Obtén las credenciales:
- **SMTP_HOST**: `mail.tecktur.cl`
- **SMTP_PORT**: `465` (SSL) o `587` (TLS)
- **SMTP_USER**: `induccionmlc@tecktur.cl`
- **SMTP_PASS**: contraseña que creaste en cPanel
- **MAIL_FROM**: `induccionmlc@tecktur.cl`
- **MAIL_NOTIFY**: `rrhh@tecktur.cl` (o el email de tu RR.HH.)

---

## ✅ PASO 2: Crear Archivo de Remitentes Autorizados

**Archivo: `server/data/authorized_senders.json`**

Este archivo **whitelist** qué emails pueden inscribir estudiantes:

```json
[
  {
    "id": "rrhh-principal",
    "email": "rrhh@tecktur.cl",
    "nombre": "Departamento RR.HH.",
    "area": "Recursos Humanos",
    "activo": true,
    "fecha_creacion": "2026-04-20"
  },
  {
    "id": "gerencia-operaciones",
    "email": "gerencia@tecktur.cl",
    "nombre": "Gerencia de Operaciones",
    "area": "Operaciones",
    "activo": true,
    "fecha_creacion": "2026-04-20"
  }
]
```

### 📝 Campos:
- `email`: email autorizado para enviar Excel
- `nombre`: nombre descriptivo
- `area`: departamento
- `activo`: `true` para autorizar, `false` para bloquear

---

## ✅ PASO 3: Crear Carpetas de Datos

En el servidor (cPanel), crea esta estructura:

```
/home/usuario/induccion/server/data/
├── processed/          (lotes procesados)
├── rejected/           (emails rechazados)
├── students.json       (base de datos de estudiantes)
└── mail.log           (log de procesamiento)
```

**En tu máquina local (para desarrollo):**

```bash
mkdir -p server/data/processed
mkdir -p server/data/rejected
touch server/data/students.json
touch server/data/authorized_senders.json
touch server/data/mail.log
```

---

## ✅ PASO 4: Configurar cPanel Email Routing

En **cPanel → Email Routing** para `induccion@gmlc.cl`:

1. Selecciona **"Pipe to a Program"**
2. Ingresa la ruta:
   ```
   |/usr/bin/php /home/usuario/induccion/server/pipe_mail.php
   ```
3. Guarda

### ⚠️ Notas importantes:
- Reemplaza `usuario` con tu usuario de cPanel
- Asegúrate permisos 755 en carpetas
- El script se ejecuta automáticamente al recibir email

---

## ✅ PASO 5: Instalar PhpSpreadsheet (para parsear Excel)

En tu servidor (via SSH o cPanel Terminal):

```bash
cd /home/usuario/induccion/server
composer require phpoffice/phpspreadsheet
```

Luego **actualiza** `pipe_mail.php` línea 224:

```php
function parse_excel(string $data): array {
    require_once __DIR__ . '/vendor/autoload.php';
    
    $tmpfile = tempnam(sys_get_temp_dir(), 'excel_');
    file_put_contents($tmpfile, $data);
    
    $spreadsheet = \PhpOffice\PhpSpreadsheet\IOFactory::load($tmpfile);
    $sheet = $spreadsheet->getActiveSheet();
    
    $alumnos = [];
    foreach ($sheet->getRowIterator(2) as $row) {  // Empezar desde fila 2 (saltamos encabezados)
        $cells = $row->getCellIterator();
        $values = [];
        foreach ($cells as $cell) {
            $values[] = $cell->getValue();
        }
        
        if (!empty($values[0]) && !empty($values[1])) {
            $alumnos[] = [
                'nombre'  => trim($values[0]),
                'rut'     => trim($values[1]),
                'email'   => strtolower(trim($values[2])),
                'cursos'  => array_filter(array_map('trim', explode(',', $values[3] ?? '')))
            ];
        }
    }
    
    @unlink($tmpfile);
    return $alumnos;
}
```

---

## ✅ PASO 6: Formato del Excel que RR.HH. debe enviar

**Columnas (fila 1 = encabezados):**

| A | B | C | D |
|---|---|---|---|
| **Nombre** | **RUT** | **Correo** | **Cursos** |
| Juan Pérez | 14.523.867-3 | j.perez@minera.cl | Mina Cabildo, Mina Taltal |
| María González | 16.789.012-5 | m.gonzalez@minera.cl | Planta Cabildo |
| Pedro Ramírez | 12.901.234-7 | p.ramirez@minera.cl | Mina Cabildo |

### 📌 Notas:
- **Columna D** separa cursos con coma + espacio
- Cursos válidos: `Mina Cabildo`, `Mina Taltal`, `Planta Cabildo`, `Planta Taltal`
- Formato .xlsx o .csv

---

## ✅ PASO 7: Prueba End-to-End

### 1️⃣ Desarrollo Local
```bash
npm run dev
# Visita http://localhost:5173
```

### 2️⃣ Crea archivo de prueba
**`test_inscritos.xlsx`** con:
- Juan Pérez | 14.523.867-3 | test@example.com | Mina Cabildo

### 3️⃣ Envía desde email autorizado
- A: `induccion@gmlc.cl`
- Asunto: "Inscripción Batch 001"
- Adjunta: `test_inscritos.xlsx`

### 4️⃣ Verifica
```bash
cat server/data/mail.log
cat server/data/students.json
ls server/data/processed/
```

---

## 🔐 Variables de Entorno Completas

```bash
# ─── Google Cloud ───────────────────────────────
VITE_GCS_BUCKET=gmlc-induccion-media
VITE_API_BASE_URL=https://induccion-api-xxxx-uc.a.run.app

# ─── Email / cPanel ─────────────────────────────
SMTP_HOST=mail.tecktur.cl
SMTP_PORT=465
SMTP_USER=induccionmlc@tecktur.cl
SMTP_PASS=TU_PASSWORD
MAIL_FROM=induccionmlc@tecktur.cl
MAIL_NOTIFY=rrhh@tecktur.cl
```

---

## 🚀 Próximos Pasos

- [ ] Configurar SMTP en cPanel
- [ ] Crear `authorized_senders.json`
- [ ] Instalar PhpSpreadsheet
- [ ] Crear carpetas en server
- [ ] Configurar email routing en cPanel
- [ ] Prueba con Excel de ejemplo
- [ ] Documentar para equipo RR.HH.

---

## 📊 Estructura de `students.json`

```json
[
  {
    "nombre": "Juan Pérez",
    "rut": "14523867-3",
    "email": "j.perez@minera.cl",
    "password": "$2y$10$...",
    "pwd_plain": "aBc123!@#",
    "cursos": ["mina_cabildo", "mina_taltal"],
    "inscrito": "2026-04-20",
    "vencimiento": "2026-05-05",
    "estado": "pendiente",
    "inscritor": "rrhh@gmlc.cl"
  }
]
```

---

## 🛠 API de Administración Relacionadas

- `server/api/confirm_batch.php` - Confirmar inscripción manual
- `server/api/get_batch.php` - Obtener detalles de un lote
- `server/api/senders.php` - Gestionar remitentes autorizados

