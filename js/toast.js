// toast.js - Sistema de notificaciones modernas

window.mostrarToast = function(mensaje, tipo = 'success') {
    // Crear contenedor si no existe
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    // Crear el toast
    const toast = document.createElement('div');
    toast.className = `toast ${tipo}`;
    
    // Icono según el tipo
    const icono = tipo === 'success' ? '✅' : (tipo === 'error' ? '❌' : 'ℹ️');
    toast.innerHTML = `<span>${icono}</span> ${mensaje}`;

    container.appendChild(toast);

    // Eliminar después de 3 segundos
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease-in forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};
