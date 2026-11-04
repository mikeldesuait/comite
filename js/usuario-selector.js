// usuario-selector.js - Rellena y sincroniza el selector de usuario actual

(function () {
    if (typeof MODELO === 'undefined') return;

    document.addEventListener('DOMContentLoaded', () => {
        const select = document.getElementById('usuarioActualSelect');
        if (!select) return;

        const responsables = MODELO.getResponsables();
        const actual = MODELO.getUsuarioActual();

        select.innerHTML = '<option value="">— Selecciona —</option>';

        if (responsables.length === 0) {
            const opt = document.createElement('option');
            opt.value = '';
            opt.textContent = '⚠️ Configura el comité primero';
            opt.disabled = true;
            select.appendChild(opt);
        } else {
            const optGroupEmpresa = document.createElement('optgroup');
            optGroupEmpresa.label = '🏢 Empresa';
            
            const optGroupTrabajadores = document.createElement('optgroup');
            optGroupTrabajadores.label = '👷 Trabajadores';

            responsables.forEach(r => {
                const opt = document.createElement('option');
                opt.value = r.valor;
                opt.textContent = `${r.valor} (${r.rol})`;
                if (r.valor === actual) opt.selected = true;

                if (r.parte === 'empresa') {
                    optGroupEmpresa.appendChild(opt);
                } else {
                    optGroupTrabajadores.appendChild(opt);
                }
            });

            if (optGroupEmpresa.children.length > 0) select.appendChild(optGroupEmpresa);
            if (optGroupTrabajadores.children.length > 0) select.appendChild(optGroupTrabajadores);

            const otro = document.createElement('option');
            otro.value = '__otro__';
            otro.textContent = 'Otro (Escribir nombre)...';
            select.appendChild(otro);

            select.addEventListener('change', (e) => {
                if (e.target.value === '__otro__') {
                    const nombre = prompt('Introduce el nombre de la persona:');
                    if (nombre && nombre.trim()) {
                        MODELO.setUsuarioActual(nombre.trim());
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
