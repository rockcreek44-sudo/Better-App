const app = document.getElementById("app");
const STORAGE_KEY = "betterAppCatches";

const lureOptions = ["Workhorse", "Mini", "Mesh", "Darkhorse", "Karashi", "Swim Jig", "Other"];

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}

function optionList(options, selectedValue = "", placeholder = "Select") {
  return `
    <option value="">${placeholder}</option>
    ${options.map(option => `
      <option value="${escapeHtml(option)}" ${option === selectedValue ? "selected" : ""}>${escapeHtml(option)}</option>
    `).join("")}
  `;
}

function getCatches() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveCatches(catches) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(catches));
}

function header(tagline = "BUILT ON THE WATER") {
  return `
    <section class="hero">
      <button class="brand brand-button" type="button" onclick="showHome()">2°BAITS<span>™</span></button>
      <div class="tagline">${tagline}</div>
    </section>
  `;
}

function showHome() {
  const catches = getCatches();

  app.innerHTML = `
    ${header()}
    <section class="grid">
      <button class="card primary" id="logCatch"><div class="icon">🐟</div><h2>Log a Catch</h2><p>Record a new fish</p></button>
      <button class="card" id="myTrips"><div class="icon">📍</div><h2>My Trips</h2><p>${catches.length} catches saved</p></button>
      <button class="card" id="stats"><div class="icon">📊</div><h2>Statistics</h2><p>Analyze your data</p></button>
      <button class="card" id="settings"><div class="icon">⚙️</div><h2>Settings</h2><p>Preferences & gear</p></button>
    </section>
    <footer><div class="small-logo">2°</div><p>BUILT BY ANGLERS. FOR ANGLERS.</p></footer>
  `;

  document.getElementById("logCatch").onclick = () => showCatchForm();
  document.getElementById("myTrips").onclick = showCatches;
  document.getElementById("stats").onclick = showStats;
  document.getElementById("settings").onclick = showSettings;
}

function showCatchForm(editIndex = null) {
  const catches = getCatches();
  const editing = editIndex !== null;
  const oldCatch = editing ? catches[editIndex] : {};

  app.innerHTML = `
    ${header(editing ? "EDIT CATCH" : "LOG A CATCH")}

    <section class="form-card">
      <h2>${editing ? "Edit Catch" : "New Catch"}</h2>

      <form id="catchForm">
        <label for="catchDate">Date</label>
        <input id="catchDate" type="date" value="${oldCatch.catchDate || new Date().toISOString().slice(0, 10)}" />

        <label for="catchTime">Time</label>
        <input id="catchTime" type="time" value="${oldCatch.catchTime || new Date().toTimeString().slice(0, 5)}" />

        <label for="waterTemp">Water Temp (°F)</label>
        <input id="waterTemp" type="number" min="32" max="120" placeholder="Ex: 72" value="${oldCatch.waterTemp || ""}" />

        <label for="weather">Weather</label>
        <select id="weather">${optionList(["Sunny", "Partly Cloudy", "Cloudy", "Rain", "Storm"], oldCatch.weather || "", "Select Weather")}</select>

        <label for="waterClarity">Water Clarity</label>
        <select id="waterClarity">${optionList(["Clear", "Slightly Stained", "Stained", "Muddy"], oldCatch.waterClarity || "", "Select Water Clarity")}</select>

        <label for="windDirection">Wind Direction</label>
        <select id="windDirection">${optionList(["N", "NE", "E", "SE", "S", "SW", "W", "NW", "Variable"], oldCatch.windDirection || "", "Select Wind Direction")}</select>

        <label for="wind">Wind</label>
        <select id="wind">${optionList(["Calm", "Light", "Moderate", "Strong"], oldCatch.wind || "", "Select Wind")}</select>

        <label for="barometricTrend">Barometric Trend</label>
        <select id="barometricTrend">${optionList(["Rising", "Stable", "Falling"], oldCatch.barometricTrend || "", "Select Barometric Trend")}</select>

        <label for="airTemp">Air Temp (°F)</label>
        <input id="airTemp" type="number" min="-20" max="130" placeholder="Ex: 78" value="${oldCatch.airTemp || ""}" />

        <label for="fishStage">Fish Stage</label>
        <select id="fishStage">${optionList(["Pre-Spawn", "Spawn", "Post-Spawn", "Summer", "Fall", "Winter"], oldCatch.fishStage || "", "Select Fish Stage")}</select>

        <label for="species">Bass Type</label>
        <select id="species">${optionList(["Largemouth Bass", "Smallmouth Bass", "Spotted Bass"], oldCatch.species || "Largemouth Bass", "Select Bass Type")}</select>

        <label for="weight">Weight</label>
        <select id="weight">${optionList(["<1 lb", "1 lb", "2 lb", "3 lb", "4 lb", "5 lb", "6 lb", "7 lb", "8 lb", "9 lb", "10 lb", "11 lb", "12 lb", "13 lb", "14 lb", "15 lb+"], oldCatch.weight || "", "Select Weight")}</select>

        <label for="length">Length</label>
        <select id="length">${optionList([...Array.from({ length: 23 }, (_, i) => `${i + 8}"`), `31"+`], oldCatch.length || "", "Select Length")}</select>

        <label for="lake">Lake / Pond</label>
        <input id="lake" type="text" placeholder="Where did you catch it?" value="${escapeHtml(oldCatch.lake || "")}" />

        <label for="baitColor">Bait Color</label>
        <input id="baitColor" type="text" placeholder="Ex: Green Pumpkin Shad" value="${escapeHtml(oldCatch.baitColor || "")}" />

        <label for="lure">Lure</label>
        <select id="lure">${optionList(lureOptions, oldCatch.lure || "", "Select Lure")}</select>

        <label for="notes">Notes</label>
        <textarea id="notes" placeholder="Water color, cover, retrieve, etc.">${escapeHtml(oldCatch.notes || "")}</textarea>

        <button class="card primary back-button" type="submit">${editing ? "Save Changes" : "Save Catch"}</button>
        <button class="card back-button" type="button" id="backHome">Back Home</button>
      </form>
    </section>
  `;

  document.getElementById("catchForm").addEventListener("submit", event => {
    event.preventDefault();

    const savedCatch = {
      catchDate: document.getElementById("catchDate").value,
      catchTime: document.getElementById("catchTime").value,
      waterTemp: document.getElementById("waterTemp").value,
      weather: document.getElementById("weather").value,
      waterClarity: document.getElementById("waterClarity").value,
      windDirection: document.getElementById("windDirection").value,
      wind: document.getElementById("wind").value,
      barometricTrend: document.getElementById("barometricTrend").value,
      airTemp: document.getElementById("airTemp").value,
      fishStage: document.getElementById("fishStage").value,
      species: document.getElementById("species").value,
      weight: document.getElementById("weight").value,
      length: document.getElementById("length").value,
      lake: document.getElementById("lake").value.trim(),
      baitColor: document.getElementById("baitColor").value.trim(),
      lure: document.getElementById("lure").value,
      notes: document.getElementById("notes").value.trim()
    };

    if (editing) catches[editIndex] = savedCatch;
    else catches.push(savedCatch);

    saveCatches(catches);
    showCatches();
  });

  document.getElementById("backHome").onclick = showHome;
}

function showCatches() {
  const catches = getCatches();

  app.innerHTML = `
    ${header("MY TRIPS")}
    <section class="form-card">
      <h2>Saved Catches</h2>
      ${
        catches.length === 0
          ? `<p>No catches logged yet.</p>`
          : catches.map((fish, index) => `
            <div class="catch-card">
              <h3>${escapeHtml(fish.species || "Bass")}</h3>
              <p><strong>Date:</strong> ${escapeHtml(fish.catchDate || "Not entered")}</p>
              <p><strong>Time:</strong> ${escapeHtml(fish.catchTime || "Not entered")}</p>
              <p><strong>Weight:</strong> ${escapeHtml(fish.weight || "Not entered")}</p>
              <p><strong>Length:</strong> ${escapeHtml(fish.length || "Not entered")}</p>
              <p><strong>Lake/Pond:</strong> ${escapeHtml(fish.lake || "Not entered")}</p>
              <p><strong>Lure:</strong> ${escapeHtml(fish.lure || "Not entered")}</p>
              <p><strong>Bait Color:</strong> ${escapeHtml(fish.baitColor || "Not entered")}</p>
              <p><strong>Water Temp:</strong> ${escapeHtml(fish.waterTemp || "Not entered")}</p>
              <p><strong>Air Temp:</strong> ${escapeHtml(fish.airTemp || "Not entered")}</p>
              <p><strong>Weather:</strong> ${escapeHtml(fish.weather || "Not entered")}</p>
              <p><strong>Water Clarity:</strong> ${escapeHtml(fish.waterClarity || "Not entered")}</p>
              <p><strong>Wind:</strong> ${escapeHtml(fish.wind || "Not entered")} ${escapeHtml(fish.windDirection || "")}</p>
              <p><strong>Barometric Trend:</strong> ${escapeHtml(fish.barometricTrend || "Not entered")}</p>
              <p><strong>Fish Stage:</strong> ${escapeHtml(fish.fishStage || "Not entered")}</p>
              <p><strong>Notes:</strong> ${escapeHtml(fish.notes || "None")}</p>
              <button class="card back-button editBtn" data-index="${index}">Edit</button>
              <button class="card back-button deleteBtn" data-index="${index}">Delete</button>
            </div>
          `).join("")
      }
      <button class="card primary back-button" id="addCatch">Log Another Catch</button>
      <button class="card back-button" id="backHome">Back Home</button>
    </section>
  `;

  document.getElementById("addCatch").onclick = () => showCatchForm();
  document.getElementById("backHome").onclick = showHome;

  document.querySelectorAll(".editBtn").forEach(button => {
    button.onclick = () => showCatchForm(Number(button.dataset.index));
  });

  document.querySelectorAll(".deleteBtn").forEach(button => {
    button.onclick = () => {
      const updated = getCatches();
      updated.splice(Number(button.dataset.index), 1);
      saveCatches(updated);
      showCatches();
    };
  });
}

function showStats() {
  const catches = getCatches();

  app.innerHTML = `
    ${header("STATISTICS")}
    <section class="form-card">
      <h2>Stats</h2>
      <p><strong>Total Catches:</strong> ${catches.length}</p>
      <p><strong>Top Lure:</strong> ${getTopLure(catches)}</p>
      <button class="card back-button" id="backHome">Back Home</button>
    </section>
  `;

  document.getElementById("backHome").onclick = showHome;
}

function getTopLure(catches) {
  const counts = {};
  catches.forEach(fish => {
    if (fish.lure) counts[fish.lure] = (counts[fish.lure] || 0) + 1;
  });

  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return top ? `${top[0]} (${top[1]})` : "None yet";
}

function showSettings() {
  app.innerHTML = `
    ${header("SETTINGS")}
    <section class="form-card">
      <h2>Settings</h2>
      <p>Gear and preferences will go here next.</p>
      <button class="card back-button" id="backHome">Back Home</button>
    </section>
  `;

  document.getElementById("backHome").onclick = showHome;
}

showHome();