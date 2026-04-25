(() => {
  "use strict";

  /* ── 1. Real-Time Inline Form Validation ── */
  const forms = document.querySelectorAll(".needs-validation");

  function showFieldError(input) {
    const field = input.closest(".auth-field");
    if (!field) return;
    const errorSpan = field.querySelector(".auth-field-error");
    const wrap = field.querySelector(".auth-input-wrap");
    if (errorSpan) errorSpan.classList.add("visible");
    if (wrap) wrap.classList.add("has-error");
  }

  function hideFieldError(input) {
    const field = input.closest(".auth-field");
    if (!field) return;
    const errorSpan = field.querySelector(".auth-field-error");
    const wrap = field.querySelector(".auth-input-wrap");
    if (errorSpan) errorSpan.classList.remove("visible");
    if (wrap) wrap.classList.remove("has-error");
  }

  Array.from(forms).forEach((form) => {
    const inputs = form.querySelectorAll(".auth-input[required]");

    // Show error when user leaves an empty / invalid field
    inputs.forEach((input) => {
      input.addEventListener("blur", () => {
        if (!input.value.trim() || !input.checkValidity()) {
          showFieldError(input);
        }
      });

      // Clear error as soon as the user starts typing valid content
      input.addEventListener("input", () => {
        if (input.value.trim() && input.checkValidity()) {
          hideFieldError(input);
        }
      });
    });

    // On submit – show all remaining errors at once
    form.addEventListener(
      "submit",
      (event) => {
        let hasError = false;
        inputs.forEach((input) => {
          if (!input.value.trim() || !input.checkValidity()) {
            showFieldError(input);
            hasError = true;
          }
        });
        if (hasError) {
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
