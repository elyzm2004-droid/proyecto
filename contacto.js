// Contacto JavaScript - Funcionalidad del formulario de contacto

// Manejar envío del formulario
function handleSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Simulación de envío (en producción se conectaría a un backend)
    console.log('Formulario enviado con los siguientes datos:');
    for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
    }
    
    // Mostrar mensaje de éxito
    showSuccessMessage();
    
    // Limpiar formulario
    form.reset();
    
    // Enviar evento de seguimiento
    trackFormSubmission();
}

// Mostrar mensaje de éxito
function showSuccessMessage() {
    // Buscar mensaje existente
    const existingMessage = document.querySelector('.success-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Crear nuevo mensaje
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <p>¡Gracias por tu mensaje! Te responderemos pronto.</p>
    `;
    
    // Insertar después del formulario
    const form = document.getElementById('contactForm');
    form.parentNode.insertBefore(successMessage, form.nextSibling);
    
    // Remover mensaje después de 5 segundos
    setTimeout(() => {
        successMessage.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            successMessage.remove();
        }, 300);
    }, 5000);
}

// Agregar animación de fadeOut
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-10px);
        }
    }
`;
document.head.appendChild(style);

// Validación en tiempo real
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        // Validación al salir del campo
        input.addEventListener('blur', () => {
            validateField(input);
        });
        
        // Remover error al escribir
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                input.classList.remove('error');
            }
        });
    });
});

// Validar campo individual
function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    
    if (field.hasAttribute('required') && !value) {
        markFieldError(field, 'Este campo es obligatorio');
        return false;
    }
    
    if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            markFieldError(field, 'Correo electrónico inválido');
            return false;
        }
    }
    
    if (type === 'tel' && value) {
        const phoneRegex = /^[\d\s\+\-\(\)]+$/;
        if (!phoneRegex.test(value)) {
            markFieldError(field, 'Teléfono inválido');
            return false;
        }
    }
    
    return true;
}

// Marcar campo con error
function markFieldError(field, message) {
    field.classList.add('error');
    
    // Agregar estilo de error si no existe
    if (!document.getElementById('error-styles')) {
        const errorStyle = document.createElement('style');
        errorStyle.id = 'error-styles';
        errorStyle.textContent = `
            .form-input.error {
                border-color: #ef4444 !important;
                background-color: rgba(239, 68, 68, 0.05) !important;
            }
        `;
        document.head.appendChild(errorStyle);
    }
}

// Enviar evento de seguimiento
function trackFormSubmission() {
    console.log('Evento de formulario enviado');
    // Aquí se integraría con Google Analytics o similar
}

// Auto-guardar borrador en localStorage
let saveTimeout;
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const inputs = form.querySelectorAll('input, textarea, select');
    
    // Cargar borrador guardado
    loadDraft();
    
    // Guardar cambios automáticamente
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => {
                saveDraft();
            }, 1000);
        });
    });
    
    // Limpiar borrador al enviar
    form.addEventListener('submit', () => {
        clearDraft();
    });
});

// Guardar borrador
function saveDraft() {
    const form = document.getElementById('contactForm');
    const formData = new FormData(form);
    const draft = {};
    
    for (let [key, value] of formData.entries()) {
        draft[key] = value;
    }
    
    localStorage.setItem('contactFormDraft', JSON.stringify(draft));
    console.log('Borrador guardado');
}

// Cargar borrador
function loadDraft() {
    const draft = localStorage.getItem('contactFormDraft');
    
    if (draft) {
        const data = JSON.parse(draft);
        const form = document.getElementById('contactForm');
        
        for (let [key, value] of Object.entries(data)) {
            const input = form.querySelector(`[name="${key}"]`);
            if (input && value) {
                input.value = value;
            }
        }
        
        console.log('Borrador cargado');
    }
}

// Limpiar borrador
function clearDraft() {
    localStorage.removeItem('contactFormDraft');
    console.log('Borrador eliminado');
}

// Copiar información de contacto al portapapeles
function copyToClipboard(text, type) {
    navigator.clipboard.writeText(text).then(() => {
        showCopyNotification(type);
    });
}

// Mostrar notificación de copiado
function showCopyNotification(type) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: linear-gradient(135deg, #f4a5a4 0%, #d48383 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 50px;
        box-shadow: 0 8px 24px rgba(244, 165, 164, 0.4);
        z-index: 1000;
        animation: slideInUp 0.3s ease-out;
    `;
    notification.textContent = `${type} copiado al portapapeles`;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 2000);
}

const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(animationStyles);

// Agregar funcionalidad de clic en info items para copiar
document.addEventListener('DOMContentLoaded', () => {
    const infoItems = document.querySelectorAll('.info-item');
    
    infoItems.forEach(item => {
        const content = item.querySelector('.info-content');
        const title = content.querySelector('h4').textContent;
        const text = content.querySelector('p').textContent;
        
        // Agregar cursor pointer para indicar que es clickeable
        item.style.cursor = 'pointer';
        
        item.addEventListener('click', () => {
            if (title === 'Teléfono') {
                copyToClipboard('+57 300 716 8999', 'Teléfono');
            } else if (title === 'Correo Electrónico') {
                copyToClipboard('estudiantesgrupo10@unibarranquilla.com', 'Correo');
            } else if (title === 'Ubicación') {
                copyToClipboard('Cra 18 #39-100, Soledad - Atlántico', 'Dirección');
            }
        });
        
        // Efecto hover
        item.addEventListener('mouseenter', () => {
            item.style.backgroundColor = 'rgba(244, 165, 164, 0.05)';
            item.style.borderRadius = '16px';
            item.style.padding = '0.75rem';
            item.style.margin = '-0.75rem';
            item.style.transition = 'all 0.3s';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.backgroundColor = 'transparent';
            item.style.padding = '0';
            item.style.margin = '0';
        });
    });
});

// Inicialización
console.log('Página de contacto cargada');
