const API_BASE = "https://api.imdbapi.dev";

// ── DOM REFERENCES ──
const carousel = document.getElementById("carousel");
const stateMsg = document.getElementById("state-msg");
const stateText = document.getElementById("state-text");
const bg = document.getElementById("bg-container");
const titleEl = document.getElementById("movie-title");
const metaEl = document.getElementById("meta-row");
const descEl = document.getElementById("movie-desc");
const searchInput = document.getElementById("search-input");
const btnLeft = document.getElementById("btn-left");
const btnRight = document.getElementById("btn-right");

let movies = [];
let selectedMovie = null;

function getPoster(movie) {
  return movie.primaryImage?.url || "";
}

function showState(icon, message) {
  stateMsg.classList.add("visible");
  stateMsg.querySelector(".state-icon").textContent = icon;
  stateText.textContent = message;
  carousel.innerHTML = "";
}

function hideState() {
  stateMsg.classList.remove("visible");
}

function setBackground(url) {
  bg.style.backgroundImage = url ? `url(${url})` : "none";
}

// ────────────────────────────────
// UI — MOVIE INFO PANEL
// ────────────────────────────────
function displayMovieInfo(movie) {
  if (!movie) return;

  titleEl.textContent =
    movie.primaryTitle || movie.originalTitle || "Unknown Title";

  const parts = [];
  const rating = movie.rating?.aggregateRating;
  if (rating) parts.push(`<span class="imdb-badge">IMDb</span> ${rating}`);
  if (movie.startYear)
    parts.push(`<span class="meta-sep">•</span> ${movie.startYear}`);

  let runtime = "";
  const runtimeSeconds = movie.runtimeSeconds || 0;
  if (runtimeSeconds > 0) {
    const totalMinutes = Math.round(runtimeSeconds / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    runtime =
      hours > 0
        ? minutes > 0
          ? `${hours}h ${minutes}m`
          : `${hours}h`
        : `${minutes}m`;
  }

  if (runtime) parts.push(`<span class="meta-sep">|</span> ${runtime}`);
  console.log(runtime);
  const genre = (movie.genres || [])[0];
  if (genre) parts.push(`<span class="meta-sep">|</span> ${genre}`);
  console.log(movie);
  metaEl.innerHTML = parts.join(" ");

  const plot = movie.plot || "";
  descEl.textContent = plot;

  setBackground(getPoster(movie));
}

// ────────────────────────────────
// API — FETCH SINGLE MOVIE DETAIL
// ────────────────────────────────
async function fetchMovieDetail(movie) {
  if (movie.detailLoaded) return;
  try {
    const res = await fetch(`${API_BASE}/titles/${movie.id}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const detail = await res.json();
    Object.assign(movie, detail);
    movie.detailLoaded = true;
  } catch (err) {
    console.error(`Failed to load detail for ${movie.id}:`, err);
  }
}

// ────────────────────────────────
// UI — CARDS
// ────────────────────────────────
function createCard(movie) {
  const card = document.createElement("div");
  card.className = "movie-card";
  if (selectedMovie && movie.id === selectedMovie.id)
    card.classList.add("selected");

  const img = document.createElement("img");
  img.src = getPoster(movie);
  img.alt = movie.primaryTitle || "";
  img.loading = "lazy";
  img.onerror = () => {
    img.src =
      'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="300"><rect width="200" height="300" fill="%23222"/><text x="50%" y="50%" fill="%23666" font-size="13" text-anchor="middle" dominant-baseline="middle">No Image</text></svg>';
  };

  const label = document.createElement("div");
  label.className = "card-title";
  label.textContent = movie.primaryTitle || "";

  card.appendChild(img);
  card.appendChild(label);

  card.addEventListener("mouseenter", async () => {
    await fetchMovieDetail(movie);
    displayMovieInfo(movie);
  });

  card.addEventListener("mouseleave", () => {
    if (selectedMovie) displayMovieInfo(selectedMovie);
  });

  card.addEventListener("click", async () => {
    await fetchMovieDetail(movie);
    selectedMovie = movie;
    document
      .querySelectorAll(".movie-card")
      .forEach((c) => c.classList.remove("selected"));
    card.classList.add("selected");
    displayMovieInfo(movie);
  });

  return card;
}

function renderCards(list) {
  carousel.innerHTML = "";
  list.forEach((movie) => carousel.appendChild(createCard(movie)));
}

// ────────────────────────────────
// API — FETCH MOVIE LIST
// ────────────────────────────────
async function fetchMovies(query = "") {
  showState("⏳", "Loading...");
  try {
    let url = query
      ? `${API_BASE}/search/titles?query=${encodeURIComponent(query)}&limit=50`
      : `${API_BASE}/titles?limit=50&titleType=MOVIE`;

    const res = await fetch(url);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `HTTP ${res.status}`);
    }

    const data = await res.json();
    movies = data.titles || [];

    if (!movies.length) {
      showState("🔍", "No results found");
      titleEl.textContent = "—";
      metaEl.innerHTML = "";
      descEl.textContent = "";
      setBackground("");
      return;
    }
    const carouselMovies = movies.slice(0, 20);
    hideState();
    selectedMovie = carouselMovies[0];
    // console.log(carouselMovies.length);
    await fetchMovieDetail(selectedMovie);
    renderCards(carouselMovies);
    displayMovieInfo(selectedMovie);
  } catch (err) {
    showState("⚠️", `Something went wrong: ${err.message}`);
  }
}

// ────────────────────────────────
// CAROUSEL SCROLL BUTTONS
// ────────────────────────────────
function getScrollAmount() {
  const card = carousel.querySelector(".movie-card");
  const gap = 22;
  return card ? (card.offsetWidth + gap) * 3 : 300;
}

btnLeft.addEventListener("click", () => {
  carousel.scrollBy({ left: -getScrollAmount(), behavior: "smooth" });
});
btnRight.addEventListener("click", () => {
  carousel.scrollBy({ left: getScrollAmount(), behavior: "smooth" });
});

// ────────────────────────────────
// SEARCH
// ────────────────────────────────
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const query = searchInput.value.trim();
    fetchMovies(query || null);
  }
});

// ────────────────────────────────
// INIT
// ────────────────────────────────
fetchMovies();
