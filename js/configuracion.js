// configuracion.js - Lógica del formulario de configuración

const STORAGE_KEY = 'planIgualdadConfig';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('configForm');
    const btnReset = document.getElementById('btnReset');
    const statusMessage = document.getElementById('statusMessage');

    if (!form) return;

    cargarConfiguracion();

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(form).entries());
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            mostrarMensaje('✅ Configuración guardada correctamente.', 'success');
        } catch (err) {
            mostrarMensaje('❌ Error al guardar la configuración.', 'error');
            console.error(err);
        }
    });

    if (btnReset) {
        btnReset.addEventListener('click', () => {
            if (confirm('¿Seguro que quieres borrar todos los datos de configuración?')) {
                localStorage.removeItem(STORAGE_KEY);
                form.reset();
                mostrarMensaje('🗑️ Datos eliminados.', 'success');
            }
        });
    }

    function cargarConfiguracion() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return;
        try {
            const data = JSON.parse(saved);
            Object.keys(data).forEach((key) => {
                const field = form.elements[key];
                if (field) field.value = data[key];
            });
        } catch (e) {
            console.warn('Error al cargar configuración:', e);
        }
    }

    function mostrarMensaje(texto, tipo) {
        if (!statusMessage) return;
        statusMessage.textContent = texto;
        statusMessage.className = 'status-message ' + tipo;
        setTimeout(() => {
            statusMessage.className = 'status-message';
            statusMessage.textContent = '';
        }, 4000);
    }
});
