// Cart Management
let cart = [];

// Initialize cart from localStorage
function initCart() {
    const savedCart = localStorage.getItem('pasteleriaCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartBadge();
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('pasteleriaCart', JSON.stringify(cart));
}

// Add product to cart
function addToCart(id, name, price, image) {
    // Check if product already exists in cart
    const existingProduct = cart.find(item => item.id === id);
    
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartBadge();
    showAddedNotification(name);
}

// Update cart badge
function updateCartBadge() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartBadge = document.getElementById('cartBadge');
    const floatingCartBadge = document.getElementById('floatingCartBadge');
    
    if (cartBadge) {
        cartBadge.textContent = totalItems;
    }
    if (floatingCartBadge) {
        floatingCartBadge.textContent = totalItems;
    }
}

// Show notification when product is added
function showAddedNotification(productName) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>${productName} agregado al carrito</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 2rem;
        background: linear-gradient(135deg, #f4a5a4 0%, #d48383 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 50px;
        box-shadow: 0 8px 24px rgba(244, 165, 164, 0.4);
        z-index: 1000;
        animation: slideIn 0.3s ease-out, fadeOut 0.3s ease-in 2.7s;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-weight: 500;
    }
    
    @media (max-width: 640px) {
        .cart-notification {
            right: 1rem !important;
            left: 1rem !important;
        }
    }
`;
document.head.appendChild(style);

// Open cart (redirect to cart page)
function openCart() {
    window.location.href = 'cart.html';
}

// Scroll to products section
function scrollToProducts() {
    const productsSection = document.getElementById('productos');
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Handle scroll effects
let lastScrollTop = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add shadow to header on scroll
    if (scrollTop > 10) {
        header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
    } else {
        header.style.boxShadow = 'none';
    }
    
    lastScrollTop = scrollTop;
});

// Show/hide floating cart button on scroll (mobile)
let scrollTimeout;
const floatingCart = document.getElementById('floatingCart');

window.addEventListener('scroll', () => {
    if (window.innerWidth <= 767 && floatingCart) {
        floatingCart.style.transform = 'scale(0.8)';
        floatingCart.style.opacity = '0.7';
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            floatingCart.style.transform = 'scale(1)';
            floatingCart.style.opacity = '1';
        }, 150);
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe product cards
document.addEventListener('DOMContentLoaded', () => {
    initCart();
    
    const productCards = document.querySelectorAll('.product-card');
    const featureCards = document.querySelectorAll('.feature-card');
    
    productCards.forEach(card => {
        observer.observe(card);
    });
    
    featureCards.forEach(card => {
        observer.observe(card);
    });
});

// Add fadeInUp animation
const animationStyle = document.createElement('style');
animationStyle.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .product-card,
    .feature-card {
        opacity: 0;
    }
`;
document.head.appendChild(animationStyle);

// Handle image loading
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('load', () => {
            img.style.animation = 'fadeIn 0.3s ease-in';
        });
        
        img.addEventListener('error', () => {
            console.error(`Failed to load image: ${img.src}`);
        });
    });
});

const fadeInStyle = document.createElement('style');
fadeInStyle.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`;
document.head.appendChild(fadeInStyle);

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Press 'C' to open cart
    if (e.key === 'c' || e.key === 'C') {
        if (!e.target.matches('input, textarea')) {
            openCart();
        }
    }
    
    // Press 'P' to scroll to products
    if (e.key === 'p' || e.key === 'P') {
        if (!e.target.matches('input, textarea')) {
            scrollToProducts();
        }
    }
});

// Add touch feedback for mobile
if ('ontouchstart' in window) {
    const buttons = document.querySelectorAll('button, .product-card, .feature-card');
    
    buttons.forEach(button => {
        button.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.97)';
        });
        
        button.addEventListener('touchend', function() {
            this.style.transform = '';
        });
    });
}

// Analytics helper (placeholder)
function trackEvent(category, action, label) {
    console.log(`Event: ${category} - ${action} - ${label}`);
    // Here you would typically send to Google Analytics or similar
}

// Track add to cart events
const originalAddToCart = addToCart;
addToCart = function(id, name, price, image) {
    trackEvent('E-commerce', 'Add to Cart', name);
    originalAddToCart(id, name, price, image);
};
