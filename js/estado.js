// estado.js - Gestión de Medidas y Objetivos del Plan

const STORAGE_MEDIDAS = 'planIgualdadMedidas';

document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ estado.js cargado y ejecutándose');
    const tbody = document.getElementById('tablaMedidasBody');
    const modal = document.getElementById('modalMedida');
    const form = document.getElementById('formMedida');
    const btnNueva = document.getElementById('btnNuevaMedida');
    const btnCancelar = document.getElementById('btnCancelarMedida');
    const modalTitulo = document.getElementById('modalTitulo');
    
    let medidas = JSON.parse(localStorage.getItem(STORAGE_MEDIDAS) || '[]');
    let editandoId = null;

    // --- Renderizar Tabla ---
    function renderTabla() {
        tbody.innerHTML = '';
        if (medidas.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:2rem; color:#888;">No hay medidas definidas. Pulsa "Nueva Medida" para empezar.</td></tr>`;
            return;
        }

        medidas.forEach(m => {
            const tr = document.createElement('tr');
            tr.style.borderBottom = '1px solid var(--border)';
            
            // Color según estado
            let colorEstado = '#e0e0e0'; // pendiente
            if (m.estado === 'en_curso') colorEstado = '#fff3e0';
            if (m.estado === 'hecho') colorEstado = '#e8f5e9';

            tr.innerHTML = `
                <td style="padding: 1rem; max-width: 300px;">
                    <strong>${m.titulo}</strong>
                    <br><small style="color:var(--text-light);">📊 ${m.indicador || 'Sin indicador'}</small>
                </td>
                <td style="padding: 1rem;">${m.plazo ? new Date(m.plazo).toLocaleDateString('es-ES') : '—'}</td>
                <td style="padding: 1rem;">
                    <span style="font-weight:600; color:${m.prioridad === 'Alta' ? 'var(--danger)' : (m.prioridad === 'Media' ? 'var(--secondary)' : 'var(--success)')}">
                        ${m.prioridad}
                    </span>
                </td>
                <td style="padding: 1rem;">${m.presupuesto ? m.presupuesto + ' €' : '—'}</td>
                <td style="padding: 1rem;">${m.responsable || '—'}</td>
                <td style="padding: 1rem;">
                    <span class="estado-badge estado-${m.estado}" style="background:${colorEstado}">${MODELO.etiquetaEstado(m.estado)}</span>
                </td>
                <td style="padding: 1rem; white-space: nowrap;">
                    <button class="btn btn-sm" onclick="window.editarMedida('${m.id}')" style="background:var(--primary); padding:0.3rem 0.6rem; font-size:0.8rem;">✏️</button>
                    <button class="btn btn-sm btn-danger" onclick="window.borrarMedida('${m.id}')" style="padding:0.3rem 0.6rem; font-size:0.8rem;">🗑️</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    // --- Abrir/Cerrar Modal ---
    function abrirModal(editId = null) {
        editandoId = editId;
        const selectResp = document.getElementById('medidaResponsable');
        
        // Poblar responsables
        selectResp.innerHTML = '<option value="">— Selecciona —</option>';
        if (typeof MODELO !== 'undefined' && MODELO.getResponsables) {
            MODELO.getResponsables().forEach(r => {
                selectResp.innerHTML += `<option value="${r.valor}">${r.valor}</option>`;
            });
        }

        if (editId) {
            const m = medidas.find(x => x.id === editId);
            modalTitulo.textContent = 'Editar Medida';
            document.getElementById('medidaTitulo').value = m.titulo;
            document.getElementById('medidaPlazo').value = m.plazo || '';
            document.getElementById('medidaPrioridad').value = m.prioridad || 'Media';
            document.getElementById('medidaPresupuesto').value = m.presupuesto || '';
            document.getElementById('medidaResponsable').value = m.responsable || '';
            document.getElementById('medidaEstado').value = m.estado || 'pendiente';
            document.getElementById('medidaIndicador').value = m.indicador || '';
        } else {
            modalTitulo.textContent = 'Añadir Nueva Medida';
            form.reset();
        }
        
        modal.style.display = 'flex';
    }

    // --- Guardar ---
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nuevaMedida = {
            id: editandoId || Date.now().toString(),
            titulo: document.getElementById('medidaTitulo').value,
            plazo: document.getElementById('medidaPlazo').value,
            prioridad: document.getElementById('medidaPrioridad').value,
            presupuesto: document.getElementById('medidaPresupuesto').value,
            responsable: document.getElementById('medidaResponsable').value,
            estado: document.getElementById('medidaEstado').value,
            indicador: document.getElementById('medidaIndicador').value
        };

        if (editandoId) {
            const idx = medidas.findIndex(x => x.id === editandoId);
            medidas[idx] = nuevaMedida;
        } else {
            medidas.push(nuevaMedida);
        }

        localStorage.setItem(STORAGE_MEDIDAS, JSON.stringify(medidas));
        modal.style.display = 'none';
        renderTabla();
    });

    // --- Eventos Globales ---
    btnNueva.addEventListener('click', () => abrirModal());
    btnCancelar.addEventListener('click', () => modal.style.display = 'none');

    window.editarMedida = (id) => abrirModal(id);
    window.borrarMedida = (id) => {
        if (confirm('¿Eliminar esta medida?')) {
            medidas = medidas.filter(m => m.id !== id);
            localStorage.setItem(STORAGE_MEDIDAS, JSON.stringify(medidas));
            renderTabla();
        }
    };

    // Inicializar
    renderTabla();
});
