// reuniones.js - Gestión del Libro de Actas y firmas digitales

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

    // --- Renderizar Asistentes ---
    function renderizarListaAsistentes(asistenciasGuardadas = []) {
        const contenedor = document.getElementById('listaAsistentes');
        contenedor.innerHTML = '';
        
        const miembros = MODELO.getResponsables();
        
        if (miembros.length === 0) {
            contenedor.innerHTML = '<p style="color:var(--danger); font-size:0.9rem;">⚠️ No hay miembros configurados. Ve a Configuración para añadirlos.</p>';
            return;
        }

        const empresa = [];
        const trabajadores = [];

        miembros.forEach(m => {
            if (m.parte === 'empresa') empresa.push(m);
            else trabajadores.push(m);
        });

        const crearSelect = (m) => {
            const guardado = asistenciasGuardadas.find(a => a.nombre === m.valor);
            const estadoActual = guardado ? guardado.estado : 'Presencial';
            
            const div = document.createElement('div');
            div.style.display = 'flex';
            div.style.justifyContent = 'space-between';
            div.style.alignItems = 'center';
            div.style.gap = '1rem';
            div.style.padding = '0.4rem 0';
            div.style.borderBottom = '1px solid #eee';

            div.innerHTML = `
                <div style="font-weight: 500; font-size: 0.95rem;">${m.valor} <small style="color:var(--text-light); font-size: 0.8rem;">- ${m.rol}</small></div>
                <select class="select-asistencia" data-nombre="${m.valor}" style="padding: 0.3rem; border-radius: 4px; border: 1px solid #ccc;">
                    <option value="Presencial" ${estadoActual === 'Presencial' ? 'selected' : ''}>Presencial</option>
                    <option value="Telemático" ${estadoActual === 'Telemático' ? 'selected' : ''}>Telemático</option>
                    <option value="No asiste" ${estadoActual === 'No asiste' ? 'selected' : ''}>No asiste</option>
                </select>
            `;
            return div;
        };

        if (empresa.length > 0) {
            const titulo = document.createElement('div');
            titulo.innerHTML = '<strong style="color: var(--primary-dark); font-size: 0.85rem; margin-top: 0.5rem; display: block;">🏢 Por la Empresa:</strong>';
            contenedor.appendChild(titulo);
            empresa.forEach(m => contenedor.appendChild(crearSelect(m)));
        }

        if (trabajadores.length > 0) {
            const titulo = document.createElement('div');
            titulo.innerHTML = '<strong style="color: var(--success); font-size: 0.85rem; margin-top: 1rem; display: block;">👷 Por los Trabajadores:</strong>';
            contenedor.appendChild(titulo);
            trabajadores.forEach(m => contenedor.appendChild(crearSelect(m)));
        }
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
            document.getElementById('reunionAcuerdos').value = r.acuerdos || '';
            document.getElementById('reunionProxima').value = r.proxima || '';
            document.getElementById('reunionAdvertencia').checked = r.advertencia || false;
            renderizarListaAsistentes(r.asistentesData || []);
        } else {
            modalTitulo.textContent = 'Nueva Reunión';
            form.reset();
            document.getElementById('reunionFecha').value = new Date().toISOString().split('T')[0];
            renderizarListaAsistentes([]);
        }
        
        modal.style.display = 'flex';
    }

    // --- Guardar Reunión ---
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const selectores = document.querySelectorAll('.select-asistencia');
        const asistentesData = [];
        let textoAsistentes = '';
        
        selectores.forEach(sel => {
            const nombre = sel.dataset.nombre;
            const estado = sel.value;
            asistentesData.push({ nombre, estado });
            if (estado !== 'No asiste') {
                textoAsistentes += `${nombre} (${estado})\n`;
            }
        });

        const nuevaReunion = {
            id: editandoId || Date.now().toString(),
            fecha: document.getElementById('reunionFecha').value,
            hora: document.getElementById('reunionHora').value,
            modalidad: document.getElementById('reunionModalidad').value,
            lugar: document.getElementById('reunionLugar').value,
            temas: document.getElementById('reunionTemas').value,
            acuerdos: document.getElementById('reunionAcuerdos').value,
            proxima: document.getElementById('reunionProxima').value,
            advertencia: document.getElementById('reunionAdvertencia').checked,
            asistentesData: asistentesData,
            asistentes: textoAsistentes.trim()
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

    // --- GENERAR PDF DEL ACTA CON FIRMAS ---
    window.generarPdfReunion = function(id) {
        const r = reuniones.find(x => x.id === id);
        if (!r) return;
        
        const config = JSON.parse(localStorage.getItem('planIgualdadConfig') || '{}');
        const cumplimiento = MODELO.getEstadoCompleto();

        const fHoy = new Date(r.fecha).toLocaleDateString('es-ES');
        const fProx = r.proxima ? new Date(r.proxima).toLocaleDateString('es-ES') : 'Por determinar';

        const nombresPasos = {
            f1p1: 'Declaración de compromiso', f1p2: 'Constitución de la Comisión', f1p3: 'Acta de constitución', f1p4: 'Comunicación a la plantilla',
            f2p1: 'Planificación del diagnóstico', f2p2: 'Recogida de datos', f2p3: 'Informe diagnóstico', f2p4: 'Encuesta a la plantilla',
            f3p1: 'Registro Retributivo', f3p2: 'Consulta a la RLPT', f3p3: 'Valoración de Puestos', f3p4: 'Auditoría Retributiva', f3p5: 'Análisis de brecha',
            f4p1: 'Definición de objetivos', f4p2: 'Diseño de medidas', f4p3: 'Medios y recursos', f4p4: 'Calendario',
            f5p1: 'Acta de aprobación', f5p2: 'Registro REGCON', f5p3: 'Sistema de seguimiento', f5p4: 'Procedimiento de revisión',
            f6p1: 'Protocolo de acoso', f6p2: 'Canal de denuncias', f6p3: 'Protección violencia de género'
        };
        const nombrePaso = (id) => nombresPasos[id.toLowerCase()] || id.toUpperCase();

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
        if (!hayHallazgos) hallazgosHTML = '<p style="color: #000;">✅ No hay hallazgos pendientes en este momento.</p>';

        let cambiosHTML = '';
        const fechaReunionStr = r.fecha;
        for (const [pasoId, datos] of Object.entries(cumplimiento)) {
            const paso = MODELO.normalizarPaso(datos);
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
                    <ul style="padding-left: 1.5rem;">${cambiosHTML}</ul>
                </div>
            `;
        }

        const ventana = window.open('', '_blank');
        ventana.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Acta de Reunión - ${fHoy}</title>
                <script src="https://cdn.jsdelivr.net/npm/signature_pad@4.0.0/dist/signature_pad.umd.min.js"></script>
                <style>
                    body { font-family: sans-serif; padding: 2rem; color: #000; line-height: 1.5; }
                    h1, h2 { text-align: center; }
                    .seccion { margin-top: 1.5rem; page-break-inside: avoid; }
                    .seccion h3 { background: #f4f4f4; color: #000; padding: 0.5rem; border-bottom: 2px solid #000; margin-bottom: 0.8rem; text-transform: uppercase; font-size: 14px; }
                    .hallazgo { page-break-inside: avoid; margin-bottom: 10px; padding: 10px; border: 1px solid #ccc; }
                    .firmas { margin-top: 4rem; display: flex; justify-content: space-between; text-align: center; }
                    @media print { .no-print { display: none !important; } body { padding: 0; } }
                </style>
            </head>
            <body>
                <div class="no-print" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem;">
                    <div>
                        <button onclick="document.getElementById('panelFirmas').style.display='block'; window.scrollTo(0,0);" style="padding: 10px 20px; background: #2e7d32; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">✍️ Firmar el Acta</button>
                        <button onclick="window.print()" style="padding: 10px 20px; background: #6a1b9a; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; margin-left: 10px;">🖨️ Imprimir / Guardar como PDF</button>
                        <button onclick="window.close()" style="padding: 10px 20px; background: #ccc; color: black; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; margin-left: 10px;">Cerrar</button>
                    </div>
                </div>

                <div id="panelFirmas" class="no-print" style="display: none; background: #fff; border: 2px solid #6a1b9a; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
                    <h3 style="margin-top: 0; color: #6a1b9a;">Firmas Digitales</h3>
                    <p style="font-size: 0.9rem; margin-bottom: 1rem;">Firmad en los recuadros blancos (con el ratón o el dedo). Las firmas se incrustarán en el documento final.</p>
                    
                    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                        <div style="flex: 1; min-width: 250px;">
                            <label style="font-size: 0.85rem; font-weight: bold;">Firma Presidencia / Empresa</label>
                            <canvas id="canvasEmpresa" style="width: 100%; height: 150px; border: 1px solid #ccc; background: #f9f9f9; border-radius: 4px; touch-action: none;"></canvas>
                        </div>
                        <div style="flex: 1; min-width: 250px;">
                            <label style="font-size: 0.85rem; font-weight: bold;">Firma Secretaría / Trabajadores</label>
                            <canvas id="canvasTrabajadores" style="width: 100%; height: 150px; border: 1px solid #ccc; background: #f9f9f9; border-radius: 4px; touch-action: none;"></canvas>
                        </div>
                    </div>
                    
                    <div style="margin-top: 1rem; display: flex; gap: 1rem;">
                        <button onclick="guardarFirmas()" style="padding: 10px 20px; background: #2e7d32; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">Incrustar Firmas en el Documento</button>
                        <button onclick="limpiarFirmas()" style="padding: 10px 20px; background: #ccc; border: none; border-radius: 5px; cursor: pointer;">Limpiar todo</button>
                    </div>
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
                        let empresaAsist = [];
                        let trabajadoresAsist = [];
                        const todosLosMiembros = MODELO.getResponsables();
                        
                        (r.asistentesData || []).forEach(a => {
                            if (a.estado === 'No asiste') return;
                            const miembro = todosLosMiembros.find(m => m.valor === a.nombre);
                            const parte = miembro ? miembro.parte : 'trabajadores';
                            const texto = `<li>${a.nombre} (${a.estado})</li>`;
                            
                            if (parte === 'empresa') empresaAsist.push(texto);
                            else trabajadoresAsist.push(texto);
                        });
                        
                        let html = '';
                        if (empresaAsist.length) html += `<p style="margin-bottom:0.2rem;"><strong>Por la Empresa:</strong></p><ul style="margin-top:0; margin-bottom:1rem;">${empresaAsist.join('')}</ul>`;
                        if (trabajadoresAsist.length) html += `<p style="margin-bottom:0.2rem;"><strong>Por la Representación de los Trabajadores:</strong></p><ul style="margin-top:0; margin-bottom:1rem;">${trabajadoresAsist.join('')}</ul>`;
                        
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

                ${seccionCambios}

                ${r.advertencia ? `
                <div class="seccion" style="border: 2px solid #000; padding: 1rem; page-break-inside: avoid;">
                    <h4 style="margin-top:0; text-transform: uppercase;">Advertencia Legal y Constancia de Incumplimiento</h4>
                    <p style="margin: 0;">Se deja constancia expresa de que la Comisión Negociadora ha solicitado a la Dirección la documentación detallada, no habiendo sido entregada en su totalidad hasta la fecha. Se advierte a la Empresa de su obligación legal conforme al RD 901/2020. La persistencia obligará a la Comisión a poner los hechos en conocimiento de la Inspección de Trabajo.</p>
                </div>
                ` : ''}

                <div class="seccion">
                    <h3>6. PRÓXIMA REUNIÓN</h3>
                    <p><strong>${fProx}</strong></p>
                </div>

                <p style="margin-top:2rem;">Y sin más asuntos que tratar, se da por finalizada la reunión, firmando el presente documento en prueba de conformidad.</p>

                <div class="firmas">
                    <div style="width:45%;">
                        <div id="firmaImgEmpresa" style="height: 80px; display: flex; align-items: flex-end; justify-content: center; margin-bottom: 0.5rem;"></div>
                        <p style="border-top: 1px solid #000; padding-top: 0.5rem; margin: 0;"><strong>Por la Empresa</strong></p>
                    </div>
                    <div style="width:45%;">
                        <div id="firmaImgTrabajadores" style="height: 80px; display: flex; align-items: flex-end; justify-content: center; margin-bottom: 0.5rem;"></div>
                        <p style="border-top: 1px solid #000; padding-top: 0.5rem; margin: 0;"><strong>Por la Comisión</strong></p>
                    </div>
                </div>

                <script>
                    let sigPadEmpresa, sigPadTrabajadores;
                    
                    window.addEventListener('load', () => {
                        const cEmp = document.getElementById('canvasEmpresa');
                        const cTrab = document.getElementById('canvasTrabajadores');
                        
                        const ratio = Math.max(window.devicePixelRatio || 1, 1);
                        cEmp.width = cEmp.offsetWidth * ratio;
                        cEmp.height = cEmp.offsetHeight * ratio;
                        cEmp.getContext("2d").scale(ratio, ratio);
                        
                        cTrab.width = cTrab.offsetWidth * ratio;
                        cTrab.height = cTrab.offsetHeight * ratio;
                        cTrab.getContext("2d").scale(ratio, ratio);

                        sigPadEmpresa = new SignaturePad(cEmp, { backgroundColor: 'rgba(255, 255, 255, 0)' });
                        sigPadTrabajadores = new SignaturePad(cTrab, { backgroundColor: 'rgba(255, 255, 255, 0)' });
                    });

                    function guardarFirmas() {
                        if (!sigPadEmpresa.isEmpty()) {
                            const dataUrl = sigPadEmpresa.toDataURL('image/png');
                            document.getElementById('firmaImgEmpresa').innerHTML = '<img src="' + dataUrl + '" style="max-height: 80px; max-width: 100%;">';
                        }
                        if (!sigPadTrabajadores.isEmpty()) {
                            const dataUrl = sigPadTrabajadores.toDataURL('image/png');
                            document.getElementById('firmaImgTrabajadores').innerHTML = '<img src="' + dataUrl + '" style="max-height: 80px; max-width: 100%;">';
                        }
                        document.getElementById('panelFirmas').style.display = 'none';
                        alert('✅ Firmas incrustadas. Ya puedes imprimir o guardar el PDF.');
                    }

                    function limpiarFirmas() {
                        if (sigPadEmpresa) sigPadEmpresa.clear();
                        if (sigPadTrabajadores) sigPadTrabajadores.clear();
                        document.getElementById('firmaImgEmpresa').innerHTML = '';
                        document.getElementById('firmaImgTrabajadores').innerHTML = '';
                    }
                <\/script>
            </body>
            </html>
        `);
        ventana.document.close();
    };

    renderLista();
});
