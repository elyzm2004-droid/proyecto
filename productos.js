// Productos JavaScript - Funcionalidad de filtrado

// Función de filtrado por categoría
function filterCategory(category) {
    const productCards = document.querySelectorAll('.product-card');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Actualizar botones activos
    filterButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Filtrar productos
    productCards.forEach(card => {
        if (category === 'all') {
            card.classList.remove('hidden');
            // Agregar animación
            card.style.animation = 'none';
            setTimeout(() => {
                card.style.animation = 'fadeInUp 0.5s ease-out';
            }, 10);
        } else {
            const cardCategory = card.getAttribute('data-category');
            if (cardCategory === category) {
                card.classList.remove('hidden');
                // Agregar animación
                card.style.animation = 'none';
                setTimeout(() => {
                    card.style.animation = 'fadeInUp 0.5s ease-out';
                }, 10);
            } else {
                card.classList.add('hidden');
            }
        }
    });
    
    // Scroll suave a la sección de productos
    const productsSection = document.querySelector('.products-section');
    if (productsSection) {
        const offset = 100;
        const elementPosition = productsSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Contador de productos visibles
function updateProductCount() {
    const visibleProducts = document.querySelectorAll('.product-card:not(.hidden)');
    console.log(`Mostrando ${visibleProducts.length} productos`);
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    console.log('Página de productos cargada');
    updateProductCount();
    
    // Agregar eventos de teclado para navegación rápida
    document.addEventListener('keydown', (e) => {
        // Presionar número 1-5 para filtrar categorías
        if (e.key >= '1' && e.key <= '5') {
            const categories = ['all', 'cakes', 'cheesecakes', 'desserts', 'pastries'];
            const categoryIndex = parseInt(e.key) - 1;
            if (categoryIndex < categories.length) {
                const buttons = document.querySelectorAll('.filter-btn');
                if (buttons[categoryIndex]) {
                    buttons[categoryIndex].click();
                }
            }
        }
    });
});

// Observador para lazy loading de imágenes
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.style.opacity = '0';
            img.addEventListener('load', () => {
                img.style.transition = 'opacity 0.3s';
                img.style.opacity = '1';
            });
            observer.unobserve(img);
        }
    });
}, {
    rootMargin: '50px'
});

// Observar todas las imágenes de productos
document.addEventListener('DOMContentLoaded', () => {
    const productImages = document.querySelectorAll('.product-image img');
    productImages.forEach(img => imageObserver.observe(img));
});
