// =============================================================
// admin-dates.js — Lee fechas de Google Sheets y actualiza oferta.html
// Requiere que sheets-config.js se cargue ANTES que este archivo.
// =============================================================

// Mapa: atributo data-date-* → programa_id en la hoja de Fechas
const DATA_DATE_MAP = {
  'data-date-maestria':       'maestria-docencia',
  'data-date-admin':          'admin-empresas',
  'data-date-contaduria':     'contaduria',
  'data-date-ejec-admin':     'ejecutivas-admin',
  'data-date-prep-uaemex':    'preparatoria-uaemex',
  'data-date-ingles':         'ingles-cele',
  'data-date-ingles-cero':    'ingles-cero',
  'data-date-psico':          'psicologia',
  'data-date-peda':           'pedagogia',
  'data-date-ejec-psico':     'ejecutivas-psico',
  'data-date-ingles-cero-vill': 'ingles-cero-vill',
  'data-date-ingles-vill':    'ingles-cele-vill',
  'data-date-ceneval':        'ceneval',
  'data-date-prep-sep-bravo': 'preparatoria-sep-bravo',
  'data-date-prep-abierta':   'preparatoria-abierta',
  'data-date-preescolar':     'educacion-preescolar',
};

// Valores por defecto (si la hoja no carga)
const FECHAS_DEFAULT = {
  'maestria-docencia':      '21 sep 2026',
  'admin-empresas':         '4 ago 2026',
  'contaduria':             '4 ago 2026',
  'ejecutivas-admin':       '29 ago 2026',
  'ejecutivas-derecho':     '29 ago 2026',
  'preparatoria-uaemex':    '4 ago 2026',
  'ingles-cele':            '15 ago 2026',
  'ingles-cero':            '15 ago 2026',
  'psicologia':             '10 ago 2026',
  'pedagogia':              '10 ago 2026',
  'ejecutivas-psico':       '29 ago 2026',
  'ejecutivas-peda':        '29 ago 2026',
  'ejecutivas-rrhh':        '29 ago 2026',
  'preparatoria-sep-vill':  '17 ago 2026',
  'ingles-cele-vill':       '15 ago 2026',
  'ingles-cero-vill':       '15 ago 2026',
  'ceneval':                '22 ago 2026',
  'preparatoria-sep-bravo': '17 ago 2026',
  'preparatoria-abierta':   '29 ago 2026',
  'educacion-preescolar':   '7 sep 2026',
};

// Cache en memoria
let _fechasCache = null;

/**
 * Carga fechas desde Google Sheets.
 * Devuelve objeto { programa_id: fecha }.
 */
async function cargarFechas() {
  if (_fechasCache) return _fechasCache;

  try {
    const filas = await leerHoja(SHEET_ID_FECHAS, SHEET_TAB_FECHAS);
    const mapa = { ...FECHAS_DEFAULT };
    filas.forEach(f => {
      const id    = (f['programa_id'] || '').trim();
      const fecha = (f['fecha']       || '').trim();
      if (id && fecha) mapa[id] = fecha;
    });
    _fechasCache = mapa;
  } catch (err) {
    console.warn('No se pudo cargar la hoja de fechas, usando valores por defecto:', err);
    _fechasCache = { ...FECHAS_DEFAULT };
  }

  return _fechasCache;
}

/**
 * Actualiza todos los [data-date-*] del DOM con las fechas de la hoja.
 */
async function actualizarFechasDOM() {
  const fechas = await cargarFechas();

  Object.entries(DATA_DATE_MAP).forEach(([attr, programaId]) => {
    const elementos = document.querySelectorAll(`[${attr}]`);
    elementos.forEach(el => {
      if (fechas[programaId]) el.textContent = fechas[programaId];
    });
  });
}

// API pública — compatible con el código que use adminDates.getDate()
const adminDates = {
  getDate: async function(programaId) {
    const fechas = await cargarFechas();
    return fechas[programaId] || '';
  },
  getAll: async function() {
    return cargarFechas();
  },
};

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', actualizarFechasDOM);
