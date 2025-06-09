// Registro de plugins GSAP
gsap.registerPlugin(ScrollTrigger);


// Variables globales
let isPlaying = false;
const backgroundMusic = document.getElementById('background-music');
const musicToggle = document.getElementById('music-toggle');
const musicIcon = document.getElementById('music-icon');

// Fecha del evento (15 de Junio 2025, 4:00 PM)
const eventDate = new Date('2025-06-15T16:00:00').getTime();

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function () {
  initializeApp();
});

function initializeApp() {
  setupWelcomeOverlay();
  setupCountdown();
  setupScrollAnimations();
  setupMusicControl();
  setupModal();
  setupInteractiveElements();
}

// === OVERLAY DE BIENVENIDA ===


function setupWelcomeOverlay() {
  const overlay = document.getElementById('welcome-overlay');
  const enterBtn = document.getElementById('enter-btn');
  const mainContent = document.getElementById('main-content');
  const musicToggleBtn = document.getElementById('music-toggle');

  // Animaciones del overlay
  gsap.timeline()

    .from('.welcome-title', {
      duration: 1,
      y: 50,
      opacity: 0,
      ease: "power2.out"
    }, "-=0.5")
    .from('.welcome-subtitle', {
      duration: 1,
      y: 30,
      opacity: 0,
      ease: "power2.out"
    }, "-=0.5")
  gsap.to('.enter-btn', {
    duration: 1,
    opacity: 1,
    scale: 1,
    ease: "back.out(1.7)",
    delay: 1
  });



  // Evento del botón entrar
  enterBtn.addEventListener('click', function () {
    // Animación de salida del overlay
    gsap.timeline()
      .to(overlay, {
        duration: 1,
        y: '-100%',
        ease: "power2.inOut"
      })
      .call(() => {
        overlay.style.display = 'none';
        mainContent.classList.remove('hidden');
        musicToggleBtn.classList.remove('hidden');

        // Iniciar animaciones del contenido principal
        startMainContentAnimations();

        // Auto-iniciar música si está disponible
        setTimeout(() => {
          if (backgroundMusic) {
            playMusic();
          }
        }, 1000);
      });
  });
}

// === ANIMACIONES DEL CONTENIDO PRINCIPAL ===
function startMainContentAnimations() {
  // Animación del hero
  gsap.timeline()
    .from('.main-logo', {
      duration: 1.5,
      scale: 0,
      rotation: 720,
      ease: "back.out(1.7)"
    })

    .from('.countdown-container', {
      duration: 1,
      scale: 0,
      ease: "elastic.out(1, 0.5)"
    }, "-=0.3");

  // Animación de las mariposas
  animateButterflies();
}

function animateButterflies() {
  const butterflies = document.querySelectorAll('.butterfly');

  butterflies.forEach((butterfly, index) => {
    // Trayectoria aleatoria para cada mariposa
    gsap.set(butterfly, {
      x: Math.random() * window.innerWidth,
      y: window.innerHeight + 100
    });

    const tl = gsap.timeline({ repeat: -1 });

    tl.to(butterfly, {
      duration: 8 + Math.random() * 4,
      y: -100,
      x: `+=${(Math.random() - 0.5) * 400}`,
      rotation: 360,
      ease: "none",
      onComplete: () => {
        gsap.set(butterfly, {
          x: Math.random() * window.innerWidth,
          y: window.innerHeight + 100,
          rotation: 0
        });
      }
    });
  });
}



// === CONTADOR REGRESIVO ===
function setupCountdown() {
  const countdownInterval = setInterval(updateCountdown, 1000);
  updateCountdown(); // Llamada inicial

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = eventDate - now;

    if (distance < 0) {
      clearInterval(countdownInterval);
      document.getElementById('countdown').innerHTML = '<div class="time-unit"><span>¡YA!</span><label>LLEGÓ</label></div>';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Actualizar con animación
    animateCounterUpdate('days', days);
    animateCounterUpdate('hours', hours);
    animateCounterUpdate('minutes', minutes);
    animateCounterUpdate('seconds', seconds);
  }

  function animateCounterUpdate(id, value) {
    const element = document.getElementById(id);
    const currentValue = element.textContent;
    const newValue = value.toString().padStart(2, '0');

    if (currentValue !== newValue) {
      gsap.timeline()
        .to(element, {
          duration: 0.3,
          scale: 1.2,
          color: '#ffd700',
          ease: "power2.out"
        })
        .call(() => {
          element.textContent = newValue;
        })
        .to(element, {
          duration: 0.3,
          scale: 1,
          color: '#ffd700',
          ease: "power2.out"
        });
    }
  }
}

// === CONTROL DE MÚSICA ===
function setupMusicControl() {
  if (!backgroundMusic || !musicToggle) return;

  musicToggle.addEventListener('click', toggleMusic);

  // Configurar el audio
  backgroundMusic.volume = 0.3; // Volumen moderado
  backgroundMusic.addEventListener('canplaythrough', () => {
    console.log('Música lista para reproducir');
  });

  backgroundMusic.addEventListener('error', (e) => {
    console.log('Error al cargar la música:', e);
    musicToggle.style.display = 'none';
  });
}

function toggleMusic() {
  if (isPlaying) {
    pauseMusic();
  } else {
    playMusic();
  }
}

function playMusic() {
  if (!backgroundMusic) return;

  backgroundMusic.play()
    .then(() => {
      isPlaying = true;
      musicIcon.src = 'img/music_off.png';
      musicIcon.alt = 'Stop Music';

      // Animación del botón
      gsap.to(musicToggle, {
        duration: 0.3,
        scale: 1.1,
        ease: "power2.out"
      });
      gsap.to(musicToggle, {
        duration: 0.3,
        scale: 1,
        ease: "power2.out",
        delay: 0.3
      });
    })
    .catch(error => {
      console.log('Error al reproducir música:', error);
    });
}

function pauseMusic() {
  if (!backgroundMusic) return;

  backgroundMusic.pause();
  isPlaying = false;
  musicIcon.src = 'img/music_on.png';
  musicIcon.alt = 'Play Music';

  // Animación del botón
  gsap.to(musicToggle, {
    duration: 0.3,
    scale: 0.9,
    ease: "power2.out"
  });
  gsap.to(musicToggle, {
    duration: 0.3,
    scale: 1,
    ease: "power2.out",
    delay: 0.3
  });
}

// === ANIMACIONES DE SCROLL HACER TARJETA MAGICA CODEPEN===
function setupScrollAnimations() {
  // Animaciones para las tarjetas de información
  gsap.fromTo('.mirror-card',
    {
      y: 100,
      opacity: 0,
      scale: 0.8
    },
    {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 1,
      stagger: 0.2,
      ease: "back.out(1.7)",
      scrollTrigger: {
        trigger: '.info-cards',
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
      }
    }
  );

  
  // Clase para el efecto de partículas
  class MagicParticles {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.particles = [];
      this.isActive = false;
      this.animationId = null;

      this.init();
      this.setupEventListeners();
    }

    init() {
      this.resizeCanvas();
      window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
      const rect = this.canvas.parentElement.getBoundingClientRect();
      this.canvas.width = rect.width;
      this.canvas.height = rect.height;
    }

    setupEventListeners() {
      const section = document.getElementById('magicSection');

      section.addEventListener('mouseenter', () => {
        this.startEffect();
      });

      section.addEventListener('mouseleave', () => {
        this.stopEffect();
      });

      // Auto-activación en móviles
      if (window.innerWidth <= 768) {
        setTimeout(() => {
          this.startEffect();
          setTimeout(() => this.stopEffect(), 3000);
        }, 1000);
      }
    }

    createParticle() {
      return {
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 4 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: -Math.random() * 0.5 - 0.2,
        opacity: Math.random() * 0.8 + 0.2,
        life: 1,
        decay: Math.random() * 0.02 + 0.005,
        color: this.getRandomColor(),
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.1 + 0.05
      };
    }

    getRandomColor() {
      const colors = [
        '#FFD700', '#FFA500', '#FFFF00', // Dorados
        '#DA70D6', '#DDA0DD', '#BA55D3', '#9370DB', // Lilas
        '#FF69B4', '#FFB6C1', // Rosas
        '#FFFFFF', '#F8F8FF', '#FFFAFA', '#F0F8FF', // Blancos
        '#E6E6FA', '#FFF8DC', '#FFFFF0', '#F5F5F5'  // Más blancos
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    }

    startEffect() {
      if (this.isActive) return;

      this.isActive = true;

      for (let i = 0; i < 45; i++) {
        this.particles.push(this.createParticle());
      }

      this.animate();
    }

    stopEffect() {
      this.isActive = false;

      // Desvanecer partículas gradualmente
      setTimeout(() => {
        this.particles = [];
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.animationId) {
          cancelAnimationFrame(this.animationId);
        }
      }, 1000);
    }

    animate() {
      if (!this.isActive && this.particles.length === 0) return;

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      if (this.isActive && Math.random() < 0.4) {
        this.particles.push(this.createParticle());
      }

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const particle = this.particles[i];

        particle.x += particle.speedX;
        particle.y += particle.speedY;

        particle.twinkle += particle.twinkleSpeed;
        const twinkleOpacity = (Math.sin(particle.twinkle) + 1) * 0.5;

        particle.life -= particle.decay;
        particle.opacity = particle.life * twinkleOpacity;

        this.ctx.save();
        this.ctx.globalAlpha = Math.max(0, particle.opacity);
        this.ctx.fillStyle = particle.color;
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = particle.color;

        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fill();

        this.drawStar(particle.x, particle.y, particle.size * 1.5, particle.color);

        this.ctx.restore();

        if (particle.life <= 0 || particle.y < -10 || particle.x < -10 || particle.x > this.canvas.width + 10) {
          this.particles.splice(i, 1);
        }
      }

      this.animationId = requestAnimationFrame(() => this.animate());
    }

    drawStar(x, y, size, color) {
      this.ctx.save();
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = 1;
      this.ctx.globalAlpha = 0.6;

      this.ctx.beginPath();
      this.ctx.moveTo(x - size, y);
      this.ctx.lineTo(x + size, y);
      this.ctx.moveTo(x, y - size);
      this.ctx.lineTo(x, y + size);
      this.ctx.moveTo(x - size * 0.7, y - size * 0.7);
      this.ctx.lineTo(x + size * 0.7, y + size * 0.7);
      this.ctx.moveTo(x - size * 0.7, y + size * 0.7);
      this.ctx.lineTo(x + size * 0.7, y - size * 0.7);
      this.ctx.stroke();

      this.ctx.restore();
    }
  }

  // Inicializar todo cuando se carga la página
  document.addEventListener('DOMContentLoaded', () => {
    // Inicializar partículas
    const canvas = document.getElementById('particlesCanvas');
    if (canvas) {
      const magicParticles = new MagicParticles(canvas);
    }

    // Animación del pergamino mágico
    gsap.fromTo('.scroll-parchment', {
      scale: 0,
      rotation: -10,
      opacity: 0
    }, {
      scale: 1,
      rotation: 0,
      opacity: 1,
      duration: 1.5,
      ease: "elastic.out(1, 0.5)",
      scrollTrigger: {
        trigger: '.magic-quote',
        start: 'top 70%',
        toggleActions: 'play none none reverse'
      },
      onComplete: () => {
        // Activar partículas después de la animación del pergamino
        setTimeout(() => {
          const section = document.getElementById('magicSection');
          if (section) {
            section.dispatchEvent(new Event('mouseenter'));
            setTimeout(() => {
              section.dispatchEvent(new Event('mouseleave'));
            }, 3000);
          }
        }, 500);
      }
    });
  });
  // Animación de los elementos de vestimenta
  gsap.fromTo('.dress-item',
    {
      y: 50,
      opacity: 0,
      scale: 0.8
    },
    {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.8,
      stagger: 0.15,
      ease: "power2.out",
      scrollTrigger: {
        trigger: '.dress-items',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    }
  );

  // Animación de las notas musicales
  gsap.fromTo('.note',
    {
      y: -50,
      opacity: 0,
      rotation: -45
    },
    {
      y: 0,
      opacity: 1,
      rotation: 0,
      duration: 1,
      stagger: 0.1,
      ease: "bounce.out",
      scrollTrigger: {
        trigger: '.music-notes',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    }
  );

  // Animación de la varita mágica
  gsap.fromTo('.magic-wand-img',
    {
      scale: 0,
      rotation: -180
    },
    {
      scale: 1,
      rotation: 0,
      duration: 1.5,
      ease: "back.out(2)",
      scrollTrigger: {
        trigger: '.gifts-section',
        start: 'top 70%',
        toggleActions: 'play none none reverse'
      }
    }
  );

  // Animación de la tarjeta final
  gsap.fromTo('.thank-you-card',
    {
      y: 100,
      opacity: 0,
      scale: 0.9
    },
    {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 1.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: '.final-message',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    }
  );
}

// === MODAL DE REGALOS ===
function setupModal() {
  const modal = document.getElementById('gifts-modal');
  const magicWand = document.getElementById('magic-wand');
  const closeBtn = document.querySelector('.close');

  if (!modal || !magicWand || !closeBtn) {
    console.warn("Alguno de los elementos del modal no existe");
    return;
  }

  // Abrir modal al hacer clic en la varita
  magicWand.addEventListener('click', function () {
    openModal();
  });

  // Cerrar modal
  closeBtn.addEventListener('click', closeModal);

  // Cerrar modal al hacer clic fuera
  window.addEventListener('click', function (event) {
    if (event.target === modal) {
      closeModal();
    }
  });

  function openModal() {
    modal.style.display = 'block';

    // Animación de apertura
    gsap.fromTo('.modal-content',
      {
        scale: 0,
        rotation: -10,
        opacity: 0
      },
      {
        scale: 1,
        rotation: 0,
        opacity: 1,
        duration: 0.5,
        ease: "back.out(1.7)"
      }
    );

    // Animar items de regalo
    gsap.fromTo('.gift-item',
      {
        x: -50,
        opacity: 0
      },
      {
        x: 0,
        opacity: 1,
        duration: 0.3,
        stagger: 0.1,
        delay: 0.3,
        ease: "power2.out"
      }
    );

    // Animar información bancaria
    gsap.fromTo('.gift-banking',
      {
        y: 50,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        delay: 0.5,
        ease: "power2.out"
      }
    );
    gsap.fromTo(musicToggleBtn, {
      scale: 0,
      opacity: 0
    }, {
      scale: 1,
      opacity: 1,
      duration: 1,
      ease: "back.out(1.7)"
    });

musicToggleBtn.classList.remove('hidden');


    // Efecto de sparkles en la varita
    createSparkleEffect();
  }

  function closeModal() {
    gsap.to('.modal-content', {
      scale: 0,
      rotation: 10,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        modal.style.display = 'none';
      }
    });
  }
}




// === EFECTOS INTERACTIVOS ===
function setupInteractiveElements() {
  // Efecto hover para tarjetas
  document.querySelectorAll('.mirror-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
      gsap.to(this, {
        duration: 0.3,
        y: -10,
        scale: 1.05,
        boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
        ease: "power2.out"
      });
    });

    card.addEventListener('mouseleave', function () {
      gsap.to(this, {
        duration: 0.3,
        y: 0,
        scale: 1,
        boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
        ease: "power2.out"
      });
    });
  });

  // Efecto para botones
  document.querySelectorAll('.whatsapp-btn, .request-song-btn').forEach(btn => {
    btn.addEventListener('mouseenter', function () {
      gsap.to(this, {
        duration: 0.2,
        scale: 1.05,
        ease: "power2.out"
      });
    });

    btn.addEventListener('mouseleave', function () {
      gsap.to(this, {
        duration: 0.2,
        scale: 1,
        ease: "power2.out"
      });
    });
  });

  // Parallax suave para el hero
  gsap.to('.hero-background', {
    yPercent: -50,
    ease: "none",
    scrollTrigger: {
      trigger: '.hero',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  });
}

// === EFECTO DE SPARKLES ===
function createSparkleEffect() {
  const wandContainer = document.querySelector('.magic-wand-container');

  for (let i = 0; i < 10; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'temp-sparkle';
    sparkle.style.cssText = `
            position: absolute;
            width: 6px;
            height: 6px;
            background: #ffd700;
            border-radius: 50%;
            pointer-events: none;
            z-index: 10;
        `;

    wandContainer.appendChild(sparkle);

    // Posición inicial aleatoria alrededor de la varita
    const startX = Math.random() * 120;
    const startY = Math.random() * 120;

    gsap.set(sparkle, { x: startX, y: startY });

    // Animación de dispersión
    gsap.to(sparkle, {
      duration: 2,
      x: startX + (Math.random() - 0.5) * 200,
      y: startY + (Math.random() - 0.5) * 200,
      scale: 0,
      opacity: 0,
      ease: "power2.out",
      onComplete: () => {
        sparkle.remove();
      }
    });
  }
}
document.addEventListener("DOMContentLoaded", () => {
  if (typeof $ === "function" && typeof $.fn.sparkleh === "function") {
    $(".frase").sparkleh({
      count: 60,
      color: ["#fffacd", "#fbcfe8", "#e9d5ff", "#fde68a"],
      speed: 0.3
    });
  } else {
    console.warn("Sparkleh.js no cargado o jQuery no disponible");
  }
});

$(".sparkle-target").sparkleh({
  count: 40,
  color: ["#fff", "#ffecb3", "#ffd6e0"],
  speed: 0.2
});


// === UTILIDADES ===
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// === EVENTOS DE RESIZE ===
window.addEventListener('resize', debounce(() => {
  ScrollTrigger.refresh();
}, 250));

// === PREVENCIÓN DE ERRORES ===
window.addEventListener('error', function (event) {
  console.error('Error capturado:', event.message, 'en', event.filename, 'línea', event.lineno);
});