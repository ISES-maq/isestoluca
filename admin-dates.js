/**
 * Sistema de gestión de fechas de inicio de clases
 * Almacena en localStorage y se sincroniza con todas las páginas
 */

class AdminDates {
  constructor() {
    this.storageKey = 'ises_program_dates';
    this.versionKey = 'ises_program_dates_version';
    this.version = '2026-08-ciclo-2';
    this.init();
  }

  init() {
    // Si no hay datos, o la versión cambió, re-sembrar con los defaults vigentes
    if (!this.getData() || localStorage.getItem(this.versionKey) !== this.version) {
      this.setDefaults();
      localStorage.setItem(this.versionKey, this.version);
    }
  }

  setDefaults() {
    const defaults = {
      'maestria-docencia': '21 sep 2026',
      'admin-empresas': '4 ago 2026',
      'contaduria': '4 ago 2026',
      'ejecutivas-admin': '29 ago 2026',
      'ejecutivas-derecho': '29 ago 2026',
      'preparatoria-uaemex': '4 ago 2026',
      'ingles-cele': '15 ago 2026',
      'ingles-cero': '15 ago 2026',
      'psicologia': '10 ago 2026',
      'pedagogia': '10 ago 2026',
      'ejecutivas-psico': '29 ago 2026',
      'ejecutivas-peda': '29 ago 2026',
      'ejecutivas-rrhh': '29 ago 2026',
      'preparatoria-sep-vill': '17 ago 2026',
      'ingles-cele-vill': '15 ago 2026',
      'ingles-cero-vill': '15 ago 2026',
      'ceneval': '22 ago 2026',
      'preparatoria-sep-bravo': '17 ago 2026',
      'preparatoria-abierta': '29 ago 2026',
      'educacion-preescolar': '7 sep 2026',
    };
    localStorage.setItem(this.storageKey, JSON.stringify(defaults));
  }

  getData() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : null;
  }

  setDate(programId, date) {
    const data = this.getData() || {};
    data[programId] = date;
    localStorage.setItem(this.storageKey, JSON.stringify(data));
    this.notifyChanges();
  }

  getDate(programId) {
    const data = this.getData();
    return data ? data[programId] : null;
  }

  notifyChanges() {
    // Emitir evento personalizado para que otras páginas se actualicen
    window.dispatchEvent(new CustomEvent('datesUpdated', { detail: this.getData() }));
  }

  getAllDates() {
    return this.getData();
  }
}

const adminDates = new AdminDates();
