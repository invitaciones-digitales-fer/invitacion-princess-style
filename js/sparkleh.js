 gsap.registerPlugin(ScrollTrigger);

        class ParticleEffect {
            constructor(canvas) {
                this.canvas = canvas;
                this.ctx = canvas.getContext('2d');
                this.particles = [];
                this.isActive = false;
                this.animationId = null;
                this.debugInfo = document.getElementById('debugInfo');
                
                this.init();
                this.setupEventListeners();
            }

            init() {
                this.resizeCanvas();
                window.addEventListener('resize', () => this.resizeCanvas());
                this.updateDebug('Canvas inicializado');
            }

            resizeCanvas() {
                const rect = this.canvas.parentElement.getBoundingClientRect();
                this.canvas.width = rect.width;
                this.canvas.height = rect.height;
                this.updateDebug(`Canvas redimensionado: ${rect.width}x${rect.height}`);
            }

            setupEventListeners() {
                const magicSection = document.getElementById('magicSection');
                
                // Eventos de mouse
                magicSection.addEventListener('mouseenter', () => {
                    this.updateDebug('Mouse enter - Iniciando efecto');
                    this.startEffect();
                });
                
                magicSection.addEventListener('mouseleave', () => {
                    this.updateDebug('Mouse leave - Deteniendo efecto');
                    this.stopEffect();
                });

                // Para dispositivos móviles - auto-start cuando sea visible
                if (window.innerWidth <= 768) {
                    const observer = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                this.updateDebug('Sección visible - Auto-start móvil');
                                setTimeout(() => {
                                    this.startEffect();
                                    setTimeout(() => this.stopEffect(), 4000);
                                }, 1000);
                            }
                        });
                    }, { threshold: 0.5 });
                    
                    observer.observe(magicSection);
                }
            }

            createParticle() {
                return {
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    size: Math.random() * 4 + 2,
                    speedX: (Math.random() - 0.5) * 2,
                    speedY: -Math.random() * 2 - 1,
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
                    '#FFD700', '#FFA500', '#FFFF00', '#DA70D6', 
                    '#DDA0DD', '#BA55D3', '#9370DB', '#FF69B4', 
                    '#FFB6C1', '#FFFFFF', '#F8F8FF', '#E6E6FA'
                ];
                return colors[Math.floor(Math.random() * colors.length)];
            }

            startEffect() {
                if (!this.isActive) {
                    this.isActive = true;
                    this.updateDebug(`Efecto iniciado - Partículas: ${this.particles.length}`);
                    
                    // Crear partículas iniciales
                    for (let i = 0; i < 50; i++) {
                        this.particles.push(this.createParticle());
                    }
                    
                    this.animate();
                }
            }

            stopEffect() {
                this.isActive = false;
                this.updateDebug('Efecto detenido - Limpiando partículas');
                
                setTimeout(() => {
                    this.particles = [];
                    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                    if (this.animationId) {
                        cancelAnimationFrame(this.animationId);
                    }
                }, 2000);
            }

            animate() {
                if (!this.isActive && this.particles.length === 0) {
                    return;
                }

                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

                // Agregar nuevas partículas mientras esté activo
                if (this.isActive && Math.random() < 0.3) {
                    this.particles.push(this.createParticle());
                }

                // Actualizar y dibujar partículas
                for (let i = this.particles.length - 1; i >= 0; i--) {
                    const particle = this.particles[i];
                    
                    // Actualizar posición
                    particle.x += particle.speedX;
                    particle.y += particle.speedY;
                    particle.twinkle += particle.twinkleSpeed;
                    
                    // Efecto de parpadeo
                    const twinkleEffect = (Math.sin(particle.twinkle) + 1) * 0.5;
                    
                    // Reducir vida
                    particle.life -= particle.decay;
                    particle.opacity = particle.life * twinkleEffect;

                    if (particle.opacity > 0) {
                        // Dibujar partícula
                        this.ctx.save();
                        this.ctx.globalAlpha = Math.max(0, particle.opacity);
                        this.ctx.fillStyle = particle.color;
                        this.ctx.shadowBlur = 15;
                        this.ctx.shadowColor = particle.color;
                        
                        // Círculo principal
                        this.ctx.beginPath();
                        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                        this.ctx.fill();
                        
                        // Estrella decorativa
                        this.drawStar(particle.x, particle.y, particle.size * 1.5, particle.color);
                        
                        this.ctx.restore();
                    }

                    // Remover partículas muertas o fuera de pantalla
                    if (particle.life <= 0 || 
                        particle.y < -20 || 
                        particle.x < -20 || 
                        particle.x > this.canvas.width + 20) {
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
                // Cruz principal
                this.ctx.moveTo(x - size, y);
                this.ctx.lineTo(x + size, y);
                this.ctx.moveTo(x, y - size);
                this.ctx.lineTo(x, y + size);
                
                // Cruz diagonal
                const diag = size * 0.7;
                this.ctx.moveTo(x - diag, y - diag);
                this.ctx.lineTo(x + diag, y + diag);
                this.ctx.moveTo(x - diag, y + diag);
                this.ctx.lineTo(x + diag, y - diag);
                
                this.ctx.stroke();
                this.ctx.restore();
            }

            updateDebug(message) {
                if (this.debugInfo) {
                    const time = new Date().toLocaleTimeString();
                    this.debugInfo.innerHTML = `
                        ${time}: ${message}<br>
                        Partículas activas: ${this.particles.length}<br>
                        Estado: ${this.isActive ? 'Activo' : 'Inactivo'}
                    `;
                }
            }
        }

        // Inicialización cuando el DOM esté listo
        document.addEventListener('DOMContentLoaded', () => {
            const canvas = document.getElementById('particlesCanvas');
            
            if (canvas) {
                const particleEffect = new ParticleEffect(canvas);
                
                // Animación de entrada con GSAP
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
                    onComplete() {
                        // Auto-demostración en escritorio
                        if (window.innerWidth > 768) {
                            setTimeout(() => {
                                const magicSection = document.getElementById('magicSection');
                                magicSection.dispatchEvent(new Event('mouseenter'));
                                setTimeout(() => {
                                    magicSection.dispatchEvent(new Event('mouseleave'));
                                }, 3000);
                            }, 500);
                        }
                    }
                });
                
                console.log('Efecto de partículas inicializado correctamente');
            } else {
                console.error('Canvas no encontrado');
            }
        });

        // Refresh ScrollTrigger en resize
        window.addEventListener('resize', () => {
            ScrollTrigger.refresh();
        });

        // Animación de entrada con GSAP
        gsap.fromTo('.dress-item', {
            y: 50,
            opacity: 0,
            scale: 0.8
        }, {
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
        });

        // Animación del título
        gsap.fromTo('.section-title', {
            y: -30,
            opacity: 0
        }, {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: '.dress-code',
                start: 'top 90%',
                toggleActions: 'play none none reverse'
            }
        });

        // Animación de la descripción
        gsap.fromTo('.dress-code-description', {
            scale: 0.9,
            opacity: 0
        }, {
            scale: 1,
            opacity: 1,
            duration: 1,
            delay: 0.3,
            ease: "back.out(1.7)",
            scrollTrigger: {
                trigger: '.dress-code',
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });

        // Efecto adicional al hacer hover
        document.querySelectorAll('.dress-item').forEach(item => {
            item.addEventListener('mouseenter', function() {
                gsap.to(this.querySelector('img'), {
                    duration: 0.3,
                    rotation: 360,
                    scale: 1.2,
                    ease: "power2.out"
                });
            });

            item.addEventListener('mouseleave', function() {
                gsap.to(this.querySelector('img'), {
                    duration: 0.3,
                    rotation: 0,
                    scale: 1,
                    ease: "power2.out"
                });
            });
        });

        console.log('Efecto de vestimenta mágica cargado correctamente ✨');