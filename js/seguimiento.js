// seguimiento.js - Lógica para generar el Acta de Reunión y Seguimiento

window.generarActa = function() {
    const config = JSON.parse(localStorage.getItem('planIgualdadConfig') || '{}');
    const cumplimiento = MODELO.getEstadoCompleto();
    
    // Recogemos todos los datos del formulario
    const lugar = document.getElementById('lugarReunion').value || 'Instalaciones de la empresa';
    const fechaHoy = document.getElementById('fechaHoy').value || new Date().toISOString().split('T')[0];
    const asistentes = document.getElementById('textoAsistentes').value || 'No especificados';
    const ordenDia = document.getElementById('textoOrdenDia').value || 'No especificado';
    const acuerdos = document.getElementById('textoAcuerdos').value || 'Sin acuerdos registrados.';
    const fechaProxima = document.getElementById('fechaProxima').value || 'Por determinar';
    const incluirAdvertencia = document.getElementById('checkAdvertencia').checked;

    const fHoy = new Date(fechaHoy).toLocaleDateString('es-ES');
    const fProx = fechaProxima !== 'Por determinar' ? new Date(fechaProxima).toLocaleDateString('es-ES') : 'Por determinar';

    // Buscar hallazgos (pasos que están parciales o no conformes)
    let hallazgosHTML = '';
    let hayHallazgos = false;

    for (const [id, datos] of Object.entries(cumplimiento)) {
        const paso = MODELO.normalizarPaso(datos);
        if (paso.resultado_auditoria === 'parcial' || paso.resultado_auditoria === 'no_conforme') {
            hayHallazgos = true;
            const estadoTxt = paso.resultado_auditoria === 'parcial' ? '⚠️ PARCIAL' : '❌ NO CONFORME';
            
            hallazgosHTML += `
                <div class="hallazgo-card" style="margin-bottom: 0.5rem; padding: 0.8rem;">
                    <p><strong>Paso ${id.toUpperCase()} - ${estadoTxt}</strong></p>
                    <p><strong>Hallazgo:</strong> ${paso.hallazgos || 'Pendiente de definir'}</p>
                    <p><strong>Petición de la Comisión:</strong> ${paso.plan_accion || 'Pendiente de definir'}</p>
                </div>
            `;
        }
    }

    if (!hayHallazgos) {
        hallazgosHTML = '<p style="color: var(--success);">✅ No hay hallazgos pendientes de subsanar en este momento.</p>';
    }

    // Construir el documento con formato formal de acta
    const html = `
        <div style="text-align: center; margin-bottom: 2rem; border-bottom: 2px solid #000; padding-bottom: 1rem;">
            <h1>ACTA DE REUNIÓN DE LA COMISIÓN NEGOCIADORA</h1>
            <h2>${config.empresaNombre || 'Empresa'}</h2>
        </div>

        <div style="margin-bottom: 2rem;">
            <p><strong>Lugar:</strong> ${lugar}</p>
            <p><strong>Fecha:</strong> ${fHoy}</p>
            <p><strong>Hora de inicio:</strong> ______:______ h</p>
            <p><strong>Hora de finalización:</strong> ______:______ h</p>
        </div>

        <h3 style="background: #eee; padding: 0.3rem; border-left: 4px solid #000;">1. ASISTENTES</h3>
        <p style="white-space: pre-wrap;">${asistentes}</p>

        <h3 style="background: #eee; padding: 0.3rem; border-left: 4px solid #000; margin-top: 1.5rem;">2. ORDEN DEL DÍA</h3>
        <p style="white-space: pre-wrap;">${ordenDia}</p>

        <h3 style="background: #eee; padding: 0.3rem; border-left: 4px solid #000; margin-top: 1.5rem;">3. ACUERDOS ALCANZADOS</h3>
        <p style="white-space: pre-wrap;">${acuerdos}</p>

        <h3 style="background: #eee; padding: 0.3rem; border-left: 4px solid #000; margin-top: 1.5rem;">4. ESTADO DE LA AUDITORÍA / REQUERIMIENTOS A LA EMPRESA</h3>
        <p>La Comisión ha revisado la documentación y requiere a la Dirección que subsane los siguientes puntos:</p>
        ${hallazgosHTML}

        ${incluirAdvertencia ? `
        <div style="margin-top: 1.5rem; padding: 1rem; border: 2px solid #c62828; background: #fff5f5; border-radius: 4px;">
            <h4 style="color: #c62828; margin-bottom: 0.5rem;">ADVERTENCIA LEGAL</h4>
            <p style="font-size: 0.9rem;">Se deja constancia expresa de que la Comisión Negociadora ha solicitado a la Dirección la documentación detallada en esta acta, no habiendo sido entregada en su totalidad hasta la fecha. Se advierte a la Empresa de su obligación legal conforme al Real Decreto 901/2020. La persistencia en esta situación obligará a la Comisión a poner los hechos en conocimiento de la Inspección de Trabajo y Seguridad Social.</p>
        </div>
        ` : ''}

        <div style="margin-top: 2rem;">
            <p><strong>Próxima reunión:</strong> ${fProx}</p>
        </div>

        <p style="margin-top: 2rem;">Y sin más asuntos que tratar, se da por finalizada la reunión, firmando el presente documento en prueba de conformidad.</p>

        <div style="margin-top: 4rem; display: flex; justify-content: space-between;">
            <div style="text-align: center; width: 45%;">
                <p>_____________________________</p>
                <p><strong>Por la Empresa</strong></p>
                <p>Firma y Sello</p>
            </div>
            <div style="text-align: center; width: 45%;">
                <p>_____________________________</p>
                <p><strong>Por la Comisión Negociadora</strong></p>
                <p>${config.comitePresidente || 'Presidencia'}</p>
            </div>
        </div>
    `;

    // Mostrar el documento generado
    document.getElementById('formularioSeguimiento').style.display = 'none';
    const contDoc = document.getElementById('documentoActa');
    contDoc.innerHTML = html;
    contDoc.style.display = 'block';
    
    // Cambiar el botón de volver
    const btnVolver = document.querySelector('.no-print a');
    if (btnVolver) {
        btnVolver.textContent = '🔄 Rellenar otra Acta';
        btnVolver.href = 'javascript:location.reload()';
    }
};
