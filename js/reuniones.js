// reuniones.js - Gestión del Libro de Actas

const STORAGE_REUNIONES = 'planIgualdadReuniones';

document.addEventListener('DOMContentLoaded', () => {
    const lista = document.getElementById('listaReuniones');
    const modal = document.getElementById('modalReunion');
    const form = document.getElementById('formReunion');
    const btnNueva = document.getElementById('btnNuevaReunion');
    const btnCancelar = document.getElementById('btnCancelarReunion');
    const modalTitulo = document.getElementById('modalTitulo');
    
    let reuniones = JSON.parse(localStorage.getItem(STORAGE_REUNIONES) || '[]');
    let editandoId = null;

    // --- Renderizar Lista ---
    function renderLista() {
        lista.innerHTML = '';
        if (reuniones.length === 0) {
            lista.innerHTML = `<div class="card" style="text-align:center; padding:2rem; color:#888;">No hay reuniones registradas. Pulsa "Nueva Reunión" para crear la primera.</div>`;
            return;
        }

        // Ordenar por fecha descendente (la más reciente arriba)
        reuniones.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

        reuniones.forEach(r => {
            const card = document.createElement('div');
            card.className = 'card';
            card.style.padding = '1.5rem';
            
            const fechaFmt = new Date(r.fecha).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

            card.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                    <div>
                        <h3 style="color:var(--primary-dark); margin-bottom:0.3rem;">Reunión del ${fechaFmt}</h3>
                        <p style="font-size:0.9rem; color:var(--text-light);">
                            <strong>Lugar:</strong> ${r.lugar || '—'} | 
                            <strong>Modalidad:</strong> ${r.modalidad || 'Presencial'} ${r.hora ? '| <strong>Hora:</strong> ' + r.hora : ''}
                        </p>
                    </div>
                    <div style="display:flex; gap:0.5rem;">
                        <button class="btn" onclick="window.generarPdfReunion('${r.id}')" style="background:var(--secondary); padding:0.4rem 0.8rem; font-size:0.85rem;">🖨️ Ver Acta / PDF</button>
                        <button class="btn" onclick="window.editarReunion('${r.id}')" style="background:var(--primary); padding:0.4rem 0.8rem; font-size:0.85rem;">✏️ Editar</button>
                        <button class="btn btn-danger" onclick="window.borrarReunion('${r.id}')" style="padding:0.4rem 0.8rem; font-size:0.85rem;">🗑️</button>
                    </div>
                </div>
                <div style="margin-top:1rem; font-size:0.9rem;">
                    <p><strong>Acuerdos:</strong> ${r.acuerdos ? r.acuerdos.substring(0, 100) + '...' : '—'}</p>
                </div>
            `;
            lista.appendChild(card);
        });
    }


    // --- Generar lista de asistencia con desplegables ---
    function renderizarListaAsistentes(asistenciasGuardadas = []) {
        const contenedor = document.getElementById('listaAsistentes');
        contenedor.innerHTML = '';
        
        const miembros = MODELO.getResponsables();
        
        if (miembros.length === 0) {
            contenedor.innerHTML = '<p style="color:var(--danger); font-size:0.9rem;">⚠️ No hay miembros en el comité. Ve a Configuración para añadirlos.</p>';
            return;
        }

        miembros.forEach(m => {
            // Buscar si este miembro ya tenía una asistencia guardada
            const guardado = asistenciasGuardadas.find(a => a.nombre === m.valor);
            const estadoActual = guardado ? guardado.estado : 'Presencial';

            const div = document.createElement('div');
            div.style.display = 'flex';
            div.style.justifyContent = 'space-between';
            div.style.alignItems = 'center';
            div.style.gap = '1rem';

            div.innerHTML = `
                <div style="font-weight: 500;">${m.valor} <small style="color:var(--text-light);">(${m.rol})</small></div>
                <select class="select-asistencia" data-nombre="${m.valor}" style="padding: 0.3rem; border-radius: 4px; border: 1px solid #ccc;">
                    <option value="Presencial" ${estadoActual === 'Presencial' ? 'selected' : ''}>Presencial</option>
                    <option value="Telemático" ${estadoActual === 'Telemático' ? 'selected' : ''}>Telemático</option>
                    <option value="No asiste" ${estadoActual === 'No asiste' ? 'selected' : ''}>No asiste</option>
                </select>
            `;
            contenedor.appendChild(div);
        });
    }

    // --- Abrir Modal ---
    function abrirModal(editId = null) {
        editandoId = editId;
        
        if (editId) {
            const r = reuniones.find(x => x.id === editId);
            modalTitulo.textContent = 'Editar Reunión';
            document.getElementById('reunionFecha').value = r.fecha;
            document.getElementById('reunionHora').value = r.hora || '';
            document.getElementById('reunionModalidad').value = r.modalidad || 'Presencial';
            document.getElementById('reunionLugar').value = r.lugar || '';
            document.getElementById('reunionTemas').value = r.temas || '';
            // Pasamos los datos guardados (o un array vacío si es nueva)
            renderizarListaAsistentes(r.asistentesData || []);
            document.getElementById('reunionAcuerdos').value = r.acuerdos || '';
            document.getElementById('reunionProxima').value = r.proxima || '';
            document.getElementById('reunionAdvertencia').checked = r.advertencia || false;
        } else {
            modalTitulo.textContent = 'Nueva Reunión';
            form.reset();
            document.getElementById('reunionFecha').value = new Date().toISOString().split('T')[0]; // Hoy por defecto
            renderizarListaAsistentes([]);
        }
        
        modal.style.display = 'flex';
    }

    // --- Guardar ---
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Recopilar la asistencia de los desplegables
        const selectores = document.querySelectorAll('.select-asistencia');
        const asistentesData = [];
        let textoAsistentes = '';
        
        selectores.forEach(sel => {
            const nombre = sel.dataset.nombre;
            const estado = sel.value;
            asistentesData.push({ nombre, estado });
            
            // Construir el texto para el PDF
            if (estado !== 'No asiste') {
                textoAsistentes += `${nombre} (${estado})\n`;
            }
        });

        const nuevaReunion = {
            id: editandoId || Date.now().toString(),
            fecha: document.getElementById('reunionFecha').value,
            asistentesData: asistentesData,
            asistentes: textoAsistentes.trim(),
            hora: document.getElementById('reunionHora').value,
            modalidad: document.getElementById('reunionModalidad').value,
            lugar: document.getElementById('reunionLugar').value,
            asistentes: document.getElementById('reunionAsistentes').value,
            temas: document.getElementById('reunionTemas').value,
            acuerdos: document.getElementById('reunionAcuerdos').value,
            proxima: document.getElementById('reunionProxima').value,
            advertencia: document.getElementById('reunionAdvertencia').checked
        };

        if (editandoId) {
            const idx = reuniones.findIndex(x => x.id === editandoId);
            reuniones[idx] = nuevaReunion;
        } else {
            reuniones.push(nuevaReunion);
        }

        localStorage.setItem(STORAGE_REUNIONES, JSON.stringify(reuniones));
        modal.style.display = 'none';
        renderLista();
    });

    // --- Eventos Globales ---
    btnNueva.addEventListener('click', () => abrirModal());
    btnCancelar.addEventListener('click', () => modal.style.display = 'none');

    window.editarReunion = (id) => abrirModal(id);
    window.borrarReunion = (id) => {
        if (confirm('¿Eliminar esta acta de reunión?')) {
            reuniones = reuniones.filter(m => m.id !== id);
            localStorage.setItem(STORAGE_REUNIONES, JSON.stringify(reuniones));
            renderLista();
        }
    };

    // --- GENERAR PDF DEL ACTA ---
    window.generarPdfReunion = function(id) {
        const r = reuniones.find(x => x.id === id);
        if (!r) return;
        
        const config = JSON.parse(localStorage.getItem('planIgualdadConfig') || '{}');
        const configList = MODELO.getResponsables();
        const cumplimiento = MODELO.getEstadoCompleto();
        
        // Diccionario para traducir los códigos a nombres reales
        const nombresPasos = {
            f1p1: 'Declaración de compromiso', f1p2: 'Constitución de la Comisión', f1p3: 'Acta de constitución', f1p4: 'Comunicación a la plantilla',
            f2p1: 'Planificación del diagnóstico', f2p2: 'Recogida de datos', f2p3: 'Informe diagnóstico', f2p4: 'Encuesta a la plantilla',
            f3p1: 'Registro Retributivo', f3p2: 'Consulta a la RLPT', f3p3: 'Valoración de Puestos', f3p4: 'Auditoría Retributiva', f3p5: 'Análisis de brecha',
            f4p1: 'Definición de objetivos', f4p2: 'Diseño de medidas', f4p3: 'Medios y recursos', f4p4: 'Calendario',
            f5p1: 'Acta de aprobación', f5p2: 'Registro REGCON', f5p3: 'Sistema de seguimiento', f5p4: 'Procedimiento de revisión',
            f6p1: 'Protocolo de acoso', f6p2: 'Canal de denuncias', f6p3: 'Protección violencia de género'
        };
        const nombrePaso = (id) => nombresPasos[id.toLowerCase()] || id.toUpperCase();

        const fHoy = new Date(r.fecha).toLocaleDateString('es-ES');
        const fProx = r.proxima ? new Date(r.proxima).toLocaleDateString('es-ES') : 'Por determinar';

        // Buscar hallazgos automáticos
        let hallazgosHTML = '';
        let hayHallazgos = false;
        for (const [pasoId, datos] of Object.entries(cumplimiento)) {
            const paso = MODELO.normalizarPaso(datos);
            if (paso.resultado_auditoria === 'parcial' || paso.resultado_auditoria === 'no_conforme') {
                hayHallazgos = true;
                const estadoTxt = paso.resultado_auditoria === 'parcial' ? '⚠️ PARCIAL' : '❌ NO CONFORME';
                hallazgosHTML += `
                    <div class="hallazgo">
                        <p style="margin: 0 0 5px 0;"><strong>${nombrePaso(pasoId)} - ${estadoTxt}</strong></p>
                        <p style="margin: 0 0 5px 0;"><strong>Hallazgo:</strong> ${paso.hallazgos || 'Pendiente de definir'}</p>
                        <p style="margin: 0;"><strong>Petición de la Comisión:</strong> ${paso.plan_accion || 'Pendiente de definir'}</p>
                    </div>
                `;
            }
        }
        if (!hayHallazgos) hallazgosHTML = '<p style="color: var(--success);">✅ No hay hallazgos pendientes en este momento.</p>';

        // --- BUSCAR CAMBIOS REALIZADOS EN LA FECHA DE LA REUNIÓN ---
        let cambiosHTML = '';
        const fechaReunionStr = r.fecha; // Formato YYYY-MM-DD
        
        for (const [pasoId, datos] of Object.entries(cumplimiento)) {
            const paso = MODELO.normalizarPaso(datos);
            
            // Buscamos en el historial si hay alguna acción con la fecha de la reunión
            const cambiosDelDia = paso.historial.filter(h => h.fecha.startsWith(fechaReunionStr));
            
            if (cambiosDelDia.length > 0) {
                cambiosHTML += `<li style="margin-bottom: 0.3rem;"><strong>${nombrePaso(pasoId)}:</strong> `;
                cambiosHTML += cambiosDelDia.map(c => c.accion).join(' | ');
                cambiosHTML += ` (por ${cambiosDelDia[0].usuario})</li>`;
            }
        }

        let seccionCambios = '';
        if (cambiosHTML) {
            seccionCambios = `
                <div class="seccion">
                    <h3>5. ACTUALIZACIONES DEL ESTADO DEL PLAN EN ESTA SESIÓN</h3>
                    <p>Durante la reunión del día de hoy, se han registrado los siguientes avances en la aplicación:</p>
                    <ul style="padding-left: 1.5rem;">
                        ${cambiosHTML}
                    </ul>
                </div>
            `;
        }

        // Generar HTML para imprimir en una nueva ventana
        const ventana = window.open('', '_blank');
        ventana.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Acta de Reunión - ${fHoy}</title>
                <style>
                    body { font-family: sans-serif; padding: 2rem; color: #000; line-height: 1.5; }
                    h1, h2 { text-align: center; }
                    .seccion { margin-top: 1.5rem; page-break-inside: avoid; }
                    .seccion h3 { background: #f4f4f4; color: #000; padding: 0.5rem; border-bottom: 2px solid #000; margin-bottom: 0.8rem; text-transform: uppercase; font-size: 14px; }
                    .hallazgo { page-break-inside: avoid; margin-bottom: 10px; padding: 10px; border: 1px solid #ccc; }
                    .firmas { margin-top: 4rem; display: flex; justify-content: space-between; text-align: center; }
                    @media print { .no-print { display: none !important; } }
                    @media print { body { padding: 0; } }
                </style>
            </head>
            <body>
                <div class="no-print" style="text-align: right; margin-bottom: 2rem;">
                    <button onclick="window.print()" style="padding: 10px 20px; background: #6a1b9a; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">🖨️ Imprimir / Guardar como PDF</button>
                    <button onclick="window.close()" style="padding: 10px 20px; background: #ccc; color: black; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; margin-left: 10px;">Cerrar</button>
                </div>
                <h1>ACTA DE REUNIÓN DE LA COMISIÓN NEGOCIADORA</h1>
                <h2>${config.empresaNombre || 'Empresa'}</h2>
                
                <p style="margin-top:2rem;"><strong>Lugar:</strong> ${r.lugar || '—'}</p>
                <p><strong>Fecha:</strong> ${fHoy}</p>
                ${r.hora ? `<p><strong>Hora de inicio:</strong> ${r.hora} h</p>` : ''}
                <p><strong>Modalidad de la reunión:</strong> ${r.modalidad || 'Presencial'}</p>

                <div class="seccion">
                    <h3>1. ASISTENTES</h3>
                    ${(() => {
                        // Generar listas separadas por empresa y trabajadores
                        let empresaAsist = [];
                        let trabajadoresAsist = [];
                        let otrosAsist = [];
                        
                        (r.asistentesData || []).forEach(a => {
                            if (a.estado === 'No asiste') return;
                            // Buscar el rol de este miembro en la config
                            const miembro = configList.find(m => m.valor === a.nombre);
                            const rol = miembro ? miembro.rol : '';
                            
                            const texto = `<li>${a.nombre} (${a.estado})</li>`;
                            
                            if (rol.includes('Empresa') || rol.includes('Presidente')) empresaAsist.push(texto);
                            else if (rol.includes('Trabajadores') || rol.includes('Secretario')) trabajadoresAsist.push(texto);
                            else otrosAsist.push(texto);
                        });
                        
                        let html = '';
                        if (empresaAsist.length) html += `<p style="margin-bottom:0.2rem;"><strong>Por la Empresa:</strong></p><ul style="margin-top:0; margin-bottom:1rem;">${empresaAsist.join('')}</ul>`;
                        if (trabajadoresAsist.length) html += `<p style="margin-bottom:0.2rem;"><strong>Por la Representación de los Trabajadores:</strong></p><ul style="margin-top:0; margin-bottom:1rem;">${trabajadoresAsist.join('')}</ul>`;
                        if (otrosAsist.length) html += `<p style="margin-bottom:0.2rem;"><strong>Otros asistentes:</strong></p><ul style="margin-top:0; margin-bottom:1rem;">${otrosAsist.join('')}</ul>`;
                        
                        if (!html) html = '<p>No especificados</p>';
                        return html;
                    })()}
                </div>

                <div class="seccion">
                    <h3>2. ORDEN DEL DÍA / TEMAS TRATADOS</h3>
                    <p style="white-space: pre-wrap;">${r.temas || 'No especificado'}</p>
                </div>

                <div class="seccion">
                    <h3>3. ACUERDOS ALCANZADOS</h3>
                    <p style="white-space: pre-wrap;">${r.acuerdos || 'Sin acuerdos registrados'}</p>
                </div>

                <div class="seccion">
                    <h3>4. ESTADO DE LA AUDITORÍA (Hallazgos pendientes)</h3>
                    <p>Se requiere a la empresa la subsanación de los siguientes puntos:</p>
                    ${hallazgosHTML}
                </div>

                ${r.advertencia ? `
                <div class="seccion" style="border: 2px solid #000; padding: 1rem; page-break-inside: avoid;">
                    <h4 style="margin-top:0; text-transform: uppercase;">Advertencia Legal y Constancia de Incumplimiento</h4>
                    <p style="margin: 0;">Se deja constancia expresa de que la Comisión Negociadora ha solicitado a la Dirección la documentación detallada, no habiendo sido entregada en su totalidad hasta la fecha. Se advierte a la Empresa de su obligación legal conforme al RD 901/2020. La persistencia obligará a la Comisión a poner los hechos en conocimiento de la Inspección de Trabajo.</p>
                </div>
                ` : ''}

                ${seccionCambios}

                <div class="seccion">
                    <h3>6. PRÓXIMA REUNIÓN</h3>
                    <p><strong>${fProx}</strong></p>
                </div>

                <p style="margin-top:2rem;">Y sin más asuntos que tratar, se da por finalizada la reunión, firmando el presente documento en prueba de conformidad.</p>

                <div class="firmas">
                    <div style="width:45%;">
                        <p>_____________________________</p>
                        <p><strong>Por la Empresa</strong></p>
                    </div>
                    <div style="width:45%;">
                        <p>_____________________________</p>
                        <p><strong>Por la Comisión</strong></p>
                        <p>${config.comitePresidente || 'Presidencia'}</p>
                    </div>
                </div>
            </body>
            </html>
        `);
        ventana.document.close();
        
    };

    // Inicializar
    renderLista();
});
