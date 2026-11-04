// peticion.js - Genera el documento de solicitud de datos para la empresa

document.addEventListener('DOMContentLoaded', () => {
    const contenedor = document.getElementById('contenidoPeticion');
    
    // 1. Leemos la configuración real
    const config = JSON.parse(localStorage.getItem('planIgualdadConfig') || '{}');
    
    // Sacamos los datos (si no existen, ponemos un texto por defecto)
    const nombreEmpresa = config.empresaNombre || '[Nombre de la Empresa]';
    const fechaHoy = new Date().toLocaleDateString('es-ES');
    
    const presidente = config.comitePresidente || '_____________________';
    const secretario = config.comiteSecretario || '_____________________';
    
    // 2. Construimos el HTML dinámico
    let html = `
        <div style="text-align: center; margin-bottom: 3rem; border-bottom: 2px solid #000; padding-bottom: 1rem;">
            <h1>PETICIÓN DE DOCUMENTACIÓN PARA EL PLAN DE IGUALDAD</h1>
            <h2>${nombreEmpresa}</h2>
            <p><strong>Fecha de la solicitud:</strong> ${fechaHoy}</p>
            <p><strong>Solicitado por:</strong> Comisión Negociadora de Igualdad</p>
        </div>

        <p style="margin-bottom: 2rem;">
            Estimada Dirección / Departamento de Recursos Humanos de <strong>${nombreEmpresa}</strong>:<br><br>
            Para poder avanzar en la elaboración del Plan de Igualdad y realizar la auditoría correspondiente, 
            os solicitamos que preparéis y entreguéis la siguiente documentación y evidencias, clasificadas por fases. 
            Por favor, marcad las casillas a medida que preparéis los documentos.
        </p>
    `;

    // 3. Las fases (estas son fijas por ley)
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
        html += `<div class="fase-bloque">`;
        html += `<h3>${fase.titulo}</h3>`;
        
        fase.pasos.forEach(paso => {
            html += `
                <div class="paso-peticion">
                    <div class="cuadro-check"></div>
                    <div class="texto-peticion">
                        <strong>${paso}</strong>
                    </div>
                </div>
            `;
        });

        html += `</div>`;
    });

    // 4. Firmas dinámicas (con los nombres del comité)
    html += `
        <div style="margin-top: 3rem; border-top: 1px solid #000; padding-top: 2rem;">
            <p><strong>Notas adicionales de la Comisión:</strong></p>
            <div style="border: 1px solid #ccc; height: 100px; border-radius: 4px; margin-bottom: 3rem;"></div>
            
            <div style="display: flex; justify-content: space-between; margin-top: 2rem;">
                <div style="text-align: center; width: 45%;">
                    <p>_____________________________</p>
                    <p><strong>Fdo: ${presidente}</strong></p>
                    <p>Presidencia de la Comisión</p>
                </div>
                <div style="text-align: center; width: 45%;">
                    <p>_____________________________</p>
                    <p><strong>Fdo: ${secretario}</strong></p>
                    <p>Secretaría de la Comisión</p>
                </div>
            </div>
            <div style="text-align: center; margin-top: 3rem;">
                <p>_____________________________</p>
                <p><strong>Recibido por la Dirección / RRHH</strong></p>
                <p>${nombreEmpresa}</p>
            </div>
        </div>
    `;

    contenedor.innerHTML = html;
});
