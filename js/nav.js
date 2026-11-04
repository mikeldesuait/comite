// nav.js - Genera la barra de navegación unificada y controla el menú móvil

document.addEventListener('DOMContentLoaded', () => {
    const nav = document.getElementById('mainNav');
    const btnMenu = document.getElementById('mobileMenuBtn');
    const navContainer = document.getElementById('navContainer');

    // 1. Control del menú hamburguesa en móviles
    if (btnMenu && navContainer) {
        btnMenu.addEventListener('click', () => {
            navContainer.classList.toggle('show-mobile');
            // Cambiar icono
            if (navContainer.classList.contains('show-mobile')) {
                btnMenu.innerHTML = '✕';
            } else {
                btnMenu.innerHTML = '☰';
            }
        });
    }

    if (!nav) return;

    // 2. Pintar los enlaces del menú (detectando la página actual)
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
        <a href="guia.html" class="${activeGuia}" style="color: #ffb74d;">💡&nbsp;Guía</a>
    `;
});
