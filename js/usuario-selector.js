// usuario-selector.js - Rellena y sincroniza el selector de usuario actual
// Requiere modelo.js cargado antes.

(function () {
    if (typeof MODELO === 'undefined') {
        console.warn('modelo.js no cargado: el selector de usuario no funcionará.');
        return;
    }

    document.addEventListener('DOMContentLoaded', () => {
        const select = document.getElementById('usuarioActualSelect');
        if (!select) return;

        const responsables = MODELO.getResponsables();
        const actual = MODELO.getUsuarioActual();

        // Limpiar y rellenar
        select.innerHTML = '<option value="">— Selecciona —</option>';

        if (responsables.length === 0) {
            // No hay comité configurado → aviso
            const opt = document.createElement('option');
            opt.value = '';
            opt.textContent = '⚠️ Configura el comité primero';
            opt.disabled = true;
            select.appendChild(opt);
        } else {
            responsables.forEach(r => {
                const opt = document.createElement('option');
                opt.value = r.valor;
                opt.textContent = `${r.valor} (${r.rol})`;
                if (r.valor === actual) opt.selected = true;
                select.appendChild(opt);
            });

            // Opción "Otro" al final
            const otro = document.createElement('option');
            otro.value = '__otro__';
            otro.textContent = 'Otro…';
            select.appendChild(otro);

            // Manejar selección
            select.addEventListener('change', (e) => {
                if (e.target.value === '__otro__') {
                    const nombre = prompt('Introduce el nombre de la persona:');
                    if (nombre && nombre.trim()) {
                        MODELO.setUsuarioActual(nombre.trim());
                        // Recargar para que aparezca como opción seleccionada
                        location.reload();
                    } else {
                        e.target.value = actual || '';
                    }
                } else {
                    MODELO.setUsuarioActual(e.target.value);
                }
            });
        }
    });
})();
