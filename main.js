/* =========================================
   RIVILAN INVESTMENTS — main.js
   GSAP + ScrollTrigger — zero lag, instant response
   ========================================= */

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const OUT = "power3.out";
const EXPO = "expo.out";

/* ══════════════════════════════════════════
   NAVBAR
══════════════════════════════════════════ */
const navbar = document.getElementById("navbar");

gsap.from(navbar, { y: -60, opacity: 0, duration: 0.7, ease: EXPO });

window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 50);
}, { passive: true });

/* Mobile hamburger */
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");

hamburger.addEventListener("click", () => {
    const isOpen = hamburger.classList.toggle("open");
    if (isOpen) {
        mobileMenu.classList.add("open");
        gsap.fromTo(mobileMenu,
            { opacity: 0, y: -8 },
            { opacity: 1, y: 0, duration: 0.25, ease: OUT }
        );
    } else {
        gsap.to(mobileMenu, {
            opacity: 0, y: -8, duration: 0.18, ease: "power2.in",
            onComplete: () => {
                mobileMenu.classList.remove("open");
                gsap.set(mobileMenu, { clearProps: "opacity,y" });
            }
        });
    }
});

mobileMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        hamburger.classList.remove("open");
        mobileMenu.classList.remove("open");
    });
});

/* ══════════════════════════════════════════
   HERO — tight stagger, no long waits
══════════════════════════════════════════ */
gsap.timeline({ defaults: { ease: EXPO } })
    .from(".badge-pill", { opacity: 0, y: 20, duration: 0.6 }, 0.1)
    .from(".hero-heading", { opacity: 0, y: 35, duration: 0.75 }, 0.2)
    .from(".hero-sub", { opacity: 0, y: 25, duration: 0.65 }, 0.35)
    .from(".hero-actions", { opacity: 0, y: 20, duration: 0.6 }, 0.48)
    .from(".logo-marquee", { opacity: 0, y: 15, duration: 0.55 }, 0.58)
    .from(".hero-light-left", { opacity: 0, x: -60, duration: 0.9 }, 0.15)
    .from(".hero-light-right", { opacity: 0, x: 60, duration: 0.9 }, 0.15);

/* ══════════════════════════════════════════
   HELPERS
══════════════════════════════════════════ */

/* Single element, fires the moment it enters viewport */
function sr(el, fromVars, triggerEl, startPos) {
    gsap.from(el, {
        ...fromVars,
        ease: EXPO,
        scrollTrigger: {
            trigger: triggerEl || el,
            start: startPos || "top 88%",
            toggleActions: "play none none none"
        }
    });
}

/* Group of elements — ONE shared ScrollTrigger, GSAP stagger */
function srGroup(selector, fromVars, triggerSel, startPos, staggerAmt) {
    const els = document.querySelectorAll(selector);
    if (!els.length) return;
    gsap.from(els, {
        ...fromVars,
        ease: EXPO,
        stagger: staggerAmt || 0.09,
        scrollTrigger: {
            trigger: triggerSel || els[0],
            start: startPos || "top 85%",
            toggleActions: "play none none none"
        }
    });
}

/* ── WHO WE ARE ── */
srGroup("#intro .badge, #intro .intro-content, #intro .vision-box",
    { opacity: 0, y: 40, duration: 0.8 }, "#intro", "top 85%", 0.12);

/* ── FOUNDER ── */
sr(".founder-card", { opacity: 0, scale: 0.96, y: 35, duration: 0.9 }, ".founder-card", "top 85%");
sr(".founder-quote", { opacity: 0, y: 18, duration: 0.7 }, ".founder-card", "top 80%");

/* ── PROCESS ── */
sr("#process .section-header", { opacity: 0, y: 35, duration: 0.7 });

const processCards = document.querySelectorAll(".process-card");
const xOrigins = [-70, 0, 70];
processCards.forEach((card, i) => {
    gsap.from(card, {
        opacity: 0,
        x: xOrigins[i],
        y: i === 1 ? 40 : 0,
        duration: 0.85,
        ease: EXPO,
        delay: i * 0.07,
        scrollTrigger: { trigger: ".process-grid", start: "top 85%", toggleActions: "play none none none" }
    });
});

/* ── SERVICES ── */
sr("#services .section-header", { opacity: 0, y: 35, duration: 0.7 });
srGroup(".bento-card", { opacity: 0, y: 0, duration: 0.75 }, ".services-bento", "top 85%", 0.08);

/* ── BENEFITS ── */
sr("#benefits .section-header", { opacity: 0, y: 35, duration: 0.7 });
srGroup(".benefit-card", { opacity: 0, y: 0, duration: 0.8 }, ".benefits-grid", "top 85%", 0.1);

/* ── PLANS ── */
sr("#plans .section-header", { opacity: 0, y: 35, duration: 0.7 });
sr(".plans-toggle", { opacity: 0, y: 15, duration: 0.5 }, ".plans-toggle", "top 90%");
srGroup(".plan-card", { opacity: 0, y: 0, scale: 0.97, duration: 0.8 }, ".plans-grid", "top 85%", 0.2);

/* ── TESTIMONIALS ── */
sr("#testimonials .section-header", { opacity: 0, y: 35, duration: 0.7 });
srGroup(".testimonial-card", { opacity: 0, y: 40, duration: 0.75 }, ".testimonials-grid", "top 88%", 0.07);

/* ── CONTACT ── */
sr(".contact-info", { opacity: 0, x: -50, duration: 0.85 }, ".contact-layout", "top 85%");
sr(".contact-form-wrap", { opacity: 0, x: 50, duration: 0.85 }, ".contact-layout", "top 85%");

/* ── CTA ── */
sr(".cta-section", { opacity: 0, y: 40, duration: 0.85 }, ".cta-section", "top 85%");

/* ── FOOTER ── */
sr("footer .footer-inner", { opacity: 0, y: 35, duration: 0.8 }, "footer", "top 92%");

/* ══════════════════════════════════════════
   FAQ ACCORDION
══════════════════════════════════════════ */
sr("#faq .section-header", { opacity: 0, y: 35, duration: 0.7 });
srGroup(".faq-item", { opacity: 0, y: 25, duration: 0.65 }, ".faq-list", "top 88%", 0.07);

document.querySelectorAll(".faq-item").forEach(item => {
    const btn = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    gsap.set(answer, { height: 0, opacity: 0, overflow: "hidden" });

    btn.addEventListener("click", () => {
        const isOpen = item.classList.contains("open");

        document.querySelectorAll(".faq-item.open").forEach(openItem => {
            openItem.classList.remove("open");
            openItem.querySelector(".faq-question").setAttribute("aria-expanded", "false");
            gsap.to(openItem.querySelector(".faq-answer"), {
                height: 0, opacity: 0, duration: 0.3, ease: "power2.inOut"
            });
        });

        if (!isOpen) {
            item.classList.add("open");
            btn.setAttribute("aria-expanded", "true");
            gsap.set(answer, { height: "auto", opacity: 1 });
            const h = answer.offsetHeight;
            gsap.fromTo(answer,
                { height: 0, opacity: 0 },
                { height: h, opacity: 1, duration: 0.38, ease: "power3.out" }
            );
        }
    });
});

/* ══════════════════════════════════════════
   PRICING TOGGLE
══════════════════════════════════════════ */
const monthlyBtn = document.getElementById("toggleMonthly");
const annuallyBtn = document.getElementById("toggleAnnually");
const priceBigs = document.querySelectorAll(".price-big[data-monthly]");

function setPricing(mode) {
    gsap.to(priceBigs, {
        opacity: 0, y: -6, duration: 0.15, ease: "power1.in",
        onComplete() {
            priceBigs.forEach(el => {
                el.textContent = mode === "monthly" ? el.dataset.monthly : el.dataset.annually;
            });
            gsap.to(priceBigs, { opacity: 1, y: 0, duration: 0.22, ease: OUT });
        }
    });
}

monthlyBtn.addEventListener("click", () => {
    monthlyBtn.classList.add("active");
    annuallyBtn.classList.remove("active");
    setPricing("monthly");
});
annuallyBtn.addEventListener("click", () => {
    annuallyBtn.classList.add("active");
    monthlyBtn.classList.remove("active");
    setPricing("annually");
});

/* ══════════════════════════════════════════
   CONTACT FORM
══════════════════════════════════════════ */
const contactForm = document.getElementById("contactForm");
if (contactForm) {
    contactForm.addEventListener("submit", e => {
        e.preventDefault();
        const btn = contactForm.querySelector("button[type='submit']");
        const orig = btn.textContent;
        btn.textContent = "Sent \u2713";
        btn.disabled = true;
        gsap.from(btn, { scale: 0.94, duration: 0.28, ease: "back.out(2)" });
        setTimeout(() => {
            btn.textContent = orig;
            btn.disabled = false;
            contactForm.reset();
        }, 3000);
    });
}

/* ══════════════════════════════════════════
   SMOOTH SCROLL
══════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", e => {
        const target = document.querySelector(anchor.getAttribute("href"));
        if (!target) return;
        e.preventDefault();
        gsap.to(window, { scrollTo: { y: target, offsetY: 80 }, duration: 0.85, ease: "power3.inOut" });
    });
});

/* ══════════════════════════════════════════
   HOVER MICRO-INTERACTIONS
══════════════════════════════════════════ */
[".bento-card", ".plan-card", ".testimonial-card", ".benefit-card", ".process-card"].forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
        el.addEventListener("mouseenter", () => gsap.to(el, { y: -5, duration: 0.28, ease: OUT }));
        el.addEventListener("mouseleave", () => gsap.to(el, { y: 0, duration: 0.32, ease: OUT }));
    });
});

document.querySelectorAll(".btn").forEach(btn => {
    btn.addEventListener("mouseenter", () => gsap.to(btn, { scale: 1.04, duration: 0.2, ease: OUT }));
    btn.addEventListener("mouseleave", () => gsap.to(btn, { scale: 1, duration: 0.25, ease: OUT }));
});

/* ══════════════════════════════════════════
   PARALLAX — hero circles
══════════════════════════════════════════ */
gsap.to(".hero-circle-large", {
    y: -100, ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1.2 }
});
gsap.to(".hero-circle-small", {
    y: -50, ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1.2 }
});
