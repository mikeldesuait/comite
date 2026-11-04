// archivos-db.js - Guarda los archivos en la base de datos del navegador

window.ArchivosDB = (() => {
  const DB_NAME = 'PlanIgualdadArchivos';
  const STORE_NAME = 'documentos';
  let db;

  function init() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      req.onsuccess = (e) => {
        db = e.target.result;
        resolve();
      };
      req.onerror = (e) => reject(e.target.error);
    });
  }

  function guardar(id, archivo) {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(archivo, id);
      req.onsuccess = () => resolve();
      req.onerror = (e) => reject(e.target.error);
    });
  }

  function obtener(id) {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result);
      req.onerror = (e) => reject(e.target.error);
    });
  }

  return { init, guardar, obtener };
})();

// Iniciar conexión al cargar
document.addEventListener('DOMContentLoaded', () => {
    ArchivosDB.init().catch(console.error);
});
