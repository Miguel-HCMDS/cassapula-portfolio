const searchInput = document.getElementById("projectSearch");
const tagSelect = document.getElementById("tagSelect");

const resultsSection = document.getElementById("resultsSection");
const resultsGrid = document.getElementById("resultsGrid");

/* =======================
   SHOW MORE (PER SECTION)
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

    showMoreText.textContent = expanded
      ? "Mostrar menos 🡹"
      : "Mostrar mais 🡻";
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
  const query = searchInput.value.toLowerCase();
  const selectedTag = tagSelect.value;

  resultsGrid.innerHTML = "";

  const matches = allProjectItems.filter(item => {
    const card = item.querySelector(".project-card");
    const title = card.dataset.title.toLowerCase();
    const tags = item.dataset.tags.split(",").map(t => t.trim());

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

searchInput.addEventListener("input", applyFilters);
tagSelect.addEventListener("change", applyFilters);

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

const prevBtn = modal.querySelector(".carousel-btn.prev");
const nextBtn = modal.querySelector(".carousel-btn.next");

let currentIndex = 0;

document.addEventListener("click", e => {
  const card = e.target.closest(".project-card");
  if (!card) return;

  const projectItem = card.closest(".project-item");
  const layout = card.dataset.layout || "single";

  const images = (card.dataset.images || "")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

  const videos = (card.dataset.videos || "")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

  const tags = projectItem.dataset.tags
    .split(",")
    .map(t => t.trim());

  const projectLink = card.dataset.link || "#";

  /* RESET MODAL */
  modal.classList.remove(
    "single-image",
    "single-carousel",
    "multiple-images"
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

  /* TAGS */
  let tagsContainer = modalRight.querySelector(".modal-tags");
  if (!tagsContainer) {
    tagsContainer = document.createElement("div");
    tagsContainer.className = "modal-tags";
    modalTitle.after(tagsContainer);
  }
  tagsContainer.innerHTML = "";
  tags.forEach(tag => {
    const span = document.createElement("span");
    span.className = "tag";
    span.textContent = tag;
    tagsContainer.appendChild(span);
  });

  /* CAROUSEL RESET */
  prevBtn.style.display = "none";
  nextBtn.style.display = "none";
  currentIndex = 0;

  /* LAYOUT DECISION */
  if (layout === "single-carousel" && (images.length + videos.length) > 1) {
    modal.classList.add("single-carousel");
    prevBtn.style.display = "flex";
    nextBtn.style.display = "flex";

    let index = 0;

    images.forEach(src => {
      const img = document.createElement("img");
      img.src = src;
      img.className = `carousel-image modal-img${index === 0 ? " active" : ""}`;
      modalImages.appendChild(img);
      index++;
    });

    videos.forEach(src => {
      const video = document.createElement("video");
      video.src = src;
      video.controls = true;
      video.className = `carousel-image modal-video${index === 0 ? " active" : ""}`;
      modalImages.appendChild(video);
      index++;
    });

  } else if ((images.length + videos.length) > 1) {
    modal.classList.add("multiple-images");

    images.forEach(src => {
      const img = document.createElement("img");
      img.src = src;
      img.className = "modal-img";
      modalImages.appendChild(img);
    });

    videos.forEach(src => {
      const video = document.createElement("video");
      video.src = src;
      video.controls = true;
      video.className = "modal-video";
      modalImages.appendChild(video);
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
      const video = document.createElement("video");
      video.src = videos[0];
      video.controls = true;
      video.className = "modal-video";
      modalImages.appendChild(video);
    }
  }
});

/* CLOSE MODAL */
closeModal.onclick = () => modal.classList.remove("active");

modal.addEventListener("click", e => {
  if (!e.target.closest(".modal-content")) {
    modal.classList.remove("active");
  }

  const img = e.target.closest("img");
  if (img && modalImages.contains(img)) {
    imageModalImg.src = img.src;
    imageModal.classList.add("active");
  }
});

/* FULLSCREEN IMAGE */
imageModal.onclick = () => imageModal.classList.remove("active");

/* CAROUSEL CONTROLS */
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

/* FECHAR BUTTON */
const fecharBtn = modal.querySelector(".modal-btn.fechar");
if (fecharBtn) {
  fecharBtn.addEventListener("click", () => {
    modal.classList.remove("active");
  });
}