// ==========================================
// KARANG TARUNA PERAONEPULE
// JAVASCRIPT
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

  // ============================
  // MENU MOBILE
  // ============================

  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");

  if (menuToggle && navMenu) {

    menuToggle.addEventListener("click", function () {
      navMenu.classList.toggle("active");

      if (navMenu.classList.contains("active")) {
        menuToggle.textContent = "✕";
      } else {
        menuToggle.textContent = "☰";
      }
    });

    // Tutup menu setelah memilih menu
    const navLinks = navMenu.querySelectorAll("a");

    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        navMenu.classList.remove("active");
        menuToggle.textContent = "☰";
      });
    });
  }

  // ============================
  // TAHUN OTOMATIS
  // ============================

  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // ============================
  // TOMBOL BACK TO TOP
  // ============================

  const backTop = document.getElementById("backTop");

  if (backTop) {

    window.addEventListener("scroll", function () {

      if (window.scrollY > 400) {
        backTop.classList.add("show");
      } else {
        backTop.classList.remove("show");
      }

    });

    backTop.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  // ============================
  // ANIMASI SAAT SCROLL
  // ============================

  const animatedElements = document.querySelectorAll(
    ".about-card, .activity-card, .leader-card, .gallery-item, .contact-card"
  );

  const observer = new IntersectionObserver(
    function (entries) {

      entries.forEach(function (entry) {

        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          observer.unobserve(entry.target);
        }

      });

    },
    {
      threshold: 0.1
    }
  );

  animatedElements.forEach(function (element) {

    element.style.opacity = "0";
    element.style.transform = "translateY(25px)";
    element.style.transition =
      "opacity 0.6s ease, transform 0.6s ease";

    observer.observe(element);

  });

});
