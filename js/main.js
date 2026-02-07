/**
 * Lienzo Gallery - Main JavaScript
 * Refined Gallery Minimalism
 */

(function() {
  'use strict';

  // DOM Elements
  const header = document.querySelector('.header');
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav__link');

  // State
  let lastScrollY = window.scrollY;
  let isMenuOpen = false;

  /**
   * Initialize the application
   */
  function init() {
    setupMobileMenu();
    setupHeaderScroll();
    setupSmoothScroll();
    setupImageLazyLoad();
    setupImagePlaceholders();
    setupGalleryFilters();
    setupProductGallery();
    setupContactForm();
    setupScrollAnimations();
    setupKeyboardNavigation();
  }

  /**
   * Mobile Menu Toggle
   */
  function setupMobileMenu() {
    if (!menuToggle || !mobileNav) return;

    menuToggle.addEventListener('click', toggleMenu);

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        closeMenu();
        menuToggle.focus();
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (isMenuOpen && !mobileNav.contains(e.target) && !menuToggle.contains(e.target)) {
        closeMenu();
      }
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

  /**
   * Header Scroll Behavior
   */
  function setupHeaderScroll() {
    if (!header) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleHeaderScroll();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  function handleHeaderScroll() {
    const currentScrollY = window.scrollY;

    // Add shadow when scrolled
    if (currentScrollY > 10) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }

    // Hide/show header on scroll direction (only on larger screens)
    if (window.innerWidth >= 768) {
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        header.classList.add('header--hidden');
      } else {
        header.classList.remove('header--hidden');
      }
    }

    lastScrollY = currentScrollY;
  }

  /**
   * Smooth Scroll for Anchor Links
   */
  function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const headerHeight = header ? header.offsetHeight : 0;
          const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  /**
   * Enhanced Image Lazy Loading
   */
  function setupImageLazyLoad() {
    if ('loading' in HTMLImageElement.prototype) {
      const images = document.querySelectorAll('img[loading="lazy"]');
      images.forEach(img => {
        if (img.dataset.src) {
          img.src = img.dataset.src;
        }
      });
    } else {
      const lazyImages = document.querySelectorAll('img[loading="lazy"]');

      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
            }
            img.removeAttribute('loading');
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px'
      });

      lazyImages.forEach(img => imageObserver.observe(img));
    }
  }

  /**
   * Image Placeholder Handler
   * Generates colored placeholders for missing images
   */
  function setupImagePlaceholders() {
    const images = document.querySelectorAll('img');

    const colors = [
      '#D4C4B0', '#B8C4B8', '#C4B8B8', '#B8B8C4',
      '#C4C4B8', '#B8C4C4', '#C4B8C4', '#D0C4B8'
    ];

    images.forEach((img, index) => {
      img.addEventListener('error', function() {
        // Create a placeholder with a subtle color
        const color = colors[index % colors.length];
        const width = img.width || 800;
        const height = img.height || 600;

        // Create SVG placeholder
        const svg = `
          <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
            <rect fill="${color}" width="${width}" height="${height}"/>
            <rect fill="rgba(255,255,255,0.3)" x="${width/2-40}" y="${height/2-40}" width="80" height="80" rx="4"/>
            <path fill="rgba(255,255,255,0.5)" d="M${width/2-20} ${height/2+10} L${width/2} ${height/2-15} L${width/2+20} ${height/2+10} Z"/>
            <circle fill="rgba(255,255,255,0.5)" cx="${width/2-8}" cy="${height/2-5}" r="8"/>
          </svg>
        `;

        this.src = 'data:image/svg+xml,' + encodeURIComponent(svg);
        this.alt = 'Imagen no disponible';
      });
    });
  }

  /**
   * Gallery Filters
   */
  function setupGalleryFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const artworkCards = document.querySelectorAll('.artwork-card');

    if (!filterBtns.length || !artworkCards.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        // Update active button
        filterBtns.forEach(b => {
          b.classList.remove('filter-btn--active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('filter-btn--active');
        btn.setAttribute('aria-pressed', 'true');

        // Filter cards with animation
        let visibleCount = 0;
        artworkCards.forEach((card, index) => {
          const category = card.dataset.category;

          if (filter === 'all' || category === filter) {
            card.style.display = '';
            card.style.animationDelay = `${visibleCount * 0.05}s`;
            card.style.animation = 'fadeInUp 0.4s ease forwards';
            visibleCount++;
          } else {
            card.style.animation = 'fadeOut 0.2s ease forwards';
            setTimeout(() => {
              card.style.display = 'none';
            }, 200);
          }
        });

        // Announce to screen readers
        announceToScreenReader(`Mostrando ${visibleCount} obras`);
      });
    });
  }

  /**
   * Product Gallery with Thumbnails
   */
  function setupProductGallery() {
    const mainImage = document.querySelector('.product__main-image img');
    const thumbnails = document.querySelectorAll('.product__thumbnail');

    if (!mainImage || !thumbnails.length) return;

    // Add transition to main image
    mainImage.style.transition = 'opacity 0.3s ease';

    thumbnails.forEach((thumb, index) => {
      thumb.setAttribute('aria-label', `Ver imagen ${index + 1}`);

      thumb.addEventListener('click', () => {
        const thumbImg = thumb.querySelector('img');
        if (!thumbImg) return;

        const newSrc = thumbImg.src;
        const newAlt = thumbImg.alt;

        // Fade out
        mainImage.style.opacity = '0';

        setTimeout(() => {
          mainImage.src = newSrc;
          mainImage.alt = newAlt;
          // Fade in
          mainImage.style.opacity = '1';
        }, 300);

        // Update active thumbnail
        thumbnails.forEach(t => {
          t.classList.remove('product__thumbnail--active');
          t.setAttribute('aria-selected', 'false');
        });
        thumb.classList.add('product__thumbnail--active');
        thumb.setAttribute('aria-selected', 'true');
      });

      // Keyboard accessibility
      thumb.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          thumb.click();
        }

        // Arrow key navigation
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          const next = thumbnails[index + 1] || thumbnails[0];
          next.focus();
          next.click();
        }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          const prev = thumbnails[index - 1] || thumbnails[thumbnails.length - 1];
          prev.focus();
          prev.click();
        }
      });
    });
  }

  /**
   * Contact Form Handling
   */
  function setupContactForm() {
    const form = document.querySelector('.contact-form form');

    if (!form) return;

    // Add error styles
    const errorStyle = document.createElement('style');
    errorStyle.textContent = `
      .form-group input.error,
      .form-group textarea.error,
      .form-group select.error {
        border-color: #dc3545;
        animation: shake 0.3s ease;
      }
      .form-group .error-message {
        color: #dc3545;
        font-size: 0.8125rem;
        margin-top: 0.25rem;
      }
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
      }
      .btn--loading {
        position: relative;
        color: transparent !important;
      }
      .btn--loading::after {
        content: '';
        position: absolute;
        width: 20px;
        height: 20px;
        border: 2px solid transparent;
        border-top-color: currentColor;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
        left: 50%;
        top: 50%;
        margin: -10px 0 0 -10px;
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(errorStyle);

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Clear previous errors
      form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
      form.querySelectorAll('.error-message').forEach(el => el.remove());

      // Validate
      let isValid = true;
      const requiredFields = form.querySelectorAll('[required]');

      requiredFields.forEach(field => {
        const value = field.value.trim();
        let errorMessage = '';

        if (!value) {
          errorMessage = 'Este campo es obligatorio';
          isValid = false;
        } else if (field.type === 'email' && !isValidEmail(value)) {
          errorMessage = 'Ingresa un correo electrónico válido';
          isValid = false;
        }

        if (errorMessage) {
          field.classList.add('error');
          const errorEl = document.createElement('p');
          errorEl.className = 'error-message';
          errorEl.textContent = errorMessage;
          field.parentNode.appendChild(errorEl);
        }
      });

      if (!isValid) {
        // Focus first error field
        form.querySelector('.error')?.focus();
        return;
      }

      // Submit simulation
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;

      submitBtn.classList.add('btn--loading');
      submitBtn.disabled = true;

      // Simulate API call
      setTimeout(() => {
        submitBtn.classList.remove('btn--loading');
        submitBtn.textContent = '¡Mensaje Enviado!';
        submitBtn.style.background = '#25D366';

        // Reset form after delay
        setTimeout(() => {
          form.reset();
          submitBtn.textContent = originalText;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
        }, 3000);
      }, 1500);
    });

    // Real-time validation
    form.querySelectorAll('input, textarea, select').forEach(field => {
      field.addEventListener('blur', () => {
        if (field.classList.contains('error') && field.value.trim()) {
          field.classList.remove('error');
          field.parentNode.querySelector('.error-message')?.remove();
        }
      });
    });
  }

  /**
   * Email validation helper
   */
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /**
   * Scroll Animations
   */
  function setupScrollAnimations() {
    const animatedElements = document.querySelectorAll(
      '.artwork-card, .section-header, .about-hero__image, .about-hero__content'
    );

    if (!animatedElements.length) return;

    // Add initial styles
    animatedElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));
  }

  /**
   * Enhanced Keyboard Navigation
   */
  function setupKeyboardNavigation() {
    // Add visible focus styles
    const focusStyle = document.createElement('style');
    focusStyle.textContent = `
      :focus-visible {
        outline: 2px solid var(--color-accent);
        outline-offset: 2px;
      }
      .artwork-card:focus-within {
        outline: 2px solid var(--color-accent);
        outline-offset: 4px;
      }
    `;
    document.head.appendChild(focusStyle);

    // Skip link functionality
    const skipLink = document.querySelector('.visually-hidden[href="#main-content"]');
    if (skipLink) {
      skipLink.addEventListener('focus', () => {
        skipLink.style.position = 'fixed';
        skipLink.style.top = '10px';
        skipLink.style.left = '10px';
        skipLink.style.zIndex = '10000';
        skipLink.style.padding = '1rem';
        skipLink.style.background = 'var(--color-text-primary)';
        skipLink.style.color = 'white';
        skipLink.style.width = 'auto';
        skipLink.style.height = 'auto';
        skipLink.style.clip = 'auto';
      });

      skipLink.addEventListener('blur', () => {
        skipLink.style = '';
      });
    }
  }

  /**
   * Announce to Screen Reader
   */
  function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'visually-hidden';
    announcement.textContent = message;
    document.body.appendChild(announcement);

    setTimeout(() => announcement.remove(), 1000);
  }

  /**
   * Inject Animation Keyframes
   */
  const animationStyles = document.createElement('style');
  animationStyles.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `;
  document.head.appendChild(animationStyles);

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
