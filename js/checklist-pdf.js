// checklist-pdf.js - Genera una vista imprimible del checklist normativo

window.generarChecklistPDF = function() {
    const cumplimiento = MODELO.getEstadoCompleto();
    
    // Necesitamos leer las FASES del archivo cumplimiento.js que ya está cargado en la página
    if (typeof FASES === 'undefined') {
        alert('❌ Error: No se han cargado los datos de las fases.');
        return;
    }

    let html = `
        <div style="text-align: center; margin-bottom: 3rem; border-bottom: 2px solid #000; padding-bottom: 1rem;">
            <h1>CHECKLIST DE CUMPLIMIENTO NORMATIVO</h1>
            <h2>Auditoría del Plan de Igualdad</h2>
            <p><strong>Fecha del informe:</strong> ${new Date().toLocaleDateString('es-ES')}</p>
        </div>
    `;

    FASES.forEach(fase => {
        html += `<div style="margin-bottom: 2rem; page-break-inside: avoid;">`;
        html += `<h3 style="background: #f0f0f0; border-bottom: 2px solid #000; padding: 0.5rem; text-transform: uppercase; font-size: 14px;">${fase.titulo}</h3>`;
        
        fase.pasos.forEach(paso => {
            const datos = MODELO.normalizarPaso(cumplimiento[paso.id]);
            
            let estadoTxt = 'Sin auditar';
            let color = '#000';
            if (datos.resultado_auditoria === 'conforme') { estadoTxt = '✅ CONFORME'; }
            else if (datos.resultado_auditoria === 'parcial') { estadoTxt = '⚠️ PARCIAL'; }
            else if (datos.resultado_auditoria === 'no_conforme') { estadoTxt = '❌ NO CONFORME'; }
            else if (datos.resultado_auditoria === 'no_aplica') { estadoTxt = '➖ NO APLICA'; }
            
            html += `
                <div style="border-left: 4px solid #000; padding-left: 10px; margin-bottom: 1rem;">
                    <p style="margin: 0 0 5px 0;"><strong>${paso.titulo}</strong></p>
                    <p style="margin: 0 0 5px 0; font-size: 0.85rem; color: #555;">Ref: ${paso.referencia}</p>
                    <p style="margin: 0 0 5px 0;"><strong>Estado:</strong> ${estadoTxt}</p>
                    ${datos.hallazgos ? `<p style="margin: 0 0 5px 0; font-size: 0.9rem;"><strong>Hallazgos:</strong> ${datos.hallazgos}</p>` : ''}
                    ${datos.plan_accion ? `<p style="margin: 0; font-size: 0.9rem;"><strong>Plan de Acción:</strong> ${datos.plan_accion}</p>` : ''}
                </div>
            `;
        });
        html += `</div>`;
    });

    const ventana = window.open('', '_blank');
    ventana.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Checklist Normativo</title>
            <style>
                body { font-family: sans-serif; padding: 2rem; color: #000; line-height: 1.4; }
                @media print { body { padding: 0; } }
            </style>
        </head>
        <body>
            <div style="text-align: right; margin-bottom: 2rem;">
                <button onclick="window.print()" style="padding: 10px 20px; background: #6a1b9a; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">🖨️ Imprimir / Guardar como PDF</button>
                <button onclick="window.close()" style="padding: 10px 20px; background: #ccc; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">Cerrar</button>
            </div>
            ${html}
        </body>
        </html>
    `);
    ventana.document.close();
};
