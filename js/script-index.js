document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click', () => {
        nav.classList.toggle('active');
        burger.classList.toggle('toggle');

        // Animate Links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
    });

    
    class Particle {
        constructor(canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = Math.random() * 2 - 1;
            this.vy = Math.random() * 2 - 1;
            this.radius = Math.random() * 2 + 1;
            this.connections = [];
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > this.canvas.width) this.vx = -this.vx;
            if (this.y < 0 || this.y > this.canvas.height) this.vy = -this.vy;
        }

        draw() {
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            this.ctx.fill();
        }
    }

    class ParticleNetwork {
        constructor() {
            this.canvas = document.getElementById('particles-canvas');
            this.ctx = this.canvas.getContext('2d');
            this.particles = [];
            this.numberOfParticles = 100;
            this.connectionDistance = 150;
            this.init();
            this.animate();

            window.addEventListener('resize', () => this.resize());
        }

        init() {
            this.resize();
            for (let i = 0; i < this.numberOfParticles; i++) {
                this.particles.push(new Particle(this.canvas));
            }
        }

        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }

        drawConnections() {
            for (let i = 0; i < this.particles.length; i++) {
                for (let j = i + 1; j < this.particles.length; j++) {
                    const dx = this.particles[i].x - this.particles[j].x;
                    const dy = this.particles[i].y - this.particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < this.connectionDistance) {
                        const opacity = 1 - (distance / this.connectionDistance);
                        this.ctx.beginPath();
                        this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                        this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                        this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.5})`;
                        this.ctx.lineWidth = 1;
                        this.ctx.stroke();
                    }
                }
            }
        }

        animate() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            this.drawConnections();
            
            requestAnimationFrame(() => this.animate());
        }
    }

    // Initialize the particle network when the window loads
    window.addEventListener('load', () => {
        new ParticleNetwork();
    });

    // Smooth scroll for the CTA button
    document.querySelector('.cta-button').addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });

   // Función para validar el input
   function validateInput(input) {
    // Patrones para detectar posibles scripts o inyecciones de código
    const scriptPattern = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
    const onEventPattern = /\bon\w+\s*=/gi;
    const jsUrlPattern = /javascript:/gi;

    if (scriptPattern.test(input) || onEventPattern.test(input) || jsUrlPattern.test(input)) {
        return false;
    }
    return true;
}

    // Parallax effect for hero section
    gsap.to('.hero', {
        backgroundPosition: `50% ${innerHeight / 2}px`,
        ease: "none",
        scrollTrigger: {
            trigger: '.hero',
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });

    // Header scroll effect
    ScrollTrigger.create({
        start: 100,
        toggleClass: {className: 'scrolled', targets: 'header'}
    });
});