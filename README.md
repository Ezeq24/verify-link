# Verificador de Links — con Google Gemini (gratis)

## Estructura del proyecto

```
verificador-links/
├── index.html       ← el frontend (lo ven los usuarios)
├── api/
│   └── check.js     ← función serverless (la API key vive acá, segura)
└── vercel.json      ← configuración de Vercel
```

---

## Paso 1 — Conseguir la API Key de Gemini (gratis, sin tarjeta)

1. Ir a https://aistudio.google.com
2. Iniciar sesión con tu cuenta de Google
3. Click en "Get API key" → "Create API key"
4. Copiar la clave (empieza con AIza...)

Límite gratuito: 1.500 requests por día.

---

## Paso 2 — Subir el proyecto a GitHub

1. Crear cuenta en https://github.com (si no tenés)
2. Click en "New repository" → nombre: verificador-links → "Create repository"
3. Click en "uploading an existing file"
4. Subí index.html y vercel.json
5. Creá la carpeta api y subí check.js dentro

---

## Paso 3 — Publicar en Vercel

1. Crear cuenta en https://vercel.com (con tu cuenta de GitHub)
2. Click "Add New Project" → seleccioná el repositorio
3. Click "Deploy"

---

## Paso 4 — Agregar la API Key en Vercel

1. En tu proyecto: Settings → Environment Variables
2. Agregar:
   - Name: GEMINI_API_KEY
   - Value: la clave AIza... de Google AI Studio
3. Click "Save"
4. Deployments → tres puntos → "Redeploy"

---

## Costos

Vercel: Gratis
Gemini: Gratis (1.500 análisis/día)
Total: $0
