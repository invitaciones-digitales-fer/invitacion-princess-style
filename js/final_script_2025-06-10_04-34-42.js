
// ░░░ CONFIGURACIÓN INICIAL ░░░
gsap.registerPlugin(ScrollTrigger);
let isPlaying = false;
const backgroundMusic = document.getElementById("background-music");
const musicToggle = document.getElementById("music-toggle");
const musicIcon = document.getElementById("music-icon");
const eventDate = new Date("2025-06-15T16:00:00").getTime();

document.addEventListener("DOMContentLoaded", () => {
  initializeApp();
});

window.addEventListener("resize", debounce(() => ScrollTrigger.refresh(), 250));
window.addEventListener("error", e => {
  console.error("Error capturado:", e.message, "en", e.filename, "línea", e.lineno);
});



// ░░░ 1. INICIALIZACIÓN GENERAL ░░░
function initializeApp() {
  setupWelcomeOverlay();
  setupCountdown();
  setupScrollAnimations();
  setupMusicControl();
  setupModal();
  setupInteractiveElements();
}

// ░░░ 2. OVERLAY DE BIENVENIDA ░░░
function setupWelcomeOverlay() {
  const overlay = document.getElementById("welcome-overlay");
  const enterBtn = document.getElementById("enter-btn");
  const mainContent = document.getElementById("main-content");

  gsap.timeline()
    .from(".welcome-title", { duration: 1, y: 50, opacity: 0, ease: "power2.out" })
    .from(".welcome-subtitle", { duration: 1, y: 30, opacity: 0, ease: "power2.out" }, "-=0.5")
    .to(".enter-btn", { duration: 1, opacity: 1, scale: 1, ease: "back.out(1.7)", delay: 1 });

  enterBtn.addEventListener("click", () => {
    gsap.timeline()
      .to(overlay, { duration: 1, y: "-100%", ease: "power2.inOut" })
      .call(() => {
        overlay.style.display = "none";
        mainContent.classList.remove("hidden");
        musicToggle.classList.remove("hidden");
        startMainContentAnimations();
        setTimeout(() => backgroundMusic && playMusic(), 1000);
      });
  });
}

// ░░░ 3. ANIMACIÓN DE ENTRADA AL HERO ░░░
function startMainContentAnimations() {
  gsap.timeline()
    .from(".main-logo", {
      duration: 1.5,
      scale: 0,
      rotation: 720,
      ease: "back.out(1.7)"
    })
    .from(".countdown-container", {
      duration: 1,
      scale: 0,
      ease: "elastic.out(1, 0.5)"
    }, "-=0.3");
}

// ░░░ 4. COUNTDOWN ░░░
function setupCountdown() {
  const interval = setInterval(updateCountdown, 1000);

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = eventDate - now;

    if (distance < 0) {
      clearInterval(interval);
      document.getElementById("countdown").innerHTML = '<div class="time-unit"><span>¡YA!</span><label>LLEGÓ</label></div>';
      return;
    }

    updateUnit("days", Math.floor(distance / (1000 * 60 * 60 * 24)));
    updateUnit("hours", Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
    updateUnit("minutes", Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
    updateUnit("seconds", Math.floor((distance % (1000 * 60)) / 1000));
  }

  function updateUnit(id, value) {
    const el = document.getElementById(id);
    const newValue = value.toString().padStart(2, "0");
    if (el.textContent !== newValue) {
      gsap.timeline()
        .to(el, { duration: 0.3, scale: 1.2, color: "#ffd700", ease: "power2.out" })
        .call(() => el.textContent = newValue)
        .to(el, { duration: 0.3, scale: 1, color: "#ffd700", ease: "power2.out" });
    }
  }
}

// ░░░ 5. CONTROL DE MÚSICA ░░░
function setupMusicControl() {
  if (!backgroundMusic || !musicToggle) return;

  musicToggle.addEventListener("click", toggleMusic);
  backgroundMusic.volume = 0.3;

  backgroundMusic.addEventListener("canplaythrough", () => {
    console.log("🎵 Música lista para reproducir");
  });

  backgroundMusic.addEventListener("error", e => {
    console.error("Error al cargar música:", e);
    musicToggle.style.display = "none";
  });
}

function toggleMusic() {
  isPlaying ? pauseMusic() : playMusic();
}

function playMusic() {
  backgroundMusic?.play()
    .then(() => {
      isPlaying = true;
      musicIcon.src = "img/music_off.png";
      musicIcon.alt = "Stop Music";
    })
    .catch(err => console.error("🎵 Error al reproducir música:", err));
}

function pauseMusic() {
  backgroundMusic?.pause();
  isPlaying = false;
  musicIcon.src = "img/music_on.png";
  musicIcon.alt = "Play Music";
}

// ░░░ 6. ANIMACIONES SCROLL ░░░
function setupScrollAnimations() {
  gsap.fromTo(".mirror-card", {
    y: 100, opacity: 0, scale: 0.8
  }, {
    y: 0, opacity: 1, scale: 1,
    duration: 1, stagger: 0.2,
    ease: "back.out(1.7)",
    scrollTrigger: {
      trigger: ".info-cards",
      start: "top 80%",
      end: "bottom 20%",
      toggleActions: "play none none reverse"
    }
  });
}
... (continuará)
