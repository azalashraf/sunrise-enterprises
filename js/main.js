/**
 * SUNRISE ENTERPRISES - MAIN APPLICATION & 30-IMAGE REVOLVING ENGINE
 * File: js/main.js
 */

(function () {
  "use strict";

  const config = window.SITE_CONFIG;
  const data = window.PRODUCTS_DATA;
  const totalPerCat = config.carousel.imagesPerCategory || 30;

  // Stores active slide index (1..30) and interval timer for each of the 12 categories
  const carouselState = {};

  /**
   * Builds a clean, unique SVG Data URI placeholder whenever a client photo (1.jpg - 30.jpg)
   * has not been placed into the folder yet.
   */
  function generatePlaceholderDataURI(category, photoNumber) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#102A43"/>
          <stop offset="100%" stop-color="#173F63"/>
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#bg)"/>
      <circle cx="680" cy="110" r="140" fill="#FF941F" opacity="0.12"/>
      <rect x="44" y="44" width="712" height="512" rx="16" fill="none" stroke="#FF941F" stroke-width="2" stroke-opacity="0.4"/>
      <text x="400" y="185" text-anchor="middle" font-family="Arial, sans-serif" font-size="68">${category.icon}</text>
      <text x="400" y="265" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" font-weight="bold" fill="#FF941F" letter-spacing="2">SUNRISE ENTERPRISES CATALOGUE</text>
      <text x="400" y="325" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="#FFFFFF">${escapeXml(category.shortTitle)}</text>
      <rect x="270" y="365" width="260" height="54" rx="27" fill="#FF941F"/>
      <text x="400" y="400" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" font-weight="bold" fill="#102A43">PHOTOGRAPH #${photoNumber} OF ${totalPerCat}</text>
      <text x="400" y="485" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#BCCCDC">Replace at: assets/images/catalogue/${category.slug}/${photoNumber}.${config.carousel.imageExtension}</text>
    </svg>`;
    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
  }

  function escapeXml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /**
   * Returns the file path for a specific category photo (e.g. assets/images/catalogue/chairs/14.jpg)
   */
  function getCategoryPhotoPath(slug, index) {
    return `${config.carousel.baseImagePath}/${slug}/${index}.${config.carousel.imageExtension}`;
  }

  /**
   * Builds a direct WhatsApp inquiry link pre-filled with the category name
   */
  function getWhatsAppLink(customMessage) {
    const text = encodeURIComponent(
      customMessage || `Hello ${config.companyName}, I would like to inquire about your institutional products and services.`
    );
    if (config.contact.whatsappNumber) {
      return `https://wa.me/${config.contact.whatsappNumber}?text=${text}`;
    }
    return "#contact";
  }

  function getPhoneLink() {
    return config.contact.phoneDial ? `tel:${config.contact.phoneDial}` : "#contact";
  }

  /**
   * Populates all contact placeholders across Topbar, Contact Section, and Footer
   */
  function bindContactInformation() {
    document.querySelectorAll("[data-contact='phone-display']").forEach((el) => {
      el.textContent = config.contact.phoneDisplay;
    });
    document.querySelectorAll("[data-contact='whatsapp-display']").forEach((el) => {
      el.textContent = config.contact.whatsappDisplay;
    });
    document.querySelectorAll("[data-contact='email-display']").forEach((el) => {
      el.textContent = config.contact.email;
    });
    document.querySelectorAll("[data-contact='address-display']").forEach((el) => {
      el.textContent = config.contact.address;
    });

    document.querySelectorAll("[data-link='phone']").forEach((el) => {
      el.setAttribute("href", getPhoneLink());
    });
    document.querySelectorAll("[data-link='whatsapp']").forEach((el) => {
      el.setAttribute("href", getWhatsAppLink());
    });
    document.querySelectorAll("[data-link='email']").forEach((el) => {
      el.setAttribute(
        "href",
        config.contact.email.includes("@") ? `mailto:${config.contact.email}` : "#contact"
      );
    });
    document.querySelectorAll("[data-link='maps']").forEach((el) => {
      el.setAttribute("href", config.contact.mapsUrl || "#contact");
    });
  }

  /**
   * Renders the Hero Quick Category Pills
   */
  function renderHeroCategoryPills() {
    const container = document.getElementById("heroCategoryPills");
    if (!container) return;

    container.innerHTML = data.categories
      .map(
        (cat) => `
        <a href="#card-${cat.slug}" class="hero-pill">
          <span>${cat.icon}</span>
          <span>${cat.shortTitle}</span>
        </a>
      `
      )
      .join("");
  }

  /**
   * Renders all 12 Business Categories with a 30-Image Revolving Stage each
   */
  function renderRevolvingCatalogue(filterGroup = "all", searchQuery = "") {
    const grid = document.getElementById("revolvingCatalogueGrid");
    if (!grid) return;

    // Clear existing timers before re-rendering
    Object.keys(carouselState).forEach((slug) => {
      if (carouselState[slug] && carouselState[slug].timer) {
        clearInterval(carouselState[slug].timer);
      }
    });

    const normalizedSearch = searchQuery.trim().toLowerCase();

    const filtered = data.categories.filter((cat) => {
      const matchesGroup = filterGroup === "all" || cat.group === filterGroup;
      const matchesSearch =
        !normalizedSearch ||
        cat.title.toLowerCase().includes(normalizedSearch) ||
        cat.description.toLowerCase().includes(normalizedSearch) ||
        cat.specs.some((s) => s.toLowerCase().includes(normalizedSearch));
      return matchesGroup && matchesSearch;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align:center; padding: 48px; background:#fff; border-radius:12px;">
          <h3>No matching product categories found</h3>
          <p style="color:#486581; margin-top:8px;">Try clearing your search filter to view all 12 institutional categories.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered
      .map((cat) => {
        const initialPhotoPath = getCategoryPhotoPath(cat.slug, 1);
        const waLink = getWhatsAppLink(
          `Hello Sunrise Enterprises, I am interested in *${cat.title}*. Please share details.`
        );

        return `
        <article class="category-card" id="card-${cat.slug}" data-slug="${cat.slug}">
          <div class="revolving-stage" data-stage="${cat.slug}">
            <div class="stage-top-badges">
              <span class="badge-tag">${cat.icon} ${cat.badge}</span>
              <span class="badge-counter" id="counter-${cat.slug}">1 / ${totalPerCat}</span>
            </div>

            <button class="slide-nav-btn prev" type="button" aria-label="Previous image" data-action="prev" data-slug="${cat.slug}">&#10094;</button>
            <button class="slide-nav-btn next" type="button" aria-label="Next image" data-action="next" data-slug="${cat.slug}">&#10095;</button>

            <img
              id="img-${cat.slug}"
              class="revolving-img"
              src="${initialPhotoPath}"
              alt="${cat.title} - Photograph 1"
              loading="lazy"
            />

            <div class="stage-bottom-strip">
              <span><i class="auto-dot"></i>Auto-Revolving (${totalPerCat} Photos)</span>
              <span id="caption-${cat.slug}">Photo #1</span>
            </div>
          </div>

          <div class="card-body">
            <h3 class="card-title">${cat.title}</h3>
            <p class="card-desc">${cat.description}</p>

            <div class="spec-tags">
              ${cat.specs.map((spec) => `<span class="spec-tag">${spec}</span>`).join("")}
            </div>

            <div class="card-actions">
              <button type="button" class="btn btn-navy btn-sm" data-open-modal="${cat.slug}">
                View All ${totalPerCat} Photos
              </button>
              <a href="${waLink}" target="_blank" rel="noopener" class="btn btn-whatsapp btn-sm">
                WhatsApp Inquiry
              </a>
            </div>
          </div>
        </article>
      `;
      })
      .join("");

    // Initialize 30-image revolving state & error fallback for every rendered card
    filtered.forEach((cat, idx) => {
      initCategoryCarousel(cat, idx);
    });
  }

  /**
   * Initializes the 1..30 revolving image cycle for a single category card
   */
  function initCategoryCarousel(category, staggerIndex) {
    const slug = category.slug;
    const imgEl = document.getElementById(`img-${slug}`);
    const counterEl = document.getElementById(`counter-${slug}`);
    const captionEl = document.getElementById(`caption-${slug}`);
    const stageEl = document.querySelector(`[data-stage='${slug}']`);

    if (!imgEl) return;

    carouselState[slug] = {
      currentIndex: 1,
      paused: false,
      timer: null
    };

    // Fallback to clean generated SVG if client photo file does not exist yet
    imgEl.onerror = function () {
      const idx = carouselState[slug] ? carouselState[slug].currentIndex : 1;
      this.onerror = null;
      this.src = generatePlaceholderDataURI(category, idx);
    };

    function showSlide(targetIndex) {
      const state = carouselState[slug];
      if (!state) return;

      if (targetIndex > totalPerCat) targetIndex = 1;
      if (targetIndex < 1) targetIndex = totalPerCat;
      state.currentIndex = targetIndex;

      imgEl.onerror = function () {
        this.onerror = null;
        this.src = generatePlaceholderDataURI(category, state.currentIndex);
      };

      imgEl.src = getCategoryPhotoPath(slug, state.currentIndex);
      imgEl.alt = `${category.title} - Photograph ${state.currentIndex}`;

      if (counterEl) counterEl.textContent = `${state.currentIndex} / ${totalPerCat}`;
      if (captionEl) captionEl.textContent = `Photo #${state.currentIndex}`;
    }

    // Start revolving timer (staggered slightly so all 12 cards don't flip at the exact same millisecond)
    const intervalMs = (config.carousel.autoSlideMs || 2600) + (staggerIndex % 4) * 180;
    carouselState[slug].timer = setInterval(() => {
      if (!carouselState[slug].paused) {
        showSlide(carouselState[slug].currentIndex + 1);
      }
    }, intervalMs);

    // Pause on hover so institutional buyers can inspect a photo
    if (stageEl) {
      stageEl.addEventListener("mouseenter", () => {
        carouselState[slug].paused = true;
      });
      stageEl.addEventListener("mouseleave", () => {
        carouselState[slug].paused = false;
      });
    }

    carouselState[slug].showSlide = showSlide;
  }

  /**
   * Opens the 30-Image Modal Grid for any selected category
   */
  function openThirtyPhotoModal(slug) {
    const category = data.categories.find((c) => c.slug === slug);
    const modal = document.getElementById("thirtyPhotoModal");
    const modalTitle = document.getElementById("modalCategoryTitle");
    const modalGrid = document.getElementById("modalThirtyGrid");
    const modalWhatsappBtn = document.getElementById("modalWhatsappBtn");

    if (!category || !modal || !modalGrid) return;

    modalTitle.textContent = `${category.title} — All ${totalPerCat} Catalogue Photographs`;
    modalWhatsappBtn.setAttribute(
      "href",
      getWhatsAppLink(`Hello Sunrise Enterprises, I viewed your ${totalPerCat} catalogue images for *${category.title}* and would like to discuss our institutional requirement.`)
    );

    let tilesHtml = "";
    for (let i = 1; i <= totalPerCat; i++) {
      const fileUrl = getCategoryPhotoPath(category.slug, i);
      const fallbackUri = generatePlaceholderDataURI(category, i);
      tilesHtml += `
        <div class="photo-tile">
          <img
            src="${fileUrl}"
            alt="${category.title} Photo ${i}"
            loading="lazy"
            onerror="this.onerror=null;this.src='${fallbackUri}';"
          />
          <div class="photo-tile-caption">
            <span>${category.shortTitle}</span>
            <span>#${i} / ${totalPerCat}</span>
          </div>
        </div>
      `;
    }

    modalGrid.innerHTML = tilesHtml;
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeThirtyPhotoModal() {
    const modal = document.getElementById("thirtyPhotoModal");
    if (modal) {
      modal.classList.remove("open");
      document.body.style.overflow = "";
    }
  }

  /**
   * Renders the Services & Projects grids
   */
  function renderServicesAndProjects() {
    const servicesGrid = document.getElementById("servicesGrid");
    if (servicesGrid && data.services) {
      servicesGrid.innerHTML = data.services
        .map(
          (srv) => `
          <div class="info-card">
            <div class="info-icon">${srv.icon}</div>
            <span class="eyebrow" style="margin-bottom:8px;">${srv.category}</span>
            <h3>${srv.title}</h3>
            <p style="color:#486581; font-size:0.93rem; margin-bottom:16px;">${srv.description}</p>
            <a href="${getWhatsAppLink(`Hello Sunrise Enterprises, we require *${srv.title}* for our institution.`)}" target="_blank" rel="noopener" class="btn btn-orange btn-sm">
              Inquire on WhatsApp
            </a>
          </div>
        `
        )
        .join("");
    }

    const projectsGrid = document.getElementById("projectsGrid");
    if (projectsGrid && data.projects) {
      projectsGrid.innerHTML = data.projects
        .map(
          (proj) => `
          <div class="info-card">
            <span class="eyebrow">${proj.category}</span>
            <h3>${proj.title}</h3>
            <p style="font-size:0.86rem; font-weight:700; color:#173F63; margin-bottom:8px;">
              Institution: ${proj.client} | Location: ${proj.location}
            </p>
            <p style="color:#486581; font-size:0.92rem;">${proj.description}</p>
          </div>
        `
        )
        .join("");
    }
  }

  /**
   * Event Listeners for Carousel Prev/Next, Filter Pills, Search, and Modal
   */
  function bindEvents() {
    // Delegated clicks for Prev/Next slide buttons and Modal Open buttons
    document.addEventListener("click", (e) => {
      const navBtn = e.target.closest("[data-action]");
      if (navBtn) {
        const slug = navBtn.getAttribute("data-slug");
        const action = navBtn.getAttribute("data-action");
        const state = carouselState[slug];
        if (state && state.showSlide) {
          state.showSlide(action === "next" ? state.currentIndex + 1 : state.currentIndex - 1);
        }
        return;
      }

      const modalTrigger = e.target.closest("[data-open-modal]");
      if (modalTrigger) {
        openThirtyPhotoModal(modalTrigger.getAttribute("data-open-modal"));
        return;
      }

      if (e.target.id === "closeModalBtn" || e.target.id === "thirtyPhotoModal") {
        closeThirtyPhotoModal();
      }
    });

    // Escape key closes modal
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeThirtyPhotoModal();
    });

    // Category Group Filters
    const filterButtons = document.querySelectorAll("[data-filter]");
    const searchInput = document.getElementById("catalogueSearchInput");
    let activeGroup = "all";

    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        activeGroup = btn.getAttribute("data-filter");
        renderRevolvingCatalogue(activeGroup, searchInput ? searchInput.value : "");
      });
    });

    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        renderRevolvingCatalogue(activeGroup, e.target.value);
      });
    }

    // Mobile Menu Toggle
    const menuToggle = document.getElementById("mobileMenuToggle");
    const navLinks = document.getElementById("mainNavLinks");
    if (menuToggle && navLinks) {
      menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("open");
      });
      navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => navLinks.classList.remove("open"));
      });
    }
  }

  // Initialize on DOM Ready
  document.addEventListener("DOMContentLoaded", () => {
    bindContactInformation();
    renderHeroCategoryPills();
    renderRevolvingCatalogue();
    renderServicesAndProjects();
    bindEvents();
  });
})();
