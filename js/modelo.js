// modelo.js - Esquema de datos centralizado para el checklist de cumplimiento
// Formato por paso:
// {
//   estado: "pendiente" | "en_curso" | "hecho" | "validado",
//   fecha_inicio: "YYYY-MM-DD" | "",
//   fecha_completado: "YYYY-MM-DD" | "",
//   responsable: "nombre del comité o 'Otro'",
//   evidencia: "referencia al documento (ruta/nombre)",
//   notas: "texto libre",
//   historial: [ { fecha: ISO, accion: "...", usuario: "..." } ]
// }

const MODELO = (() => {
  const STORAGE_CUMPLIMIENTO = 'planIgualdadCumplimiento';
  const STORAGE_USUARIO = 'planIgualdadUsuarioActual';
  const STORAGE_CONFIG = 'planIgualdadConfig';

  const ESTADOS = ['pendiente', 'en_curso', 'hecho', 'validado'];

  // -------- Usuario actual --------
  function getUsuarioActual() {
    return localStorage.getItem(STORAGE_USUARIO) || '';
  }

  function setUsuarioActual(nombre) {
    if (nombre) localStorage.setItem(STORAGE_USUARIO, nombre);
    else localStorage.removeItem(STORAGE_USUARIO);
  }

  // -------- Lista de responsables desde configuración --------
  function getResponsables() {
    let cfg = {};
    try { cfg = JSON.parse(localStorage.getItem(STORAGE_CONFIG) || '{}'); } catch {}
    
    const lista = [];
    
    // 1. Representantes de la Empresa (fijos)
    if (cfg.empresaRep1) lista.push({ valor: cfg.empresaRep1, rol: 'Empresa' });
    if (cfg.empresaRep2) lista.push({ valor: cfg.empresaRep2, rol: 'Empresa' });
    if (cfg.empresaRep3) lista.push({ valor: cfg.empresaRep3, rol: 'Empresa' });

    // 2. Representantes de los Trabajadores (fijos)
    if (cfg.trabajadoresRep1) lista.push({ valor: cfg.trabajadoresRep1, rol: 'Trabajadores' });
    if (cfg.trabajadoresRep2) lista.push({ valor: cfg.trabajadoresRep2, rol: 'Trabajadores' });
    if (cfg.trabajadoresRep3) lista.push({ valor: cfg.trabajadoresRep3, rol: 'Trabajadores' });

    // 3. Miembros Dinámicos (los que se añaden con el botón +)
    if (cfg.empresaMiembrosExtra && Array.isArray(cfg.empresaMiembrosExtra)) {
        cfg.empresaMiembrosExtra.forEach(m => {
            lista.push({ valor: m.nombre, rol: `Empresa (${m.rol})` });
        });
    }
    if (cfg.trabajadoresMiembrosExtra && Array.isArray(cfg.trabajadoresMiembrosExtra)) {
        cfg.trabajadoresMiembrosExtra.forEach(m => {
            lista.push({ valor: m.nombre, rol: `Trabajadores (${m.rol})` });
        });
    }

    // 4. Cargos de la Mesa (Presidente y Secretario)
    if (cfg.comitePresidente) lista.push({ valor: cfg.comitePresidente, rol: 'Presidencia' });
    if (cfg.comiteSecretario) lista.push({ valor: cfg.comiteSecretario, rol: 'Secretaría' });
    
    return lista;
  }

  // -------- Estado completo (todos los pasos) --------
  function getEstadoCompleto() {
    let raw = {};
    try { raw = JSON.parse(localStorage.getItem(STORAGE_CUMPLIMIENTO) || '{}'); } catch {}
    return raw;
  }

  function guardarEstadoCompleto(estado) {
    localStorage.setItem(STORAGE_CUMPLIMIENTO, JSON.stringify(estado));
  }

  // -------- Paso individual --------
  function getPaso(pasoId) {
    const todos = getEstadoCompleto();
    return normalizarPaso(todos[pasoId]);
  }

  function setPaso(pasoId, datos) {
    const todos = getEstadoCompleto();
    todos[pasoId] = normalizarPaso(datos);
    guardarEstadoCompleto(todos);
  }

  // Normaliza un paso que puede venir en formato antiguo (true/false)
  // o en formato nuevo (objeto). Garantiza todos los campos.
  function normalizarPaso(valor) {
    const base = {
      estado: 'pendiente', // pendiente, en_curso, hecho, validado
      resultado_auditoria: 'sin_auditar', // sin_auditar, conforme, parcial, no_conforme, no_aplica
      fecha_inicio: '',
      fecha_completado: '',
      responsable: '',
      evidencia: '',
      archivo_evidencia: '', // Nombre del archivo seleccionado localmente
      enlace_evidencia: '',  // Ruta de red o enlace web
      hallazgos: '', // Qué falta o está incompleto
      plan_accion: '', // Qué hay que hacer para subsanarlo
      notas: '',
      historial: []
    };

    // Formato antiguo: true/false
    if (valor === true) {
      return {
        ...base,
        estado: 'hecho',
        fecha_completado: hoyISO(),
        historial: [{ fecha: new Date().toISOString(), accion: 'Migrado desde formato antiguo (marcado como hecho)', usuario: 'Sistema' }]
      };
    }
    if (valor === false || valor === undefined || valor === null) {
      return base;
    }

    // Formato nuevo: objeto
    if (typeof valor === 'object') {
      return {
        ...base,
        ...valor,
        estado: ESTADOS.includes(valor.estado) ? valor.estado : 'pendiente',
        historial: Array.isArray(valor.historial) ? valor.historial : []
      };
    }

    return base;
  }

  // -------- Registrar cambio (añade entrada al historial) --------
  function registrarCambio(pasoId, accion, usuario) {
    const todos = getEstadoCompleto();
    const paso = normalizarPaso(todos[pasoId]);
    paso.historial.push({
      fecha: new Date().toISOString(),
      accion,
      usuario: usuario || getUsuarioActual() || 'Sistema'
    });
    todos[pasoId] = paso;
    guardarEstadoCompleto(todos);
    return paso;
  }

  // -------- Cambio de estado con lógica --------
  function cambiarEstado(pasoId, nuevoEstado, usuario) {
    if (!ESTADOS.includes(nuevoEstado)) return null;
    const todos = getEstadoCompleto();
    const paso = normalizarPaso(todos[pasoId]);
    const anterior = paso.estado;

    if (anterior === nuevoEstado) return paso;

    paso.estado = nuevoEstado;

    // Auto-fechas
    if (nuevoEstado === 'en_curso' && !paso.fecha_inicio) {
      paso.fecha_inicio = hoyISO();
    }
    if ((nuevoEstado === 'hecho' || nuevoEstado === 'validado') && !paso.fecha_completado) {
      paso.fecha_completado = hoyISO();
    }
    if (nuevoEstado === 'pendiente') {
      paso.fecha_inicio = '';
      paso.fecha_completado = '';
    }

    paso.historial.push({
      fecha: new Date().toISOString(),
      accion: `Estado: ${etiquetaEstado(anterior)} → ${etiquetaEstado(nuevoEstado)}`,
      usuario: usuario || getUsuarioActual() || 'Sistema'
    });

    todos[pasoId] = paso;
    guardarEstadoCompleto(todos);
    return paso;
  }

  // -------- Actualizar campos con trazabilidad --------
  function actualizarCampo(pasoId, campo, valor, usuario) {
    const todos = getEstadoCompleto();
    const paso = normalizarPaso(todos[pasoId]);
    const anterior = paso[campo] || '';

    if (anterior === valor) return paso;

    paso[campo] = valor;

    const etiquetas = {
      resultado_auditoria: 'Resultado auditoría',
      responsable: 'Responsable',
      fecha_inicio: 'Fecha de inicio',
      fecha_completado: 'Fecha de completado',
      evidencia: 'Evidencia',
      archivo_evidencia: 'Archivo adjunto',
      enlace_evidencia: 'Enlace al documento',
      hallazgos: 'Hallazgos / Carencias',
      plan_accion: 'Plan de acción',
      notas: 'Notas'
    };

    const accion = campo === 'notas'
      ? `Nota actualizada`
      : `${etiquetas[campo] || campo}: "${anterior || '(vacío)'}" → "${valor || '(vacío)'}"`;

    paso.historial.push({
      fecha: new Date().toISOString(),
      accion,
      usuario: usuario || getUsuarioActual() || 'Sistema'
    });

    todos[pasoId] = paso;
    guardarEstadoCompleto(todos);
    return paso;
  }

  // -------- Utilidades --------
  function hoyISO() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }

  function etiquetaEstado(e) {
    return {
      pendiente: 'Pendiente',
      en_curso: 'En curso',
      hecho: 'Hecho',
      validado: 'Validado'
    }[e] || e;
  }

  // -------- Migración global (solo una vez, idempotente) --------
  function migrarSiNecesario() {
    const raw = getEstadoCompleto();
    let migrados = 0;
    const nuevo = {};
    for (const [id, valor] of Object.entries(raw)) {
      if (valor === true || valor === false) {
        nuevo[id] = normalizarPaso(valor);
        if (valor === true) migrados++;
      } else {
        nuevo[id] = normalizarPaso(valor);
      }
    }
    if (migrados > 0) {
      guardarEstadoCompleto(nuevo);
      console.log(`✅ Migración: ${migrados} pasos del formato antiguo (boolean) al nuevo formato.`);
    }
    return migrados;
  }

  // -------- Estadísticas --------
  function getEstadisticas() {
    const todos = getEstadoCompleto();
    const stats = { pendiente: 0, en_curso: 0, hecho: 0, validado: 0, total: 0 };
    for (const valor of Object.values(todos)) {
      const p = normalizarPaso(valor);
      stats[p.estado] = (stats[p.estado] || 0) + 1;
      stats.total++;
    }
    return stats;
  }

  // API pública
  return {
    ESTADOS,
    RESULTADOS_AUDITORIA: ['sin_auditar', 'conforme', 'parcial', 'no_conforme', 'no_aplica'],
    getUsuarioActual,
    setUsuarioActual,
    getResponsables,
    getEstadoCompleto,
    guardarEstadoCompleto,
    getPaso,
    setPaso,
    normalizarPaso,
    registrarCambio,
    cambiarEstado,
    actualizarCampo,
    migrarSiNecesario,
    getEstadisticas,
    etiquetaEstado,
    hoyISO
  };
})();
