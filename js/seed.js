// seed.js - Datos de ejemplo para modo DEMO
// Empresa ficticia de ~300 trabajadores. Sin relación con ninguna empresa real.

const SEED = {
  configuracion: {
    empresaNombre: 'TechNova Solutions S.L.',
    empresaCif: 'B87654321',
    empresaDireccion: 'Avenida de la Innovación 45',
    empresaCiudad: 'Madrid',
    empresaCp: '28020',
    empresaSector: 'Tecnología y servicios',
    empresaEmpleados: '298',
    empresaRepresentante: 'Elena Torres Vidal',
    empresaRep1: 'Elena Torres Vidal',
    empresaRep2: 'Javier Gómez Ruiz',
    empresaRep3: '',
    trabajadoresRep1: 'Ana García Fernández',
    trabajadoresRep2: 'Carmen Ruiz Navarro',
    trabajadoresRep3: 'Luis Martínez Ortega',
    comitePresidente: 'Elena Torres Vidal',
    comiteSecretario: 'Ana García Fernández',
    planFechaInicio: '2025-01-15',
    planFechaFin: '2028-01-14',
    planAmbito: 'nacional',
    planEstado: 'negociacion'
  },

  diagnostico: {
    totalMujeres: '142',
    totalHombres: '156',
    mujeresDirectivas: '8',
    hombresDirectivos: '22',
    mujeresMandos: '24',
    hombresMandos: '36',
    contratosTemporalMujeres: '18',
    contratosTemporalHombres: '22',
    permisosMaternidadHombres: '14',
    excedenciasMujeres: '9',
    excedenciasHombres: '2',
    teletrabajoDisponible: 'si',
    flexibilidadHoraria: 'si',
    protocoloAcoso: 'si',
    formacionIgualdad: 'puntual',
    canalDenuncia: 'si',
    planAnterior: 'no',
    observaciones: 'Empresa en proceso de elaboración de su primer plan de igualdad. Se detecta infrarrepresentación femenina en puestos directivos (26,7% de mujeres en dirección frente a 47,7% en plantilla global). Buena implantación de medidas de conciliación (teletrabajo y flexibilidad horaria). Se recomienda reforzar formación en igualdad y promover el uso de permisos de paternidad por parte de los hombres.'
  },

  // Estado inicial del checklist en modo demo
  // Formato nuevo (objeto rico) compatible con modelo.js
  cumplimiento: {
    f1p1: {
      estado: 'hecho',
      fecha_inicio: '2025-01-15',
      fecha_completado: '2025-01-20',
      responsable: 'Ana García Fernández',
      evidencia: 'Actas/2025/Acta_compromiso_direccion_15-01-2025.pdf',
      notas: 'Declaración firmada por la dirección y comunicada a toda la plantilla el 20/01/2025.',
      historial: [
        { fecha: '2025-01-15T09:00:00.000Z', accion: 'Estado: Pendiente → En curso', usuario: 'Ana García Fernández' },
        { fecha: '2025-01-20T17:30:00.000Z', accion: 'Estado: En curso → Hecho', usuario: 'Ana García Fernández' },
        { fecha: '2025-01-20T17:32:00.000Z', accion: 'Evidencia: "(vacío)" → "Actas/2025/Acta_compromiso_direccion_15-01-2025.pdf"', usuario: 'Ana García Fernández' }
      ]
    },
    f1p2: {
      estado: 'hecho',
      fecha_inicio: '2025-01-22',
      fecha_completado: '2025-02-05',
      responsable: 'Ana García Fernández',
      evidencia: 'Actas/2025/Acta_constitucion_comision_05-02-2025.pdf',
      notas: 'Comisión paritaria de 6 miembros (3 por la empresa, 3 por la RLPT). Presidencia rotatoria anual acordada.',
      historial: [
        { fecha: '2025-01-22T10:00:00.000Z', accion: 'Estado: Pendiente → En curso', usuario: 'Ana García Fernández' },
        { fecha: '2025-02-05T12:00:00.000Z', accion: 'Estado: En curso → Hecho', usuario: 'Ana García Fernández' }
      ]
    },
    f1p3: {
      estado: 'hecho',
      fecha_inicio: '2025-02-05',
      fecha_completado: '2025-02-10',
      responsable: 'Luis Martínez Ortega',
      evidencia: 'Actas/2025/Acta_constitucion_firmada.pdf',
      notas: 'Acta firmada por los 6 miembros. Copia archivada en Secretaría.',
      historial: [
        { fecha: '2025-02-05T12:05:00.000Z', accion: 'Estado: Pendiente → En curso', usuario: 'Luis Martínez Ortega' },
        { fecha: '2025-02-10T09:00:00.000Z', accion: 'Estado: En curso → Hecho', usuario: 'Luis Martínez Ortega' },
        { fecha: '2025-02-10T09:02:00.000Z', accion: 'Validado por unanimidad en reunión del 10/02', usuario: 'Ana García Fernández' }
      ]
    },
    f1p4: {
      estado: 'en_curso',
      resultado_auditoria: 'parcial',
      fecha_inicio: '2025-02-12',
      fecha_completado: '2025-03-01',
      responsable: 'Carmen Ruiz Navarro',
      evidencia: 'Actas/2025/Comunicacion_intranet_12-02.pdf',
      hallazgos: 'Se envió un correo electrónico, pero no se ha realizado la sesión informativa presencial obligatoria. Además, no hay acuse de recibo de la plantilla.',
      plan_accion: 'Programar 3 sesiones informativas (una por turno) antes del 15/03. Pasar hoja de firmas para tener evidencia física.',
      notas: 'Comunicación interna enviada por correo y publicada en intranet el 12/02/2025.',
      historial: [
        { fecha: '2025-02-12T08:00:00.000Z', accion: 'Estado: Pendiente → En curso', usuario: 'Carmen Ruiz Navarro' },
        { fecha: '2025-03-01T10:00:00.000Z', accion: 'Resultado auditoría: Sin auditar → Parcial', usuario: 'Carmen Ruiz Navarro' },
        { fecha: '2025-03-01T10:05:00.000Z', accion: 'Hallazgos actualizados', usuario: 'Carmen Ruiz Navarro' }
      ]
    },
    f2p1: {
      estado: 'en_curso',
      fecha_inicio: '2025-02-15',
      fecha_completado: '',
      responsable: 'Carmen Ruiz Navarro',
      evidencia: 'Diagnostico/2025/Plan_diagnostico_v1.pdf',
      notas: 'Cronograma acordado en reunión del 15/02. Recogida de datos prevista para marzo-abril 2025.',
      historial: [
        { fecha: '2025-02-15T10:00:00.000Z', accion: 'Estado: Pendiente → En curso', usuario: 'Carmen Ruiz Navarro' }
      ]
    }
    // Resto de pasos: pendientes (sin entrada = pendiente por defecto)
  }
};

// API pública
window.SEED = SEED;
