// ░░░ 1. PLUGINS Y CONSTANTES GLOBALES ░░░
gsap.registerPlugin(ScrollTrigger);

const backgroundMusic = document.getElementById("background-music");
const musicToggle = document.getElementById("music-toggle");
const musicIcon = document.getElementById("music-icon");
const eventDate = new Date("2025-06-15T16:00:00").getTime();

let isPlaying = false;

// ░░░ 2. MÓDULO: CONTROL DE MÚSICA ░░░
function setupMusicControl() {
  if (!backgroundMusic || !musicToggle || !musicIcon) return;

  backgroundMusic.volume = 0.3;

  musicToggle.addEventListener("click", toggleMusic);

  backgroundMusic.addEventListener("canplaythrough", () => {
    console.log("🎶 Música lista para reproducir");
  });

  backgroundMusic.addEventListener("error", (e) => {
    console.warn("⚠️ Error al cargar la música:", e);
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
    animateMusicButton();
  }).catch((error) => {
    console.error("Error al reproducir música:", error);
  });
}

function pauseMusic() {
  backgroundMusic.pause();
  isPlaying = false;
  musicIcon.src = "img/music_on.png";
  musicIcon.alt = "Play Music";
  animateMusicButton();
}

function animateMusicButton() {
  gsap.fromTo(musicToggle, { scale: 0.9 }, { scale: 1.1, duration: 0.3, ease: "power2.out" });
  gsap.to(musicToggle, { scale: 1, duration: 0.3, ease: "power2.out", delay: 0.3 });
}


// ░░░ 3. MÓDULO: BIENVENIDA E INGRESO ░░░
function setupWelcomeOverlay() {
  const overlay = document.getElementById("welcome-overlay");
  const enterBtn = document.getElementById("enter-btn");
  const mainContent = document.getElementById("main-content");
  const musicBtn = document.getElementById("music-toggle");

  if (!overlay || !enterBtn || !mainContent || !musicBtn) return;

  // Animación de texto al inicio
  gsap.timeline()
    .from(".welcome-title", {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power2.out"
    }, 0)
    .from(".welcome-subtitle", {
      y: 30,
      opacity: 0,
      duration: 1,
      ease: "power2.out"
    }, "-=0.5")
    .to(".enter-btn", {
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: "back.out(1.7)",
      delay: 0.5
    });

  // Click en "Entrar"
  enterBtn.addEventListener("click", () => {
    gsap.timeline()
      .to(overlay, {
        y: "-100%",
        duration: 1,
        ease: "power2.inOut"
      })
      .call(() => {
        overlay.style.display = "none";
        mainContent.classList.remove("hidden");
        musicBtn.classList.remove("hidden");
        startMainContentAnimations();

        // Delay para iniciar la música
        setTimeout(() => {
          backgroundMusic && playMusic();
        }, 1000);
      });
  });
}


// ░░░ 4. MÓDULO: ANIMACIÓN DE INGRESO ░░░
function startMainContentAnimations() {
  const logo = document.querySelector(".main-logo");
  const countdown = document.querySelector(".countdown-container");
  const butterflies = document.querySelectorAll(".butterfly");

  if (!logo || !countdown) return;

  gsap.timeline()
    .from(logo, {
      scale: 0,
      rotation: 720,
      duration: 1.5,
      ease: "back.out(1.7)"
    })
    .from(countdown, {
      scale: 0,
      duration: 1,
      ease: "elastic.out(1, 0.5)"
    }, "-=0.5");

  animateButterflies(butterflies);
}


function animateButterflies(butterflies) {
  if (!butterflies.length) return;

  butterflies.forEach(butterfly => {
    // Posición inicial
    gsap.set(butterfly, {
      x: Math.random() * window.innerWidth,
      y: window.innerHeight + 100
    });

    // Movimiento infinito
    const tl = gsap.timeline({ repeat: -1 });
    tl.to(butterfly, {
      y: -100,
      x: `+=${(Math.random() - 0.5) * 400}`,
      rotation: 360,
      duration: 8 + Math.random() * 4,
      ease: "none",
      onComplete: () => {
        // Reinicio fuera de pantalla
        gsap.set(butterfly, {
          x: Math.random() * window.innerWidth,
          y: window.innerHeight + 100,
          rotation: 0
        });
      }
    });
  });
}


// ░░░ 5. MÓDULO: CUENTA REGRESIVA ░░░
function setupCountdown() {
  const countdownId = setInterval(updateCountdown, 1000);
  const countdownElement = document.getElementById("countdown");

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = eventDate - now;

    if (distance < 0) {
      clearInterval(countdownId);
      if (countdownElement) {
        countdownElement.innerHTML = `
          <div class="time-unit">
            <span>¡YA!</span>
            <label>LLEGÓ</label>
          </div>
        `;
      }
      return;
    }

    const timeValues = {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000)
    };

    for (const [unit, value] of Object.entries(timeValues)) {
      updateTimeUnit(unit, value);
    }
  }

  function updateTimeUnit(unitId, newValue) {
    const unitElement = document.getElementById(unitId);
    if (!unitElement) return;

    const formattedValue = newValue.toString().padStart(2, "0");
    const currentValue = unitElement.textContent;

    if (formattedValue !== currentValue) {
      gsap.timeline()
        .to(unitElement, { scale: 1.2, color: "#ffd700", duration: 0.3, ease: "power2.out" })
        .call(() => { unitElement.textContent = formattedValue; })
        .to(unitElement, { scale: 1, color: "#ffd700", duration: 0.3, ease: "power2.out" });
    }
  }

  // Inicializar al cargar
  updateCountdown();
}


// ░░░ 6. MÓDULO: CONTROL DE MÚSICA ░░░
function setupMusicControl() {
  if (!backgroundMusic || !musicToggle) return;

  backgroundMusic.volume = 0.3;

  musicToggle.addEventListener("click", toggleMusic);

  backgroundMusic.addEventListener("canplaythrough", () => {
    console.log("🎵 Música lista para reproducir");
  });

  backgroundMusic.addEventListener("error", (e) => {
    console.warn("❌ Error al cargar la música:", e);
    musicToggle.style.display = "none";
  });
}

function toggleMusic() {
  isPlaying ? pauseMusic() : playMusic();
}

function playMusic() {
  if (!backgroundMusic) return;

  backgroundMusic.play().then(() => {
    isPlaying = true;
    musicIcon.src = "img/music_off.png";
    musicIcon.alt = "Stop Music";

    animateMusicButton();
  }).catch((e) => {
    console.error("⚠️ Error al reproducir música:", e);
  });
}

function pauseMusic() {
  if (!backgroundMusic) return;

  backgroundMusic.pause();
  isPlaying = false;
  musicIcon.src = "img/music_on.png";
  musicIcon.alt = "Play Music";

  animateMusicButton(true);
}

function animateMusicButton(isPause = false) {
  const scaleUp = isPause ? 0.9 : 1.1;
  gsap.to(musicToggle, { duration: 0.3, scale: scaleUp, ease: "power2.out" });
  gsap.to(musicToggle, { duration: 0.3, scale: 1, ease: "power2.out", delay: 0.3 });
}


// ░░░ 7. MÓDULO: ANIMACIONES CON SCROLL ░░░
function setupScrollAnimations() {
  // Cartas espejadas
  gsap.fromTo(".mirror-card", 
    { y: 100, opacity: 0, scale: 0.8 },
    {
      y: 0, opacity: 1, scale: 1,
      duration: 1,
      stagger: 0.2,
      ease: "back.out(1.7)",
      scrollTrigger: {
        trigger: ".info-cards",
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
      }
    }
  );

  // Pergamino animado
  gsap.fromTo(".scroll-parchment",
    { scale: 0, rotation: -10, opacity: 0 },
    {
      scale: 1,
      rotation: 0,
      opacity: 1,
      duration: 1.5,
      ease: "elastic.out(1, 0.5)",
      scrollTrigger: {
        trigger: ".magic-quote",
        start: "top 70%",
        toggleActions: "play none none reverse"
      },
      onComplete: () => {
        // Autoactivar partículas al entrar por scroll
        const magicSection = document.getElementById("magicSection");
        if (magicSection) {
          magicSection.dispatchEvent(new Event("mouseenter"));
          setTimeout(() => {
            magicSection.dispatchEvent(new Event("mouseleave"));
          }, 3000);
        }
      }
    }
  );

  // Notas musicales
  gsap.fromTo(".note",
    { y: -50, opacity: 0, rotation: -45 },
    {
      y: 0,
      opacity: 1,
      rotation: 0,
      duration: 1,
      stagger: 0.1,
      ease: "bounce.out",
      scrollTrigger: {
        trigger: ".music-notes",
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    }
  );

  // Varita mágica
  gsap.fromTo(".magic-wand-img",
    { scale: 0, rotation: -180 },
    {
      scale: 1,
      rotation: 0,
      duration: 1.5,
      ease: "back.out(2)",
      scrollTrigger: {
        trigger: ".gifts-section",
        start: "top 70%",
        toggleActions: "play none none reverse"
      }
    }
  );

  // Tarjeta final
  gsap.fromTo(".thank-you-card",
    { y: 100, opacity: 0, scale: 0.9 },
    {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 1.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".final-message",
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    }
  );
}


// ░░░ 8. MÓDULO: MODAL DE REGALOS ░░░
function setupModal() {
  const modal = document.getElementById("gifts-modal");
  const trigger = document.getElementById("magic-wand");
  const closeBtn = document.querySelector(".close");

  if (!modal || !trigger || !closeBtn) {
    console.warn("⚠️ Elementos del modal no están presentes");
    return;
  }

  trigger.addEventListener("click", () => {
    modal.style.display = "block";

    gsap.fromTo(".modal-content", { scale: 0, rotation: -10, opacity: 0 },
      { scale: 1, rotation: 0, opacity: 1, duration: 0.5, ease: "back.out(1.7)" });

    gsap.fromTo(".gift-item", { x: -50, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.3, stagger: 0.1, delay: 0.3, ease: "power2.out" });

    gsap.fromTo(".gift-banking", { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, delay: 0.5, ease: "power2.out" });

    // Mostrar botón de música si oculto
    if (musicToggleBtn) {
      gsap.fromTo(musicToggleBtn, { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, ease: "back.out(1.7)" });
      musicToggleBtn.classList.remove("hidden");
    }

    createSparkleEffect();
  });

  closeBtn.addEventListener("click", closeModal);
  window.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  function closeModal() {
    gsap.to(".modal-content", {
      scale: 0,
      rotation: 10,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        modal.style.display = "none";
      }
    });
  }
}


// ░░░ 9. MÓDULO: EFECTOS INTERACTIVOS ░░░
function setupInteractiveElements() {
  // Hover en tarjetas espejo
  document.querySelectorAll(".mirror-card").forEach(card => {
    card.addEventListener("mouseenter", () => {
      gsap.to(card, {
        duration: 0.3,
        y: -10,
        scale: 1.05,
        boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
        ease: "power2.out"
      });
    });

    card.addEventListener("mouseleave", () => {
      gsap.to(card, {
        duration: 0.3,
        y: 0,
        scale: 1,
        boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
        ease: "power2.out"
      });
    });
  });

  // Hover en botones de acción
  document.querySelectorAll(".whatsapp-btn, .request-song-btn").forEach(btn => {
    btn.addEventListener("mouseenter", () => {
      gsap.to(btn, { duration: 0.2, scale: 1.05, ease: "power2.out" });
    });

    btn.addEventListener("mouseleave", () => {
      gsap.to(btn, { duration: 0.2, scale: 1, ease: "power2.out" });
    });
  });

  // Parallax en fondo del hero
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

// ░░░ 10. EFECTO CHISPAS MÁGICAS (modal) ░░░
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

    const startX = Math.random() * 120;
    const startY = Math.random() * 120;

    gsap.set(sparkle, { x: startX, y: startY });

    gsap.to(sparkle, {
      duration: 2,
      x: startX + (Math.random() - 0.5) * 200,
      y: startY + (Math.random() - 0.5) * 200,
      scale: 0,
      opacity: 0,
      ease: "power2.out",
      onComplete: () => sparkle.remove()
    });
  }
}
