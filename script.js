/* ============================================
   JAM THE WEB – MAIN JAVASCRIPT v2
   Optimised: rAF-throttled scroll, lightweight
   particles, cursor glow, tilt & ripple
   ============================================ */

// ── Preloader ─────────────────────────────────
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hidden');
            // Trigger hero animations after preloader
            document.querySelectorAll('.hero-content .reveal, .hero-visual .reveal').forEach(el => el.classList.add('visible'));
        }, 800);
    }
});

// ── Scroll handler (rAF throttled) ────────────
const progressBar = document.querySelector('.progress-bar');
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.nav-links a[data-section]');
const sections = document.querySelectorAll('section[id]');
const backToTop = document.querySelector('.back-to-top');

let scrollTick = false;
window.addEventListener('scroll', () => {
    if (!scrollTick) {
        scrollTick = true;
        requestAnimationFrame(() => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (progressBar) progressBar.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%';
            if (navbar) navbar.classList.toggle('scrolled', scrollTop > 40);
            if (backToTop) backToTop.classList.toggle('visible', scrollTop > 400);
            let current = '';
            sections.forEach(sec => { if (scrollTop >= sec.offsetTop - 120) current = sec.id; });
            navLinks.forEach(a => a.classList.toggle('active', a.dataset.section === current));
            scrollTick = false;
        });
    }
}, { passive: true });

// ── Smooth Scroll ─────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        mobileNav.classList.remove('open');
        hamburger.classList.remove('open');
    });
});

// ── Back to Top ───────────────────────────────
if (backToTop) {
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ── Mobile Hamburger ──────────────────────────
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');
if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        mobileNav.classList.toggle('open');
    });
}

// ── Scroll Reveal (Intersection Observer) ─────
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObserver.observe(el));

// ── Typewriter Effect ─────────────────────────
function typewriter(el, words, speed = 100, pause = 2000) {
    if (!el) return;
    let wordIdx = 0, charIdx = 0, deleting = false;
    function tick() {
        const word = words[wordIdx];
        if (!deleting) {
            el.textContent = word.slice(0, ++charIdx);
            if (charIdx === word.length) { deleting = true; setTimeout(tick, pause); return; }
        } else {
            el.textContent = word.slice(0, --charIdx);
            if (charIdx === 0) { deleting = false; wordIdx = (wordIdx + 1) % words.length; }
        }
        setTimeout(tick, deleting ? speed / 2 : speed);
    }
    tick();
}
typewriter(document.getElementById('typewriter-text'), [
    'Blooms with AI',
    'Rides the Tide',
    'Creates Beauty',
    'Grows Uniquely'
], 90, 2200);

// ── Cursor Glow (desktop, rAF throttled) ──────
const cursorGlow = document.getElementById('cursor-glow');
if (cursorGlow && window.matchMedia('(min-width: 900px)').matches) {
    let glowTick = false;
    document.addEventListener('mousemove', e => {
        if (!glowTick) {
            glowTick = true;
            requestAnimationFrame(() => {
                cursorGlow.style.left = e.clientX + 'px';
                cursorGlow.style.top = e.clientY + 'px';
                glowTick = false;
            });
        }
    }, { passive: true });
}

// ── Hero Particle Canvas (lightweight) ────────
(function initParticles() {
    const canvas = document.getElementById('hero-particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h;
    const particles = [];
    const COUNT = 35; // reduced for performance
    const CONNECT_DIST = 120;
    let heroVisible = true;

    function resize() {
        const hero = canvas.parentElement;
        w = canvas.width = hero.offsetWidth;
        h = canvas.height = hero.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Pause when hero is off-screen
    const heroObs = new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; }, { threshold: 0 });
    heroObs.observe(canvas.parentElement);

    for (let i = 0; i < COUNT; i++) {
        particles.push({
            x: Math.random() * w, y: Math.random() * h,
            r: Math.random() * 1.5 + 0.5,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            alpha: Math.random() * 0.4 + 0.15
        });
    }

    function draw() {
        requestAnimationFrame(draw);
        if (!heroVisible) return; // skip when not visible

        ctx.clearRect(0, 0, w, h);
        for (const p of particles) {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
            if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(14, 165, 233, ${p.alpha})`;
            ctx.fill();
        }

        // Connecting lines – fast distance skip
        ctx.lineWidth = 0.5;
        for (let i = 0; i < particles.length; i++) {
            const a = particles[i];
            for (let j = i + 1; j < particles.length; j++) {
                const b = particles[j];
                const dx = a.x - b.x;
                if (dx > CONNECT_DIST || dx < -CONNECT_DIST) continue;
                const dy = a.y - b.y;
                if (dy > CONNECT_DIST || dy < -CONNECT_DIST) continue;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < CONNECT_DIST) {
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.strokeStyle = `rgba(14, 165, 233, ${0.06 * (1 - dist / CONNECT_DIST)})`;
                    ctx.stroke();
                }
            }
        }
    }
    draw();
})();

// ── Tilt Effect (3D card hover) ───────────────
document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const midX = rect.width / 2;
        const midY = rect.height / 2;
        const rotateX = ((y - midY) / midY) * -6;
        const rotateY = ((x - midX) / midX) * 6;
        card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(600px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// ── Ripple Effect on Buttons ──────────────────
document.querySelectorAll('.btn-ripple').forEach(btn => {
    btn.addEventListener('click', function (e) {
        const circle = document.createElement('span');
        circle.classList.add('ripple-circle');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        circle.style.width = circle.style.height = size + 'px';
        circle.style.left = (e.clientX - rect.left - size / 2) + 'px';
        circle.style.top = (e.clientY - rect.top - size / 2) + 'px';
        this.appendChild(circle);
        setTimeout(() => circle.remove(), 600);
    });
});

// ── Testimonials Drag Scroll ──────────────────
const testimonialScroll = document.querySelector('.testimonials-scroll');
if (testimonialScroll) {
    let isDown = false, startX, scrollLeft;
    testimonialScroll.addEventListener('mousedown', e => {
        isDown = true;
        testimonialScroll.style.cursor = 'grabbing';
        startX = e.pageX - testimonialScroll.offsetLeft;
        scrollLeft = testimonialScroll.scrollLeft;
    });
    testimonialScroll.addEventListener('mouseleave', () => { isDown = false; testimonialScroll.style.cursor = 'grab'; });
    testimonialScroll.addEventListener('mouseup', () => { isDown = false; testimonialScroll.style.cursor = 'grab'; });
    testimonialScroll.addEventListener('mousemove', e => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - testimonialScroll.offsetLeft;
        testimonialScroll.scrollLeft = scrollLeft - (x - startX) * 2;
    });
}

// ── Toast Notification ────────────────────────
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.querySelector('.toast-msg').textContent = message;
    toast.querySelector('.toast-icon').textContent = type === 'success' ? '✅' : '❌';
    toast.className = `toast ${type} visible`;
    setTimeout(() => toast.classList.remove('visible'), 4000);
}

// ── Contact Form ──────────────────────────────
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearErrors();

        const name = document.getElementById('f-name');
        const email = document.getElementById('f-email');
        const subject = document.getElementById('f-subject');
        const message = document.getElementById('f-message');
        let valid = true;

        if (!name.value.trim()) { showFieldError('err-name', 'Name is required.'); name.classList.add('invalid'); valid = false; }
        if (!email.value.trim()) { showFieldError('err-email', 'Email is required.'); email.classList.add('invalid'); valid = false; }
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { showFieldError('err-email', 'Enter a valid email address.'); email.classList.add('invalid'); valid = false; }
        if (!message.value.trim()) { showFieldError('err-message', 'Message cannot be empty.'); message.classList.add('invalid'); valid = false; }
        if (!valid) return;

        const submitBtn = contactForm.querySelector('.form-submit');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: name.value.trim(),
                    email: email.value.trim(),
                    subject: subject ? subject.value : '',
                    message: message.value.trim()
                })
            });
            const data = await res.json();
            if (data.success) { showToast(data.message, 'success'); contactForm.reset(); }
            else { showToast(data.error || 'Something went wrong.', 'error'); }
        } catch { showToast('Could not connect to server. Please try again.', 'error'); }
        finally { submitBtn.disabled = false; submitBtn.textContent = 'Send Message 🚀'; }
    });

    contactForm.querySelectorAll('.form-input, .form-textarea').forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('invalid');
            const errId = 'err-' + input.id.replace('f-', '');
            const errEl = document.getElementById(errId);
            if (errEl) { errEl.style.display = 'none'; errEl.textContent = ''; }
        });
    });
}

function showFieldError(id, msg) {
    const el = document.getElementById(id);
    if (el) { el.textContent = msg; el.style.display = 'block'; }
}
function clearErrors() {
    document.querySelectorAll('.field-error').forEach(el => { el.style.display = 'none'; el.textContent = ''; });
    document.querySelectorAll('.form-input, .form-textarea').forEach(el => el.classList.remove('invalid'));
}

// ── Newsletter / CTA Form ─────────────────────
const newsletterForm = document.getElementById('newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const emailInput = document.getElementById('cta-email');
        const email = emailInput.value.trim();
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showToast('Please enter a valid email address.', 'error');
            return;
        }
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: 'Newsletter Subscriber', email, subject: 'Newsletter', message: 'Subscribed to newsletter.' })
            });
            const data = await res.json();
            if (data.success) { showToast('Subscribed successfully! 🎉', 'success'); emailInput.value = ''; }
            else { showToast(data.error || 'Something went wrong.', 'error'); }
        } catch { showToast('Could not connect to server.', 'error'); }
    });
}

// ── Animated Counter ──────────────────────────
function animateCounter(el, target, duration = 1500) {
    let start = null;
    const step = (ts) => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(eased * target).toLocaleString() + (el.dataset.suffix || '');
        if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}

const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('[data-count]').forEach(c => animateCounter(c, parseInt(c.dataset.count)));
            statObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.hero-stats');
if (statsSection) statObserver.observe(statsSection);
