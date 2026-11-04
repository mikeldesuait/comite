// app.js - Lógica general de la página principal

document.addEventListener('DOMContentLoaded', () => {
    console.log('📋 Gestor de Plan de Igualdad iniciado');

    const config = localStorage.getItem('planIgualdadConfig');
    if (config) {
        try {
            const data = JSON.parse(config);
            if (data.empresaNombre) {
                const hero = document.querySelector('.hero p');
                if (hero) {
                    hero.textContent = `Empresa configurada: ${data.empresaNombre}`;
                }
            }
        } catch (e) {
            console.warn('Error al leer configuración:', e);
        }
    }
});
