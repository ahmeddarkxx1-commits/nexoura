import products from './products.js';
import { AntigravityScene } from './three-scene.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize 3D Background
    new AntigravityScene('hero-canvas-container');
    
    initTheme();
    initMobileMenu();
    initHeader();
    renderFeaturedProducts();
    initRevealAnimations();
    handleProductDetail();
    initPaymentSuccess(); // Handles redirects from payment providers
});

// Theme Management
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    // Check saved theme or preference
    const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

// Mobile Menu
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const header = document.querySelector('.header');
    
    if (!menuToggle || !navLinks) return;

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        header.classList.toggle('nav-active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
    });

    // Close menu when clicking on a link
    navLinks.addEventListener('click', (e) => {
        if (e.target.closest('.nav-link')) {
            navLinks.classList.remove('active');
            header.classList.remove('nav-active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Close menu when resizing window beyond mobile width
    window.addEventListener('resize', () => {
        if (window.innerWidth > 992 && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            header.classList.remove('nav-active');
            document.body.style.overflow = 'auto';
        }
    });
}

// Header scroll and scrollspy effect
function initHeader() {
    const header = document.querySelector('.header');
    const sections = ['hero', 'featured', 'benefits', 'faq'];
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        // Sticky/Scrolled effect
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Basic Scrollspy
        let current = 'hero';
        sections.forEach(section => {
            const el = document.getElementById(section);
            if (el) {
                const sectionTop = el.offsetTop;
                if (window.scrollY >= sectionTop - 100) {
                    current = section;
                }
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href.includes(current) || (current === 'hero' && href.includes('index.html'))) {
                link.classList.add('active');
            }
        });
    });
}

// Reveal animations on scroll
function initRevealAnimations() {
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    // Observe all reveal elements
    document.querySelectorAll('.reveal').forEach(el => {
        // Special case: Reveal hero elements immediately to avoid "empty site" feeling
        if (el.closest('.hero')) {
            el.classList.add('active');
        } else {
            observer.observe(el);
        }
    });
}

// Render products on the home page (Featured section)
function renderFeaturedProducts() {
    const grid = document.getElementById('featured-grid');
    if (!grid) return;

    // Take first 3 products for the landing page
    const featured = products.slice(0, 3);
    
    grid.innerHTML = featured.map(product => `
        <div class="product-card reveal">
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.src='https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800'">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            </div>
            <div class="product-content">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-desc">${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">${product.price}</span>
                    <a href="product.html?id=${product.id}" class="btn btn-primary">Buy Now</a>
                </div>
            </div>
        </div>
    `).join('');
}

// Handle dynamic content on product-detail page
function handleProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    if (!productId) return;

    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Store current product globally for the modal
    window.currentProduct = product;

    // Update Page SEO/Meta if needed
    document.title = `${product.name} | Nexora`;

    // Map properties to DOM elements
    const elements = {
        name: document.getElementById('pd-name'),
        tagline: document.getElementById('pd-tagline'),
        description: document.getElementById('pd-description'),
        price: document.getElementById('pd-price'),
        image: document.getElementById('pd-image'),
        buyBtn: document.getElementById('pd-buy-btn')
    };

    if (elements.name) elements.name.textContent = product.name;
    if (elements.tagline) elements.tagline.textContent = product.tagline;
    if (elements.description) elements.description.textContent = product.fullDescription;
    if (elements.price) elements.price.textContent = product.price;
    if (elements.image) elements.image.src = product.image;
    
    // Compute approx EGP for display
    const egpDisplay = document.getElementById('pd-egp-price-display');
    if (egpDisplay && product.price) {
        const usdValue = parseFloat(product.price.replace('$', ''));
        const egpValue = (usdValue * EXCHANGE_RATE).toLocaleString('ar-EG');
        egpDisplay.textContent = `≈ ${egpValue} EGP`;
    }

    if (elements.buyBtn) {
        elements.buyBtn.href = product.paymentLink;
    }
}

const EXCHANGE_RATE = 50; // 1 USD = 50 EGP

// Payment Modal Logic
const PAYMENT_DETAILS = {
    vfcash: {
        number: '01097207353',
        label: 'Vodafone Cash Number:',
        title: 'Pay via Vodafone Cash',
        icon: '📱'
    },
    instapay: {
        number: '01556533745',
        label: 'InstaPay Address:',
        title: 'Pay via InstaPay',
        icon: '⚡'
    }
};

window.openPaymentModal = function(method) {
    const modal = document.getElementById('payment-modal');
    const product = window.currentProduct;
    if (!modal || !product) return;

    const details = PAYMENT_DETAILS[method];
    
    // Calculate EGP price
    const usdPrice = parseFloat(product.price.replace('$', ''));
    const egpPrice = usdPrice * EXCHANGE_RATE;
    
    document.getElementById('modal-icon').textContent = details.icon;
    document.getElementById('modal-title').textContent = details.title;
    document.getElementById('number-label').textContent = details.label;
    document.getElementById('modal-number').textContent = details.number;
    document.getElementById('modal-amount').textContent = `${product.price} (approx. ${egpPrice} EGP)`;
    
    // Update WhatsApp link dynamically based on phone input
    const whatsappBtn = document.getElementById('modal-whatsapp-btn');
    const phoneInput = document.getElementById('customer-phone');
    
    const updateWhatsAppLink = () => {
        const phone = phoneInput ? (phoneInput.value || 'Not provided') : 'Not provided';
        const message = `Hello Nexoura, I'd like to instantly get the "${product.name}"\n` +
                        `Price: ${product.price} (approx. ${egpPrice.toLocaleString()} EGP)\n` +
                        `Payment Method: ${details.title}\n` +
                        `Phone: ${phone}\n\n` +
                        `Here is the payment screenshot to confirm my order.`;
        const encodedMsg = encodeURIComponent(message);
        whatsappBtn.href = `https://wa.me/201097207353?text=${encodedMsg}`;
    };

    if (phoneInput) {
        phoneInput.addEventListener('input', updateWhatsAppLink);
    }
    
    updateWhatsAppLink(); // Initial call

    modal.classList.add('active');
    document.body.classList.add('modal-open'); 
};

// Handles Payment Success State (Redirects from Paymob)
function initPaymentSuccess() {
    const urlParams = new URLSearchParams(window.location.search);
    const isSuccess = urlParams.get('payment') === 'success';
    const productId = urlParams.get('id');
    
    if (isSuccess && productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        showSuccessUI(product);
    }
}

function showSuccessUI(product) {
    // Create a fixed success overlay or update the current detail section
    const container = document.querySelector('.payment-card');
    if (!container) return;

    container.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <div style="width: 60px; height: 60px; background: var(--success); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 30px;">✓</div>
            <h2 style="margin-bottom: 10px;">Payment Confirmed!</h2>
            <p class="text-muted" style="margin-bottom: 24px;">Thank you for trusting Nexoura. You can download your product now.</p>
            <a href="${product.downloadLink || '#'}" class="btn btn-primary" style="width: 100%;" download>Download Now</a>
            <p style="margin-top: 16px; font-size: 0.85rem;">Facing an issue? <a href="contact.html" style="color: var(--primary);">Contact Us</a></p>
        </div>
    `;
}


window.closePaymentModal = function() {
    const modal = document.getElementById('payment-modal');
    if (modal) modal.classList.remove('active');
    document.body.classList.remove('modal-open');
};

window.copyPaymentDetails = function() {
    const number = document.getElementById('modal-number').textContent;
    const btn = document.getElementById('copy-btn');
    
    navigator.clipboard.writeText(number).then(() => {
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        btn.style.background = 'var(--success)';
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = 'var(--primary)';
        }, 2000);
    });
};
