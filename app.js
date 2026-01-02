const row = document.getElementById("episodeRow");
const modal = document.getElementById("playerModal");
const iframe = document.getElementById("videoFrame");
const closeBtn = document.getElementById("closeBtn");
const heroTitle = document.getElementById("heroTitle");
const heroDesc = document.getElementById("heroDesc");
const heroBtn = document.getElementById("heroPlayBtn");
const errorMsg = document.getElementById("loadingError");

// FETCH AND LOAD
fetch("episodes.json")
  .then(response => {
    if (!response.ok) throw new Error("HTTP error " + response.status);
    return response.json();
  })
  .then(data => {
    // 1. Load Hero (First item)
    if(data.length > 0) {
      const first = data[0];
      heroTitle.innerText = first.title;
      heroDesc.innerText = first.desc;
      heroBtn.onclick = () => openPlayer(first.driveId);
      
      // Update Hero Background if image exists
      if(first.image) {
        document.getElementById("hero").style.backgroundImage = 
          `linear-gradient(rgba(0,0,0,0), var(--bg)), url('${first.image}')`;
      }
    }

    // 2. Load Grid
    data.forEach(ep => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${ep.image || 'https://via.placeholder.com/300x169/000000/FFFFFF/?text=PooFlix'}" alt="Thumb">
        <div class="card-title">${ep.title}</div>
      `;
      card.onclick = () => openPlayer(ep.driveId);
      row.appendChild(card);
    });
  })
  .catch(err => {
    console.error("CRITICAL ERROR:", err);
    errorMsg.style.display = "block";
    errorMsg.innerText = "Error: JSON file is broken. Check Console (F12).";
  });

// PLAYER FUNCTIONS
function openPlayer(driveId) {
  // Use preview URL for best embed compatibility
  iframe.src = `https://drive.google.com/file/d/${driveId}/preview`;
  modal.classList.remove("hidden");
}

closeBtn.onclick = () => {
  iframe.src = "";
  modal.classList.add("hidden");
};

// Close on background click
document.querySelector(".modal-bg").onclick = closeBtn.onclick;
