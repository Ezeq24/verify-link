# Verificador de Links — Guía de despliegue

## Estructura del proyecto

```
verificador-links/
├── index.html       ← el frontend (lo ven los usuarios)
├── api/
│   └── check.js     ← función serverless (la API key vive acá, segura)
└── vercel.json      ← configuración de Vercel
```

## Paso a paso para publicarlo

### 1. Crear cuenta en GitHub (si no tenés)
→ https://github.com

### 2. Crear repositorio nuevo
- Click en "New repository"
- Nombre: `verificador-links` (o el que quieras)
- Público o privado, cualquiera sirve
- Click "Create repository"

### 3. Subir los archivos
Podés hacerlo directo desde la web de GitHub:
- Click "uploading an existing file"
- Subí `index.html` y `vercel.json`
- Creá la carpeta `api` y subí `check.js` dentro

O si usás Git:
```bash
git init
git add .
git commit -m "primer commit"
git remote add origin https://github.com/TU_USUARIO/verificador-links.git
git push -u origin main
```

### 4. Crear cuenta en Vercel
→ https://vercel.com
- Registrate con tu cuenta de GitHub (más fácil)

### 5. Importar el proyecto
- Click "Add New Project"
- Seleccioná tu repositorio `verificador-links`
- Click "Deploy" (sin cambiar nada más)

### 6. Agregar la API Key de Anthropic (el paso clave)
- En tu proyecto de Vercel, ir a: **Settings → Environment Variables**
- Agregar:
  - **Name:** `ANTHROPIC_API_KEY`
  - **Value:** tu clave de https://console.anthropic.com
- Click "Save"
- Ir a **Deployments** → click en los tres puntos del último deploy → **Redeploy**

### 7. ¡Listo!
Vercel te da una URL tipo `https://verificador-links-xyz.vercel.app`
Esa URL la compartís con quien quieras — nadie ve la API key.

---

## ¿Dónde consigo la API Key de Anthropic?

1. Ir a https://console.anthropic.com
2. Registrarse (tiene créditos gratis para empezar)
3. Ir a "API Keys" → "Create Key"
4. Copiar la clave (empieza con `sk-ant-...`)
5. Pegarla en Vercel como indica el paso 6

## Costos aproximados

- **Vercel:** gratis para este uso
- **Anthropic:** cada análisis de link cuesta ~$0.003 USD (menos de 1 centavo)
  - Con $5 USD tenés ~1.600 análisis
  - Podés poner límites de gasto en console.anthropic.com
