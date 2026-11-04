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
        
        // Recoger los datos estándar del formulario
        const data = Object.fromEntries(new FormData(form).entries());
        
        // Recoger los miembros dinámicos
        data.empresaMiembrosExtra = obtenerMiembros('empresaContenedor');
        data.trabajadoresMiembrosExtra = obtenerMiembros('trabajadoresContenedor');

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            mostrarMensaje('✅ Configuración guardada correctamente.', 'success');
        } catch (err) {
            mostrarMensaje('❌ Error al guardar la configuración.', 'error');
            console.error(err);
        }
    });

    // --- Lógica de Miembros Dinámicos ---
    window.agregarCampoMiembro = function(contenedorId, nombreArray, valorNombre = '', valorRol = 'Titular') {
        const contenedor = document.getElementById(contenedorId);
        if (!contenedor) return;

        const div = document.createElement('div');
        div.className = 'miembro-extra';
        div.style.display = 'flex';
        div.style.gap = '0.5rem';
        div.style.marginBottom = '0.8rem';
        
        div.innerHTML = `
            <input type="text" placeholder="Nombre y apellidos" value="${valorNombre}" style="flex: 1; padding: 0.55rem 0.7rem; border: 1px solid var(--border); border-radius: 8px;" class="input-nombre">
            <select class="input-rol" style="width: 120px; padding: 0.55rem 0.7rem; border: 1px solid var(--border); border-radius: 8px;">
                <option value="Titular" ${valorRol === 'Titular' ? 'selected' : ''}>Titular</option>
                <option value="Suplente" ${valorRol === 'Suplente' ? 'selected' : ''}>Suplente</option>
                <option value="Asesor" ${valorRol === 'Asesor' ? 'selected' : ''}>Asesor</option>
            </select>
            <button type="button" onclick="this.parentElement.remove()" class="btn btn-danger" style="padding: 0.55rem; font-size: 1rem;">🗑️</button>
        `;
        contenedor.appendChild(div);
    };

    function obtenerMiembros(contenedorId) {
        const contenedor = document.getElementById(contenedorId);
        if (!contenedor) return [];
        
        const miembros = [];
        contenedor.querySelectorAll('.miembro-extra').forEach(div => {
            const nombre = div.querySelector('.input-nombre').value.trim();
            const rol = div.querySelector('.input-rol').value;
            if (nombre) {
                miembros.push({ nombre, rol });
            }
        });
        return miembros;
    }

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
