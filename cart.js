// Carrito de compras - JavaScript

// Datos de productos - cargar desde localStorage
let products = {};

// Cargar carrito desde localStorage
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('pasteleriaCart');
    if (savedCart) {
        const cartItems = JSON.parse(savedCart);
        cartItems.forEach(item => {
            products[item.id] = {
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image
            };
        });
        renderCartItems();
    } else {
        showEmptyCart();
    }
}

// Guardar carrito en localStorage
function saveCartToStorage() {
    const cartArray = Object.keys(products).map(id => ({
        id: parseInt(id),
        name: products[id].name,
        price: products[id].price,
        quantity: products[id].quantity,
        image: products[id].image
    }));
    localStorage.setItem('pasteleriaCart', JSON.stringify(cartArray));
}

// Renderizar items del carrito
function renderCartItems() {
    const cartSection = document.querySelector('.cart-section');
    const totalItems = Object.values(products).reduce((sum, product) => sum + product.quantity, 0);
    
    if (Object.keys(products).length === 0) {
        showEmptyCart();
        return;
    }
    
    let html = `<h3>Tu Carrito (${totalItems} ${totalItems === 1 ? 'producto' : 'productos'})</h3>`;
    
    for (let id in products) {
        const product = products[id];
        html += `
            <div class="cart-item">
                <div class="item-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="item-details">
                    <h4 class="item-name">${product.name}</h4>
                    <p class="item-price">${formatPrice(product.price)}</p>
                </div>
                <div class="item-actions">
                    <div class="quantity-control">
                        <button class="quantity-button" onclick="decreaseQuantity(${id})">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                        </button>
                        <span class="quantity" id="quantity-${id}">${product.quantity}</span>
                        <button class="quantity-button" onclick="increaseQuantity(${id})">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                        </button>
                    </div>
                    <button class="remove-button" onclick="removeItem(${id})">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    }
    
    cartSection.innerHTML = html;
}

// Constantes
const SHIPPING_COST = 8000;

// Funciones de utilidad
function formatPrice(price) {
    return '$ ' + price.toLocaleString('es-CO');
}

function calculateSubtotal() {
    let subtotal = 0;
    for (let id in products) {
        subtotal += products[id].price * products[id].quantity;
    }
    return subtotal;
}

function updateSummary() {
    const subtotal = calculateSubtotal();
    const total = subtotal + SHIPPING_COST;
    
    document.getElementById('subtotal').textContent = formatPrice(subtotal);
    document.getElementById('total').textContent = formatPrice(total);
}

// Funciones de control de cantidad
function increaseQuantity(itemId) {
    if (products[itemId]) {
        products[itemId].quantity++;
        document.getElementById('quantity-' + itemId).textContent = products[itemId].quantity;
        updateSummary();
        saveCartToStorage();
        console.log('Incrementar cantidad del item:', itemId, 'Nueva cantidad:', products[itemId].quantity);
    }
}

function decreaseQuantity(itemId) {
    if (products[itemId] && products[itemId].quantity > 1) {
        products[itemId].quantity--;
        document.getElementById('quantity-' + itemId).textContent = products[itemId].quantity;
        updateSummary();
        saveCartToStorage();
        console.log('Decrementar cantidad del item:', itemId, 'Nueva cantidad:', products[itemId].quantity);
    }
}

function removeItem(itemId) {
    if (confirm('¿Estás seguro de eliminar este producto del carrito?')) {
        delete products[itemId];
        
        // Buscar y eliminar el elemento del DOM
        const cartItems = document.querySelectorAll('.cart-item');
        cartItems.forEach((item, index) => {
            if (index + 1 === itemId) {
                item.remove();
            }
        });
        
        updateSummary();
        updateCartCount();
        saveCartToStorage();
        console.log('Eliminar item:', itemId);
        
        // Si el carrito está vacío, mostrar mensaje
        if (Object.keys(products).length === 0) {
            showEmptyCart();
        }
    }
}

function updateCartCount() {
    const totalItems = Object.values(products).reduce((sum, product) => sum + product.quantity, 0);
    const cartTitle = document.querySelector('.cart-section h3');
    if (cartTitle) {
        cartTitle.textContent = `Tu Carrito (${totalItems} ${totalItems === 1 ? 'producto' : 'productos'})`;
    }
}

function showEmptyCart() {
    const cartSection = document.querySelector('.cart-section');
    cartSection.innerHTML = `
        <h3>Tu Carrito (0 productos)</h3>
        <div class="empty-cart">
            <svg class="empty-cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <p class="empty-cart-text">Tu carrito está vacío</p>
        </div>
    `;
}

// Navegación entre pasos
let currentStep = 1;

function nextStep() {
    if (currentStep < 3) {
        currentStep++;
        updateStepIndicator();
        loadStepContent();
        console.log('Avanzar al paso:', currentStep);
    }
}

function previousStep() {
    if (currentStep > 1) {
        currentStep--;
        updateStepIndicator();
        loadStepContent();
        console.log('Retroceder al paso:', currentStep);
    }
}

function updateStepIndicator() {
    const steps = document.querySelectorAll('.step-circle');
    const stepLines = document.querySelectorAll('.step-line');
    const stepTitles = document.querySelectorAll('.step-title');
    
    steps.forEach((step, index) => {
        const stepNumber = index + 1;
        step.className = 'step-circle';
        
        if (stepNumber < currentStep) {
            step.classList.add('completed');
            step.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            `;
        } else if (stepNumber === currentStep) {
            step.classList.add('active');
        } else {
            step.classList.add('inactive');
        }
    });
    
    stepLines.forEach((line, index) => {
        if (index + 1 < currentStep) {
            line.classList.add('completed');
        } else {
            line.classList.remove('completed');
        }
    });
    
    stepTitles.forEach((title, index) => {
        if (index + 1 === currentStep || index + 1 < currentStep) {
            title.classList.add('active');
        } else {
            title.classList.remove('active');
        }
    });
}

function loadStepContent() {
    const cartSection = document.querySelector('.cart-section');
    
    if (currentStep === 1) {
        // Paso 1: Revisión del carrito (ya está cargado)
        location.reload(); // Recargar para mostrar el carrito inicial
    } else if (currentStep === 2) {
        // Paso 2: Información de envío
        cartSection.innerHTML = `
            <h3>Información de Envío</h3>
            <div class="form-group form-grid form-grid-2">
                <div>
                    <label class="form-label">Nombre Completo *</label>
                    <input type="text" class="form-input" placeholder="Juan Pérez" id="fullName">
                </div>
                <div>
                    <label class="form-label">Teléfono *</label>
                    <input type="tel" class="form-input" placeholder="+57 300 123 4567" id="phone">
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Correo Electrónico *</label>
                <input type="email" class="form-input" placeholder="correo@ejemplo.com" id="email">
            </div>
            <div class="form-group">
                <label class="form-label">Dirección *</label>
                <input type="text" class="form-input" placeholder="Calle 123 #45-67" id="address">
            </div>
            <div class="form-group form-grid form-grid-3">
                <div>
                    <label class="form-label">Ciudad *</label>
                    <input type="text" class="form-input" placeholder="Bogotá" id="city">
                </div>
                <div>
                    <label class="form-label">Departamento *</label>
                    <input type="text" class="form-input" placeholder="Cundinamarca" id="department">
                </div>
                <div>
                    <label class="form-label">Código Postal</label>
                    <input type="text" class="form-input" placeholder="110111" id="zipCode">
                </div>
            </div>
        `;
        updateActionButton('Continuar al Pago');
    } else if (currentStep === 3) {
        // Paso 3: Método de pago
        cartSection.innerHTML = `
            <h3>Método de Pago</h3>
            
            <div class="payment-methods">
                <div class="payment-option active" onclick="selectPaymentMethod('card')">
                    <div class="payment-option-content">
                        <div class="radio-circle">
                            <div class="radio-circle-inner"></div>
                        </div>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                            <line x1="1" y1="10" x2="23" y2="10"></line>
                        </svg>
                        <span>Tarjeta de Crédito/Débito</span>
                    </div>
                </div>
                
                <div class="payment-option" onclick="selectPaymentMethod('paypal')">
                    <div class="payment-option-content">
                        <div class="radio-circle">
                        </div>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#003087">
                            <path d="M8.32 21.97a.546.546 0 01-.26-.32L6.46 15.5H3.3a.547.547 0 01-.5-.35.546.546 0 01.09-.57l11.5-13a.544.544 0 01.91.14c.07.16.04.34-.08.47l-8.38 9.47h3.92c.17 0 .33.08.42.23.09.14.11.32.05.48l-2.67 9.38a.545.545 0 01-.24.22z"/>
                        </svg>
                        <span>PayPal</span>
                    </div>
                </div>
            </div>
            
            <div class="card-form" id="cardForm">
                <div class="secure-badge">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                    <span>Pago seguro encriptado</span>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Número de Tarjeta</label>
                    <input type="text" class="form-input" placeholder="1234 5678 9012 3456" maxlength="19">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Nombre en la Tarjeta</label>
                    <input type="text" class="form-input" placeholder="JUAN PEREZ">
                </div>
                
                <div class="form-group form-grid form-grid-2">
                    <div>
                        <label class="form-label">Fecha de Expiración</label>
                        <input type="text" class="form-input" placeholder="MM/AA" maxlength="5">
                    </div>
                    <div>
                        <label class="form-label">CVV</label>
                        <input type="text" class="form-input" placeholder="123" maxlength="4">
                    </div>
                </div>
                
                <div class="card-logos">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" alt="Amex">
                </div>
            </div>
        `;
        updateActionButton('Finalizar Pedido', true);
    }
}

function selectPaymentMethod(method) {
    const options = document.querySelectorAll('.payment-option');
    options.forEach(option => option.classList.remove('active'));
    
    if (method === 'card') {
        options[0].classList.add('active');
        document.getElementById('cardForm').style.display = 'block';
    } else {
        options[1].classList.add('active');
        document.getElementById('cardForm').innerHTML = `
            <div class="paypal-section">
                <div class="paypal-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                </div>
                <p>Serás redirigido a PayPal para completar tu pago de forma segura</p>
                <p class="small-text">Haz clic en "Finalizar Pedido" para continuar</p>
            </div>
        `;
    }
}

function updateActionButton(text, isFinal = false) {
    const actionButtons = document.querySelector('.action-buttons');
    actionButtons.innerHTML = `
        <button class="btn-primary" onclick="${isFinal ? 'finishOrder()' : 'nextStep()'}">
            ${isFinal ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>' : ''}
            <span>${text}</span>
            ${!isFinal ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>' : ''}
        </button>
        ${currentStep > 1 ? '<button class="btn-secondary" onclick="previousStep()">Volver</button>' : ''}
    `;
}

function finishOrder() {
    alert('¡Pedido realizado con éxito! Gracias por tu compra.\n\nTotal: ' + formatPrice(calculateSubtotal() + SHIPPING_COST));
    // Limpiar carrito
    localStorage.removeItem('pasteleriaCart');
    // Redirigir al home
    window.location.href = 'index.html';
}

// Función para cerrar el checkout
function closeCheckout() {
    // Redirigir de vuelta al home
    window.location.href = 'index.html';
}

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    console.log('Carrito de compras cargado');
    loadCartFromStorage();
    updateSummary();
    updateCartCount();
});