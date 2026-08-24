import React, { useEffect } from "react";

/**
 * AdBanner — componente opcional de anuncios.
 *
 * NO está conectado a tu App.jsx todavía (no toqué ese archivo).
 * Cuando quieras activarlo, impórtalo donde te convenga, por ejemplo
 * debajo del header en Welcome o LevelMap:
 *
 *   import AdBanner from "./AdBanner";
 *   ...
 *   <AdBanner />
 *
 * Funciona en dos modos:
 *
 * 1) WEB / PWA → usa Google AdSense (variable de abajo: ADSENSE_CLIENT_ID
 *    y ADSENSE_SLOT_ID). Requiere que tu sitio ya esté aprobado en
 *    https://adsense.google.com
 *
 * 2) APP NATIVA (Android/iOS empaquetada con Capacitor) → usa el plugin
 *    oficial @capacitor-community/admob. Ver instrucciones abajo del todo.
 */

// --- CONFIGURA TUS IDS AQUÍ CUANDO LOS TENGAS ---
const ADSENSE_CLIENT_ID = "ca-pub-XXXXXXXXXXXXXXX"; // tu ID de editor de AdSense
const ADSENSE_SLOT_ID = "XXXXXXXXXX"; // el ID del bloque de anuncios que crees en AdSense

export default function AdBanner({ style = {} }) {
  useEffect(() => {
    try {
      // Le pide a AdSense que rellene el bloque de anuncios recién montado.
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // Es normal que falle mientras el script de AdSense no esté cargado
      // (por ejemplo si aún no descomentaste la línea en index.html).
    }
  }, []);

  return (
    <div style={{ width: "100%", textAlign: "center", margin: "12px 0", ...style }}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={ADSENSE_SLOT_ID}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}

/*
 * -------------------------------------------------------------------
 * APP NATIVA CON ADMOB (Android/iOS vía Capacitor) — código de referencia
 * -------------------------------------------------------------------
 * 1. npm install @capacitor-community/admob
 * 2. npx cap sync
 * 3. En tu App.jsx (cuando tú decidas integrarlo), algo así:
 *
 *   import { AdMob } from '@capacitor-community/admob';
 *
 *   useEffect(() => {
 *     AdMob.initialize({ requestTrackingAuthorization: true });
 *     AdMob.showBanner({
 *       adId: 'TU_AD_UNIT_ID_DE_ADMOB', // banner, lo generas en admob.google.com
 *       adSize: 'BANNER',
 *       position: 'BOTTOM_CENTER',
 *     });
 *   }, []);
 *
 * Para anuncios intersticiales (pantalla completa entre niveles):
 *
 *   await AdMob.prepareInterstitial({ adId: 'TU_AD_UNIT_ID_INTERSTITIAL' });
 *   await AdMob.showInterstitial();
 *
 * Documentación oficial: https://github.com/capacitor-community/admob
 * -------------------------------------------------------------------
 */
