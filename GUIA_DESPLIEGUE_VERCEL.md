# 🚀 Guía Paso a Paso: Despliegue de Vitality Shield en Vercel

¡Bienvenida! Esta guía te acompañará paso a paso para publicar tu plataforma web en **Vercel** de manera gratuita, rápida y con máxima seguridad. Al terminar, tendrás tu aplicación funcionando en internet con un enlace oficial seguro (`https://...vercel.app`).

---

## 📋 ¿Por qué Vercel?

- **Gratuito y de alto rendimiento:** Especialmente optimizado para aplicaciones modernas en **React + Vite**.
- **Seguridad SSL automática:** Tu aplicación tendrá candado verde (`https://`) desde el primer segundo.
- **Privacidad total de credenciales:** Tus claves de base de datos se configuran en un panel cifrado y nunca se exponen en GitHub.
- **Actualización automática (CI/CD):** Cada vez que hagas `git push` a tu repositorio, Vercel actualizará tu sitio web en vivo automáticamente.

---

## 🧰 Requisitos Previos

1. Una cuenta activa en [GitHub](https://github.com).
2. El código de tu proyecto subido a tu repositorio de GitHub.
3. Una cuenta gratuita en [Vercel](https://vercel.com) (te recomendamos registrarte con el botón **"Continue with GitHub"**).
4. Acceso a tu proyecto en [Supabase](https://supabase.com/dashboard) para copiar tus variables de entorno.

---

## 📍 Paso 1: Asegurar que tus últimos cambios estén en GitHub

Abre tu terminal en la carpeta del proyecto y ejecuta estos tres comandos:

```bash
git add .
git commit -m "Listo para desplegar en Vercel"
git push origin main
```

---

## 🌐 Paso 2: Conectar Vercel con tu cuenta de GitHub

1. Entra a [vercel.com](https://vercel.com).
2. Haz clic en **Log In** (o **Sign Up** si es la primera vez) y selecciona **Continue with GitHub**.
3. Si Vercel te pide permisos de acceso, acéptalos para que pueda leer tus repositorios.

---

## 📥 Paso 3: Importar tu Repositorio

1. En la pantalla principal de Vercel (*Dashboard*), haz clic en el botón azul o negro que dice **"Add New..."** (arriba a la derecha) y elige **"Project"**.
2. Verás una lista con tus repositorios de GitHub.
3. Busca tu proyecto:  
   👉 **`Evaluacio-Vulnerabilidad-mujer`**
4. Haz clic en el botón azul **"Import"** a la derecha del nombre.

---

## ⚙️ Paso 4: Configuración del Proyecto y Directorio Raíz

Vercel te mostrará la pantalla de configuración del proyecto (*Configure Project*). 

Gracias al archivo `vercel.json` que ya dejamos preparado en el código, la mayor parte se configura sola:

1. **Project Name:** Puedes dejar el nombre que viene o escribir uno más corto (ejemplo: `evaluacion-vulnerabilidad-mujer`). Este nombre formará parte de tu enlace web.
2. **Framework Preset:** Debe decir **Vite** (Vercel lo detecta automáticamente).
3. **Root Directory (Directorio Raíz):**
   - Debe permanecer en `./` (la raíz del proyecto).
   - *¿Qué significa?* Significa que tus archivos principales (`package.json`, `vite.config.ts`) están en la carpeta principal. Si tu proyecto estuviera dentro de una subcarpeta, aquí harías clic en "Edit" para seleccionarla, pero en nuestro caso déjalo tal como viene en `./`.
4. **Build and Output Settings:** Déjalo cerrado/por defecto. Ya está configurado para compilar con `npm run build` y colocar la salida en la carpeta `dist`.

---

## 🔐 Paso 5: Localizar el panel de "Environment Variables"

Esta es la parte más importante para conectar tu base de datos Supabase de forma 100% privada:

1. En esa misma pantalla de configuración, baja hasta ver la sección llamada:  
   👉 **`Environment Variables`** (haz clic sobre la flechita para desplegarla si está cerrada).
2. Tienes **dos alternativas** muy sencillas para ingresarlas:

### Opción A (La más rápida - Recomendada):
1. Haz clic en el botón que dice **`Import .env`** (ubicado abajo a la izquierda del recuadro de variables).
2. Se abrirá un cuadro de texto amplio. Pega allí este bloque:
   ```env
   VITE_SUPABASE_URL=https://<TU-PROJECT-ID>.supabase.co
   VITE_SUPABASE_ANON_KEY=<TU-CLAVE-PUBLICA-ANON>
   ```
   *(Sustituyendo `<TU-PROJECT-ID>` y `<TU-CLAVE-PUBLICA-ANON>` por los datos reales de tu Supabase)*.
3. Haz clic en **Save** o **Add**.

### Opción B (Llenar casilla por casilla):
1. En la primera casilla donde dice **Key** (en gris dice `EXAMPLE_NAME`), escribe:
   ```text
   VITE_SUPABASE_URL
   ```
2. En la casilla de abajo **Value**, escribe la URL de tu proyecto Supabase (ejemplo: `https://xyz.supabase.co`).
3. Haz clic en el botón **`+ Add More`** (a la derecha).
4. En el nuevo **Key**, escribe:
   ```text
   VITE_SUPABASE_ANON_KEY
   ```
5. En el nuevo **Value**, pega tu clave pública anónima de Supabase.

---

## 🔍 ¿De dónde salen estas claves en Supabase?

Si no recuerdas dónde encontrarlas en tu panel de Supabase:

1. Entra a [supabase.com/dashboard](https://supabase.com/dashboard) y abre tu proyecto.
2. En la barra lateral izquierda, haz clic en el icono de engranaje **Project Settings (⚙️)** (abajo a la izquierda).
3. Haz clic en la opción **Data API** (o **API**).
4. Verás los dos valores listos para copiar:
   - **`VITE_SUPABASE_URL`**: Cópialo del campo **Project URL**.
   - **`VITE_SUPABASE_ANON_KEY`**: Cópialo de la sección **Project API keys**, en la fila marcada con la etiqueta verde **`anon` `public`**.

```
+--------------------------------------------------------------------------------+
|                         SUPABASE DASHBOARD (PROJECT SETTINGS)                  |
|                                                                                |
|  ⚙️ Settings  ->  API                                                           |
|                                                                                |
|  [Project URL]      https://xxxxxxxxxxxxxxxxxxxx.supabase.co  <-- VITE_SUPABASE_URL
|                                                                                |
|  [Project API Keys]                                                            |
|  • anon / public    eyJh...... (Clave pública cliente)       <-- VITE_SUPABASE_ANON_KEY
+--------------------------------------------------------------------------------+
```

---

## 🚀 Paso 6: Desplegar la Aplicación

1. Una vez agregadas las variables, baja hasta el final de la página.
2. Haz clic en el botón negro grande:  
   👉 **`Deploy`**
3. Verás una pantalla con animaciones de construcción (*Building...*). El proceso toma entre **30 y 50 segundos**.
4. ¡Aparecerá una lluvia de confeti y el mensaje **"Congratulations!"**!
5. Tu aplicación ya se encuentra publicada y lista para usar en:  
   👉 **[https://evaluacio-vulnerabilidad-mujer.vercel.app](https://evaluacio-vulnerabilidad-mujer.vercel.app)**

---

## 🔄 ¿Cómo hacer cambios en el futuro?

¡No tienes que repetir este proceso nunca más!

Cada vez que hagas cambios en tu código:
```bash
git add .
git commit -m "Mejora en la interfaz"
git push origin main
```
Vercel detectará el cambio al instante, compilará la nueva versión y la pondrá en vivo en menos de 1 minuto sin que tengas que entrar a Vercel.

---

## ❓ Preguntas Frecuentes

### ¿Qué pasa si necesito cambiar o agregar una variable de entorno después?
1. Entra a tu proyecto en Vercel.
2. Ve a la pestaña **Settings** (arriba).
3. Selecciona **Environment Variables** en el menú izquierdo.
4. Ahí puedes editar, eliminar o agregar nuevas variables.
5. Luego ve a la pestaña **Deployments**, haz clic en los tres puntos (`...`) del último despliegue y selecciona **Redeploy** para aplicar los cambios.

### ¿Por qué mi aplicación no da error 404 al recargar o navegar entre pantallas?
El archivo `vercel.json` incluido en el código le dice a Vercel que redirija todas las peticiones internas a `index.html`. Esto permite que la navegación Single Page Application (SPA) funcione de forma fluida y sin interrupciones.
