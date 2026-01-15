// ===================================
// CINEMATIC UNIVERSE - JAVASCRIPT
// Interactions, Animations & UX
// ===================================

// ===================================
// UTILITY FUNCTIONS
// ===================================

const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// ===================================
// NAVIGATION
// ===================================

class Navigation {
  constructor() {
    this.nav = document.getElementById('nav');
    this.navToggle = document.getElementById('navToggle');
    this.navMenu = document.getElementById('navMenu');
    this.navLinks = document.querySelectorAll('.nav__link');
    this.scrollThreshold = 100;

    this.init();
  }

  init() {
    this.setupScrollEffect();
    this.setupMobileMenu();
    this.setupSmoothScroll();
  }

  setupScrollEffect() {
    const handleScroll = throttle(() => {
      if (window.scrollY > this.scrollThreshold) {
        this.nav.classList.add('scrolled');
      } else {
        this.nav.classList.remove('scrolled');
      }
    }, 100);

    window.addEventListener('scroll', handleScroll);
  }

  setupMobileMenu() {
    this.navToggle.addEventListener('click', () => {
      this.navToggle.classList.toggle('active');
      this.navMenu.classList.toggle('active');
      document.body.style.overflow = this.navMenu.classList.contains('active') ? 'hidden' : '';
    });

    this.navLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.navToggle.classList.remove('active');
        this.navMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  setupSmoothScroll() {
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
              top: offsetTop,
              behavior: 'smooth'
            });
          }
        }
      });
    });
  }
}

// ===================================
// PARTICLE SYSTEM
// ===================================

class ParticleSystem {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.particleCount = window.innerWidth < 768 ? 30 : 50;
    this.particles = [];

    this.init();
  }

  init() {
    this.createParticles();
    this.animate();
  }

  createParticles() {
    for (let i = 0; i < this.particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';

      const size = Math.random() * 2 + 0.5;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const duration = Math.random() * 30 + 15;
      const delay = Math.random() * 8;
      const opacity = Math.random() * 0.3 + 0.05;

      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: rgba(166, 124, 82, ${opacity});
        border-radius: 50%;
        left: ${x}%;
        top: ${y}%;
        animation: float ${duration}s ease-in-out ${delay}s infinite;
        pointer-events: none;
      `;

      this.container.appendChild(particle);
      this.particles.push(particle);
    }

    // Add float animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float {
        0%, 100% {
          transform: translate(0, 0) scale(1);
          opacity: 1;
        }
        25% {
          transform: translate(5px, -15px) scale(1.05);
          opacity: 0.7;
        }
        50% {
          transform: translate(-5px, -25px) scale(0.95);
          opacity: 0.5;
        }
        75% {
          transform: translate(-8px, -15px) scale(1.02);
          opacity: 0.8;
        }
      }
    `;
    document.head.appendChild(style);
  }

  animate() {
    // Particles are animated via CSS
  }
}

// ===================================
// SCROLL ANIMATIONS
// ===================================

class ScrollAnimations {
  constructor() {
    this.elements = document.querySelectorAll('[data-parallax]');
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    this.init();
  }

  init() {
    this.setupParallax();
    this.setupIntersectionObserver();
  }

  setupParallax() {
    const handleScroll = throttle(() => {
      this.elements.forEach(element => {
        const speed = parseFloat(element.dataset.parallax) || 0.5;
        const rect = element.getBoundingClientRect();
        const scrolled = window.pageYOffset;
        const rate = scrolled * speed;

        if (rect.top < window.innerHeight && rect.bottom > 0) {
          element.style.transform = `translateY(${rate}px)`;
        }
      });
    }, 16);

    window.addEventListener('scroll', handleScroll);
  }

  setupIntersectionObserver() {
    const animateElements = document.querySelectorAll('.creation-card, .theme-card, .future-card, .gallery__item');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '0';
            entry.target.style.transform = 'translateY(30px)';

            requestAnimationFrame(() => {
              entry.target.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0)';
            });
          }, index * 50);

          observer.unobserve(entry.target);
        }
      });
    }, this.observerOptions);

    animateElements.forEach(element => {
      observer.observe(element);
    });
  }
}

// ===================================
// FORM HANDLING
// ===================================

class FormHandler {
  constructor() {
    this.form = document.getElementById('contactForm');
    if (!this.form) return;

    this.init();
  }

  init() {
    this.setupFormSubmit();
    this.setupInputAnimations();
  }

  setupFormSubmit() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(this.form);
      const data = Object.fromEntries(formData);

      console.log('Form submitted:', data);

      // Show success message (in production, integrate with backend)
      this.showMessage('Reservation request received. We\'ll reach out shortly to confirm your seat.', 'success');
      this.form.reset();
    });
  }

  setupInputAnimations() {
    const inputs = this.form.querySelectorAll('.form__input');

    inputs.forEach(input => {
      input.addEventListener('focus', (e) => {
        e.target.parentElement.classList.add('focused');
      });

      input.addEventListener('blur', (e) => {
        if (!e.target.value) {
          e.target.parentElement.classList.remove('focused');
        }
      });
    });
  }

  showMessage(message, type) {
    const messageEl = document.createElement('div');
    messageEl.className = `form-message form-message--${type}`;
    messageEl.textContent = message;
    messageEl.style.cssText = `
      padding: 1rem 1.5rem;
      margin-top: 1rem;
      border-radius: 4px;
      font-size: 0.95rem;
      background: ${type === 'success' ? 'rgba(46, 213, 115, 0.1)' : 'rgba(233, 69, 96, 0.1)'};
      color: ${type === 'success' ? '#2ed573' : '#e94560'};
      border: 1px solid ${type === 'success' ? '#2ed573' : '#e94560'};
      animation: slideIn 0.3s ease;
    `;

    this.form.appendChild(messageEl);

    setTimeout(() => {
      messageEl.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => messageEl.remove(), 300);
    }, 5000);
  }
}

// ===================================
// GALLERY LIGHTBOX
// ===================================

class GalleryLightbox {
  constructor() {
    this.galleryItems = document.querySelectorAll('.gallery__item');
    this.lightbox = null;

    if (this.galleryItems.length > 0) {
      this.init();
    }
  }

  init() {
    this.createLightbox();
    this.setupGalleryItems();
  }

  createLightbox() {
    this.lightbox = document.createElement('div');
    this.lightbox.className = 'lightbox';
    this.lightbox.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(250, 248, 245, 0.98);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;

    this.lightbox.innerHTML = `
      <button class="lightbox__close" style="
        position: absolute;
        top: 2rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        background: transparent;
        border: 1px solid #2c2825;
        color: #2c2825;
        font-size: 2rem;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
      ">&times;</button>
      <div class="lightbox__content" style="
        max-width: 90%;
        max-height: 90%;
        position: relative;
      "></div>
    `;

    document.body.appendChild(this.lightbox);

    const closeBtn = this.lightbox.querySelector('.lightbox__close');
    closeBtn.addEventListener('click', () => this.closeLightbox());
    closeBtn.addEventListener('mouseenter', (e) => {
      e.target.style.background = '#a67c52';
      e.target.style.color = '#faf8f5';
      e.target.style.borderColor = '#a67c52';
    });
    closeBtn.addEventListener('mouseleave', (e) => {
      e.target.style.background = 'transparent';
      e.target.style.color = '#2c2825';
      e.target.style.borderColor = '#2c2825';
    });

    this.lightbox.addEventListener('click', (e) => {
      if (e.target === this.lightbox) {
        this.closeLightbox();
      }
    });
  }

  setupGalleryItems() {
    this.galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const imageClone = item.querySelector('.gallery__image').cloneNode(true);
        this.openLightbox(imageClone);
      });
    });
  }

  openLightbox(content) {
    const lightboxContent = this.lightbox.querySelector('.lightbox__content');
    lightboxContent.innerHTML = '';
    lightboxContent.appendChild(content);

    this.lightbox.style.display = 'flex';
    requestAnimationFrame(() => {
      this.lightbox.style.opacity = '1';
    });

    document.body.style.overflow = 'hidden';
  }

  closeLightbox() {
    this.lightbox.style.opacity = '0';
    setTimeout(() => {
      this.lightbox.style.display = 'none';
      document.body.style.overflow = '';
    }, 300);
  }
}

// ===================================
// CURSOR EFFECT (OPTIONAL)
// ===================================

class CustomCursor {
  constructor() {
    if (window.innerWidth < 1024) return; // Skip on mobile/tablet

    this.cursor = document.createElement('div');
    this.cursorFollower = document.createElement('div');

    this.init();
  }

  init() {
    this.cursor.className = 'custom-cursor';
    this.cursorFollower.className = 'custom-cursor-follower';

    this.cursor.style.cssText = `
      width: 10px;
      height: 10px;
      background: rgba(201, 169, 97, 0.8);
      border-radius: 50%;
      position: fixed;
      pointer-events: none;
      z-index: 9999;
      transition: transform 0.1s ease;
      mix-blend-mode: difference;
    `;

    this.cursorFollower.style.cssText = `
      width: 40px;
      height: 40px;
      border: 2px solid rgba(201, 169, 97, 0.3);
      border-radius: 50%;
      position: fixed;
      pointer-events: none;
      z-index: 9998;
      transition: transform 0.3s ease;
      mix-blend-mode: difference;
    `;

    document.body.appendChild(this.cursor);
    document.body.appendChild(this.cursorFollower);

    document.addEventListener('mousemove', (e) => {
      this.cursor.style.transform = `translate(${e.clientX - 5}px, ${e.clientY - 5}px)`;

      setTimeout(() => {
        this.cursorFollower.style.transform = `translate(${e.clientX - 20}px, ${e.clientY - 20}px)`;
      }, 100);
    });

    // Enlarge cursor on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .creation-card, .gallery__item');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        this.cursor.style.transform += ' scale(2)';
        this.cursorFollower.style.transform += ' scale(1.5)';
      });

      el.addEventListener('mouseleave', () => {
        this.cursor.style.transform = this.cursor.style.transform.replace(' scale(2)', '');
        this.cursorFollower.style.transform = this.cursorFollower.style.transform.replace(' scale(1.5)', '');
      });
    });
  }
}

// ===================================
// PERFORMANCE MONITORING
// ===================================

class PerformanceMonitor {
  constructor() {
    this.init();
  }

  init() {
    if ('PerformanceObserver' in window) {
      // Monitor loading performance
      window.addEventListener('load', () => {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log('Page Load Time:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
      });
    }
  }
}

// ===================================
// INITIALIZATION
// ===================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modules
  const navigation = new Navigation();
  const particles = new ParticleSystem('particles');
  const scrollAnimations = new ScrollAnimations();
  const formHandler = new FormHandler();
  const galleryLightbox = new GalleryLightbox();
  const customCursor = new CustomCursor();
  const performanceMonitor = new PerformanceMonitor();

  // Log initialization
  console.log('%c🍽️ Supper Club Experience Loaded', 'color: #a67c52; font-size: 18px; font-weight: normal;');
  console.log('%cWhere stories are cooked, not told', 'color: #5a5550; font-size: 12px;');
});

// ===================================
// SMOOTH SCROLL RESTORATION
// ===================================

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// ===================================
// PREVENT LAYOUT SHIFT
// ===================================

window.addEventListener('load', () => {
  document.body.style.visibility = 'visible';
});

// ===================================
// EXPORT FOR MODULE USAGE (OPTIONAL)
// ===================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    Navigation,
    ParticleSystem,
    ScrollAnimations,
    FormHandler,
    GalleryLightbox,
    CustomCursor
  };
}
