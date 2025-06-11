// 1. Registro de Plugins
gsap.registerPlugin(ScrollTrigger);

// 2. Variables globales
let isPlaying = false;
const backgroundMusic = document.getElementById("background-music");
const musicToggle = document.getElementById("music-toggle");
const musicIcon = document.getElementById("music-icon");
const eventDate = new Date("2025-06-15T16:00:00").getTime();

// 3. App principal
function initializeApp() {
  setupWelcomeOverlay();
  setupCountdown();
  setupMusicControl();
  setupScrollAnimations();
  setupModal();
  setupInteractiveElements();
  setupParticlesEffect();
}

document.addEventListener("DOMContentLoaded", () => {
  initializeApp();
});

// 4. Overlay de bienvenida
function setupWelcomeOverlay() {
  const overlay = document.getElementById("welcome-overlay");
  const btn = document.getElementById("enter-btn");
  const mainContent = document.getElementById("main-content");

  gsap.timeline()
    .from(".welcome-title", { y: 50, opacity: 0, duration: 1, ease: "power2.out" })
    .from(".welcome-subtitle", { y: 30, opacity: 0, duration: 1, ease: "power2.out" }, "-=0.5")
    .to(".enter-btn", { opacity: 1, scale: 1, duration: 1, ease: "back.out(1.7)", delay: 1 });

  btn.addEventListener("click", () => {
    gsap.timeline()
      .to(overlay, { y: "-100%", duration: 1, ease: "power2.inOut" })
      .call(() => {
        overlay.style.display = "none";
        mainContent.classList.remove("hidden");
        musicToggle.classList.remove("hidden");
        startMainContentAnimations();
        setTimeout(() => playMusic(), 1000);
      });
  });
}

// 5. Animaciones iniciales post-ingreso
function startMainContentAnimations() {
  gsap.from(".main-logo", {
    duration: 1.5,
    scale: 0,
    rotation: 720,
    ease: "back.out(1.7)"
  });

  gsap.from(".countdown-container", {
    duration: 1,
    scale: 0,
    ease: "elastic.out(1, 0.5)",
    delay: 0.5
  });
}

// 6. Countdown con animación
function setupCountdown() {
  const countdownEl = document.getElementById("countdown");
  const update = () => {
    const now = new Date().getTime();
    const distance = eventDate - now;
    if (distance < 0) {
      clearInterval(interval);
      countdownEl.innerHTML = '<div class="time-unit"><span>¡YA!</span><label>LLEGÓ</label></div>';
      return;
    }
    updateUnit("days", Math.floor(distance / (1000 * 60 * 60 * 24)));
    updateUnit("hours", Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
    updateUnit("minutes", Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
    updateUnit("seconds", Math.floor((distance % (1000 * 60)) / 1000));
  };

  const updateUnit = (id, value) => {
    const el = document.getElementById(id);
    const newVal = value.toString().padStart(2, "0");
    if (el.textContent !== newVal) {
      gsap.to(el, { scale: 1.2, duration: 0.2, ease: "power2.out" });
      el.textContent = newVal;
      gsap.to(el, { scale: 1, duration: 0.2, ease: "power2.out", delay: 0.2 });
    }
  };

  update();
  const interval = setInterval(update, 1000);
}

// 7. Control de música
function setupMusicControl() {
  if (!backgroundMusic || !musicToggle) return;

  backgroundMusic.volume = 0.3;

  musicToggle.addEventListener("click", toggleMusic);
  backgroundMusic.addEventListener("canplaythrough", () => console.log("🎵 Música lista"));
  backgroundMusic.addEventListener("error", () => {
    console.warn("⚠️ Error al cargar música");
    musicToggle.style.display = "none";
  });
}

function toggleMusic() {
  isPlaying ? pauseMusic() : playMusic();
}

function playMusic() {
  backgroundMusic.play().then(() => {
    isPlaying = true;
    musicIcon.src = "img/music_off.png";
    musicIcon.alt = "Stop Music";
  }).catch(err => console.error("🎵 Error al reproducir:", err));
}

function pauseMusic() {
  backgroundMusic.pause();
  isPlaying = false;
  musicIcon.src = "img/music_on.png";
  musicIcon.alt = "Play Music";
}

// 8. ScrollTrigger Animations
function setupScrollAnimations() {
  gsap.from(".scroll-parchment", {
    scale: 0.5,
    rotation: -20,
    opacity: 0,
    duration: 1.8,
    ease: "elastic.out(1, 0.5)",
    scrollTrigger: {
      trigger: ".magic-quote",
      start: "top 75%",
      toggleActions: "play none none reverse"
    },
    onComplete: () => {
      if (window.innerWidth > 768) {
        const magicSection = document.getElementById("magicSection");
        magicSection.dispatchEvent(new Event("mouseenter"));
        setTimeout(() => {
          magicSection.dispatchEvent(new Event("mouseleave"));
        }, 5000);
      }
    }
  });

  gsap.from(".dress-item", {
    y: 50,
    opacity: 0,
    scale: 0.8,
    duration: 1.2,
    stagger: 0.2,
    ease: "back.out(1.7)",
    scrollTrigger: {
      trigger: ".dress-items",
      start: "top 80%",
      toggleActions: "play none none reverse"
    }
  });

  gsap.from(".note", {
    y: -50,
    opacity: 0,
    rotation: -30,
    duration: 1,
    stagger: 0.1,
    ease: "bounce.out",
    scrollTrigger: {
      trigger: ".music-notes",
      start: "top 80%",
      toggleActions: "play none none reverse"
    }
  });

  gsap.from(".magic-wand-img", {
    scale: 0,
    rotation: -180,
    duration: 1.5,
    ease: "back.out(2)",
    scrollTrigger: {
      trigger: ".gifts-section",
      start: "top 75%",
      toggleActions: "play none none reverse"
    }
  });
}

// 9. Modal de regalos
function setupModal() {
  const modal = document.getElementById("gifts-modal");
  const trigger = document.getElementById("magic-wand");
  const closeBtn = document.querySelector(".close");

  if (!modal || !trigger || !closeBtn) return;

  trigger.addEventListener("click", () => {
    modal.style.display = "block";
    gsap.from(".modal-content", { scale: 0, opacity: 0, duration: 0.5, ease: "back.out(1.7)" });
    createSparkleEffect();
  });

  closeBtn.addEventListener("click", () => {
    closeModal(modal);
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) closeModal(modal);
  });
}

function closeModal(modal) {
  gsap.to(".modal-content", {
    scale: 0.8,
    opacity: 0,
    duration: 0.3,
    ease: "power2.in",
    onComplete: () => modal.style.display = "none"
  });
}

// 10. Efectos de interacción
function setupInteractiveElements() {
  document.querySelectorAll(".mirror-card").forEach(card => {
    card.addEventListener("mouseenter", () => {
      gsap.to(card, { y: -10, scale: 1.05, boxShadow: "0 15px 35px rgba(0,0,0,0.2)", duration: 0.3 });
    });
    card.addEventListener("mouseleave", () => {
      gsap.to(card, { y: 0, scale: 1, boxShadow: "0 5px 15px rgba(0,0,0,0.1)", duration: 0.3 });
    });
  });

  gsap.to(".hero-background", {
    yPercent: -50,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top bottom",
      end: "bottom top",
      scrub: true
    }
  });
}

// 11. Partículas mágicas con Canvas
function setupParticlesEffect() {
  const canvas = document.getElementById("particlesCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let particles = [];
  let animationId;
  let active = false;

  const resize = () => {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  };
  window.addEventListener("resize", resize);
  resize();

  const createParticle = () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: 2 + Math.random() * 4,
    speedX: (Math.random() - 0.5) * 2,
    speedY: -Math.random() * 2 - 1,
    opacity: Math.random() * 0.8 + 0.2,
    life: 1,
    decay: 0.01 + Math.random() * 0.01,
    color: "#FFD700"
  });

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (active && Math.random() < 0.3) particles.push(createParticle());

    particles.forEach((p, i) => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.life -= p.decay;
      p.opacity = p.life;
      if (p.life <= 0) particles.splice(i, 1);
      else {
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    ctx.globalAlpha = 1;
    animationId = requestAnimationFrame(animate);
  };

  const section = document.getElementById("magicSection");
  if (!section) return;

  section.addEventListener("mouseenter", () => {
    active = true;
    animate();
  });

  section.addEventListener("mouseleave", () => {
    active = false;
    setTimeout(() => {
      particles = [];
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(animationId);
    }, 1500);
  });

  if (window.innerWidth <= 768) {
    setTimeout(() => {
      active = true;
      animate();
      setTimeout(() => {
        active = false;
      }, 3000);
    }, 1000);
  }
}

// 12. Sparkles mágicos
function createSparkleEffect() {
  const container = document.querySelector(".magic-wand-container");
  if (!container) return;

  for (let i = 0; i < 10; i++) {
    const sparkle = document.createElement("div");
    sparkle.className = "temp-sparkle";
    sparkle.style.cssText = `
      position: absolute;
      width: 6px;
      height: 6px;
      background: #ffd700;
      border-radius: 50%;
      pointer-events: none;
      z-index: 10;
    `;
    container.appendChild(sparkle);

    const x = 80 * Math.random();
    const y = 80 * Math.random();

    gsap.set(sparkle, { x, y });
    gsap.to(sparkle, {
      duration: 2,
      x: x + (Math.random() - 0.5) * 200,
      y: y + (Math.random() - 0.5) * 200,
      scale: 0,
      opacity: 0,
      ease: "power2.out",
      onComplete: () => sparkle.remove()
    });
  }
}

// 13. Utilidades
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

window.addEventListener("resize", debounce(() => {
  ScrollTrigger.refresh();
}, 250));

window.addEventListener("error", (e) => {
  console.error("Error capturado:", e.message, "en", e.filename, "línea", e.lineno);
});
