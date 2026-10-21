/* ============================================================
   Portfolio — interactions & animations
   ============================================================ */
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky header ---------- */
  const header = document.getElementById("siteHeader");
  const backToTop = document.getElementById("backToTop");

  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle("scrolled", y > 20);
    backToTop.classList.toggle("visible", y > 600);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- Mobile nav ---------- */
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  const closeMenu = () => {
    navToggle.classList.remove("open");
    navMenu.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  };

  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (e) => {
    if (
      navMenu.classList.contains("open") &&
      !navMenu.contains(e.target) &&
      !navToggle.contains(e.target)
    ) {
      closeMenu();
    }
  });

  /* ---------- Scroll spy (active nav link) ---------- */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
        });
      });
    },
    { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
  );

  sections.forEach((section) => spy.observe(section));

  /* ---------- Reveal on scroll ---------- */
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  /* ---------- Typing effect ---------- */
  const typedEl = document.getElementById("typedRole");
  const roles = [
    "Software Engineer",
    ".NET / WPF Developer",
    "RF & ATE Software Specialist",
    "Aerospace & Defence Technologist",
  ];

  if (typedEl) {
    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const typeLoop = () => {
      const current = roles[roleIndex];
      charIndex += deleting ? -1 : 1;
      typedEl.textContent = current.slice(0, charIndex);

      let delay = deleting ? 45 : 85;

      if (!deleting && charIndex === current.length) {
        delay = 2000;
        deleting = true;
      } else if (deleting && charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = 450;
      }

      setTimeout(typeLoop, delay);
    };

    setTimeout(typeLoop, 700);
  }

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll(".stat-number");

  const animateCounter = (el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const suffix = el.dataset.suffix || "";
    const duration = 1600;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = (target * eased).toFixed(decimals);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));

  /* ---------- Experience accordion ---------- */
  document.querySelectorAll("[data-accordion]").forEach((card) => {
    const button = card.querySelector(".job-head");

    button.addEventListener("click", () => {
      const isOpen = card.classList.toggle("open");
      button.setAttribute("aria-expanded", String(isOpen));
    });
  });

  /* ---------- Contact form (mailto) ---------- */
  const form = document.getElementById("contactForm");
  const formNote = document.getElementById("formNote");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const subject = form.subject.value.trim();
      const message = form.message.value.trim();

      let valid = true;

      const setValidity = (field, isValid) => {
        field.classList.toggle("invalid", !isValid);
        if (!isValid) valid = false;
      };

      setValidity(form.name, name.length > 0);
      setValidity(form.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
      setValidity(form.subject, subject.length > 0);
      setValidity(form.message, message.length > 0);

      if (!valid) {
        formNote.textContent = "Please fill in all fields with a valid email.";
        formNote.classList.remove("success");
        return;
      }

      const to = "suryatejatiruveedhula03@gmail.com";
      const body = `Hi Surya Teja,%0D%0A%0D%0A${encodeURIComponent(message)}%0D%0A%0D%0A— ${encodeURIComponent(name)}%0D%0A${encodeURIComponent(email)}`;
      const mailto = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${body}`;

      window.location.href = mailto;

      formNote.textContent = "Opening your email app… If nothing happens, email me directly.";
      formNote.classList.add("success");
      form.reset();
    });

    form.querySelectorAll("input, textarea").forEach((field) => {
      field.addEventListener("input", () => field.classList.remove("invalid"));
    });
  }

  /* ---------- Smooth close mobile menu on resize ---------- */
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768 && navMenu.classList.contains("open")) {
      closeMenu();
    }
  });
});
