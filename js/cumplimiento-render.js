// cumplimiento-render.js - Render de fichas de trabajo para el checklist

window.CUMPLIMIENTO_RENDER = (() => {

  function fmtFechaHora(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    if (isNaN(d)) return iso;
    return d.toLocaleDateString('es-ES') + ' ' + d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  }

  function badgeAuditoria(res) {
    const map = {
      sin_auditar: { txt: 'Sin auditar', clase: 'estado-pendiente' },
      conforme: { txt: '✅ Conforme', clase: 'estado-validado' },
      parcial: { txt: '⚠️ Parcial', clase: 'estado-en_curso' },
      no_conforme: { txt: '❌ No conforme', clase: 'estado-no_conforme' },
      no_aplica: { txt: '➖ No aplica', clase: 'estado-pendiente' }
    };
    const item = map[res] || map.sin_auditar;
    return `<span class="estado-badge ${item.clase}">${item.txt}</span>`;
  }

  function renderFicha(paso, pasoId, responsables) {
    const optsResponsable = ['<option value="">— Selecciona —</option>']
      .concat(responsables.map(r =>
        `<option value="${r.valor}" ${paso.responsable === r.valor ? 'selected' : ''}>${r.valor} (${r.rol})</option>`
      ))
      .join('');

    const historialHTML = paso.historial.length === 0
      ? '<em style="color:var(--text-light);">Sin cambios registrados todavía.</em>'
      : paso.historial.slice().reverse().map(h => `
          <li style="padding:0.3rem 0; border-bottom:1px dashed var(--border); font-size:0.85rem;">
            <span style="color:var(--text-light);">${fmtFechaHora(h.fecha)}</span>
            · ${h.accion}
            <span style="color:var(--primary);"> · ${h.usuario}</span>
          </li>`).join('');

    return `
      <div class="ficha-trabajo" style="background:#fff; border:1px solid var(--border); border-radius:8px; padding:1rem; margin-bottom:1rem;">
        <div class="ficha-grid">
          <div class="form-group">
            <label>Resultado de la Auditoría</label>
            <select data-campo="resultado_auditoria" data-paso="${pasoId}" style="font-weight:600;">
              <option value="sin_auditar" ${paso.resultado_auditoria === 'sin_auditar' ? 'selected' : ''}>Sin auditar</option>
              <option value="conforme" ${paso.resultado_auditoria === 'conforme' ? 'selected' : ''}>✅ Conforme</option>
              <option value="parcial" ${paso.resultado_auditoria === 'parcial' ? 'selected' : ''}>⚠️ Parcial (faltan cosas)</option>
              <option value="no_conforme" ${paso.resultado_auditoria === 'no_conforme' ? 'selected' : ''}>❌ No conforme</option>
              <option value="no_aplica" ${paso.resultado_auditoria === 'no_aplica' ? 'selected' : ''}>➖ No aplica a esta empresa</option>
            </select>
          </div>
          <div class="form-group">
            <label>Responsable (Empresa/Comité)</label>
            <select data-campo="responsable" data-paso="${pasoId}">
              ${optsResponsable}
            </select>
          </div>
          <div class="form-group">
            <label>Fecha de revisión</label>
            <input type="date" data-campo="fecha_completado" data-paso="${pasoId}" value="${paso.fecha_completado || ''}">
          </div>
          <div class="form-group" style="grid-column: span 2;">
            <label>Evidencia (Documento adjunto)</label>
            <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
              <input type="file" id="file-${pasoId}" style="display:none;" onchange="window.guardarArchivoLocal(event, '${pasoId}')">
              <button type="button" class="btn" onclick="document.getElementById('file-${pasoId}').click()" style="font-size: 0.85rem;">
                📂 Seleccionar archivo
              </button>
              <span id="nombre-file-${pasoId}" style="font-size: 0.9rem; color: var(--primary); font-weight: 500;">
                ${paso.archivo_evidencia ? '📄 ' + paso.archivo_evidencia : 'Ningún archivo seleccionado'}
              </span>
              ${paso.archivo_evidencia ? `
                <a href="#" onclick="window.abrirArchivoLocal(event, '${pasoId}')" class="btn btn-primary" style="font-size: 0.85rem; padding: 0.4rem 0.8rem;">
                  🔗 Abrir documento
                </a>
              ` : ''}
            </div>
          </div>
        </div>
        
        <div class="form-group" style="margin-top:0.8rem;">
          <label style="color:var(--danger);">Hallazgos / Carencias detectadas</label>
          <textarea data-campo="hallazgos" data-paso="${pasoId}" rows="2"
                    style="padding:0.55rem 0.7rem;border:1px solid var(--danger);border-radius:8px;font-family:inherit;font-size:0.9rem;width:100%;resize:vertical;"
                    placeholder="Ej: Se informó a la plantilla pero no hay acta firmada.">${paso.hallazgos || ''}</textarea>
        </div>
        
        <div class="form-group" style="margin-top:0.8rem;">
          <label style="color:var(--success);">Plan de Acción (Cómo subsanarlo)</label>
          <textarea data-campo="plan_accion" data-paso="${pasoId}" rows="2"
                    style="padding:0.55rem 0.7rem;border:1px solid var(--success);border-radius:8px;font-family:inherit;font-size:0.9rem;width:100%;resize:vertical;"
                    placeholder="Ej: Crear modelo de acta y convocar reunión.">${paso.plan_accion || ''}</textarea>
        </div>

        <div class="form-group" style="margin-top:0.8rem;">
          <label>Notas adicionales</label>
          <textarea data-campo="notas" data-paso="${pasoId}" rows="1"
                    style="padding:0.55rem 0.7rem;border:1px solid var(--border);border-radius:8px;font-family:inherit;font-size:0.9rem;width:100%;resize:vertical;">${paso.notas || ''}</textarea>
        </div>
        
        <div style="display:flex; justify-content:flex-end; gap:0.8rem; margin-top:1rem; padding-top:1rem; border-top:1px solid var(--border);">
            <button type="button" class="btn btn-danger" onclick="window.borrarFicha('${pasoId}')" style="padding:0.4rem 0.8rem; font-size:0.9rem;">
                🗑️ Borrar datos
            </button>
            <button type="button" class="btn btn-primary" onclick="window.guardarFicha('${pasoId}')" style="padding:0.4rem 1.2rem; font-size:0.9rem;">
                💾 Guardar cambios
            </button>
        </div>

        <details class="historial-detalle" style="margin-top:1rem;">
          <summary style="cursor:pointer; color:var(--primary); font-size:0.9rem; font-weight:500;">
            📜 Historial de cambios (${paso.historial.length})
          </summary>
          <ul style="list-style:none; margin-top:0.5rem; padding:0.5rem; background:#fafafa; border-radius:6px; max-height:180px; overflow-y:auto;">
            ${historialHTML}
          </ul>
        </details>
      </div>
    `;
  }

  function renderFases(container, FASES, estado, responsables) {
    container.innerHTML = '';
    FASES.forEach(fase => {
      const pasos = fase.pasos.map(p => {
        const datos = MODELO.normalizarPaso(estado[p.id]);
        return { ...p, _datos: datos };
      });

      const stats = { conforme: 0, parcial: 0, no_conforme: 0, sin_auditar: 0 };
      pasos.forEach(p => { if(stats[p._datos.resultado_auditoria] !== undefined) stats[p._datos.resultado_auditoria]++; });

      const card = document.createElement('div');
      card.className = 'fase-card';

      const header = document.createElement('div');
      header.className = 'fase-header';
      header.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:0.15rem;">
          <h3>${fase.titulo}</h3>
          <span style="font-size:0.8rem; opacity:0.9;">
            ${stats.conforme}/${pasos.length} conformes
            ${stats.parcial ? ` · ${stats.parcial} parciales` : ''}
            ${stats.no_conforme ? ` · ${stats.no_conforme} no conformes` : ''}
          </span>
        </div>
      `;

      const body = document.createElement('div');
      body.className = 'fase-body';

      pasos.forEach(paso => {
        const item = document.createElement('div');
        item.className = 'paso-item';
        item.dataset.pasoId = paso.id;

        item.innerHTML = `
          <details class="paso-details" style="width: 100%;">
            <summary style="padding: 1rem 1.5rem; cursor: pointer; list-style: none; display: flex; justify-content: space-between; align-items: center; gap: 1rem; background: #fff;">
                <div style="flex: 1;">
                    <div class="paso-titulo" style="font-weight: 600; color: var(--text); margin-bottom: 0.3rem;">${paso.titulo}</div>
                    <div class="paso-referencia" style="font-size: 0.8rem; color: var(--primary);">
                        📖 <a href="${paso.url || '#'}" target="_blank" rel="noopener" onclick="event.stopPropagation()" style="color:var(--primary); text-decoration:underline;">${paso.referencia}</a>
                    </div>
                </div>
                <div style="flex-shrink:0;">
                    ${badgeAuditoria(paso._datos.resultado_auditoria)}
                </div>
            </summary>
            
            <div style="padding: 1rem 1.5rem; background: #fafafa; border-top: 1px solid var(--border);">
                <div class="paso-descripcion" style="margin-bottom: 1rem;">${paso.descripcion}</div>
                <div class="paso-porque" style="margin-bottom: 1rem;">💡 <strong>¿Por qué?</strong> ${paso.porque}</div>

                <div class="ficha-container" style="margin-top:0.8rem; display: block;">
                  ${renderFicha(paso._datos, paso.id, responsables)}
                </div>
            </div>
          </details>
        `;

        body.appendChild(item);
      });

      card.appendChild(header);
      card.appendChild(body);
      container.appendChild(card);

      // Evento toggle para la fase entera
      header.addEventListener('click', () => body.classList.toggle('open'));
      
      // Auto-guardado del semáforo (al cambiar el select, se guarda al instante)
      body.querySelectorAll('select[data-campo="resultado_auditoria"]').forEach(el => {
        el.addEventListener('change', () => {
          MODELO.actualizarCampo(el.dataset.paso, 'resultado_auditoria', el.value);
          // Recargamos la página para actualizar el color del borde del summary
          window.location.reload(); 
        });
      });
    });

    // Abrir la primera fase por defecto
    const firstBody = container.querySelector('.fase-body');
    if (firstBody) firstBody.classList.add('open');
  }

  return { renderFases };
})();
