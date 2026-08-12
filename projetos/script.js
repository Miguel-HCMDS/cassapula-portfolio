const searchInput = document.getElementById("projectSearch");
const tagSelect = document.getElementById("tagSelect");

const resultsSection = document.getElementById("resultsSection");
const resultsGrid = document.getElementById("resultsGrid");

/*Mobile menu logic*/

const toggle = document.getElementById("nav-toggle");
const menu = document.querySelector(".nav-menu");

if (toggle && menu) {
  toggle.addEventListener("click", () => {
    menu.classList.toggle("active");
  });
}

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
   MODAL SETUP & EVENT
   ======================= */

const modal = document.getElementById("projectModal");
const modalImages = modal ? modal.querySelector(".modal-images") : null;
const modalRight = modal ? modal.querySelector(".modal-right") : null;
const modalTitle = modalRight ? modalRight.querySelector("h3") : null;
const modalDesc = modalRight ? modalRight.querySelector("p") : null;

const imageModal = document.getElementById("imageModal");
const imageModalImg = document.getElementById("imageModalImg");
const imageModalClose = document.querySelector(".image-modal-close");

const prevBtn = modal ? modal.querySelector(".carousel-btn.prev") : null;
const nextBtn = modal ? modal.querySelector(".carousel-btn.next") : null;

let currentIndex = 0;

document.addEventListener("click", e => {
  const card = e.target.closest(".project-card");
  if (!card) return;

  const layout = card.dataset.layout || "single";
  const projectLink = card.dataset.link || "#";

  // Parse unified media list from data-content
  const mediaList = [];
  const rawContent = card.dataset.content || "";

  if (rawContent && layout !== "study") {
    rawContent.split("|").forEach(item => {
      const colonIndex = item.indexOf(":");
      if (colonIndex === -1) return;

      const type = item.substring(0, colonIndex).trim().toLowerCase();
      const value = item.substring(colonIndex + 1).trim();

      if (type === "img" || type === "image") {
        const [imgUrl] = value.split(";").map(s => s.trim());
        mediaList.push({ type: "img", url: imgUrl });
      } else if (type === "video") {
        mediaList.push({ type: "video", url: value });
      }
    });
  }

  // Fallback to data-images and data-videos if data-content is not used
  if (mediaList.length === 0 && layout !== "study") {
    const images = (card.dataset.images || "").split(",").map(s => s.trim()).filter(Boolean);
    const videos = (card.dataset.videos || "").split(",").map(s => s.trim()).filter(Boolean);
    images.forEach(src => mediaList.push({ type: "img", url: src }));
    videos.forEach(src => mediaList.push({ type: "video", url: src }));
  }

  modal.classList.remove(
    "single-image",
    "single-carousel",
    "multiple-images",
    "study-layout"
  );

  modal.classList.add("active");
  
  // 🔥 Lock body scrolling when modal opens
  document.body.classList.add("modal-open");

  modalImages.innerHTML = "";

  if (modalTitle) modalTitle.textContent = card.dataset.title || "";

  if (modalDesc) {
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
  }

  const verProjetoBtn = modal.querySelector(".ver-projeto");
  if (verProjetoBtn) {
    verProjetoBtn.href = projectLink;
  }

  if (prevBtn) prevBtn.style.display = "none";
  if (nextBtn) nextBtn.style.display = "none";
  if (modalRight) modalRight.style.display = ""; // reset
  currentIndex = 0;

  modalImages.style.backgroundColor = ""; 

  /* =======================
     STUDY MODE 🔥
     ======================= */
  if (layout === "study") {
    modal.classList.add("study-layout");
    if (modalRight) modalRight.style.display = "none";
    modalImages.scrollTop = 0;

    // Custom background
    const customBg = card.dataset.bg;
    if (customBg) {
      modalImages.style.backgroundColor = customBg;
    }

    // Custom text color variable for this study card
    const customTextColor = card.dataset.textColor;
    if (customTextColor) {
      modal.style.setProperty("--study-text-color", customTextColor.trim());
    } else {
      modal.style.removeProperty("--study-text-color");
    }

    // Parse items inside data-content
    const items = rawContent
      .split("|")
      .map(item => item.trim())
      .filter(Boolean);

    items.forEach(item => {
      const colonIndex = item.indexOf(":");
      if (colonIndex === -1) return;

      const type = item.substring(0, colonIndex).trim().toLowerCase();
      let value = item.substring(colonIndex + 1).trim();

      if (type === "img") {
        const [imgUrl, pbConfig] = value.split(";").map(s => s.trim());
        const img = document.createElement("img");
        img.src = imgUrl;
        img.className = "study-img";
        if (pbConfig && pbConfig.startsWith("pb:")) {
          img.style.paddingBottom = pbConfig.replace("pb:", "").trim();
        }
        modalImages.appendChild(img);

      } else if (type === "video") {
        const videoEl = createMediaElement(value, "study-video");
        modalImages.appendChild(videoEl);

      } else if (type === "text") {
        const p = document.createElement("p");
        p.className = "study-text";

        // 1. Check for #middle alignment tag
        if (value.includes("#middle")) {
          p.classList.add("text-center");
          value = value.replace(/#middle/gi, "").trim();
        }

        // 2. Check for hex color code (e.g., #ffb703)
        const colorMatch = value.match(/#(?:[0-9a-fA-F]{3}){1,2}\b/);
        if (colorMatch) {
          const overrideColor = colorMatch[0];
          value = value.replace(overrideColor, "").trim();
          p.style.setProperty("color", overrideColor, "important");
        }

        p.innerHTML = value.replace(/\n/g, "<br>");
        modalImages.appendChild(p);

      } else if (type === "link") {
        const linkContainer = document.createElement("div");
        linkContainer.className = "study-link-container";

        // Check for #middle alignment tag
        if (value.includes("#middle")) {
          linkContainer.classList.add("text-center");
          value = value.replace(/#middle/gi, "").trim();
        }

        const [linkText, linkUrl] = value.split(";").map(s => s.trim());
        const a = document.createElement("a");
        a.href = linkUrl || linkText;
        a.textContent = linkText;
        a.className = "study-link";
        a.target = "_blank";
        a.rel = "noopener noreferrer";

        linkContainer.appendChild(a);
        modalImages.appendChild(linkContainer);
      }
    });

    // Modal action buttons
    const actions = document.createElement("div");
    actions.className = "modal-actions";
    actions.innerHTML = `
      <button class="modal-btn fechar" type="button">Fechar</button>
      <a class="modal-btn ver-projeto" href="${projectLink}" target="_blank">Ver projeto</a>
    `;
    modalImages.appendChild(actions);

    attachModalScrollHint(modalImages);
    return;
  }

  /* =======================
     NORMAL MODES
     ======================= */
  const hasCustomLayout = card.hasAttribute("data-layout");

  if (layout === "single-carousel") {
    modal.classList.add("single-carousel");

    if (mediaList.length > 1) {
      if (prevBtn) prevBtn.style.display = "flex";
      if (nextBtn) nextBtn.style.display = "flex";
    } else {
      if (prevBtn) prevBtn.style.display = "none";
      if (nextBtn) nextBtn.style.display = "none";
    }

    mediaList.forEach((item, index) => {
      const activeClass = index === 0 ? "active" : "";
      if (item.type === "img") {
        const img = document.createElement("img");
        img.src = item.url;
        img.className = `carousel-image ${activeClass}`;
        modalImages.appendChild(img);
      } else if (item.type === "video") {
        const videoEl = createMediaElement(
          item.url,
          `carousel-image ${activeClass}`
        );
        modalImages.appendChild(videoEl);
      }
    });

  } else if (!hasCustomLayout) {
    modal.classList.add("multiple-images");

    mediaList.forEach(item => {
      if (item.type === "img") {
        const img = document.createElement("img");
        img.src = item.url;
        img.className = "modal-img";
        modalImages.appendChild(img);
      } else if (item.type === "video") {
        const videoEl = createMediaElement(item.url, "modal-video");
        modalImages.appendChild(videoEl);
      }
    });

    attachModalScrollHint(modalImages);

  } else {
    modal.classList.add("single-image");

    if (mediaList.length > 0) {
      const item = mediaList[0];
      if (item.type === "img") {
        const img = document.createElement("img");
        img.src = item.url;
        img.className = "modal-img";
        modalImages.appendChild(img);
      } else if (item.type === "video") {
        const videoEl = createMediaElement(item.url, "modal-video");
        modalImages.appendChild(videoEl);
      }
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
if (modal) {
  modal.addEventListener("click", e => {
    const img = e.target.closest("img");

    if (img && modalImages && modalImages.contains(img)) {
      imageModalImg.src = img.src;
      imageModal.classList.add("active");
    }
  });
}

/* CLOSE FULLSCREEN IMAGE (click outside image) */
if (imageModal) {
  imageModal.addEventListener("click", () => {
    imageModal.classList.remove("active");
  });
}

/* CLOSE FULLSCREEN IMAGE (button) */
if (imageModalClose) {
  imageModalClose.addEventListener("click", e => {
    e.stopPropagation();
    imageModal.classList.remove("active");
  });
}

/* =======================
   CLOSE ALL MODALS
   ======================= */

function closeAllModals() {
  if (modal) modal.classList.remove("active");
  if (modalImages) modalImages.classList.remove("scrolled");
  if (imageModal) imageModal.classList.remove("active");

  // 🔥 Unlock body scrolling when modal closes
  document.body.classList.remove("modal-open");
}

document.addEventListener("click", e => {
  if (
    e.target.closest(".close-modal") ||
    e.target.closest(".fechar") ||
    e.target.classList.contains("modal")
  ) {
    closeAllModals();
  }
});

/* ESC key close */
document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    closeAllModals();
  }
});

/* CAROUSEL CONTROLS */

if (prevBtn) {
  prevBtn.onclick = () => {
    const slides = modalImages.querySelectorAll(".carousel-image");
    if (!slides.length) return;

    slides[currentIndex].classList.remove("active");
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    slides[currentIndex].classList.add("active");
  };
}

if (nextBtn) {
  nextBtn.onclick = () => {
    const slides = modalImages.querySelectorAll(".carousel-image");
    if (!slides.length) return;

    slides[currentIndex].classList.remove("active");
    currentIndex = (currentIndex + 1) % slides.length;
    slides[currentIndex].classList.add("active");
  };
}

/* RIGHT CLICK BLOCK */

document.addEventListener("contextmenu", e => e.preventDefault());

/*🡻🡻🡻 Hero Custom Cursor Glow Logic 🡻🡻🡻*/

const heroSection = document.querySelector(".hero");
const heroCursorGlow = document.getElementById("heroCursorGlow");

if (heroSection && heroCursorGlow) {
  heroSection.addEventListener("mousemove", (e) => {
    const rect = heroSection.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    heroCursorGlow.style.left = `${x}px`;
    heroCursorGlow.style.top = `${y}px`;
    heroCursorGlow.style.opacity = "1";
  });

  heroSection.addEventListener("mouseleave", () => {
    heroCursorGlow.style.opacity = "0";
  });
}