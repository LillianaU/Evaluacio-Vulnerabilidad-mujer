# 🌐 Guía Paso a Paso: Desplegar en GitHub Pages

Esta guía te explica cómo publicar tu aplicación **Vitality Shield** de forma 100% gratuita utilizando **GitHub Pages** y **GitHub Actions**.

---

## 🎯 ¿Cómo funciona?

Tu proyecto ya cuenta con el archivo de automatización listo en:  
📂 **`.github/workflows/deploy.yml`**

Este archivo se encarga de:
1. Instalar las dependencias en los servidores de GitHub.
2. Compilar el proyecto con Vite (`npm run build`).
3. Generar la copia `404.html` para evitar pantallas en blanco si recargas la página.
4. Publicar la aplicación en tu dominio de GitHub Pages.

---

## 🚀 Pasos para Activar GitHub Pages

### Paso 1: Activar GitHub Actions como motor de Pages
1. Entra a tu repositorio en GitHub desde tu navegador.
2. Haz clic en la pestaña **Settings** (⚙️) en la barra superior.
3. En el menú lateral izquierdo, busca la sección **Code and automation** y haz clic en **Pages**.
4. En el apartado **Build and deployment**:
   - En el desplegable **Source**, cámbialo de *"Deploy from a branch"* a 👉 **"GitHub Actions"**.
5. ¡Listo! Verás que GitHub reconocerá automáticamente el flujo de Vite.

```
+-----------------------------------------------------------------------------+
| GitHub Repository > Settings > Pages                                        |
|                                                                             |
| Build and deployment                                                        |
| Source: [ GitHub Actions ▼ ]  <-- ¡Selecciona esta opción!                  |
+-----------------------------------------------------------------------------+
```

---

### Paso 2: Configurar las Variables de Entorno en GitHub Secrets
Para que tu aplicación se conecte con Supabase de forma segura y privada (sin escribir contraseñas en el código público):

1. En esa misma pantalla de **Settings** de tu repositorio:
2. En el menú izquierdo, haz clic en **Secrets and variables** y luego en **Actions**.
3. Haz clic en el botón verde **"New repository secret"**:
   - **Secret 1:**
     - **Name:** `VITE_SUPABASE_URL`
     - **Secret:** La URL de tu proyecto en Supabase (ej: `https://xxxxxxxx.supabase.co`).
     - Clic en **Add secret**.
   - **Secret 2:**
     - **Name:** `VITE_SUPABASE_ANON_KEY`
     - **Secret:** Tu clave pública anónima de Supabase.
     - Clic en **Add secret**.

---

### Paso 3: Disparar el Despliegue

Tienes dos maneras sencillas de iniciar el despliegue:

#### Opción A (Haciendo un push desde tu terminal):
```bash
git add .
git commit -m "Activar despliegue en GitHub Pages"
git push origin main
```

#### Opción B (Manual desde GitHub):
1. En tu repositorio, haz clic en la pestaña **Actions** (arriba).
2. En la lista izquierda, haz clic en **"Deploy Vite App to GitHub Pages"**.
3. Haz clic en el botón **"Run workflow"** (a la derecha) y pulsa el botón verde.

---

### Paso 4: ¡Tu aplicación en vivo! 🎉

1. En la pestaña **Actions** verás un círculo verde cuando termine (tarda aproximadamente 1 minuto).
2. Regresa a **Settings ➔ Pages** y verás el enlace público generado:
   👉 **`https://<tu-usuario>.github.io/Evaluacio-Vulnerabilidad-mujer/`**
3. ¡Haz clic en el enlace para abrir tu aplicación!
