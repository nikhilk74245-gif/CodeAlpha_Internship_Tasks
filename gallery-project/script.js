(function () {
  "use strict";

  // ---- State ----
  let activeFilter = "all";
  let visibleItems = [...galleryData];   // items currently shown by filter
  let currentIndex = 0;                  // index within visibleItems, used by lightbox

  // ---- DOM refs ----
  const galleryEl = document.getElementById("gallery");
  const emptyStateEl = document.getElementById("emptyState");
  const filterButtons = document.querySelectorAll(".filter-pill");

  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxTitle = document.getElementById("lightboxTitle");
  const lightboxCategory = document.getElementById("lightboxCategory");
  const lightboxCurrent = document.getElementById("lightboxCurrent");
  const lightboxTotal = document.getElementById("lightboxTotal");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxBackdrop = document.getElementById("lightboxBackdrop");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");
  const filmstrip = document.getElementById("filmstrip");

  let lastFocusedElement = null;

  // ---- Render gallery grid ----
  function renderGallery() {
    galleryEl.innerHTML = "";

    if (visibleItems.length === 0) {
      emptyStateEl.hidden = false;
      return;
    }
    emptyStateEl.hidden = true;

    visibleItems.forEach((item, i) => {
      const fig = document.createElement("figure");
      fig.className = "gallery-item";
      fig.tabIndex = 0;
      fig.setAttribute("role", "button");
      fig.setAttribute("aria-label", `Open ${item.title} (${item.label}) in viewer`);
      fig.style.animationDelay = `${Math.min(i * 0.04, 0.5)}s`;
      fig.dataset.index = i;

      fig.innerHTML = `
        <span class="item-index">${String(item.id).padStart(2, "0")}</span>
        <img src="${item.src}" alt="${item.title} — ${item.label} photograph" loading="lazy">
        <figcaption class="item-overlay">
          <span class="item-title">${item.title}</span>
          <span class="item-category" data-cat="${item.category}">${item.label}</span>
        </figcaption>
      `;

      fig.addEventListener("click", () => openLightbox(i));
      fig.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openLightbox(i);
        }
      });

      galleryEl.appendChild(fig);
    });
  }

  // ---- Filtering ----
  function applyFilter(filter) {
    activeFilter = filter;

    filterButtons.forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.filter === filter);
    });

    visibleItems = filter === "all"
      ? [...galleryData]
      : galleryData.filter((item) => item.category === filter);

    renderGallery();
  }

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => applyFilter(btn.dataset.filter));
  });

  // ---- Lightbox ----
  function buildFilmstrip() {
    filmstrip.innerHTML = "";
    visibleItems.forEach((item, i) => {
      const thumb = document.createElement("div");
      thumb.className = "filmstrip-thumb";
      thumb.dataset.index = i;
      thumb.innerHTML = `<img src="${item.src}" alt="">`;
      thumb.addEventListener("click", () => showImage(i));
      filmstrip.appendChild(thumb);
    });
  }

  function showImage(index) {
    // wrap around
    const total = visibleItems.length;
    currentIndex = ((index % total) + total) % total;
    const item = visibleItems[currentIndex];

    lightboxImg.style.opacity = 0;
    // small fade for smooth transition between images
    window.requestAnimationFrame(() => {
      lightboxImg.src = item.src;
      lightboxImg.alt = `${item.title} — ${item.label} photograph`;
      lightboxImg.onload = () => { lightboxImg.style.opacity = 1; };
    });

    lightboxTitle.textContent = item.title;
    lightboxCategory.textContent = item.label;
    lightboxCurrent.textContent = String(currentIndex + 1).padStart(2, "0");
    lightboxTotal.textContent = String(total).padStart(2, "0");

    // sync filmstrip highlight
    [...filmstrip.children].forEach((thumb, i) => {
      thumb.classList.toggle("is-current", i === currentIndex);
    });
    const activeThumb = filmstrip.children[currentIndex];
    if (activeThumb) {
      activeThumb.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }

  function openLightbox(index) {
    lastFocusedElement = document.activeElement;
    buildFilmstrip();
    showImage(index);
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocusedElement) lastFocusedElement.focus();
  }

  function showNext() { showImage(currentIndex + 1); }
  function showPrev() { showImage(currentIndex - 1); }

  lightboxClose.addEventListener("click", closeLightbox);
  lightboxBackdrop.addEventListener("click", closeLightbox);
  lightboxNext.addEventListener("click", showNext);
  lightboxPrev.addEventListener("click", showPrev);

  // ---- Keyboard navigation ----
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") showNext();
    if (e.key === "ArrowLeft") showPrev();
  });

  // ---- Touch swipe support ----
  let touchStartX = 0;
  lightbox.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener("touchend", (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const delta = touchEndX - touchStartX;
    if (Math.abs(delta) > 50) {
      delta < 0 ? showNext() : showPrev();
    }
  }, { passive: true });

  // ---- Init ----
  renderGallery();
})();
