// configuracion.js - Lógica del formulario de configuración

const STORAGE_KEY = 'planIgualdadConfig';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('configForm');
    const btnReset = document.getElementById('btnReset');
    const statusMessage = document.getElementById('statusMessage');

    if (!form) return;

    // 1. Definir la función de agregar (global para el HTML)
    window.agregarMiembro = function(contenedorId, tipo, nombre = '', rol = 'Titular') {
        const contenedor = document.getElementById(contenedorId);
        if (!contenedor) return;

        const div = document.createElement('div');
        div.className = `miembro-${tipo}`;
        div.style.display = 'flex';
        div.style.gap = '0.5rem';
        div.style.marginBottom = '0.8rem';
        
        div.innerHTML = `
            <input type="text" value="${nombre}" placeholder="Nombre y apellidos" style="flex: 1; padding: 0.55rem 0.7rem; border: 1px solid var(--border); border-radius: 8px; font-size: 0.9rem;" class="input-nombre">
            <select class="input-rol" style="width: 130px; padding: 0.55rem 0.7rem; border: 1px solid var(--border); border-radius: 8px; font-size: 0.9rem;">
                <option value="Titular" ${rol === 'Titular' ? 'selected' : ''}>Titular</option>
                <option value="Suplente" ${rol === 'Suplente' ? 'selected' : ''}>Suplente</option>
                <option value="Asesor" ${rol === 'Asesor' ? 'selected' : ''}>Asesor</option>
                <option value="Presidente/a" ${rol === 'Presidente/a' ? 'selected' : ''}>Presidente/a</option>
                <option value="Secretario/a" ${rol === 'Secretario/a' ? 'selected' : ''}>Secretario/a</option>
            </select>
            <button type="button" onclick="this.parentElement.remove()" class="btn btn-danger" style="padding: 0.5rem; font-size: 1rem;" title="Eliminar">🗑️</button>
        `;
        contenedor.appendChild(div);
    };

    // 2. Cargar los datos al iniciar
    cargarConfiguracion();

    // 3. Guardar
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Recoger los datos estándar
        const data = Object.fromEntries(new FormData(form).entries());
        
        // Recoger los miembros dinámicos
        data.empresaMiembros = obtenerMiembros('contenedorEmpresa');
        data.trabajadoresMiembros = obtenerMiembros('contenedorTrabajadores');

        // Validar que no haya campos vacíos
        const hayVacios = data.empresaMiembros.some(m => !m.nombre) || data.trabajadoresMiembros.some(m => !m.nombre);
        if (hayVacios) {
            alert('⚠️ Por favor, rellena el nombre de todos los representantes o elimínalos si no los necesitas.');
            return;
        }

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            mostrarMensaje('✅ Configuración guardada correctamente.', 'success');
            setTimeout(() => location.reload(), 800); 
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
                document.getElementById('contenedorEmpresa').innerHTML = '';
                document.getElementById('contenedorTrabajadores').innerHTML = '';
                mostrarMensaje('🗑️ Datos eliminados.', 'success');
            }
        });
    }

    function obtenerMiembros(contenedorId) {
        const contenedor = document.getElementById(contenedorId);
        if (!contenedor) return [];
        
        const miembros = [];
        contenedor.querySelectorAll('[class^="miembro-"]').forEach(div => {
            const nombre = div.querySelector('.input-nombre').value.trim();
            const rol = div.querySelector('.input-rol').value;
            if (nombre) {
                miembros.push({ nombre, rol });
            }
        });
        return miembros;
    }

    function cargarConfiguracion() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return;
        try {
            const data = JSON.parse(saved);
            
            // Cargar campos de texto normales (empresa, fechas, etc.)
            Object.keys(data).forEach((key) => {
                if (typeof data[key] === 'string') {
                    const field = form.elements[key];
                    if (field) field.value = data[key];
                }
            });

            // Cargar listas dinámicas
            if (data.empresaMiembros && Array.isArray(data.empresaMiembros)) {
                data.empresaMiembros.forEach(m => window.agregarMiembro('contenedorEmpresa', 'empresa', m.nombre, m.rol));
            }
            if (data.trabajadoresMiembros && Array.isArray(data.trabajadoresMiembros)) {
                data.trabajadoresMiembros.forEach(m => window.agregarMiembro('contenedorTrabajadores', 'trabajadores', m.nombre, m.rol));
            }
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
