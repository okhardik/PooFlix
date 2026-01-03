// --- CONFIGURATION ---
const row = document.getElementById("episodeRow");
const continueRow = document.getElementById("continueRow");
const continueSection = document.getElementById("continueSection");
const modal = document.getElementById("playerModal");
const iframe = document.getElementById("videoFrame");
const closeBtn = document.getElementById("closeBtn");

// Hero Elements
const heroTitle = document.getElementById("heroTitle");
const heroDesc = document.getElementById("heroDesc");
const heroBg = document.getElementById("hero");
const heroBtn = document.getElementById("heroPlayBtn");
const heroTag = document.querySelector(".tag");

let allEpisodes = [];

// --- LOAD DATA ---
fetch("episodes.json")
  .then(res => res.json())
  .then(data => {
    allEpisodes = data;
    initApp();
  })
  .catch(err => console.error("Error:", err));

function initApp() {
  // 1. Check History
  const lastWatchedId = localStorage.getItem("pooflix_last_watched");
  
  // 2. Setup Hero (Last watched OR First episode)
  let heroEp = allEpisodes[0];
  if (lastWatchedId) {
    const found = allEpisodes.find(e => e.driveId === lastWatchedId);
    if (found) {
      heroEp = found;
      heroTag.classList.add("visible"); // Show "NOW WATCHING" tag
      heroBtn.innerText = "▶ Continue Episode";
    }
  }
  updateHero(heroEp);

  // 3. Build "All Episodes" List
  allEpisodes.forEach(ep => {
    createCard(ep, row);
  });

  // 4. Build "Continue Watching" List (If history exists)
  updateContinueRow();
}

function updateHero(ep) {
  heroTitle.innerText = ep.title;
  heroDesc.innerText = ep.desc;
  heroBg.style.backgroundImage = `url('${ep.image}')`;
  heroBtn.onclick = () => playVideo(ep);
}

function createCard(ep, container) {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <img src="${ep.image}" loading="lazy" alt="${ep.title}">
    <div class="card-info">${ep.title}</div>
  `;
  card.onclick = () => playVideo(ep);
  container.appendChild(card);
}

function updateContinueRow() {
  const lastId = localStorage.getItem("pooflix_last_watched");
  if(!lastId) return;

  const ep = allEpisodes.find(e => e.driveId === lastId);
  if(ep) {
    continueSection.classList.remove("hidden");
    continueRow.innerHTML = ""; // Clear
    createCard(ep, continueRow); // Add card
  }
}

// --- PLAYER LOGIC ---
function playVideo(ep) {
  // 1. Save to History
  localStorage.setItem("pooflix_last_watched", ep.driveId);
  
  // 2. Update UI immediately
  updateHero(ep);
  updateContinueRow();

  // 3. Show Player
  modal.classList.remove("hidden");
  iframe.src = `https://drive.google.com/file/d/${ep.driveId}/preview`;

  // 4. Fullscreen & Landscape Logic
  const elem = document.documentElement;
  if (elem.requestFullscreen) elem.requestFullscreen().catch(e => {});
  if (screen.orientation && screen.orientation.lock) {
    screen.orientation.lock("landscape").catch(e => {});
  }
}

// --- CLOSE LOGIC ---
closeBtn.onclick = () => {
  iframe.src = "";
  modal.classList.add("hidden");
  
  if (document.exitFullscreen) document.exitFullscreen().catch(e=>{});
  if (screen.orientation && screen.orientation.unlock) screen.orientation.unlock();
};
