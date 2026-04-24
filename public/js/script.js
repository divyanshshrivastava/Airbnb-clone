(() => {
  "use strict";

  /* ── 1. Bootstrap Form Validation ── */
  const forms = document.querySelectorAll(".needs-validation");
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add("was-validated");
      },
      false,
    );
  });

  /* ── 2. Navbar Scroll Effect ── */
  const navbar = document.getElementById("main-navbar");
  if (navbar) {
    const onScroll = () => {
      if (window.scrollY > 10) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // initial check
  }

  /* ── 3. Mobile Hamburger Menu ── */
  const hamburger = document.getElementById("hamburger-btn");
  const drawer = document.getElementById("mobile-drawer");
  if (hamburger && drawer) {
    hamburger.addEventListener("click", () => {
      const isOpen = hamburger.classList.toggle("open");
      drawer.classList.toggle("open");
      hamburger.setAttribute("aria-expanded", isOpen);
    });
  }

  /* ── 4. Flash Auto-Dismiss ── */
  document.querySelectorAll(".sf-flash").forEach((flash) => {
    setTimeout(() => {
      flash.style.transition = "opacity 0.4s ease, transform 0.4s ease";
      flash.style.opacity = "0";
      flash.style.transform = "translateY(-10px)";
      setTimeout(() => flash.remove(), 400);
    }, 5000);
  });

  /* ── 5. Scroll-Reveal Animation (IntersectionObserver) ── */
  const revealElements = document.querySelectorAll(".sf-reveal");
  if (revealElements.length && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );
    revealElements.forEach((el) => observer.observe(el));
  } else {
    // Fallback: make all visible
    revealElements.forEach((el) => el.classList.add("is-visible"));
  }

  /* ── 6. Image Preview on File Input ── */
  const imageInput = document.getElementById("image");
  const imagePreview = document.getElementById("image-preview");
  if (imageInput && imagePreview) {
    imageInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          imagePreview.src = ev.target.result;
          imagePreview.style.display = "block";
        };
        reader.readAsDataURL(file);
      } else {
        imagePreview.style.display = "none";
      }
    });
  }
})();
