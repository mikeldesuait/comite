// informe.js - Genera la vista imprimible del Plan de Igualdad

document.addEventListener('DOMContentLoaded', () => {
    const contenedor = document.getElementById('informeContenido');
    
    // 1. Cargar datos
    const config = JSON.parse(localStorage.getItem('planIgualdadConfig') || '{}');
    const cumplimiento = MODELO.getEstadoCompleto();
    const medidas = JSON.parse(localStorage.getItem('planIgualdadMedidas') || '[]');

    // 2. Cabecera del informe
    let html = `
        <div class="header-print">
            <h1>PLAN DE IGUALDAD</h1>
            <h2>${config.empresaNombre || 'Empresa sin configurar'}</h2>
            <p><strong>CIF:</strong> ${config.empresaCif || '—'} | <strong>Empleados:</strong> ${config.empresaEmpleados || '—'} | <strong>Fecha del informe:</strong> ${new Date().toLocaleDateString('es-ES')}</p>
        </div>
    `;

    // 3. Resumen de la Auditoría (Lista de Hallazgos y Conformidades)
    html += `<h2>1. Resumen de la Auditoría Normativa</h2>`;
    
    // Contamos cuántos pasos hay en cada estado
    let stats = { conforme: 0, parcial: 0, no_conforme: 0, pendiente: 0 };
    
    // Recorremos los datos para buscar hallazgos
    let hallazgosHTML = '';
    for (const [id, datos] of Object.entries(cumplimiento)) {
        const paso = MODELO.normalizarPaso(datos);
        
        if (paso.resultado_auditoria === 'parcial' || paso.resultado_auditoria === 'no_conforme') {
            stats[paso.resultado_auditoria]++;
            hallazgosHTML += `
                <div class="card" style="margin-bottom: 1rem; padding: 1rem; border: 1px solid #ccc; border-left: 4px solid #000;">
                    <h4 style="color: #000; margin-bottom: 0.5rem;">Hallazgo en: ${id.toUpperCase()}</h4>
                    <p><strong>Problema detectado:</strong> ${paso.hallazgos || 'Sin especificar.'}</p>
                    <p><strong>Plan de acción:</strong> ${paso.plan_accion || 'Sin especificar.'}</p>
                    <p style="font-size: 0.85rem; color: #666;">Revisado por: ${paso.responsable || '—'} el ${paso.fecha_completado || '—'}</p>
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
        <ul>
            <li><strong>Pasos Conformes:</strong> ${stats.conforme}</li>
            <li><strong>Pasos Parciales (faltan cosas):</strong> ${stats.parcial}</li>
            <li><strong>Pasos No Conformes (no hechos):</strong> ${stats.no_conforme}</li>
            <li><strong>Pasos Pendientes de revisar:</strong> ${stats.pendiente}</li>
        </ul>
    `;

    if (hallazgosHTML) {
        html += `<h3>Detalle de Hallazgos y Carencias</h3>`;
        html += hallazgosHTML;
    } else {
        html += `<p style="color: #000;">✅ No se han registrado hallazgos graves en la auditoría.</p>`;
    }

    // 4. Medidas del Plan (Pestaña Estado)
    html += `<h2 style="margin-top: 2rem;">2. Objetivos y Medidas Correctivas</h2>`;
    
    if (medidas.length === 0) {
        html += `<p>No se han definido medidas correctivas todavía.</p>`;
    } else {
        html += `
            <table style="width: 100%; border-collapse: collapse; margin-top: 1rem; font-size: 0.9rem;">
                <thead>
                    <tr style="background: #e0e0e0; border-bottom: 2px solid #000;">
                        <th style="padding: 0.5rem; text-align: left; border: 1px solid #000;">Objetivo / Medida</th>
                        <th style="padding: 0.5rem; text-align: left; border: 1px solid #000;">Plazo</th>
                        <th style="padding: 0.5rem; text-align: left; border: 1px solid #000;">Prioridad</th>
                        <th style="padding: 0.5rem; text-align: left; border: 1px solid #000;">Responsable</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        medidas.forEach(m => {
            html += `
                <tr>
                    <td style="padding: 0.5rem; border: 1px solid #000;">
                        <strong>${m.titulo}</strong><br>
                        <small><em>Indicador: ${m.indicador || '—'}</em></small>
                    </td>
                    <td style="padding: 0.5rem; border: 1px solid #000;">${m.plazo ? new Date(m.plazo).toLocaleDateString('es-ES') : '—'}</td>
                    <td style="padding: 0.5rem; border: 1px solid #000;">${m.prioridad}</td>
                    <td style="padding: 0.5rem; border: 1px solid #000;">${m.responsable || '—'}</td>
                </tr>
            `;
        });
        
        html += `</tbody></table>`;
    }

    // 5. Firmas (Al final del documento)
    html += `
        <div style="margin-top: 4rem; display: flex; justify-content: space-between;">
            <div style="text-align: center; width: 45%;">
                <p>_____________________________</p>
                <p><strong>Por la Empresa</strong></p>
                <p>${config.empresaRepresentante || 'Firma y sello'}</p>
            </div>
            <div style="text-align: center; width: 45%;">
                <p>_____________________________</p>
                <p><strong>Por la Comisión Negociadora</strong></p>
                <p>${config.comitePresidente || 'Firma'}</p>
            </div>
        </div>
    `;

    contenedor.innerHTML = html;
});
