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
                    <div style="display:flex; gap:0.5rem; flex-wrap: wrap;">
                        <button class="btn" onclick="window.generarPdfReunion('${r.id}')" style="background:var(--secondary); padding:0.4rem 0.8rem; font-size:0.85rem;">🖨️ Ver Acta</button>
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

    btnNueva.addEventListener('click', () => abrirModal());
    btnCancelar.addEventListener('click', () => modal.style.display = 'none');

    window.editarReunion = (id) => abrirModal(id);
    window.borrarReunion = (id) => {
        if (confirm('¿Eliminar esta acta de reunión?')) {
            reuniones = reuniones.filter(m => m.id !== id);
            localStorage.setItem(STORAGE_REUNIONES, JSON.stringify(reuniones));
            localStorage.removeItem('firmas_' + id);
            renderLista();
        }
    };

    // --- FUNCIÓN GLOBAL PARA EXPORTAR EL ACTA (Se llama desde dentro del PDF) ---
    window.exportarActaParaFirmar = function(id) {
        // Recuperamos la reunión y las firmas actuales del localStorage
        const listaReuniones = JSON.parse(localStorage.getItem('planIgualdadReuniones') || '[]');
        const acta = listaReuniones.find(x => x.id === id);
        if (!acta) return;
        
        const firmas = JSON.parse(localStorage.getItem('firmas_' + id) || '[]');
        
        const paquete = {
            tipo: 'acta_para_firmar',
            version: '1.0',
            fecha_exportacion: new Date().toISOString(),
            acta: acta,
            firmas: firmas
        };

        const blob = new Blob([JSON.stringify(paquete, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const fechaFmt = new Date(acta.fecha).toLocaleDateString('es-ES').replace(/\//g, '-');
        a.download = `Acta_Para_Firmar_${fechaFmt}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    window.generarPdfReunion = function(id) {
        const r = reuniones.find(x => x.id === id);
        if (!r) return;
        
        const config = JSON.parse(localStorage.getItem('planIgualdadConfig') || '{}');
        const cumplimiento = MODELO.getEstadoCompleto();
        const listaMiembros = MODELO.getResponsables();

        // Identificamos a los de la empresa por su nombre (sin importar mayúsculas/espacios)
        const empresaReales = (config.empresaMiembros || []).map(m => m.nombre.toLowerCase().trim());
        
        const asistentesParaFirmas = (r.asistentesData || []).map(a => {
            const m = listaMiembros.find(x => x.valor === a.nombre);
            // Es de la empresa si su nombre está en la lista de empresa
            const esEmpresa = empresaReales.includes(a.nombre.toLowerCase().trim());
            return { nombre: a.nombre, estado: a.estado, cargo: m ? m.rol : '', esEmpresa: esEmpresa };
        });

        const fHoy = new Date(r.fecha).toLocaleDateString('es-ES');
        const fProx = r.proxima ? new Date(r.proxima).toLocaleDateString('es-ES') : 'Por determinar';

        let hallazgosHTML = '';
        let hayHallazgos = false;
        for (const [pasoId, datos] of Object.entries(cumplimiento)) {
            const paso = MODELO.normalizarPaso(datos);
            if (paso.resultado_auditoria === 'parcial' || paso.resultado_auditoria === 'no_conforme') {
                hayHallazgos = true;
                const estadoTxt = paso.resultado_auditoria === 'parcial' ? '⚠️ PARCIAL' : '❌ NO CONFORME';
                hallazgosHTML += `
                    <div class="hallazgo">
                        <p style="margin: 0 0 5px 0;"><strong>${pasoId.toUpperCase()} - ${estadoTxt}</strong></p>
                        <p style="margin: 0 0 5px 0;"><strong>Hallazgo:</strong> ${paso.hallazgos || 'Pendiente'}</p>
                        <p style="margin: 0;"><strong>Petición:</strong> ${paso.plan_accion || 'Pendiente'}</p>
                    </div>
                `;
            }
        }
        if (!hayHallazgos) hallazgosHTML = '<p style="color: #000;">✅ No hay hallazgos pendientes en este momento.</p>';

        const firmasGuardadas = JSON.parse(localStorage.getItem('firmas_' + r.id) || '[]');

        const ventana = window.open('', '_blank');
        ventana.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Acta de Reunión - ${fHoy}</title>
                <script src="https://cdn.jsdelivr.net/npm/signature_pad@4.0.0/dist/signature_pad.umd.min.js"><\/script>
                <style>
                    body { font-family: sans-serif; padding: 2rem; color: #000; line-height: 1.5; }
                    h1, h2 { text-align: center; }
                    .seccion { margin-top: 1.5rem; page-break-inside: avoid; }
                    .seccion h3 { background: #f4f4f4; color: #000; padding: 0.5rem; border-bottom: 2px solid #000; margin-bottom: 0.8rem; text-transform: uppercase; font-size: 14px; }
                    .hallazgo { page-break-inside: avoid; margin-bottom: 10px; padding: 10px; border: 1px solid #ccc; }
                    @media print { .no-print { display: none !important; } body { padding: 0; } }
                </style>
            </head>
            <body>
                <div class="no-print" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; flex-wrap: wrap; gap: 0.5rem;">
                    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                        <button onclick="abrirPanelFirmas()" style="padding: 10px 20px; background: #2e7d32; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">✍️ Firmar el Acta</button>
                        <button onclick="window.opener.exportarActaParaFirmar('${r.id}')" style="padding: 10px 20px; background: #1976d2; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">📤 Exportar Acta (JSON)</button>
                        <button onclick="window.print()" style="padding: 10px 20px; background: #6a1b9a; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">🖨️ Guardar como PDF</button>
                        <button onclick="window.close()" style="padding: 10px 20px; background: #ccc; color: black; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">Cerrar</button>
                    </div>
                </div>

                <div id="panelFirmas" class="no-print" style="display: none; background: #fff; border: 2px solid #6a1b9a; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
                    <h3 style="margin-top: 0; color: #6a1b9a;">Firmas Digitales (Solo RLPT)</h3>
                    <p style="font-size: 0.9rem; margin-bottom: 1rem;">Selecciona a la persona, dibuja su firma y pulsa "Añadir Firma".</p>
                    
                    <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem; flex-wrap: wrap;">
                        <select id="selectFirmante" style="padding: 0.5rem; border-radius: 4px; border: 1px solid #ccc; flex: 1; min-width: 200px;">
                            <option value="">— Selecciona quién firma —</option>
                        </select>
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem;">
                        <label style="font-size: 0.85rem; font-weight: bold;">Firma (Dibuja con el dedo o el ratón):</label>
                        <canvas id="canvasFirma" style="width: 100%; height: 150px; border: 1px solid #ccc; background: #f9f9f9; border-radius: 4px; touch-action: none;"></canvas>
                    </div>
                    
                    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                        <button onclick="anadirFirma()" style="padding: 10px 20px; background: #2e7d32; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">➕ Añadir Firma</button>
                        <button onclick="limpiarLienzo()" style="padding: 10px 20px; background: #ccc; border: none; border-radius: 5px; cursor: pointer;">Borrar Trazo</button>
                        <button onclick="cerrarPanelFirmas()" style="padding: 10px 20px; background: #6a1b9a; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: auto;">Terminar y Cerrar</button>
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
                    ${r.asistentes || 'No especificados'}
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

                <div class="seccion">
                    <h3>6. PRÓXIMA REUNIÓN</h3>
                    <p><strong>${fProx}</strong></p>
                </div>

                <p style="margin-top:2rem;">Y sin más asuntos que tratar, se da por finalizada la reunión, firmando el presente documento en prueba de conformidad.</p>

                <div class="firmas" style="margin-top: 4rem; display: block; page-break-inside: avoid;">
                    <p style="text-align: center; font-size: 12px; color: #666; margin-bottom: 1rem; font-weight:bold;">POR LA REPRESENTACIÓN LEGAL DE LOS TRABAJADORES (RLPT)</p>
                    
                    <div id="contenedorFirmas" style="display: flex; flex-wrap: wrap; justify-content: space-around; gap: 1rem; margin-bottom: 3rem;"></div>

                    <div style="border: 1px solid #000; padding: 1.5rem; border-radius: 8px; text-align: center; background: #fff; margin-top: 3rem; page-break-inside: avoid;">
                        <p style="margin: 0 0 0.5rem 0; font-weight: bold; color: #000; font-size: 14px;">Firma de la Dirección / Representación de la Empresa</p>
                        <p style="margin: 0; font-size: 0.85rem; color: #555;">Este espacio está reservado para la firma de la empresa.</p>
                        <div style="height: 100px;"></div>
                        <p style="border-top: 1px solid #000; width: 70%; margin: 0 auto; padding-top: 0.5rem; font-size: 12px;">Fdo: La Dirección / RRHH</p>
                    </div>
                </div>

                <script>
                    let sigPad;
                    let asistentesReunion = ${JSON.stringify(asistentesParaFirmas)};
                    const reunionId = '${r.id}';
                    let firmasActuales = ${JSON.stringify(firmasGuardadas)};

                    function pintarFirma(nombre, dataUrl, fechaStr) {
                        const contenedor = document.getElementById('contenedorFirmas');
                        const div = document.createElement('div');
                        div.style.width = '45%';
                        div.style.textAlign = 'center';
                        div.style.marginBottom = '1rem';
                        
                        // Si no nos pasan fecha (al cargar antiguas), usamos un texto genérico
                        const textoFecha = fechaStr ? fechaStr : 'Fecha no registrada';
                        
                        div.innerHTML = '<img src="' + dataUrl + '" style="max-height: 80px; max-width: 100%;">' +
                            '<p style="border-top: 1px solid #000; padding-top: 0.5rem; margin: 0; font-size: 12px;">' +
                            '<strong>Firmado por: ' + nombre + '</strong><br>' +
                            '<span style="color: #555;">' + textoFecha + '</span></p>';
                        contenedor.appendChild(div);
                    }

                    window.addEventListener('load', () => {
                        firmasActuales.forEach(f => pintarFirma(f.nombre, f.imagen, f.fecha));
                    });

                    function abrirPanelFirmas() {
                        const panel = document.getElementById('panelFirmas');
                        const select = document.getElementById('selectFirmante');
                        const canvas = document.getElementById('canvasFirma');
                        
                        panel.style.display = 'block';
                        
                        const ratio = Math.max(window.devicePixelRatio || 1, 1);
                        canvas.width = canvas.offsetWidth * ratio;
                        canvas.height = canvas.offsetHeight * ratio;
                        canvas.getContext("2d").scale(ratio, ratio);
                        
                        if (!sigPad) {
                            sigPad = new SignaturePad(canvas, { backgroundColor: 'rgba(255, 255, 255, 0)' });
                        } else {
                            sigPad.clear();
                        }
                        
                        select.innerHTML = '<option value="">— Selecciona quién firma —</option>';
                        asistentesReunion.forEach(a => {
                            // FILTRO INFALIBLE: Si esEmpresa es true, se ignora. Si es false o no existe, se añade.
                            if (a.esEmpresa === true) return;
                            if (a.estado === 'No asiste') return;

                            const opt = document.createElement('option');
                            opt.value = a.nombre;
                            opt.textContent = a.nombre + (a.cargo ? ' - ' + a.cargo : '');
                            
                            if (firmasActuales.some(f => f.nombre === a.nombre)) {
                                opt.disabled = true;
                                opt.textContent += ' (Ya firmado)';
                            }
                            select.appendChild(opt);
                        });
                        
                        window.scrollTo(0,0);
                    }

                    function anadirFirma() {
                        const select = document.getElementById('selectFirmante');
                        const nombreSeleccionado = select.value;
                        
                        if (!nombreSeleccionado) { alert('⚠️ Primero selecciona quién va a firmar.'); return; }
                        if (!sigPad || sigPad.isEmpty()) { alert('⚠️ El lienzo está vacío. Dibuja la firma.'); return; }

                        const dataUrl = sigPad.toDataURL('image/png');
                        
                        // Capturamos la fecha y hora local
                        const ahora = new Date();
                        const fechaFmt = ahora.toLocaleDateString('es-ES') + ' a las ' + ahora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
                        
                        // Guardamos la firma con su fecha
                        firmasActuales.push({ nombre: nombreSeleccionado, imagen: dataUrl, fecha: fechaFmt });
                        
                        localStorage.setItem('firmas_' + reunionId, JSON.stringify(firmasActuales));
                        
                        pintarFirma(nombreSeleccionado, dataUrl, fechaFmt);
                        
                        sigPad.clear();
                        select.value = '';
                        select.options[select.selectedIndex].disabled = true;
                        select.options[select.selectedIndex].textContent += ' (Ya firmado)';
                    }

                    function limpiarLienzo() { if (sigPad) sigPad.clear(); }
                    function cerrarPanelFirmas() { document.getElementById('panelFirmas').style.display = 'none'; }
                <\/script>
            </body>
            </html>
        `);
        ventana.document.close();
    };

    // 3. Lógica de importación
    window.importarActaParaFirmar = function(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.tipo !== 'acta_para_firmar') {
                    alert('❌ Este archivo no es un acta válida para firmar.');
                    return;
                }

                const actaRecibida = data.acta;
                let reunionesLocales = JSON.parse(localStorage.getItem('planIgualdadReuniones') || '[]');
                
                const idx = reunionesLocales.findIndex(r => r.id === actaRecibida.id);
                if (idx === -1) {
                    reunionesLocales.push(actaRecibida);
                } else {
                    reunionesLocales[idx] = { ...reunionesLocales[idx], ...actaRecibida };
                }
                localStorage.setItem('planIgualdadReuniones', JSON.stringify(reunionesLocales));

                const firmasLocales = JSON.parse(localStorage.getItem('firmas_' + actaRecibida.id) || '[]');
                if (data.firmas && Array.isArray(data.firmas)) {
                    data.firmas.forEach(firmaRecibida => {
                        const indexFirma = firmasLocales.findIndex(f => f.nombre === firmaRecibida.nombre);
                        if (indexFirma === -1) {
                            firmasLocales.push(firmaRecibida);
                        } else {
                            firmasLocales[indexFirma] = firmaRecibida;
                        }
                    });
                }
                localStorage.setItem('firmas_' + actaRecibida.id, JSON.stringify(firmasLocales));

                alert('✅ Acta importada con éxito. Se han recuperado las firmas anteriores y se ha abierto el documento para que puedas firmar.');
                
                setTimeout(() => {
                    window.generarPdfReunion(actaRecibida.id);
                    setTimeout(() => location.reload(), 2000);
                }, 500);

            } catch (err) {
                console.error(err);
                alert('❌ Error al leer el archivo. Asegúrate de que es un archivo válido.');
            }
            event.target.value = '';
        };
        reader.readAsText(file);
    };

    renderLista();
});
