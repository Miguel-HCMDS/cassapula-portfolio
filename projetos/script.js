const searchInput = document.getElementById("projectSearch");
const tagSelect = document.getElementById("tagSelect");

const resultsSection = document.getElementById("resultsSection");
const resultsGrid = document.getElementById("resultsGrid");

/*🡻🡻🡻Navbar logic🡻🡻🡻*/

const navbar = document.querySelector(".navbar");
const hero = document.querySelector(".hero");

function handleNavbarScroll() {
  const isMobile = window.innerWidth <= 768;

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

window.addEventListener("scroll", handleNavbarScroll);
window.addEventListener("resize", handleNavbarScroll);
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
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.35 }
);

document.querySelectorAll('.reveal-right').forEach(el => {
  observer.observe(el);
});

/* =======================
   SHOW MORE
   ======================= */

const INITIAL_VISIBLE = 3;

document.querySelectorAll(".projects").forEach(section => {
  const grid = section.querySelector(".projects-grid");
  const showMoreBtn = section.querySelector(".show-more");
  if (!grid || !showMoreBtn) return;

  const showMoreText = showMoreBtn.querySelector(".show-more-text");
  const items = Array.from(grid.querySelectorAll(".project-item"));
  let expanded = false;

  function update() {
    items.forEach((item, i) => {
      item.classList.toggle("is-hidden", !expanded && i >= INITIAL_VISIBLE);
    });

    showMoreBtn.style.display =
      items.length > INITIAL_VISIBLE ? "flex" : "none";

    if (showMoreText) {
      showMoreText.textContent = expanded
        ? "Mostrar menos ▲"
        : "Mostrar mais ▼";
    }
  }

  showMoreBtn.addEventListener("click", () => {
    expanded = !expanded;
    update();
  });

  update();
});

/* =======================
   FILTER + SEARCH
   ======================= */

const allProjectItems = Array.from(
  document.querySelectorAll(".project-item")
);

function applyFilters() {
  if (!searchInput || !tagSelect) return;

  const query = searchInput.value.toLowerCase();
  const selectedTag = tagSelect.value;

  resultsGrid.innerHTML = "";

  const matches = allProjectItems.filter(item => {
    const card = item.querySelector(".project-card");
    if (!card) return false;

    const title = (card.dataset.title || "").toLowerCase();
    const tags = (item.dataset.tags || "")
      .split(",")
      .map(t => t.trim());

    return (
      title.includes(query) &&
      (selectedTag === "all" || tags.includes(selectedTag))
    );
  });

  if (query || selectedTag !== "all") {
    resultsSection.classList.add("active");

    document
      .querySelectorAll(".projects")
      .forEach(section => (section.style.display = "none"));

    matches.forEach(item => {
      const clone = item.cloneNode(true);
      clone.classList.remove("is-hidden");
      resultsGrid.appendChild(clone);
    });
  } else {
    resultsSection.classList.remove("active");

    document
      .querySelectorAll(".projects")
      .forEach(section => (section.style.display = ""));
  }
}

if (searchInput) searchInput.addEventListener("input", applyFilters);
if (tagSelect) tagSelect.addEventListener("change", applyFilters);

/* =======================
   MODAL SCROLL HINT
   ======================= */

function attachModalScrollHint(modalImages) {
  if (!modalImages) return;

  modalImages.classList.remove("scrolled");
  modalImages.scrollTop = 0;

  const onScroll = () => {
    if (modalImages.scrollTop > 5) {
      modalImages.classList.add("scrolled");
      modalImages.removeEventListener("scroll", onScroll);
    }
  };

  modalImages.addEventListener("scroll", onScroll);
}

/* =======================
   MEDIA FACTORY
   ======================= */

function createMediaElement(url, className) {
  url = url.trim();

  if (url.includes("youtube.com") || url.includes("youtu.be")) {

    let videoId = null;

    try {
      const parsed = new URL(url);

      if (parsed.hostname.includes("youtu.be")) {
        videoId = parsed.pathname.replace("/", "");
      }

      if (parsed.searchParams.get("v")) {
        videoId = parsed.searchParams.get("v");
      }

    } catch (err) {
      console.warn("Invalid YouTube URL:", url);
    }

    if (!videoId) return document.createElement("div");

    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube.com/embed/${videoId}`;
    iframe.allowFullscreen = true;
    iframe.className = className;

    return iframe;
  }

  const video = document.createElement("video");
  video.src = url;
  video.controls = true;
  video.className = className;

  return video;
}

/* =======================
   MODAL
   ======================= */

const modal = document.getElementById("projectModal");
const modalImages = modal.querySelector(".modal-images");
const modalRight = modal.querySelector(".modal-right");
const modalTitle = modalRight.querySelector("h3");
const modalDesc = modalRight.querySelector("p");
const closeModal = modal.querySelector(".close-modal");

const imageModal = document.getElementById("imageModal");
const imageModalImg = document.getElementById("imageModalImg");
const imageModalClose = document.querySelector(".image-modal-close");

const prevBtn = modal.querySelector(".carousel-btn.prev");
const nextBtn = modal.querySelector(".carousel-btn.next");

let currentIndex = 0;

document.addEventListener("click", e => {
  const card = e.target.closest(".project-card");
  if (!card) return;

  const projectItem = card.closest(".project-item");
  const layout = card.dataset.layout || "single";

  const images = (card.dataset.images || "").split(",").map(s => s.trim()).filter(Boolean);
  const videos = (card.dataset.videos || "").split(",").map(s => s.trim()).filter(Boolean);

  const projectLink = card.dataset.link || "#";

  modal.classList.remove(
    "single-image",
    "single-carousel",
    "multiple-images",
    "study-layout" // ✅ NEW
  );

  modal.classList.add("active");
  modalImages.innerHTML = "";

  modalTitle.textContent = card.dataset.title || "";

  modalDesc.innerHTML = "";
  const descriptions = (card.dataset.description || "")
    .split("|")
    .map(d => d.trim())
    .filter(Boolean);

  descriptions.forEach(text => {
    const p = document.createElement("p");
    p.textContent = text;
    modalDesc.appendChild(p);
  });

  modal.querySelector(".ver-projeto").href = projectLink;

  prevBtn.style.display = "none";
  nextBtn.style.display = "none";
  modalRight.style.display = ""; // reset
  currentIndex = 0;

  /* =======================
   STUDY MODE 🔥 (FIXED)
   ======================= */
if (layout === "study") {
  modal.classList.add("study-layout");
  modalRight.style.display = "none";

  const content = (card.dataset.content || "")
    .split("|")
    .map(c => c.trim())
    .filter(Boolean);

  content.forEach(item => {
    const [type, value] = item.split(":");

    if (type === "img") {
      const img = document.createElement("img");
      img.src = value;
      img.className = "study-img";
      modalImages.appendChild(img);
    }

    if (type === "text") {
      const p = document.createElement("p");
      p.className = "study-text";
      p.textContent = value;
      modalImages.appendChild(p);
    }
  });

  const actions = document.createElement("div");
  actions.className = "modal-actions";

  actions.innerHTML = `
  <button class="modal-btn fechar">Fechar</button>
  <a class="modal-btn ver-projeto" href="${projectLink}" target="_blank">Ver projeto</a>
  `;

  modalImages.appendChild(actions);

  attachModalScrollHint(modalImages);
  return;
}

  /* =======================
     NORMAL MODES
     ======================= */

  const totalMedia = images.length + videos.length;

  if (layout === "single-carousel" && totalMedia > 1) {
    modal.classList.add("single-carousel");

    prevBtn.style.display = "flex";
    nextBtn.style.display = "flex";

    let index = 0;

    images.forEach(src => {
      const img = document.createElement("img");
      img.src = src;
      img.className = `carousel-image ${index === 0 ? "active" : ""}`;
      modalImages.appendChild(img);
      index++;
    });

    videos.forEach(src => {
      const el = createMediaElement(
        src,
        `carousel-image ${index === 0 ? "active" : ""}`
      );
      modalImages.appendChild(el);
      index++;
    });

  } else if (totalMedia > 1) {
    modal.classList.add("multiple-images");

    images.forEach(src => {
      const img = document.createElement("img");
      img.src = src;
      img.className = "modal-img";
      modalImages.appendChild(img);
    });

    videos.forEach(src => {
      const el = createMediaElement(src, "modal-video");
      modalImages.appendChild(el);
    });

    attachModalScrollHint(modalImages);

  } else {
    modal.classList.add("single-image");

    if (images.length) {
      const img = document.createElement("img");
      img.src = images[0];
      img.className = "modal-img";
      modalImages.appendChild(img);
    } else if (videos.length) {
      const el = createMediaElement(videos[0], "modal-video");
      modalImages.appendChild(el);
    }
  }
});

/* =======================
   IMAGE FULLSCREEN
   ======================= */

if (imageModalImg) {
  imageModalImg.draggable = false;

  imageModalImg.addEventListener("dragstart", e => {
    e.preventDefault();
  });
}

/* OPEN FULLSCREEN */
modal.addEventListener("click", e => {
  const img = e.target.closest("img");

  // only trigger if clicking inside modal images
  if (img && modalImages.contains(img)) {
    imageModalImg.src = img.src;
    imageModal.classList.add("active");
  }
});

/* CLOSE (click outside image) */
if (imageModal) {
  imageModal.addEventListener("click", () => {
    imageModal.classList.remove("active");
  });
}

/* CLOSE (button) */
if (imageModalClose) {
  imageModalClose.addEventListener("click", e => {
    e.stopPropagation();
    imageModal.classList.remove("active");
  });
}

/* CLOSE MODAL */

closeModal.onclick = () => modal.classList.remove("active");

const fecharBtn = modal.querySelector(".modal-btn.fechar");

if (fecharBtn) {
  fecharBtn.addEventListener("click", e => {
    e.stopPropagation();
    modal.classList.remove("active");
  });
}

/* ESC */

document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    modal.classList.remove("active");
    imageModal.classList.remove("active");
  }
});

/* CAROUSEL */

prevBtn.onclick = () => {
  const slides = modalImages.querySelectorAll(".carousel-image");
  if (!slides.length) return;

  slides[currentIndex].classList.remove("active");
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  slides[currentIndex].classList.add("active");
};

nextBtn.onclick = () => {
  const slides = modalImages.querySelectorAll(".carousel-image");
  if (!slides.length) return;

  slides[currentIndex].classList.remove("active");
  currentIndex = (currentIndex + 1) % slides.length;
  slides[currentIndex].classList.add("active");
};

/* RIGHT CLICK BLOCK */

document.addEventListener("contextmenu", e => e.preventDefault());