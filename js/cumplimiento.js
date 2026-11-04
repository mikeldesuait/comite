// cumplimiento.js - Checklist normativo RD 901/2020 + RD 902/2020

const CUMPLIMIENTO_KEY = 'planIgualdadCumplimiento';

// ===== DATOS NORMATIVOS =====
const FASES = [
  {
    id: 'fase1',
    titulo: 'Fase 1: Compromiso y Constitución de la Comisión Negociadora',
    pasos: [
      {
        id: 'f1p1',
        titulo: 'Declaración de compromiso de la dirección',
        descripcion: 'La empresa debe mostrar su compromiso con la igualdad efectiva mediante una declaración institucional.',
        referencia: 'RD 901/2020, Art. 5; LO 3/2007, Art. 45',
        url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2020-12214',
        porque: 'Sin compromiso explícito de la dirección, el plan carece de legitimidad y respaldo organizativo. Es el punto de partida formal del proceso.'
      },
      {
        id: 'f1p2',
        titulo: 'Constitución de la Comisión Negociadora de Igualdad',
        descripcion: 'Órgano paritario (empresa + representación legal de trabajadores). Máx. 6 miembros por parte. Debe levantarse acta de constitución firmada por todos.',
        referencia: 'RD 901/2020, Arts. 5 y 6',
        url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2020-12214',
        porque: 'La comisión es el órgano legitimado para negociar el plan. Sin acta de constitución, el plan no puede registrarse.'
      },
      {
        id: 'f1p3',
        titulo: 'Acta de constitución firmada por todos los miembros',
        descripcion: 'Documento obligatorio para el registro. Debe recoger composición paritaria y equilibrio entre mujeres y hombres.',
        referencia: 'RD 901/2020, Art. 6; Registro REGCON',
        url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2020-12214',
        porque: 'Es uno de los documentos exigidos para inscribir el plan en el registro oficial. Sin él, el registro rechaza la solicitud.'
      },
      {
        id: 'f1p4',
        titulo: 'Comunicación a la plantilla del inicio del proceso',
        descripcion: 'Informar a todo el personal de que se inicia el proceso de elaboración del plan de igualdad.',
        referencia: 'Guía técnica Ministerio de Igualdad',
        url: 'https://www.igualdad.gob.es/',
        porque: 'La transparencia y participación de la plantilla es un principio rector. Además, facilita la recogida de datos para el diagnóstico.'
      }
    ]
  },
  {
    id: 'fase2',
    titulo: 'Fase 2: Diagnóstico de Situación',
    pasos: [
      {
        id: 'f2p1',
        titulo: 'Planificación del diagnóstico (objetivos, cronograma, recursos)',
        descripcion: 'Definir qué se va a analizar, con qué instrumentos, en qué plazos y con qué medios humanos y materiales.',
        referencia: 'RD 901/2020, Art. 7',
        url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2020-12214',
        porque: 'Un diagnóstico sin planificación previa corre el riesgo de ser incompleto o sesgado. La comisión debe acordar el alcance antes de recoger datos.'
      },
      {
        id: 'f2p2',
        titulo: 'Recogida de datos desagregados por sexo',
        descripcion: 'Datos cuantitativos y cualitativos de: plantilla, selección, clasificación, formación, promoción, condiciones de trabajo, conciliación, retribuciones y acoso.',
        referencia: 'RD 901/2020, Art. 7.1; LO 3/2007, Art. 46',
        url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2020-12214',
        porque: 'Sin datos desagregados por sexo es imposible detectar brechas ni diseñar medidas correctoras. Es la base objetiva del plan.'
      },
      {
        id: 'f2p3',
        titulo: 'Análisis de la información y elaboración del informe diagnóstico',
        descripcion: 'La comisión analiza los datos y elabora un informe con conclusiones que se incorporará al plan.',
        referencia: 'RD 901/2020, Art. 7.2',
        url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2020-12214',
        porque: 'El informe diagnóstico es el documento que justifica las medidas que se adoptarán después. Sin él, las medidas carecen de fundamento.'
      },
      {
        id: 'f2p4',
        titulo: 'Encuesta a la plantilla (análisis subjetivo)',
        descripcion: 'Recoger la opinión del personal sobre igualdad de oportunidades, conciliación, clima laboral, etc.',
        referencia: 'Guía técnica Ministerio de Igualdad',
        url: 'https://www.igualdad.gob.es/',
        porque: 'Complementa los datos numéricos con la percepción de las personas. Detecta problemas que los números no revelan (ej. micromachismos, sesgos culturales).'
      }
    ]
  },
  {
    id: 'fase3',
    titulo: 'Fase 3: Auditoría Retributiva y Valoración de Puestos',
    pasos: [
      {
        id: 'f3p1',
        titulo: 'Elaboración del Registro Retributivo',
        descripcion: 'Obligatorio para TODAS las empresas (cualquier tamaño). Debe incluir a toda la plantilla, desagregado por sexo y grupos profesionales.',
        referencia: 'RD 902/2020, Arts. 5 y 6; ET Art. 28.2',
        url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2020-12215',
        porque: 'Es la base de la transparencia retributiva. Sin registro no se puede auditar ni detectar brechas salariales.'
      },
      {
        id: 'f3p2',
        titulo: 'Consulta previa a la representación legal (10 días)',
        descripcion: 'La RLPT debe ser consultada con al menos 10 días de antelación antes de elaborar o modificar el registro retributivo.',
        referencia: 'RD 902/2020, Art. 5.3',
        url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2020-12215',
        porque: 'La ley exige participación sindical en materia retributiva. Omitir la consulta puede invalidar el registro.'
      },
      {
        id: 'f3p3',
        titulo: 'Valoración de Puestos de Trabajo (VPT)',
        descripcion: 'Aplicar el procedimiento del Ministerio (Orden PCM/1047/2022) con factores objetivos: naturaleza de funciones, condiciones educativas, profesionales, etc.',
        referencia: 'RD 902/2020, Art. 4; Orden PCM/1047/2022',
        url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2020-12215',
        porque: 'Sin VPT no se puede determinar qué puestos son "de igual valor". Es la herramienta que revela la infravaloración de trabajos feminizados.'
      },
      {
        id: 'f3p4',
        titulo: 'Auditoría Retributiva',
        descripcion: 'Solo obligatoria para empresas de 50+ trabajadores. Diagnóstico de la situación retributiva + plan de actuación para corregir diferencias.',
        referencia: 'RD 902/2020, Arts. 7 y 8',
        url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2020-12215',
        porque: 'La auditoría va más allá del registro: analiza causas de las diferencias y propone medidas correctoras concretas.'
      },
      {
        id: 'f3p5',
        titulo: 'Análisis de la brecha salarial por grupos de igual valor',
        descripcion: 'Calcular medias y medianas de retribuciones por agrupaciones de puestos de igual valor.',
        referencia: 'RD 902/2020, Art. 6.2',
        url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2020-12215',
        porque: 'La brecha global puede ocultar desigualdades dentro de grupos comparables. El análisis por grupos de igual valor es el que detecta discriminación real.'
      }
    ]
  },
  {
    id: 'fase4',
    titulo: 'Fase 4: Definición de Objetivos y Medidas',
    pasos: [
      {
        id: 'f4p1',
        titulo: 'Definición de objetivos generales y específicos',
        descripcion: 'Objetivos cualitativos y cuantitativos, revisables, flexibles, evaluables y con límite temporal.',
        referencia: 'RD 901/2020, Art. 8.1',
        url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2020-12214',
        porque: 'Los objetivos son la brújula del plan. Sin ellos, las medidas son acciones sueltas sin dirección estratégica.'
      },
      {
        id: 'f4p2',
        titulo: 'Diseño de medidas concretas con plazo, prioridad e indicadores',
        descripcion: 'Cada medida debe tener: descripción, plazo de ejecución, prioridad, indicador de seguimiento y recursos asignados.',
        referencia: 'RD 901/2020, Art. 8.1',
        url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2020-12214',
        porque: 'Una medida sin plazo ni indicador no es evaluable. La ley exige que el plan sea un instrumento de gestión, no una declaración de intenciones.'
      },
      {
        id: 'f4p3',
        titulo: 'Identificación de medios y recursos (materiales y humanos)',
        descripcion: 'Asignar presupuesto, personas responsables y herramientas para cada medida.',
        referencia: 'RD 901/2020, Art. 8.1',
        url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2020-12214',
        porque: 'Sin recursos asignados, las medidas quedan en papel mojado. La comisión debe garantizar viabilidad económica y operativa.'
      },
      {
        id: 'f4p4',
        titulo: 'Calendario de actuaciones',
        descripcion: 'Cronograma de implantación, seguimiento y evaluación de cada medida.',
        referencia: 'RD 901/2020, Art. 8.1',
        url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2020-12214',
        porque: 'El calendario permite rendir cuentas y detectar retrasos. Es la herramienta de control temporal del plan.'
      }
    ]
  },
  {
    id: 'fase5',
    titulo: 'Fase 5: Aprobación, Registro y Seguimiento',
    pasos: [
      {
        id: 'f5p1',
        titulo: 'Acta de aprobación del plan firmada por toda la comisión',
        descripcion: 'Documento obligatorio para el registro. El plan debe firmarse en todas y cada una de sus páginas.',
        referencia: 'RD 901/2020, Art. 9; Registro REGCON',
        url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2020-12214',
        porque: 'Sin acta de aprobación, el plan no tiene validez formal. Es el documento que acredita el acuerdo entre empresa y representación social.'
      },
      {
        id: 'f5p2',
        titulo: 'Registro del plan en REGCON',
        descripcion: 'Inscripción obligatoria en el Registro de Convenios y Acuerdos Colectivos. Documentos: acta constitución, acta aprobación, acta delegación (si aplica) y plan firmado.',
        referencia: 'RD 901/2020, Art. 9; RD 713/2010',
        url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2020-12214',
        porque: 'El registro es obligatorio para que el plan tenga eficacia jurídica y sea oponible a terceros. Sin registro, el plan no existe legalmente.'
      },
      {
        id: 'f5p3',
        titulo: 'Sistema de seguimiento y evaluación periódica',
        descripcion: 'Definir quién, cómo y cuándo se evaluará el grado de cumplimiento de cada medida.',
        referencia: 'RD 901/2020, Art. 8.1 y 9',
        url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2020-12214',
        porque: 'El plan es un instrumento vivo. Sin seguimiento, no se puede saber si funciona ni corregir desviaciones.'
      },
      {
        id: 'f5p4',
        titulo: 'Procedimiento de revisión y modificación',
        descripcion: 'Incluir en el plan el procedimiento para modificarlo y para resolver discrepancias durante la aplicación.',
        referencia: 'RD 901/2020, Art. 8.1',
        url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2020-12214',
        porque: 'La realidad cambia. El plan debe prever cómo adaptarse sin tener que reiniciar todo el proceso.'
      }
    ]
  },
  {
    id: 'fase6',
    titulo: 'Fase 6: Protocolos Complementarios Obligatorios',
    pasos: [
      {
        id: 'f6p1',
        titulo: 'Protocolo de prevención del acoso sexual y por razón de sexo',
        descripcion: 'Todas las empresas (cualquier tamaño) deben tener un protocolo de actuación frente al acoso.',
        referencia: 'LO 3/2007, Art. 48; RD 901/2020',
        url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2020-12214',
        porque: 'Es una obligación autónoma e independiente del plan de igualdad. Su ausencia puede generar responsabilidad administrativa y laboral.'
      },
      {
        id: 'f6p2',
        titulo: 'Canal de denuncias y procedimiento de investigación',
        descripcion: 'Establecer un cauce confidencial para denuncias y un procedimiento de investigación garantista.',
        referencia: 'LO 3/2007, Art. 48',
        url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2007-6115',
        porque: 'Un protocolo sin canal de denuncias es inoperante. La ley exige cauces específicos para que las víctimas puedan denunciar sin represalias.'
      },
      {
        id: 'f6p3',
        titulo: 'Inclusión de medidas de protección para víctimas de violencia de género',
        descripcion: 'El plan puede incorporar medidas específicas: movilidad geográfica, reducción de jornada, etc.',
        referencia: 'LO 3/2007; RD 901/2020',
        url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2020-12214',
        porque: 'La violencia de género es una manifestación extrema de desigualdad. El plan debe contemplar cómo protege la empresa a las trabajadoras en esta situación.'
      }
    ]
  }
];

// ===== LÓGICA =====
document.addEventListener('DOMContentLoaded', () => {
  if (typeof MODELO !== 'undefined') MODELO.migrarSiNecesario();
  const container = document.getElementById('fasesContainer');
  const progressBar = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');
  const btnReset = document.getElementById('btnResetCumplimiento');
  const btnExportar = document.getElementById('btnExportar');
  const statusMessage = document.getElementById('statusMessage');

  let estado = cargarEstado();

  renderFases();
  actualizarProgreso();

  function cargarEstado() {
    try {
      const saved = localStorage.getItem(CUMPLIMIENTO_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  }

  function guardarEstado() {
    localStorage.setItem(CUMPLIMIENTO_KEY, JSON.stringify(estado));
  }

  function renderFases() {
    if (window.CUMPLIMIENTO_RENDER) {
      CUMPLIMIENTO_RENDER.renderFases(container, FASES, estado, MODELO.getResponsables());
    }
  }

  function actualizarContadorFase(card) {
    const total = card.querySelectorAll('.paso-checkbox').length;
    const completados = card.querySelectorAll('.paso-checkbox:checked').length;
    const span = card.querySelector('.fase-progress');
    if (span) span.textContent = `${completados}/${total}`;
  }

  function actualizarProgreso() {
    const stats = MODELO.getEstadisticas();
    const totalPasos = FASES.reduce((acc, f) => acc + f.pasos.length, 0);
    const completados = stats.hecho + stats.validado;
    const pct = totalPasos ? Math.round((completados / totalPasos) * 100) : 0;
    progressBar.style.width = pct + '%';
    progressText.textContent = `${completados} de ${totalPasos} pasos completados (${pct}%) · ${stats.en_curso} en curso`;
  }
  window.__actualizarProgresoCumplimiento = actualizarProgreso;

  btnReset.addEventListener('click', () => {
    if (confirm('¿Seguro que quieres reiniciar todo el checklist? Se perderá el progreso.')) {
      estado = {};
      guardarEstado();
      renderFases();
      actualizarProgreso();
      mostrarMensaje('🗑️ Checklist reiniciado.', 'success');
    }
  });

  btnExportar.addEventListener('click', () => {
    const dataStr = JSON.stringify(estado, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cumplimiento_plan_igualdad.json';
    a.click();
    URL.revokeObjectURL(url);
    mostrarMensaje('📥 Progreso exportado.', 'success');
  });

  function mostrarMensaje(texto, tipo) {
    statusMessage.textContent = texto;
    statusMessage.className = 'status-message ' + tipo;
    setTimeout(() => {
      statusMessage.className = 'status-message';
      statusMessage.textContent = '';
    }, 3000);
  }
});

// Función global para capturar el archivo seleccionado sin subirlo
window.guardarArchivoLocal = async function(event, pasoId) {
  const file = event.target.files[0];
  if (!file) return;

  try {
    // Guardamos el archivo real en la base de datos local (IndexedDB)
    await ArchivosDB.guardar(pasoId, file);
    
    // Guardamos solo el nombre en localStorage para mostrarlo
    MODELO.actualizarCampo(pasoId, 'archivo_evidencia', file.name);
    
    // Refrescamos la vista para que aparezca el botón "Abrir"
    if (window.__actualizarProgresoCumplimiento) {
        // Recargamos la página de forma suave para que se pinte el botón
        // O simplemente recargamos la ventana para que el render lea el nuevo estado
        window.location.reload(); 
    }
  } catch (err) {
    console.error(err);
    alert('❌ Error al guardar el archivo localmente.');
  }
};

window.abrirArchivoLocal = async function(event, pasoId) {
  event.preventDefault();
  try {
    const file = await ArchivosDB.obtener(pasoId);
    if (!file) {
      alert('El archivo ya no está disponible. Por favor, vuelve a seleccionarlo.');
      return;
    }
    
    // Creamos una URL temporal para abrir el archivo en una nueva pestaña
    const url = URL.createObjectURL(file);
    window.open(url, '_blank');
    
    // Liberamos la memoria después de un tiempo
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  } catch (err) {
    console.error(err);
    alert('❌ Error al intentar abrir el archivo.');
  }
};

// --- FUNCIONES PARA LOS BOTONES DE LA FICHA ---
window.guardarFicha = function(pasoId) {
  // Buscamos todos los campos de esa ficha
  const ficha = document.querySelector(`[data-paso-id="${pasoId}"] .ficha-container`);
  if (!ficha) return;

  // Recogemos los valores
  const selectores = ficha.querySelectorAll('select[data-campo], input[data-campo], textarea[data-campo]');
  
  selectores.forEach(el => {
    const campo = el.dataset.campo;
    const valor = el.value;
    
    // Si el campo es de archivo, lo saltamos (ya se guarda solo al seleccionar)
    if (campo === 'archivo_evidencia') return;

    // Guardamos
    MODELO.actualizarCampo(pasoId, campo, valor);
  });

  if (window.mostrarToast) window.mostrarToast('Cambios guardados en el historial correctamente.', 'success');
  
  // En lugar de recargar, actualizamos la vista suavemente
  const nuevoEstado = MODELO.getEstadoCompleto();
  if (window.CUMPLIMIENTO_RENDER) {
      CUMPLIMIENTO_RENDER.renderFases(document.getElementById('fasesContainer'), FASES, nuevoEstado, MODELO.getResponsables());
      if (window.__actualizarProgresoCumplimiento) window.__actualizarProgresoCumplimiento();
  }
};

window.borrarFicha = function(pasoId) {
  if (!confirm('¿Seguro que quieres borrar TODOS los textos de esta ficha? El historial se mantendrá intacto.')) return;

  // Buscamos los datos actuales del paso
  const pasoActual = MODELO.getPaso(pasoId);

  // Limpiamos todos los campos de texto (excepto estado y resultado de auditoría)
  const datosLimpios = {
    ...pasoActual,
    fecha_inicio: '',
    fecha_completado: '',
    responsable: '',
    evidencia: '',
    archivo_evidencia: '',
    hallazgos: '',
    plan_accion: '',
    notas: '',
    historial: pasoActual.historial // Conservamos el historial
  };

  // Añadimos una entrada al historial indicando que se ha borrado
  datosLimpios.historial.push({
    fecha: new Date().toISOString(),
    accion: 'Ficha limpiada / reiniciada',
    usuario: MODELO.getUsuarioActual() || 'Sistema'
  });

  // Guardamos en el modelo
  MODELO.setPaso(pasoId, datosLimpios);

  // Recargamos para ver el efecto
  window.location.reload();
};

// --- SISTEMA DE COPIA DE SEGURIDAD (VERSIÓN BLINDADA) ---
window.descargarBackupTotal = function() {
    try {
        const backup = {
            version: '1.0',
            fecha: new Date().toISOString(),
            config: localStorage.getItem('planIgualdadConfig'),
            diag: localStorage.getItem('planIgualdadDiagnostico'),
            cumplimiento: localStorage.getItem('planIgualdadCumplimiento'),
            medidas: localStorage.getItem('planIgualdadMedidas'),
            usuario: localStorage.getItem('planIgualdadUsuarioActual'),
            esDemo: localStorage.getItem('planIgualdadEsDemo')
        };

        const dataStr = JSON.stringify(backup, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        const fecha = new Date().toISOString().split('T')[0];
        a.download = `Backup_Plan_Igualdad_${fecha}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error(error);
        alert('❌ Error al descargar el backup.');
    }
};

// Lógica para procesar el archivo al seleccionarlo
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('inputRestaurar');
    if (input) {
        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const backup = JSON.parse(event.target.result);
                    if (!backup.version) throw new Error('No es un backup válido');

                    if (confirm('⚠️ Se van a sobrescribir TODOS los datos actuales. ¿Continuar?')) {
                        if (backup.config) localStorage.setItem('planIgualdadConfig', backup.config);
                        if (backup.diag) localStorage.setItem('planIgualdadDiagnostico', backup.diag);
                        if (backup.cumplimiento) localStorage.setItem('planIgualdadCumplimiento', backup.cumplimiento);
                        if (backup.medidas) localStorage.setItem('planIgualdadMedidas', backup.medidas);
                        if (backup.usuario) localStorage.setItem('planIgualdadUsuarioActual', backup.usuario);
                        
                        alert('✅ Backup restaurado. Recargando la página...');
                        window.location.reload();
                    }
                } catch (err) {
                    alert('❌ Archivo inválido.');
                }
                input.value = '';
            };
            reader.readAsText(file);
        });
    }
});

window.restaurarBackup = function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const backup = JSON.parse(e.target.result);
            if (!backup.version) throw new Error('Formato no válido');

            if (confirm('⚠️ Se van a sobrescribir TODOS los datos actuales. ¿Continuar?')) {
                if (backup.config) localStorage.setItem('planIgualdadConfig', backup.config);
                if (backup.diag) localStorage.setItem('planIgualdadDiagnostico', backup.diag);
                if (backup.cumplimiento) localStorage.setItem('planIgualdadCumplimiento', backup.cumplimiento);
                if (backup.medidas) localStorage.setItem('planIgualdadMedidas', backup.medidas);
                if (backup.usuario) localStorage.setItem('planIgualdadUsuarioActual', backup.usuario);
                
                alert('✅ Backup restaurado correctamente. La página se recargará.');
                window.location.href = 'index.html'; // Volver al inicio al restaurar
            }
        } catch (err) {
            console.error(err);
            alert('❌ El archivo no es un backup válido de esta aplicación.');
        }
        event.target.value = ''; // Limpiar
    };
    reader.readAsText(file);
};
