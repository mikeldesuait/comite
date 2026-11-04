// seed-loader.js - Carga / vacía los datos de ejemplo (modo DEMO)

(function () {
  const KEY_DEMO = 'planIgualdadEsDemo';
  const KEY_CONFIG = 'planIgualdadConfig';
  const KEY_DIAG = 'planIgualdadDiagnostico';
  const KEY_CUMPL = 'planIgualdadCumplimiento';

  function isDemo() {
    return localStorage.getItem(KEY_DEMO) === '1';
  }

  function activarDemo() {
    localStorage.setItem(KEY_DEMO, '1');
  }

  function desactivarDemo() {
    localStorage.removeItem(KEY_DEMO);
    actualizarBadge();
  }

  function cargarSeed() {
    if (typeof SEED === 'undefined') {
      alert('❌ No se han podido cargar los datos de ejemplo (seed.js no encontrado).');
      return;
    }

    const hayDatos = localStorage.getItem(KEY_CONFIG) ||
                     localStorage.getItem(KEY_DIAG) ||
                     localStorage.getItem(KEY_CUMPL);

    const msg = hayDatos
      ? '⚠️ Ya tienes datos guardados. Al cargar el ejemplo se sobrescribirán TODOS los datos actuales.\n\n¿Continuar?'
      : 'Se cargarán datos de ejemplo en configuración, diagnóstico y checklist.\n\n¿Continuar?';

    if (!confirm(msg)) return;

    localStorage.setItem(KEY_CONFIG, JSON.stringify(SEED.configuracion));
    localStorage.setItem(KEY_DIAG, JSON.stringify(SEED.diagnostico));
    localStorage.setItem(KEY_CUMPL, JSON.stringify(SEED.cumplimiento));
    activarDemo();

    alert('✅ Datos de ejemplo cargados. Al guardar datos propios, el modo DEMO se desactivará solo.');
    location.href = 'configuracion.html';
  }

  function vaciarTodo() {
    if (!confirm('⚠️ Se borrarán TODOS los datos: configuración, diagnóstico y checklist.\n\n¿Seguro?')) return;

    localStorage.removeItem(KEY_CONFIG);
    localStorage.removeItem(KEY_DIAG);
    localStorage.removeItem(KEY_CUMPL);
    localStorage.removeItem(KEY_DEMO);
    localStorage.removeItem('planIgualdadUsuarioActual');

    alert('🗑️ Todos los datos han sido eliminados.');
    location.href = 'configuracion.html';
  }

  function actualizarBadge() {
    const badge = document.getElementById('demoBadge');
    if (!badge) return;
    badge.style.display = isDemo() ? 'flex' : 'none';
  }

  function salirDemoAlGuardar() {
    document.addEventListener('submit', (e) => {
      const form = e.target;
      if (form.id === 'configForm' || form.id === 'diagForm') {
        if (isDemo()) {
          desactivarDemo();
          console.log('ℹ️ Modo DEMO desactivado: has guardado datos propios.');
        }
      }
    }, true);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const btnCargar = document.getElementById('btnCargarEjemplo');
    if (btnCargar) btnCargar.addEventListener('click', cargarSeed);

    const btnVaciar = document.getElementById('btnVaciarTodo');
    if (btnVaciar) btnVaciar.addEventListener('click', vaciarTodo);

    actualizarBadge();
    salirDemoAlGuardar();
  });

  window.SEED_LOADER = {
    isDemo,
    activarDemo,
    desactivarDemo,
    actualizarBadge
  };
})();
