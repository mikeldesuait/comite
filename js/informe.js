// informe.js - Genera la vista imprimible del Plan de Igualdad con sistema de firmas (RLPT)

document.addEventListener('DOMContentLoaded', () => {
    const contenedor = document.getElementById('informeContenido');
    
    const config = JSON.parse(localStorage.getItem('planIgualdadConfig') || '{}');
    const cumplimiento = MODELO.getEstadoCompleto();
    const medidas = JSON.parse(localStorage.getItem('planIgualdadMedidas') || '[]');
    const listaMiembros = MODELO.getResponsables();

    // Recuperamos firmas guardadas del informe
    let firmasGuardadas = JSON.parse(localStorage.getItem('firmas_informe_final') || '[]');

    // 1. Cabecera
    let html = `
        <div style="text-align: center; margin-bottom: 3rem; border-bottom: 2px solid #000; padding-bottom: 1rem;">
            <h1>PLAN DE IGUALDAD</h1>
            <h2>${config.empresaNombre || 'Empresa sin configurar'}</h2>
            <p><strong>CIF:</strong> ${config.empresaCif || '—'} | <strong>Empleados:</strong> ${config.empresaEmpleados || '—'} | <strong>Fecha:</strong> ${new Date().toLocaleDateString('es-ES')}</p>
        </div>
    `;

    // 2. Auditoría
    html += `<h2 style="margin-top: 2rem;">1. Resumen de la Auditoría Normativa</h2>`;
    let stats = { conforme: 0, parcial: 0, no_conforme: 0, pendiente: 0 };
    let hallazgosHTML = '';
    
    for (const [id, datos] of Object.entries(cumplimiento)) {
        const paso = MODELO.normalizarPaso(datos);
        if (paso.resultado_auditoria === 'parcial' || paso.resultado_auditoria === 'no_conforme') {
            stats[paso.resultado_auditoria]++;
            hallazgosHTML += `
                <div style="margin-bottom: 1rem; padding: 1rem; border: 1px solid #ccc; border-left: 4px solid #000;">
                    <h4 style="margin-bottom: 0.5rem;">Hallazgo en: ${id.toUpperCase()}</h4>
                    <p><strong>Problema detectado:</strong> ${paso.hallazgos || 'Sin especificar.'}</p>
                    <p><strong>Plan de acción:</strong> ${paso.plan_accion || 'Sin especificar.'}</p>
                </div>
            `;
        } else if (paso.resultado_auditoria === 'conforme') {
            stats.conforme++;
        } else {
            stats.pendiente++;
        }
    }

    html += `
        <p>Tras la revisión de los pasos normativos, se han detectado las siguientes conclusiones:</p>
        <ul style="margin-bottom: 2rem;">
            <li><strong>Pasos Conformes:</strong> ${stats.conforme}</li>
            <li><strong>Pasos Parciales:</strong> ${stats.parcial}</li>
            <li><strong>Pasos No Conformes:</strong> ${stats.no_conforme}</li>
            <li><strong>Pasos Pendientes:</strong> ${stats.pendiente}</li>
        </ul>
    `;

    if (hallazgosHTML) {
        html += `<h3>Detalle de Hallazgos</h3>` + hallazgosHTML;
    } else {
        html += `<p>✅ No se han registrado hallazgos.</p>`;
    }

    // 3. Medidas
    html += `<h2 style="margin-top: 2rem;">2. Objetivos y Medidas Correctivas</h2>`;
    if (medidas.length === 0) {
        html += `<p>No se han definido medidas todavía.</p>`;
    } else {
        html += `<table style="width: 100%; border-collapse: collapse; margin-top: 1rem; font-size: 0.9rem;">
            <thead><tr style="background: #e0e0e0; border-bottom: 2px solid #000;">
                <th style="padding: 0.5rem; text-align: left; border: 1px solid #000;">Medida</th>
                <th style="padding: 0.5rem; text-align: left; border: 1px solid #000;">Plazo</th>
                <th style="padding: 0.5rem; text-align: left; border: 1px solid #000;">Responsable</th>
            </tr></thead><tbody>`;
        medidas.forEach(m => {
            html += `<tr>
                <td style="padding: 0.5rem; border: 1px solid #000;"><strong>${m.titulo}</strong><br><small>${m.indicador || ''}</small></td>
                <td style="padding: 0.5rem; border: 1px solid #000;">${m.plazo ? new Date(m.plazo).toLocaleDateString('es-ES') : '—'}</td>
                <td style="padding: 0.5rem; border: 1px solid #000;">${m.responsable || '—'}</td>
            </tr>`;
        });
        html += `</tbody></table>`;
    }

    // 4. Bloque de Firmas
    html += `
        <div style="margin-top: 4rem; page-break-inside: avoid;">
            <p style="text-align: center; font-size: 12px; color: #666; margin-bottom: 1rem; font-weight:bold;">POR LA REPRESENTACIÓN LEGAL DE LOS TRABAJADORES (RLPT)</p>
            
            <div id="contenedorFirmasInforme" style="display: flex; flex-wrap: wrap; justify-content: space-around; gap: 1rem;">
                <!-- Firmas -->
            </div>

            <div style="border: 1px solid #000; padding: 1.5rem; border-radius: 8px; text-align: center; background: #fff; margin-top: 3rem; page-break-inside: avoid;">
                <p style="margin: 0 0 0.5rem 0; font-weight: bold; color: #000; font-size: 14px;">Firma de la Dirección / Representación de la Empresa</p>
                <p style="margin: 0; font-size: 0.85rem; color: #555;">Este espacio está reservado para la firma de la empresa.</p>
                <div style="height: 100px;"></div>
                <p style="border-top: 1px solid #000; width: 70%; margin: 0 auto; padding-top: 0.5rem; font-size: 12px;">Fdo: La Dirección / RRHH</p>
            </div>
        </div>
    `;

    // 5. Inyectar todo en la página
    contenedor.innerHTML = `
        <div class="no-print" style="display: flex; gap: 0.5rem; margin-bottom: 2rem; flex-wrap: wrap;">
            <button onclick="abrirPanelFirmasInforme()" style="padding: 10px 20px; background: #2e7d32; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">✍️ Firmar el Informe</button>
            <button onclick="exportarInformeParaFirmar()" style="padding: 10px 20px; background: #1976d2; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">📤 Exportar Informe (JSON)</button>
            <button onclick="window.print()" style="padding: 10px 20px; background: #6a1b9a; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">🖨️ Guardar como PDF</button>
            <a href="documentos.html" class="btn" style="background: #ccc; color: black;">Volver</a>
        </div>

        <div id="panelFirmasInforme" class="no-print" style="display: none; background: #fff; border: 2px solid #6a1b9a; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
            <h3 style="margin-top: 0; color: #6a1b9a;">Firmas Digitales (Solo RLPT)</h3>
            <p style="font-size: 0.9rem; margin-bottom: 1rem;">Selecciona quién firma, dibuja su rúbrica y pulsa "Añadir Firma".</p>
            
            <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem; flex-wrap: wrap;">
                <select id="selectFirmanteInforme" style="padding: 0.5rem; border-radius: 4px; border: 1px solid #ccc; flex: 1; min-width: 200px;">
                    <option value="">— Selecciona quién firma —</option>
                </select>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem;">
                <label style="font-size: 0.85rem; font-weight: bold;">Firma (Dibuja con el dedo o el ratón):</label>
                <canvas id="canvasFirmaInforme" style="width: 100%; height: 150px; border: 1px solid #ccc; background: #f9f9f9; border-radius: 4px; touch-action: none;"></canvas>
            </div>
            
            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                <button onclick="anadirFirmaInforme()" style="padding: 10px 20px; background: #2e7d32; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">➕ Añadir Firma</button>
                <button onclick="limpiarLienzoInforme()" style="padding: 10px 20px; background: #ccc; border: none; border-radius: 5px; cursor: pointer;">Borrar Trazo</button>
                <button onclick="document.getElementById('panelFirmasInforme').style.display='none'" style="padding: 10px 20px; background: #6a1b9a; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: auto;">Terminar y Cerrar</button>
            </div>
        </div>

        ${html}
    `;

    // 6. Lógica de Firmas
    let sigPadInforme;

    function pintarFirmaInforme(nombre, dataUrl, fechaStr) {
        const contenedorFirmas = document.getElementById('contenedorFirmasInforme');
        const div = document.createElement('div');
        div.style.width = '45%';
        div.style.textAlign = 'center';
        div.style.marginBottom = '1rem';
        div.innerHTML = '<img src="' + dataUrl + '" style="max-height: 80px; max-width: 100%;">' +
            '<p style="border-top: 1px solid #000; padding-top: 0.5rem; margin: 0; font-size: 12px;">' +
            '<strong>Firmado por: ' + nombre + '</strong><br>' +
            '<span style="color: #555;">' + fechaStr + '</span></p>';
        contenedorFirmas.appendChild(div);
    }

    firmasGuardadas.forEach(f => pintarFirmaInforme(f.nombre, f.imagen, f.fecha));

    window.abrirPanelFirmasInforme = function() {
        const panel = document.getElementById('panelFirmasInforme');
        const select = document.getElementById('selectFirmanteInforme');
        const canvas = document.getElementById('canvasFirmaInforme');
        
        panel.style.display = 'block';
        
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        canvas.getContext("2d").scale(ratio, ratio);
        
        if (!sigPadInforme) {
            sigPadInforme = new SignaturePad(canvas, { backgroundColor: 'rgba(255, 255, 255, 0)' });
        } else {
            sigPadInforme.clear();
        }
        
        select.innerHTML = '<option value="">— Selecciona quién firma —</option>';
        listaMiembros.forEach(m => {
            // FILTRO: Solo trabajadores
            if (m.parte === 'empresa') return;

            const opt = document.createElement('option');
            opt.value = m.valor;
            opt.textContent = `${m.valor} (${m.rol})`;
            
            if (firmasGuardadas.some(f => f.nombre === m.valor)) {
                opt.disabled = true;
                opt.textContent += ' (Ya firmado)';
            }
            select.appendChild(opt);
        });
    };

    window.anadirFirmaInforme = function() {
        const select = document.getElementById('selectFirmanteInforme');
        const nombreSeleccionado = select.value;
        
        if (!nombreSeleccionado) { alert('⚠️ Primero selecciona quién va a firmar.'); return; }
        if (!sigPadInforme || sigPadInforme.isEmpty()) { alert('⚠️ El lienzo está vacío. Dibuja la firma.'); return; }

        const dataUrl = sigPadInforme.toDataURL('image/png');
        const ahora = new Date();
        const fechaFmt = ahora.toLocaleDateString('es-ES') + ' a las ' + ahora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        
        firmasGuardadas.push({ nombre: nombreSeleccionado, imagen: dataUrl, fecha: fechaFmt });
        localStorage.setItem('firmas_informe_final', JSON.stringify(firmasGuardadas));
        
        pintarFirmaInforme(nombreSeleccionado, dataUrl, fechaFmt);
        
        sigPadInforme.clear();
        select.value = '';
        select.options[select.selectedIndex].disabled = true;
        select.options[selectedIndex].textContent += ' (Ya firmado)';
    };

    window.limpiarLienzoInforme = function() {
        if (sigPadInforme) sigPadInforme.clear();
    };

    // 7. Exportar e Importar
    window.exportarInformeParaFirmar = function() {
        const paquete = {
            tipo: 'informe_para_firmar',
            version: '1.0',
            fecha_exportacion: new Date().toISOString(),
            firmas: firmasGuardadas
        };

        const blob = new Blob([JSON.stringify(paquete, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Informe_Para_Firmar_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    window.importarInformeParaFirmar = function(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.tipo !== 'informe_para_firmar') {
                    alert('❌ Este archivo no es un informe válido para firmar.');
                    return;
                }

                if (data.firmas && Array.isArray(data.firmas)) {
                    data.firmas.forEach(firmaRecibida => {
                        const indexFirma = firmasGuardadas.findIndex(f => f.nombre === firmaRecibida.nombre);
                        if (indexFirma === -1) {
                            firmasGuardadas.push(firmaRecibida);
                        } else {
                            firmasGuardadas[indexFirma] = firmaRecibida;
                        }
                    });
                }
                localStorage.setItem('firmas_informe_final', JSON.stringify(firmasGuardadas));

                alert('✅ Informe importado con éxito. Se han recuperado las firmas anteriores.');
                window.location.reload();

            } catch (err) {
                console.error(err);
                alert('❌ Error al leer el archivo. Asegúrate de que es un archivo válido.');
            }
            event.target.value = '';
        };
        reader.readAsText(file);
    };
});
