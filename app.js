const allEpisodesRow = document.getElementById("allEpisodesRow");
const continueRow = document.getElementById("continueRow");
const continueSection = document.getElementById("continueSection");
const modal = document.getElementById("playerModal");
const iframe = document.getElementById("videoFrame");
const closeBtn = document.getElementById("closeBtn");

// Load Data
fetch("episodes.json")
  .then(res => res.json())
  .then(episodes => {
    // 1. Setup Hero Section (Random or First episode)
    setupHero(episodes[0]);

    // 2. Render All Episodes
    episodes.forEach(ep => createCard(ep, allEpisodesRow));

    // 3. Render Continue Watching
    loadHistory(episodes);
  });

// Create Card UI
function createCard(ep, container, isHistory = false) {
  const card = document.createElement("div");
  card.className = "card";
  // Fallback if no image provided in JSON
  const imgUrl = ep.image || 'https://via.placeholder.com/300x169/333/fff?text=No+Image';
  card.style.backgroundImage = `url('${imgUrl}')`;

  card.innerHTML = `
    <div class="card-info">
      <h3>${ep.title}</h3>
    </div>
    ${isHistory ? '<div class="progress-bar"><div class="progress-fill"></div></div>' : ''}
  `;

  card.onclick = () => playEpisode(ep);
  container.appendChild(card);
}

// Hero Logic
function setupHero(ep) {
  const hero = document.getElementById("hero");
  const bg = ep.image || '#111';
  hero.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.9)), url('${bg}')`;
  
  document.getElementById("heroTitle").innerText = ep.title;
  document.getElementById("heroDesc").innerText = ep.desc || "Watch this amazing episode now.";
  document.getElementById("heroPlayBtn").onclick = () => playEpisode(ep);
}

// Play Logic & Save History
function playEpisode(ep) {
  // Update History in LocalStorage
  let history = JSON.parse(localStorage.getItem('watchHistory')) || [];
  
  // Remove duplicate if exists, push to front
  history = history.filter(item => item.driveId !== ep.driveId);
  history.unshift(ep.driveId); 
  
  // Keep only last 10
  if(history.length > 10) history.pop();
  
  localStorage.setItem('watchHistory', JSON.stringify(history));

  // Open Player
  document.getElementById("playerTitle").innerText = ep.title;
  iframe.src = `https://drive.google.com/file/d/${ep.driveId}/preview`;
  modal.classList.remove("hidden");
  
  // Refresh history row for next time
  loadHistory(episodesCache);
}

// Load History Row
let episodesCache = []; // Store json data globally
fetch("episodes.json").then(r=>r.json()).then(d => { episodesCache = d; });

function loadHistory(allEpisodes) {
  const historyIds = JSON.parse(localStorage.getItem('watchHistory')) || [];
  continueRow.innerHTML = ""; // Clear existing

  if (historyIds.length === 0) {
    continueSection.classList.add("hidden");
    return;
  }

  continueSection.classList.remove("hidden");

  historyIds.forEach(id => {
    const ep = allEpisodes.find(e => e.driveId === id);
    if (ep) createCard(ep, continueRow, true);
  });
}

// Close Modal logic
closeBtn.onclick = () => {
  iframe.src = ""; // Stop audio
  modal.classList.add("hidden");
  location.reload(); // Refresh to update "Continue Watching" row instantly
};
