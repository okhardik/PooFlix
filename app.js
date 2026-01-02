const grid = document.getElementById("episodeGrid");
const modal = document.getElementById("playerModal");
const iframe = document.getElementById("videoFrame");
const closeBtn = document.getElementById("closeBtn");

fetch("episodes.json")
  .then(res => res.json())
  .then(episodes => {
    episodes.forEach(ep => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <div class="thumbnail">▶</div>
        <h3>${ep.title}</h3>
      `;

      card.onclick = () => {
        iframe.src = `https://drive.google.com/file/d/${ep.driveId}/preview`;
        modal.classList.remove("hidden");
      };

      grid.appendChild(card);
    });
  });

closeBtn.onclick = () => {
  iframe.src = "";
  modal.classList.add("hidden");
};

modal.onclick = e => {
  if (e.target === modal) closeBtn.onclick();
};
