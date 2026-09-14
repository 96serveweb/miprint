AOS.init({
  duration: 700,
  once: true,
  offset: 50
});

new Swiper(".labGallery", {
  loop: true,
  speed: 850,
  autoplay: {
    delay: 4200,
    disableOnInteraction: false
  },
  effect: "slide",
  grabCursor: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true
  },
  navigation: {
    nextEl: ".gallery-next",
    prevEl: ".gallery-prev"
  }
});


new Swiper(".heroBackground", {
  loop: true,
  speed: 1400,
  effect: "fade",
  allowTouchMove: false,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false
  },
  fadeEffect: {
    crossFade: true
  }
});

// =========================
// YEAR GALLERY
// =========================

const galleryYears =
  document.getElementById("galleryYears");

const yearGalleryGrid =
  document.getElementById("yearGalleryGrid");

const galleryEmpty =
  document.getElementById("galleryEmpty");


const GALLERY_SUPABASE_URL =
  "https://gwkcpbncazaeuiqdxqyn.supabase.co";

const GALLERY_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3a2NwYm5jYXphZXVpcWR4cXluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2ODgyMzAsImV4cCI6MjEwMzI2NDIzMH0.bA0AwTwXn9TAK3szVxwiC9QQyRde3Dyt0DrSXABFQ1w";

const publicGalleryClient =
  supabase.createClient(
    GALLERY_SUPABASE_URL,
    GALLERY_SUPABASE_ANON_KEY
  );

let galleryImages = [];


function renderGalleryYear(year) {

  const images =
    galleryImages.filter(
      image =>
        Number(image.year) === Number(year)
    );

  yearGalleryGrid.innerHTML =
    images.map(image => `
      <article class="year-gallery-item">
        <img
          src="${image.image_url}"
          alt="${image.alt_text || "Gallery image"}"
          loading="lazy"
        >
      </article>
    `).join("");


  document
    .querySelectorAll(".gallery-year-btn")
    .forEach(button => {

      button.classList.toggle(
        "active",
        Number(button.dataset.year) === Number(year)
      );

    });
}


function renderGalleryYears() {

  const years = [
    ...new Set(
      galleryImages.map(
        image => Number(image.year)
      )
    )
  ].sort((a, b) => a - b);


  if (!years.length) {

    galleryYears.innerHTML = "";
    yearGalleryGrid.innerHTML = "";

    galleryYears.style.display = "none";
    yearGalleryGrid.style.display = "none";

    galleryEmpty.hidden = false;

    return;
  }


  galleryEmpty.hidden = true;

  galleryYears.style.display = "flex";
  yearGalleryGrid.style.display = "grid";


  galleryYears.innerHTML =
    years.map(year => `
      <button
        type="button"
        class="gallery-year-btn"
        data-year="${year}"
      >
        ${year}
      </button>
    `).join("");


  renderGalleryYear(
    years[years.length - 1]
  );
}


galleryYears.addEventListener(
  "click",
  event => {

    const button =
      event.target.closest(
        ".gallery-year-btn"
      );

    if (!button) return;

    renderGalleryYear(
      Number(button.dataset.year)
    );

  }
);


async function loadPublicGallery() {

  const {
    data,
    error
  } = await publicGalleryClient
    .from("gallery_images")
    .select(
      "id,image_url,year,alt_text,created_at"
    )
    .order(
      "created_at",
      { ascending: false }
    );


  if (error) {

    console.error(
      "Gallery load error:",
      error
    );

    galleryEmpty.hidden = false;

    return;
  }


  galleryImages =
    data || [];

  renderGalleryYears();
}


loadPublicGallery();