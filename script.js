const app = document.getElementById("app");
const STORAGE_KEY = "betterAppCatches";
const LURES = ["Workhorse", "Mini", "Mesh", "Darkhorse", "Karashi", "Swim Jig", "Other"];
const SPECIES = ["Largemouth Bass", "Smallmouth Bass", "Spotted Bass"];
const WEIGHTS = ["<1 lb", "1 lb", "2 lb", "3 lb", "4 lb", "5 lb", "6 lb", "7 lb", "8 lb", "9 lb", "10 lb", "11 lb", "12 lb", "13 lb", "14 lb", "15 lb+"];
const LENGTHS = Array.from({ length: 23 }, (_, i) => `${i + 8}\"`).concat("31\"+");

function getCatches() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (error) {
    return [];
  }
}

function saveCatches(catches) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(catches));
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function optionList(items, selected = "", placeholder = "") {
  const placeholderOption = placeholder ? `<option value="">${placeholder}</option>` : "";
  return placeholderOption + items.map(item => {
    const safe = escapeHtml(item);
    return `<option value="${safe}" ${item === selected ? "selected" : ""}>${safe}</option>`;
  }).join("");
}

function header(tagline = "BUILT ON THE WATER") {
  return `
    <section class="hero">
<button class="brand brand-button" type="button" onclick="showHome()">2°BAITS<span>™</span></button>
      <div class="tagline">${escapeHtml(tagline)}</div>
    </section>
  `;
}

function showHome() {
  const catches = getCatches();
  app.innerHTML = `
    ${header()}
    <section class="grid">
      <button class="card primary" id="logCatch" type="button">
        <div class="icon">🐟</div>
        <h2>Log a Catch</h2>
        <p>Record a new fish</p>
      </button>
      <button class="card" id="myTrips" type="button">
        <div class="icon">📍</div>
        <h2>My Trips</h2>
        <p>${catches.length} catches saved</p>
      </button>
      <button class="card" id="stats" type="button">
        <div class="icon">📊</div>
        <h2>Statistics</h2>
        <p>Analyze your data</p>
      </button>
      <button class="card" id="settings" type="button">
        <div class="icon">⚙️</div>
        <h2>Settings</h2>
        <p>Preferences & gear</p>
      </button>
    </section>
    <footer>
      <div class="small-logo">2°</div>
      <p>BUILT BY ANGLERS. FOR ANGLERS.</p>
    </footer>
  `;

  document.getElementById("logCatch").addEventListener("click", () => showCatchForm());
  document.getElementById("myTrips").addEventListener("click", showCatches);
  document.getElementById("stats").addEventListener("click", showStats);
  document.getElementById("settings").addEventListener("click", showSettings);
}

function showCatchForm(editIndex = null) {
  const catches = getCatches();
  const editing = editIndex !== null;
  const oldCatch = editing ? catches[editIndex] || {} : {};

  app.innerHTML = `
    ${header(editing ? "EDIT CATCH" : "LOG A CATCH")}
    <section class="form-card">
      <h2>${editing ? "Edit Catch" : "New Catch"}</h2>
      <form id="catchForm">
      <label for="catchDate">Date</label>
<input id="catchDate" type="date" value="${oldCatch.catchDate || new Date().toISOString().slice(0,10)}" />

<label for="catchTime">Time</label>
<input id="catchTime" type="time" value="${oldCatch.catchTime || new Date().toTimeString().slice(0,5)}" />

 <label for="waterTemp">Water Temp (°F)</label>
<input id="waterTemp" type="number" min="32" max="120" placeholder="Ex: 72" value="${oldCatch.waterTemp || ""}" />      
<label for="weather">Weather</label>
<select id="weather">${optionList(["Sunny", "Partly Cloudy", "Cloudy", "Rain", "Storm"], oldCatch.weather || "", "Select Weather")}</select>
<label for="waterClarity">Water Clarity</label>
<select id="waterClarity">${optionList(["Clear", "Slightly Stained", "Stained", "Muddy"], oldCatch.waterClarity || "", "Select Water Clarity")}</select>
<label for="wind">Wind</label>
<select id="wind">${optionList(["Calm", "Light", "Moderate", "Strong"], oldCatch.wind || "", "Select Wind")}</select>
<label for="airTemp">Air Temp (°F)</label>
<input id="airTemp" type="number" min="-20" max="130" placeholder="Ex: 78" value="${oldCatch.airTemp || ""}" />
<label for="species">Bass Type</label>
        <select id="species">${optionList(SPECIES, oldCatch.species || "Largemouth Bass")}</select>

        <label for="weight">Weight</label>
        <select id="weight">${optionList(WEIGHTS, oldCatch.weight || "", "Select Weight")}</select>

        <label for="length">Length</label>
        <select id="length">${optionList(LENGTHS, oldCatch.length || "", "Select Length")}</select>

        <label for="lake">Lake / Pond</label>
        <input id="lake" type="text" placeholder="Where did you catch it?" value="${escapeHtml(oldCatch.lake || "")}" />

       <label for="baitColor">Bait Color</label>
<input id="baitColor" type="text" placeholder="Ex: Green Pumpkin Shad" value="${escapeHtml(oldCatch.baitColor || "")}" />
        <label for="lure">Lure</label>
        <select id="lure">${optionList(LURES, oldCatch.lure || "", "Select Lure")}</select>

        <label for="notes">Notes</label>
        <textarea id="notes" placeholder="Water color, cover, retrieve, etc.">${escapeHtml(oldCatch.notes || "")}</textarea>

        <button class="action primary-action" type="submit">${editing ? "Save Changes" : "Save Catch"}</button>
        <button class="action" id="backHome" type="button">Back Home</button>
      </form>
    </section>
  `;

  document.getElementById("catchForm").addEventListener("submit", event => {
    event.preventDefault();

    const savedCatch = {
      waterTemp: document.getElementById("waterTemp").value,
      weather: document.getElementById("weather").value,
      wind: document.getElementById("wind").value,
      airTemp: document.getElementById("airTemp").value,
      waterClarity: document.getElementById("waterClarity").value,
      catchDate: document.getElementById("catchDate").value,
catchTime: document.getElementById("catchTime").value,
      species: document.getElementById("species").value,
      weight: document.getElementById("weight").value,
      length: document.getElementById("length").value,
      lake: document.getElementById("lake").value.trim(),
      lure: document.getElementById("lure").value,
      baitColor: document.getElementById("baitColor").value,
      notes: document.getElementById("notes").value.trim(),
      date: oldCatch.date || new Date().toLocaleDateString()
    };

    if (editing) catches[editIndex] = savedCatch;
    else catches.push(savedCatch);

    saveCatches(catches);
    showCatches();
  });

  document.getElementById("backHome").addEventListener("click", showHome);
}

function showCatches() {
  const catches = getCatches();
  app.innerHTML = `
    ${header("MY TRIPS")}
    <section class="form-card">
      <h2>Saved Catches</h2>
      ${catches.length === 0 ? `<p class="empty">No catches logged yet.</p>` : catches.map((catchItem, index) => `
        <article class="catch-card">
          <h3>${escapeHtml(catchItem.species || "Bass")}</h3>
          <p><strong>Date:</strong> ${escapeHtml(catchItem.date || "")}</p>
          <p><strong>Weight:</strong> ${escapeHtml(catchItem.weight || "Not entered")}</p>
          <p><strong>Length:</strong> ${escapeHtml(catchItem.length || "Not entered")}</p>
          <p><strong>Lake / Pond:</strong> ${escapeHtml(catchItem.lake || "Not entered")}</p>
          <p><strong>Lure:</strong> ${escapeHtml(catchItem.lure || "Not entered")}</p>
          <p><strong>Notes:</strong> ${escapeHtml(catchItem.notes || "None")}</p>
          <div class="row">
            <button class="action editBtn" type="button" data-index="${index}">Edit</button>
            <button class="action danger deleteBtn" type="button" data-index="${index}">Delete</button>
          </div>
        </article>
      `).join("")}
      <button class="action primary-action" id="addCatch" type="button">Log Another Catch</button>
      <button class="action" id="backHome" type="button">Back Home</button>
    </section>
  `;

  document.getElementById("addCatch").addEventListener("click", () => showCatchForm());
  document.getElementById("backHome").addEventListener("click", showHome);
  document.querySelectorAll(".editBtn").forEach(button => {
    button.addEventListener("click", () => showCatchForm(Number(button.dataset.index)));
  });
  document.querySelectorAll(".deleteBtn").forEach(button => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.index);
      const updated = getCatches();
      updated.splice(index, 1);
      saveCatches(updated);
      showCatches();
    });
  });
}

function showStats() {
  const catches = getCatches();
  app.innerHTML = `
    ${header("STATISTICS")}
    <section class="form-card">
      <h2>Stats</h2>
      <div class="stat"><span>Total Catches</span><strong>${catches.length}</strong></div>
      <div class="stat"><span>Top Lure</span><strong>${escapeHtml(getTopLure(catches))}</strong></div>
      <div class="stat"><span>Most Recent</span><strong>${escapeHtml(catches.at(-1)?.date || "None yet")}</strong></div>
      <button class="action" id="backHome" type="button">Back Home</button>
    </section>
  `;
  document.getElementById("backHome").addEventListener("click", showHome);
}

function getTopLure(catches) {
  const counts = {};
  catches.forEach(catchItem => {
    if (catchItem.lure) counts[catchItem.lure] = (counts[catchItem.lure] || 0) + 1;
  });
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return top ? `${top[0]} (${top[1]})` : "None yet";
}

function showSettings() {
  app.innerHTML = `
    ${header("SETTINGS")}
    <section class="form-card">
      <h2>Settings</h2>
      <p class="empty">Gear and preferences will go here next.</p>
      <button class="action danger" id="clearData" type="button">Clear Saved Catches</button>
      <button class="action" id="backHome" type="button">Back Home</button>
    </section>
  `;
  document.getElementById("clearData").addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
    showHome();
  });
  document.getElementById("backHome").addEventListener("click", showHome);
}

if (app) showHome();
