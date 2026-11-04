// nav.js - Genera la barra de navegación unificada

document.addEventListener('DOMContentLoaded', () => {
    const nav = document.getElementById('mainNav');
    if (!nav) return;

    const path = window.location.pathname.split('/').pop() || 'index.html';
    
    let activeIndex = '';
    let activeReuniones = '';
    let activePasos = '';
    let activeEstado = '';
    let activeConfig = '';
    let activeGuia = '';

    if (path === 'index.html' || path === '') activeIndex = 'active';
    else if (path === 'reuniones.html') activeReuniones = 'active';
    else if (path === 'cumplimiento.html' || path === 'informe.html' || path === 'peticion.html') activePasos = 'active';
    else if (path === 'estado.html') activeEstado = 'active';
    else if (path === 'configuracion.html') activeConfig = 'active';
    else if (path === 'guia.html') activeGuia = 'active';

    nav.innerHTML = `
        <a href="index.html" class="${activeIndex}">Inicio</a>
        <a href="reuniones.html" class="${activeReuniones}">Reuniones</a>
        <a href="cumplimiento.html" class="${activePasos}">Pasos del Plan</a>
        <a href="estado.html" class="${activeEstado}">Estado</a>
        <a href="configuracion.html" class="${activeConfig}">Configuración</a>
        <a href="guia.html" class="${activeGuia}" style="color: #ffb74d;">💡 Guía</a>
    `;
});
