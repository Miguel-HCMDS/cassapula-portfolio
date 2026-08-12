let index = 0;

function moveCarousel(direction) {
  const track = document.getElementById("carouselTrack");
  const items = track.children;
  const itemHeight = items[0].offsetHeight;

  index += direction;

  if (index < 0) {
    index = items.length - 1;
  } else if (index >= items.length) {
    index = 0;
  }

  track.style.transform = `translateY(-${index * itemHeight}px)`;
}

/*🡻🡻🡻Navbar logic🡻🡻🡻*/

const navbar = document.querySelector(".navbar");
const hero = document.querySelector(".hero");

function handleNavbarScroll() {
  const isMobile = window.innerWidth <= 768; // mobile breakpoint

  if (isMobile) {
    navbar.style.transform = "translateY(0)";
    navbar.style.opacity = "1";
    return;
  }

  const heroBottom = hero.getBoundingClientRect().bottom;

  if (heroBottom <= 0) {
    navbar.style.transform = "translateY(0)";
    navbar.style.opacity = "1";
  } else {
    navbar.style.transform = "translateY(-100%)";
    navbar.style.opacity = "0";
  }
}

// Attach event listeners
window.addEventListener("scroll", handleNavbarScroll);
window.addEventListener("resize", handleNavbarScroll);

// Run once on page load
handleNavbarScroll();

/*Mobile menu logic*/

const toggle = document.getElementById("nav-toggle");
  const menu = document.querySelector(".nav-menu");

  toggle.addEventListener("click", () => {
    menu.classList.toggle("active");
  });

/*🡻🡻🡻slide animation🡻🡻🡻*/

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // run once
      }
    });
  },
  {
    threshold: 0.35 // reveal when 25% visible
  }
);

document.querySelectorAll('.reveal-right').forEach(el => {
  observer.observe(el);
});

/* =======================
   UNIVERSAL DROPDOWN LOGIC
   ======================= */

// Target both .nav-dropdown and .processo-card so process cards toggle on click
const allDropdowns = document.querySelectorAll(".nav-dropdown, .processo-card");

allDropdowns.forEach(dropdown => {
  // Look for inner toggle button, title, or click the card itself
  const toggleBtn = dropdown.querySelector(".dropdown-toggle, .nav-dropbtn, .processo-title, .processo-number") || dropdown;

  toggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    // Close all OTHER open dropdowns/cards
    allDropdowns.forEach(other => {
      if (other !== dropdown) {
        other.classList.remove("active");
      }
    });

    // Toggle ONLY the clicked element
    dropdown.classList.toggle("active");
  });
});

// Close all open dropdowns/cards when clicking outside
document.addEventListener("click", (e) => {
  allDropdowns.forEach(dropdown => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove("active");
    }
  });
});

// Close on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    allDropdowns.forEach(dropdown => dropdown.classList.remove("active"));
  }
});

/*🡻🡻🡻 Hero Dropdown Toggle Logic 🡻🡻🡻*/
const heroDropdown = document.querySelector(".hero-dropdown");
const heroDropdownToggle = document.getElementById("heroDropdownToggle");

if (heroDropdownToggle && heroDropdown) {
  // Toggle menu state on button click
  heroDropdownToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    heroDropdown.classList.toggle("active");
  });

  // Close dropdown when clicking anywhere outside
  document.addEventListener("click", (e) => {
    if (!heroDropdown.contains(e.target)) {
      heroDropdown.classList.remove("active");
    }
  });

  // Close dropdown on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      heroDropdown.classList.remove("active");
    }
  });
}

// Close all open dropdowns when clicking outside
document.addEventListener("click", (e) => {
  allDropdowns.forEach(dropdown => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove("active");
    }
  });
});

// Close on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    allDropdowns.forEach(dropdown => dropdown.classList.remove("active"));
  }
});





/*🡻🡻🡻WHATSAPP FORM LOGIC🡻🡻🡻*/

function sendWhatsApp(event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const project = document.getElementById("project").value;
  const message = document.getElementById("message").value.trim();

  const text =
`Nome: ${name}
Email: ${email}
WhatsApp: ${phone}
Projeto: ${project}

Mensagem:
${message}`;

  const whatsappNumber = "5541984133481";
  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;

  window.open(url, "_blank");
}

// Simple JS swap for mobile
if (window.innerWidth <= 768) {
  document.querySelector('#ilust1 img').src = "img/ilust1-mobile.png";
  document.querySelector('#ilust2 img').src = "img/ilust2-mobile.png";
}

document.addEventListener("contextmenu", e => e.preventDefault());

/*🡻🡻🡻 Hero Custom Cursor Glow Logic 🡻🡻🡻*/
const heroSection = document.querySelector(".hero");
const heroCursorGlow = document.getElementById("heroCursorGlow");

if (heroSection && heroCursorGlow) {
  heroSection.addEventListener("mousemove", (e) => {
    const rect = heroSection.getBoundingClientRect();
    // Calculate mouse position relative to the hero section
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Move the glow center to the mouse coordinates
    heroCursorGlow.style.left = `${x}px`;
    heroCursorGlow.style.top = `${y}px`;
    heroCursorGlow.style.opacity = "1"; // Fade in when moving inside
  });

  heroSection.addEventListener("mouseleave", () => {
    heroCursorGlow.style.opacity = "0"; // Fade out when leaving the hero
  });
}