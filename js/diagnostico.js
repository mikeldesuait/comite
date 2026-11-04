// diagnostico.js - Lógica del módulo de diagnóstico

const DIAG_KEY = 'planIgualdadDiagnostico';
const CONFIG_KEY = 'planIgualdadConfig';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('diagForm');
    const btnReset = document.getElementById('btnResetDiag');
    const statusMessage = document.getElementById('statusMessage');
    const alertaConfig = document.getElementById('alertaConfig');
    const resumen = document.getElementById('resumen');
    const resumenContenido = document.getElementById('resumenContenido');

    const config = localStorage.getItem(CONFIG_KEY);
    if (!config) {
        alertaConfig.style.display = 'block';
    }

    cargarDiagnostico();

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(form).entries());
        try {
            localStorage.setItem(DIAG_KEY, JSON.stringify(data));
            mostrarMensaje('✅ Diagnóstico guardado correctamente.', 'success');
            mostrarResumen(data);
        } catch (err) {
            mostrarMensaje('❌ Error al guardar el diagnóstico.', 'error');
            console.error(err);
        }
    });

    btnReset.addEventListener('click', () => {
        if (confirm('¿Seguro que quieres borrar el diagnóstico?')) {
            localStorage.removeItem(DIAG_KEY);
            form.reset();
            resumen.style.display = 'none';
            mostrarMensaje('🗑️ Diagnóstico eliminado.', 'success');
        }
    });

    function cargarDiagnostico() {
        const saved = localStorage.getItem(DIAG_KEY);
        if (!saved) return;
        try {
            const data = JSON.parse(saved);
            Object.keys(data).forEach((key) => {
                const field = form.elements[key];
                if (field) field.value = data[key];
            });
            mostrarMensaje('ℹ️ Diagnóstico cargado.', 'success');
            mostrarResumen(data);
        } catch (e) {
            console.warn('Error al cargar diagnóstico:', e);
        }
    }

    function mostrarResumen(data) {
        const m = parseInt(data.totalMujeres) || 0;
        const h = parseInt(data.totalHombres) || 0;
        const total = m + h;

        if (total === 0) {
            resumen.style.display = 'none';
            return;
        }

        const pctM = ((m / total) * 100).toFixed(1);
        const pctH = ((h / total) * 100).toFixed(1);

        const md = parseInt(data.mujeresDirectivas) || 0;
        const hd = parseInt(data.hombresDirectivos) || 0;
        const totalDir = md + hd;
        const pctMDir = totalDir ? ((md / totalDir) * 100).toFixed(1) : '0.0';

        let html = `<p><strong>Total plantilla:</strong> ${total} personas</p>`;
        html += `<p><strong>Mujeres:</strong> ${m} (${pctM}%) — <strong>Hombres:</strong> ${h} (${pctH}%)</p>`;
        html += `<p><strong>Dirección:</strong> ${md} mujeres (${pctMDir}% de los puestos directivos)</p>`;

        if (pctM < 40 || pctM > 60) {
            html += `<p style="color:var(--danger);">⚠️ Desequilibrio en la plantilla global.</p>`;
        } else {
            html += `<p style="color:var(--success);">✅ Plantilla global equilibrada.</p>`;
        }

        if (totalDir && parseFloat(pctMDir) < 30) {
            html += `<p style="color:var(--danger);">⚠️ Baja representación de mujeres en dirección.</p>`;
        }

        resumenContenido.innerHTML = html;
        resumen.style.display = 'block';
    }

    function mostrarMensaje(texto, tipo) {
        statusMessage.textContent = texto;
        statusMessage.className = 'status-message ' + tipo;
        setTimeout(() => {
            statusMessage.className = 'status-message';
            statusMessage.textContent = '';
        }, 4000);
    }
});
