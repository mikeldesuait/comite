// peticion.js - Genera el documento de solicitud de datos para la empresa

document.addEventListener('DOMContentLoaded', () => {
    const contenedor = document.getElementById('contenidoPeticion');
    
    // 1. Leemos la configuración real
    const config = JSON.parse(localStorage.getItem('planIgualdadConfig') || '{}');
    
    // Sacamos los datos (si no existen, ponemos un texto por defecto)
    const nombreEmpresa = config.empresaNombre || '[Nombre de la Empresa]';
    const fechaHoy = new Date().toLocaleDateString('es-ES');
    
    // 2. Construimos el HTML dinámico
    let html = `
        <div style="text-align: center; margin-bottom: 3rem; border-bottom: 2px solid #000; padding-bottom: 1rem;">
            <h1>PETICIÓN DE DOCUMENTACIÓN PARA EL PLAN DE IGUALDAD</h1>
            <h2>${nombreEmpresa}</h2>
            <p><strong>Fecha de la solicitud:</strong> ${fechaHoy}</p>
            <p><strong>Solicitado por:</strong> Comisión Negociadora de Igualdad</p>
        </div>

        <p style="margin-bottom: 2rem; text-align: justify;">
            Estimada Dirección / Departamento de Recursos Humanos de <strong>${nombreEmpresa}</strong>:<br><br>
            Para poder avanzar en la elaboración del Plan de Igualdad y realizar la auditoría correspondiente, 
            os solicitamos que preparéis y entreguéis la siguiente documentación y evidencias, clasificadas por fases. 
            Por favor, revisad los documentos y responded al correo electrónico en el que se os adjunta este archivo.
        </p>
    `;

    // 3. Las fases
    const FASES = [
        { titulo: 'Fase 1: Compromiso y Constitución', pasos: [
            'Declaración de compromiso de la dirección (documento firmado).',
            'Acta de constitución de la Comisión Negociadora (firmada).',
            'Comunicación enviada a la plantilla informando del inicio.'
        ]},
        { titulo: 'Fase 2: Diagnóstico de Situación', pasos: [
            'Datos de la plantilla desagregados por sexo (categorías, contratos, antigüedad).',
            'Datos sobre procesos de selección y promoción.',
            'Datos sobre formación realizada.',
            'Datos sobre excedencias, reducciones de jornada y permisos por conciliación.',
            'Informe de diagnóstico previo (si lo hubiera).'
        ]},
        { titulo: 'Fase 3: Auditoría Retributiva', pasos: [
            'Registro Retributivo completo de la empresa.',
            'Valoración de Puestos de Trabajo (VPT) con perspectiva de género.',
            'Datos de la brecha salarial (medias y medianas).'
        ]},
        { titulo: 'Fase 4: Objetivos y Medidas', pasos: [
            'Propuestas de medidas correctoras (si la empresa las ha trabajado).',
            'Presupuesto asignado para las medidas.',
            'Calendario de actuaciones previsto.'
        ]},
        { titulo: 'Fase 5: Aprobación y Registro', pasos: [
            'Borrador del Plan de Igualdad para su lectura.',
            'Acta de aprobación (para firmar en reunión).',
            'Justificante de registro en el REGCON (una vez aprobado).'
        ]},
        { titulo: 'Fase 6: Protocolos Complementarios', pasos: [
            'Protocolo de prevención del acoso sexual y por razón de sexo.',
            'Canal de denuncias establecido.',
            'Protocolo de actuación para víctimas de violencia de género.'
        ]}
    ];

    FASES.forEach((fase) => {
        html += `<div class="fase-bloque" style="margin-bottom: 2rem;">`;
        // Título de la fase en gris claro (para que no se vea el morado al imprimir)
        html += `<h3 style="background: #f0f0f0; color: #000; padding: 0.5rem; border-bottom: 2px solid #000; margin-top: 1.5rem; text-transform: uppercase; font-size: 14px;">${fase.titulo}</h3>`;
        
        fase.pasos.forEach(paso => {
            html += `
                <div class="paso-peticion" style="display: flex; align-items: flex-start; gap: 10px; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px dashed #ccc;">
                    <div class="cuadro-check" style="width: 20px; height: 20px; border: 2px solid #000; display: inline-block; flex-shrink: 0; margin-top: 3px;"></div>
                    <div class="texto-peticion" style="flex: 1;">
                        <strong style="font-size: 1rem;">${paso}</strong>
                    </div>
                </div>
            `;
        });

        html += `</div>`;
    });

    // 4. Cierre del documento (Acuse de recibo por correo)
    html += `
        <div style="margin-top: 3rem; border-top: 2px solid #000; padding-top: 2rem;">
            <p style="font-size: 1rem; margin-bottom: 1rem; text-align: justify;">
                Documento emitido y remitido por la <strong>Representación Legal de los Trabajadores (RLPT)</strong> de <strong>${nombreEmpresa}</strong>.
            </p>
            <div style="padding: 1.5rem; border-left: 4px solid #000; background: #f9f9f9; text-align: justify;">
                <p style="margin: 0; font-size: 0.95rem;">
                    <strong>Acuse de recibo por vía telemática:</strong> Al recibir este documento en formato digital, rogamos a la Dirección / Departamento de Recursos Humanos que proceda a <strong>responder al correo electrónico en el que se ha adjuntado este archivo</strong>, confirmando su recepción, así como la fecha estimada de entrega de la documentación solicitada. Dicha respuesta servirá como acuse de recibo formal para el expediente del Plan de Igualdad.
                </p>
            </div>
        </div>
    `;

    contenedor.innerHTML = html;
});
