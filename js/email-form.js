// Inicialización de EmailJS
(function() {
    emailjs.init("dSOA-vJR6KXWvYqpf");
})();

// Función mejorada para sanitizar las entradas
function sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = input;
    return div.textContent;
}

// Función mejorada para validar el input contra scripts maliciosos
function validateInput(input) {
    if (typeof input !== 'string') return false;
    
    // Patrones de validación más precisos
    const invalidPatterns = {
        script: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        onEvent: /\bon\w+\s*=/gi,
        jsUrl: /javascript:/gi,
        // Permitimos algunos caracteres especiales comunes en emails y nombres
        invalidChars: /[<>\/'"`;(){}]|(%[0-9A-Fa-f]{2})/g
    };

    return !Object.values(invalidPatterns).some(pattern => pattern.test(input));
}

// Función para validar email
function isValidEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailPattern.test(email);
}

// Función para mostrar mensaje de error
function showErrorMessage(input, message) {
    clearErrorMessage(input); // Limpiamos primero para evitar duplicados
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    input.parentNode.insertBefore(errorElement, input.nextSibling);
    input.classList.add('input-error');
}

// Función para limpiar mensaje de error
function clearErrorMessage(input) {
    const errorElement = input.nextElementSibling;
    if (errorElement?.classList.contains('error-message')) {
        errorElement.remove();
    }
    input.classList.remove('input-error');
}

// Función para manejar el estado del botón
function updateButtonState(button, isLoading = false) {
    const span = button.querySelector('span');
    const icon = button.querySelector('i');
    
    button.disabled = isLoading;
    span.textContent = isLoading ? 'Enviando...' : 'Enviar';
    icon.className = isLoading ? 'fas fa-spinner fa-spin' : 'fas fa-paper-plane';
}

// Función principal para validar el formulario
function validateForm(nombre, email, mensaje) {
    let isValid = true;
    const form = document.getElementById('contactForm');

    // Validación de nombre
    if (!nombre || nombre.length < 2) {
        showErrorMessage(form.nombre, 'Por favor, ingresa un nombre válido (mínimo 2 caracteres).');
        isValid = false;
    } else if (!validateInput(nombre)) {
        showErrorMessage(form.nombre, 'El nombre contiene caracteres no permitidos.');
        isValid = false;
    } else {
        clearErrorMessage(form.nombre);
    }

    // Validación de email
    if (!email) {
        showErrorMessage(form.email, 'Por favor, ingresa tu correo electrónico.');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showErrorMessage(form.email, 'Por favor, ingresa un correo electrónico válido.');
        isValid = false;
    } else if (!validateInput(email)) {
        showErrorMessage(form.email, 'El correo contiene caracteres no permitidos.');
        isValid = false;
    } else {
        clearErrorMessage(form.email);
    }

    // Validación de mensaje
    if (!mensaje || mensaje.length < 10) {
        showErrorMessage(form.mensaje, 'Por favor, ingresa un mensaje de al menos 10 caracteres.');
        isValid = false;
    } else if (!validateInput(mensaje)) {
        showErrorMessage(form.mensaje, 'El mensaje contiene caracteres no permitidos.');
        isValid = false;
    } else {
        clearErrorMessage(form.mensaje);
    }

    return isValid;
}

// Manejador principal del formulario
document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const form = this;
    const submitButton = form.querySelector('.submit-btn');
    
    // Obtener y limpiar los valores del formulario
    const nombre = form.nombre.value.trim();
    const email = form.email.value.trim();
    const mensaje = form.mensaje.value.trim();

    // Validar el formulario
    if (!validateForm(nombre, email, mensaje)) {
        return;
    }

    // Actualizar estado del botón
    updateButtonState(submitButton, true);

    try {
        // Preparar los parámetros sanitizados
        const templateParams = {
            from_name: sanitizeInput(nombre),
            reply_to: sanitizeInput(email),
            message: sanitizeInput(mensaje),
            to_name: 'Cristóbal',
        };

        // Enviar el email
        await emailjs.send('service_fn4807e', 'template_oqup446', templateParams);
        
        // Mostrar mensaje de éxito
        Swal.fire({
            title: '¡Gracias!',
            text: 'Tu mensaje ha sido enviado. Te contactaremos pronto.',
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#4a90e2'
        });

        // Limpiar el formulario
        form.reset();

    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            title: '¡Error!',
            text: 'Hubo un problema al enviar tu mensaje. Por favor, intenta de nuevo más tarde.',
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: '#4a90e2'
        });
    } finally {
        // Restaurar el botón después de 3 segundos
        setTimeout(() => {
            updateButtonState(submitButton, false);
        }, 3000);
    }
});