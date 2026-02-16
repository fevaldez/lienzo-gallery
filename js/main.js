/**
 * Lienzo Gallery - Main JavaScript
 * Dual-Model: Originals + Prints
 */
(function() {
  'use strict';

  const header = document.querySelector('.header');
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav__link');

  let lastScrollY = window.scrollY;
  let isMenuOpen = false;

  function init() {
    setupMobileMenu();
    setupHeaderScroll();
    setupSmoothScroll();
    setupImageLazyLoad();
    setupImagePlaceholders();
    setupGalleryFilters();
    setupGallerySort();
    setupProductTabs();
    setupPrintPricing();
    setupProductGallery();
    setupImageZoom();
    setupModals();
    setupNotifyButtons();
    setupContactForm();
    setupScrollAnimations();
    setupKeyboardNavigation();
  }

  // Mobile Menu
  function setupMobileMenu() {
    if (!menuToggle || !mobileNav) return;
    menuToggle.addEventListener('click', toggleMenu);
    mobileNavLinks.forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isMenuOpen) { closeMenu(); menuToggle.focus(); }
    });
    document.addEventListener('click', (e) => {
      if (isMenuOpen && !mobileNav.contains(e.target) && !menuToggle.contains(e.target)) closeMenu();
    });
  }

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    menuToggle.classList.toggle('menu-toggle--active', isMenuOpen);
    mobileNav.classList.toggle('mobile-nav--active', isMenuOpen);
    menuToggle.setAttribute('aria-expanded', isMenuOpen);
    menuToggle.setAttribute('aria-label', isMenuOpen ? 'Cerrar menú' : 'Abrir menú');
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
  }

  function closeMenu() {
    isMenuOpen = false;
    menuToggle.classList.remove('menu-toggle--active');
    mobileNav.classList.remove('mobile-nav--active');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menú');
    document.body.style.overflow = '';
  }

  // Header Scroll
  function setupHeaderScroll() {
    if (!header) return;
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => { handleHeaderScroll(); ticking = false; });
        ticking = true;
      }
    }, { passive: true });
  }

  function handleHeaderScroll() {
    const currentScrollY = window.scrollY;
    header.classList.toggle('header--scrolled', currentScrollY > 10);
    lastScrollY = currentScrollY;
  }

  // Smooth Scroll
  function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const headerHeight = header ? header.offsetHeight : 0;
          window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - headerHeight, behavior: 'smooth' });
        }
      });
    });
  }

  // Lazy Loading
  function setupImageLazyLoad() {
    const images = document.querySelectorAll('img[data-src]');
    if (!images.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '100px 0px' });

    images.forEach(img => observer.observe(img));
  }

  // Image Placeholders
  function setupImagePlaceholders() {
    const colors = ['#D4C4B0','#B8C4B8','#C4B8B8','#B8B8C4','#C4C4B8','#B8C4C4','#C4B8C4','#D0C4B8'];
    document.querySelectorAll('img').forEach((img, i) => {
      img.addEventListener('error', function() {
        const c = colors[i % colors.length], w = img.width || 800, h = img.height || 600;
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect fill="${c}" width="${w}" height="${h}"/></svg>`;
        this.src = 'data:image/svg+xml,' + encodeURIComponent(svg);
        this.alt = 'Imagen no disponible';
      });
    });
  }

  // Gallery Filters (status-based)
  function setupGalleryFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const artworkCards = document.querySelectorAll('.artwork-card');
    if (!filterBtns.length || !artworkCards.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        filterBtns.forEach(b => { b.classList.remove('filter-btn--active'); b.setAttribute('aria-pressed', 'false'); });
        btn.classList.add('filter-btn--active');
        btn.setAttribute('aria-pressed', 'true');

        let count = 0;
        artworkCards.forEach(card => {
          const status = card.dataset.status;
          const show = filter === 'all' || status === filter;
          card.style.display = show ? '' : 'none';
          if (show) count++;
        });
        announceToScreenReader(`Mostrando ${count} obras`);
      });
    });
  }

  // Gallery Sort
  function setupGallerySort() {
    const sortSelect = document.getElementById('sort-select');
    const grid = document.querySelector('.artwork-grid');
    if (!sortSelect || !grid) return;

    sortSelect.addEventListener('change', () => {
      const cards = Array.from(grid.querySelectorAll('.artwork-card'));
      cards.sort((a, b) => {
        switch (sortSelect.value) {
          case 'price-asc': return (parseInt(a.dataset.price) || 0) - (parseInt(b.dataset.price) || 0);
          case 'price-desc': return (parseInt(b.dataset.price) || 0) - (parseInt(a.dataset.price) || 0);
          default: return (b.dataset.date || '').localeCompare(a.dataset.date || '');
        }
      });
      cards.forEach(card => grid.appendChild(card));
    });
  }

  // Product Tabs (Original / Prints)
  function setupProductTabs() {
    const tabBtns = document.querySelectorAll('.product-tabs__btn');
    const tabPanels = document.querySelectorAll('.product-tabs__panel');
    if (!tabBtns.length) return;

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        tabBtns.forEach(b => b.classList.remove('product-tabs__btn--active'));
        tabPanels.forEach(p => p.classList.remove('product-tabs__panel--active'));
        btn.classList.add('product-tabs__btn--active');
        const panel = document.querySelector(`[data-tab-content="${tab}"]`);
        if (panel) panel.classList.add('product-tabs__panel--active');
      });
    });
  }

  // Dynamic Print Pricing
  function setupPrintPricing() {
    const sizeInputs = document.querySelectorAll('input[name="print-size"]');
    const typeInputs = document.querySelectorAll('input[name="print-type"]');
    const totalEl = document.getElementById('prints-total');
    if (!sizeInputs.length || !totalEl) return;

    function updatePrice() {
      const sizeInput = document.querySelector('input[name="print-size"]:checked');
      const typeInput = document.querySelector('input[name="print-type"]:checked');
      if (!sizeInput) return;

      let price = parseInt(sizeInput.value);
      const typeMultiplier = typeInput ? parseFloat(typeInput.dataset.multiplier || 1) : 1;
      price = Math.round(price * typeMultiplier);
      totalEl.textContent = '$' + price.toLocaleString('es-MX') + ' MXN';
    }

    sizeInputs.forEach(input => input.addEventListener('change', updatePrice));
    typeInputs.forEach(input => input.addEventListener('change', updatePrice));
    updatePrice();
  }

  // Product Gallery with Thumbnails
  function setupProductGallery() {
    const mainImage = document.querySelector('.product__main-image img');
    const thumbnails = document.querySelectorAll('.product__thumbnail');
    if (!mainImage || !thumbnails.length) return;

    mainImage.style.transition = 'opacity 0.3s ease';
    thumbnails.forEach((thumb, index) => {
      thumb.setAttribute('aria-label', `Ver imagen ${index + 1}`);
      thumb.addEventListener('click', () => {
        const thumbImg = thumb.querySelector('img');
        if (!thumbImg) return;
        mainImage.style.opacity = '0';
        setTimeout(() => {
          mainImage.src = thumbImg.src;
          mainImage.alt = thumbImg.alt;
          mainImage.style.opacity = '1';
        }, 300);
        thumbnails.forEach(t => { t.classList.remove('product__thumbnail--active'); t.setAttribute('aria-selected','false'); });
        thumb.classList.add('product__thumbnail--active');
        thumb.setAttribute('aria-selected', 'true');
      });
      thumb.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); thumb.click(); }
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); (thumbnails[index+1]||thumbnails[0]).focus(); (thumbnails[index+1]||thumbnails[0]).click(); }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); (thumbnails[index-1]||thumbnails[thumbnails.length-1]).focus(); (thumbnails[index-1]||thumbnails[thumbnails.length-1]).click(); }
      });
    });
  }

  // Image Zoom Modal
  function setupImageZoom() {
    const zoomTrigger = document.querySelector('.product__zoom-trigger');
    const zoomModal = document.getElementById('zoom-modal');
    if (!zoomTrigger || !zoomModal) return;

    const zoomImg = zoomModal.querySelector('img');

    zoomTrigger.addEventListener('click', () => {
      if (zoomImg) {
        zoomImg.src = zoomTrigger.currentSrc || zoomTrigger.src;
        zoomImg.alt = zoomTrigger.alt;
      }
      zoomModal.classList.add('zoom-modal--active');
      document.body.style.overflow = 'hidden';
    });

    function closeZoom() {
      zoomModal.classList.remove('zoom-modal--active');
      document.body.style.overflow = '';
    }

    zoomModal.addEventListener('click', closeZoom);
    const closeBtn = zoomModal.querySelector('.zoom-modal__close');
    if (closeBtn) closeBtn.addEventListener('click', closeZoom);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && zoomModal.classList.contains('zoom-modal--active')) closeZoom();
    });
  }

  // Modals (generic)
  function setupModals() {
    document.querySelectorAll('.modal').forEach(modal => {
      const backdrop = modal.querySelector('.modal__backdrop');
      const closeBtn = modal.querySelector('.modal__close');
      const close = () => { modal.classList.remove('modal--active'); modal.setAttribute('aria-hidden','true'); document.body.style.overflow = ''; };
      if (backdrop) backdrop.addEventListener('click', close);
      if (closeBtn) closeBtn.addEventListener('click', close);
    });

    // Interest modal (prints)
    const addInterest = document.getElementById('add-interest');
    const interestModal = document.getElementById('interest-modal');
    if (addInterest && interestModal) {
      addInterest.addEventListener('click', () => {
        interestModal.classList.add('modal--active');
        interestModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      });
    }

    // Interest form
    const interestForm = document.getElementById('interest-form');
    if (interestForm) {
      interestForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const success = interestForm.parentElement.querySelector('.modal__success');
        if (success) { success.hidden = false; interestForm.style.display = 'none'; }
        setTimeout(() => {
          if (interestModal) { interestModal.classList.remove('modal--active'); document.body.style.overflow = ''; }
          if (success) { success.hidden = true; interestForm.style.display = ''; interestForm.reset(); }
        }, 2500);
      });
    }
  }

  // Notify Buttons (próximamente)
  function setupNotifyButtons() {
    const notifyBtns = document.querySelectorAll('.artwork-card__notify');
    const modal = document.getElementById('notify-modal');
    const nameSpan = document.getElementById('modal-artwork-name');
    if (!notifyBtns.length || !modal) return;

    notifyBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (nameSpan) nameSpan.textContent = btn.dataset.artwork || 'esta obra';
        modal.classList.add('modal--active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      });
    });

    const form = document.getElementById('notify-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const success = modal.querySelector('.modal__success');
        if (success) { success.hidden = false; form.style.display = 'none'; }
        setTimeout(() => {
          modal.classList.remove('modal--active');
          document.body.style.overflow = '';
          if (success) { success.hidden = true; form.style.display = ''; form.reset(); }
        }, 2500);
      });
    }
  }

  // Contact Form
  function setupContactForm() {
    const form = document.querySelector('.contact-form form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;
      form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
      form.querySelectorAll('.error-message').forEach(el => el.remove());

      form.querySelectorAll('[required]').forEach(field => {
        const value = field.value.trim();
        let errorMessage = '';
        if (!value) { errorMessage = 'Este campo es obligatorio'; isValid = false; }
        else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) { errorMessage = 'Ingresa un correo electrónico válido'; isValid = false; }
        if (errorMessage) {
          field.classList.add('error');
          const el = document.createElement('p');
          el.className = 'error-message';
          el.style.cssText = 'color:#dc3545;font-size:0.8125rem;margin-top:0.25rem;';
          el.textContent = errorMessage;
          field.parentNode.appendChild(el);
        }
      });

      if (!isValid) { form.querySelector('.error')?.focus(); return; }

      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Enviando...';

      setTimeout(() => {
        btn.textContent = '¡Mensaje Enviado!';
        btn.style.background = '#25D366';
        setTimeout(() => { form.reset(); btn.textContent = originalText; btn.style.background = ''; btn.disabled = false; }, 3000);
      }, 1500);
    });
  }

  // Scroll Animations
  function setupScrollAnimations() {
    const elements = document.querySelectorAll('.artwork-card, .section-header, .about-hero__image, .about-hero__content, .value-card, .trust-badge');
    if (!elements.length) return;

    // Only animate elements below the fold to avoid hiding LCP content
    const viewportHeight = window.innerHeight;
    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < viewportHeight) return; // already visible, skip
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      el.dataset.animate = 'true';
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.target.dataset.animate) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    elements.forEach(el => {
      if (el.dataset.animate) observer.observe(el);
    });
  }

  // Keyboard Navigation
  function setupKeyboardNavigation() {
    const style = document.createElement('style');
    style.textContent = `
      :focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }
      .artwork-card:focus-within { outline: 2px solid var(--color-accent); outline-offset: 4px; }
      .form-group input.error, .form-group textarea.error { border-color: #dc3545; }
      @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
    `;
    document.head.appendChild(style);
  }

  // Screen reader announcements
  function announceToScreenReader(message) {
    const el = document.createElement('div');
    el.setAttribute('aria-live', 'polite');
    el.setAttribute('aria-atomic', 'true');
    el.className = 'visually-hidden';
    el.textContent = message;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1000);
  }

  // ========== Shopping Cart ==========
  const CART_KEY = 'lienzo_cart';

  function getCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    catch { return []; }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
  }

  function addToCart(item) {
    const cart = getCart();
    // Check for duplicate (same title + size + type)
    const existing = cart.findIndex(c =>
      c.title === item.title && c.size === item.size && c.printType === item.printType
    );
    if (existing >= 0) {
      cart[existing].quantity = (cart[existing].quantity || 1) + 1;
    } else {
      item.quantity = 1;
      cart.push(item);
    }
    saveCart(cart);
    showToast('Agregado al carrito');
    renderCartItems();
  }

  function removeFromCart(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    renderCartItems();
  }

  function updateCartCount() {
    const countEl = document.getElementById('cart-count');
    if (!countEl) return;
    const cart = getCart();
    const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    if (total > 0) {
      countEl.textContent = total;
      countEl.hidden = false;
    } else {
      countEl.hidden = true;
    }
  }

  function renderCartItems() {
    const container = document.getElementById('cart-items');
    if (!container) return;
    const cart = getCart();
    const footer = document.getElementById('cart-footer');
    const emptyState = document.getElementById('cart-empty');

    if (cart.length === 0) {
      container.innerHTML = '';
      if (emptyState) emptyState.hidden = false;
      if (footer) footer.hidden = true;
      return;
    }

    if (emptyState) emptyState.hidden = true;
    if (footer) footer.hidden = false;

    let total = 0;
    container.innerHTML = cart.map((item, i) => {
      const subtotal = item.price * (item.quantity || 1);
      total += subtotal;
      return `
        <div class="cart-item">
          <div class="cart-item__image">
            <img src="${item.image}" alt="${item.title}" loading="lazy">
          </div>
          <div class="cart-item__details">
            <p class="cart-item__title">${item.title}</p>
            <p class="cart-item__meta">${item.meta}${item.quantity > 1 ? ' × ' + item.quantity : ''}</p>
            <p class="cart-item__price">$${subtotal.toLocaleString('es-MX')} MXN</p>
            <button class="cart-item__remove" data-index="${i}">Eliminar</button>
          </div>
        </div>`;
    }).join('');

    const totalEl = document.getElementById('cart-total');
    if (totalEl) totalEl.textContent = '$' + total.toLocaleString('es-MX') + ' MXN';

    // WhatsApp checkout link
    const checkoutLink = document.getElementById('cart-checkout');
    if (checkoutLink) {
      const msg = 'Hola, me interesa comprar:\n\n' +
        cart.map(item => {
          const sub = item.price * (item.quantity || 1);
          return `• ${item.title} - ${item.meta}${item.quantity > 1 ? ' (×' + item.quantity + ')' : ''} - $${sub.toLocaleString('es-MX')} MXN`;
        }).join('\n') +
        '\n\nTotal: $' + total.toLocaleString('es-MX') + ' MXN';
      checkoutLink.href = 'https://wa.me/521XXXXXXXXXX?text=' + encodeURIComponent(msg);
    }

    // Remove buttons
    container.querySelectorAll('.cart-item__remove').forEach(btn => {
      btn.addEventListener('click', () => removeFromCart(parseInt(btn.dataset.index)));
    });
  }

  function setupCart() {
    updateCartCount();

    // Cart toggle
    const toggle = document.getElementById('cart-toggle');
    const drawer = document.getElementById('cart-drawer');
    const backdrop = document.getElementById('cart-backdrop');
    if (!toggle || !drawer) return;

    function openCart() {
      drawer.classList.add('cart-drawer--active');
      if (backdrop) backdrop.classList.add('cart-backdrop--active');
      document.body.style.overflow = 'hidden';
      renderCartItems();
    }

    function closeCart() {
      drawer.classList.remove('cart-drawer--active');
      if (backdrop) backdrop.classList.remove('cart-backdrop--active');
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', openCart);
    if (backdrop) backdrop.addEventListener('click', closeCart);

    const closeBtn = document.getElementById('cart-close');
    if (closeBtn) closeBtn.addEventListener('click', closeCart);

    const continueBtn = document.getElementById('cart-continue');
    if (continueBtn) continueBtn.addEventListener('click', closeCart);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('cart-drawer--active')) closeCart();
    });

    // Add to cart button (prints tab)
    const addBtn = document.getElementById('add-to-cart');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        const productSection = document.querySelector('.product[data-title]');
        if (!productSection) return;

        const title = productSection.dataset.title;
        const sizeInput = document.querySelector('input[name="print-size"]:checked');
        const typeInput = document.querySelector('input[name="print-type"]:checked');
        if (!sizeInput) return;

        const sizeLabel = sizeInput.closest('.print-selector__option').querySelector('.print-selector__label span:first-child');
        const typeLabel = typeInput ? typeInput.closest('.print-selector__option').querySelector('.print-selector__label span:first-child') : null;

        let price = parseInt(sizeInput.dataset.price);
        const multiplier = typeInput ? parseFloat(typeInput.dataset.multiplier || 1) : 1;
        price = Math.round(price * multiplier);

        const mainImg = document.getElementById('main-image');
        const image = mainImg ? (mainImg.currentSrc || mainImg.src) : '';

        const sizeName = sizeLabel ? sizeLabel.textContent : sizeInput.value.toUpperCase();
        const typeName = typeLabel ? typeLabel.textContent : 'Giclée';

        addToCart({
          title: title,
          size: sizeInput.value,
          printType: typeInput ? typeInput.value : 'standard',
          meta: sizeName + ' · ' + typeName,
          price: price,
          image: image
        });
      });
    }

    // Add to cart button (original tab)
    const addOrigBtn = document.getElementById('add-to-cart-original');
    if (addOrigBtn) {
      addOrigBtn.addEventListener('click', () => {
        const productSection = document.querySelector('.product[data-title]');
        if (!productSection) return;
        const title = productSection.dataset.title;
        const price = parseInt(productSection.dataset.originalPrice);
        const technique = productSection.dataset.technique;
        const dimensions = productSection.dataset.dimensions;
        const mainImg = document.getElementById('main-image');
        const image = mainImg ? (mainImg.currentSrc || mainImg.src) : '';
        addToCart({
          title: title,
          size: 'original',
          printType: 'original',
          meta: technique + ' · ' + dimensions,
          price: price,
          image: image
        });
      });
    }
  }

  function showToast(message) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.remove('toast--visible');
    // Force reflow
    void toast.offsetWidth;
    toast.classList.add('toast--visible');
    setTimeout(() => toast.classList.remove('toast--visible'), 2000);
  }

  // Init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { init(); setupCart(); });
  } else {
    init();
    setupCart();
  }
})();
