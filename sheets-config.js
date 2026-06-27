// =============================================================
// sheets-config.js — Configuración de Google Sheets para ISES Toluca
// -------------------------------------------------------------
// INSTRUCCIONES:
//   1. Crea las dos hojas en Google Sheets (ver guía).
//   2. Pega el ID de cada hoja en las constantes de abajo.
//   3. Verifica que el nombre de cada pestaña coincida exactamente.
//   4. Incluye este archivo en cada HTML ANTES de los demás scripts:
//        <script src="sheets-config.js"></script>
// =============================================================

// ── IDs de las hojas (ya configurados) ────────────────────────
const SHEET_ID_NOTICIAS = "1dk3dMtCst1otFfll0S492L_JzPrXahl_iENLni_QJq4";
const SHEET_TAB_NOTICIAS = "Noticias"; // nombre exacto de la pestaña

const SHEET_ID_FECHAS   = "1Bjtm3ylt6o0MaHQcyPPzJlmbCo69b-xJkeHjHc5EF18";
const SHEET_TAB_FECHAS  = "Fechas";   // nombre exacto de la pestaña
// ──────────────────────────────────────────────────────────────


/**
 * Lee una hoja pública de Google Sheets usando la API gviz/JSON.
 * Devuelve un array de objetos { columna: valor, ... }.
 *
 * @param {string} sheetId      - ID de la hoja (entre /d/ y /edit en la URL)
 * @param {string} nombrePestana - Nombre exacto de la pestaña
 * @returns {Promise<Object[]>}
 */
async function leerHoja(sheetId, nombrePestana) {
  const url =
    `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq` +
    `?tqx=out:json&sheet=${encodeURIComponent(nombrePestana)}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error HTTP ${res.status} al leer la hoja "${nombrePestana}"`);

  const texto = await res.text();
  // La respuesta viene envuelta en:  google.visualization.Query.setResponse({...});
  const json = JSON.parse(
    texto.substring(texto.indexOf('{'), texto.lastIndexOf('}') + 1)
  );

  const cols = json.table.cols.map(c => (c.label || '').trim());

  return json.table.rows
    .filter(r => r && r.c)                          // ignora filas vacías
    .map(r => {
      const obj = {};
      r.c.forEach((celda, i) => {
        obj[cols[i]] = celda && celda.v !== null ? String(celda.v).trim() : '';
      });
      return obj;
    })
    .filter(obj => Object.values(obj).some(v => v !== '')); // omite filas completamente vacías
}
