# Guía: Desafío Bíblico — anuncios + app instalable en el celular

No toqué tu `App.jsx` ni tu `sound.js`. Estos son archivos **nuevos** que
agregas a tu proyecto original.

## 0. Archivos que te entrego en este paquete
- `manifest.json` → hace que el juego se pueda "Instalar" desde el navegador.
- `sw.js` → service worker, mejora la carga y el modo offline.
- `icon-192.png` / `icon-512.png` → íconos de la app (colócalos en `public/icons/`).
- `index.html` → tu mismo index.html original + las líneas necesarias para PWA
  (reemplaza al que ya tienes en la raíz del proyecto).
- `AdBanner.jsx` → componente de anuncios listo para usar, aún **no conectado**
  a tu juego. Lo importas tú donde quieras cuando decidas activarlo.

## 1. Estructura final de carpetas
```
tu-proyecto/
├── App.jsx          (el tuyo, sin cambios)
├── sound.js         (el tuyo, sin cambios)
├── main.jsx         (el tuyo, sin cambios)
├── index.html        ← reemplazar por el nuevo
├── manifest.json      ← nuevo, en la raíz
├── sw.js               ← nuevo, en la raíz
├── AdBanner.jsx         ← nuevo (opcional, actívalo cuando quieras)
├── package.json
├── vite.config.js
└── public/
    └── icons/
        ├── icon-192.png  ← nuevo
        └── icon-512.png  ← nuevo
```

## 2. Subir a GitHub
```bash
git init
git add .
git commit -m "Desafío Bíblico"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/desafio-biblico.git
git push -u origin main
```

## 3. Desplegar gratis en Vercel (recomendado para PWA)
1. Ve a https://vercel.com y entra con tu cuenta de GitHub.
2. "Add New Project" → selecciona tu repo → Vercel detecta Vite automáticamente.
3. Deploy. En 1-2 minutos tendrás una URL tipo `https://desafio-biblico.vercel.app`.
4. Abre esa URL desde el celular (Chrome en Android o Safari en iPhone) →
   aparecerá la opción **"Instalar app" / "Añadir a pantalla de inicio"**.
   Así ya cualquier persona puede "descargar" tu juego sin pasar por tiendas.

## 4. Google AdSense (anuncios en la versión web / PWA)
1. Regístrate gratis en https://adsense.google.com con la URL de tu Vercel.
2. Necesitas publicar una **política de privacidad** (puedes generar una
   gratis en sitios como privacypolicies.com y agregarla como página).
3. Google revisa el sitio (puede tardar de días a semanas). Con contenido
   original como tu trivia, normalmente se aprueba.
4. Cuando te aprueben, te dan un `ca-pub-XXXXXXXXXXXXXXX` (Client ID) y
   puedes crear un bloque de anuncios para obtener el `data-ad-slot`.
5. Descomenta la línea del script en `index.html` y reemplaza los IDs en
   `AdBanner.jsx`. Luego, en tu `App.jsx`, agrega tú mismo (o pídemelo en
   otro momento) `import AdBanner from "./AdBanner"` y colócalo donde
   quieras que aparezca el anuncio.

## 5. Google AdMob (anuncios en la app nativa Android/iOS)
1. Regístrate gratis en https://admob.google.com
2. "Add app" → te pide el nombre; si aún no está en la tienda, la registras
   como app no publicada por ahora.
3. Crea unidades de anuncio: un **Banner** y, si quieres, un **Intersticial**
   (pantalla completa entre niveles). Te da un `Ad Unit ID` para cada una.
4. Guarda esos IDs — los usarás en el paso 6 con el plugin de Capacitor
   (hay ejemplo de código dentro de `AdBanner.jsx`).

## 6. Empaquetar como app nativa con Capacitor
```bash
npm install @capacitor/core @capacitor/cli
npx cap init "Desafío Bíblico" "com.tunombre.desafiobiblico"
npm run build
npx cap add android
npx cap add ios
npm install @capacitor-community/admob
npx cap sync
```
- Para Android: `npx cap open android` abre Android Studio, ahí puedes
  compilar y generar el `.aab` para subir a Google Play.
- Para iOS: `npx cap open ios` abre Xcode (necesitas una Mac).

## 7. Publicar en las tiendas
- **Google Play**: cuenta de desarrollador ($25 USD pago único) en
  https://play.google.com/console. Subes el `.aab`, completas ficha,
  capturas de pantalla, política de privacidad y clasificación de contenido.
- **Apple App Store**: cuenta de desarrollador ($99 USD/año) en
  https://developer.apple.com. Se sube desde Xcode a App Store Connect.

## Notas
- La app **no necesita** tienda para que la gente la instale: el PWA
  (pasos 1-3) ya permite instalarla desde el navegador en Android e iPhone.
  Las tiendas (pasos 6-7) son para mayor visibilidad/descubribilidad y son
  las únicas que soportan AdMob de forma nativa.
- Puedes lanzar primero el PWA con AdSense (más rápido y barato) y luego,
  con calma, avanzar a las tiendas con AdMob.
- Si en algún momento quieres que te ayude a integrar `AdBanner.jsx` dentro
  de `App.jsx` una vez tengas tus IDs reales, dímelo y lo hago sin tocar
  nada más del diseño ni la lógica del juego.
