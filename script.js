const app = document.getElementById("app");
const STORAGE_KEY = "betterAppCatches";

const LURES = ["Workhorse", "Mini", "Mesh", "Darkhorse", "Karashi", "Swim Jig", "Other"];
const SPECIES = ["Largemouth Bass", "Smallmouth Bass", "Spotted Bass"];
const WEATHER = ["Sunny", "Partly Cloudy", "Cloudy", "Rain", "Storm"];
const WATER_CLARITY = ["Clear", "Slightly Stained", "Stained", "Muddy"];
const WIND = ["Calm", "Light", "Moderate", "Strong"];
const WIND_DIRECTION = ["N", "NE", "E", "SE", "S", "SW", "W", "NW", "Variable"];
const BAROMETRIC = ["Rising", "Stable", "Falling"];
const FISH_STAGE = ["Pre-Spawn", "Spawn", "Post-Spawn", "Summer", "Fall", "Winter"];
const WEIGHTS = ["<1 lb", "1 lb", "2 lb", "3 lb", "4 lb", "5 lb", "6 lb", "7 lb", "8 lb", "9 lb", "10 lb", "11 lb", "12 lb", "13 lb", "14 lb", "15 lb+"];
const LENGTHS = Array.from({ length: 23 }, (_, i) => `${i + 8}"`).concat('31"+');

const LAKES = [
  "Pond",
  "Lake",
  "River",
  "Creek",
  "Reservoir",
  "Farm Pond",
  "Other"
];

const BAIT_COLORS = [
  "Green Pumpkin",
  "Green Pumpkin Shad",
  "Black / Blue",
  "White",
  "White Shad",
  "Chartreuse White",
  "Bluegill",
  "Craw",
  "Brown",
  "Sexy Shad",
  "Threadfin Shad",
  "Gizzard Shad",
  "Fire Craw",
  "Other"
];

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[character]));
}

function optionList(options, selectedValue = "", placeholder = "Select") {
  const placeholderOption = `<option value="">${escapeHtml(placeholder)}</option>`;

  const optionHtml = options.map(option => {
    const safeOption = escapeHtml(option);
    const selected = option === selectedValue ? "selected" : "";
    return `<option value="${safeOption}" ${selected}>${safeOption}</option>`;
  }).join("");

  return placeholderOption + optionHtml;
}

function getCatches() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCatches(catches) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(catches));
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

        <h3 class="form-section-title">Catch Details</h3>

        <label for="catchDate">Date</label>
        <input
          id="catchDate"
          type="date"
          value="${oldCatch.catchDate || new Date().toISOString().slice(0, 10)}"
        />

        <label for="catchTime">Time</label>
        <input
          id="catchTime"
          type="time"
          value="${oldCatch.catchTime || new Date().toTimeString().slice(0, 5)}"
        />

        <label for="species">Bass Type</label>
        <select id="species">
          ${optionList(
            SPECIES,
            oldCatch.species || "Largemouth Bass",
            "Select Bass Type"
          )}
        </select>

        <label for="weight">Weight</label>
        <select id="weight">
          ${optionList(WEIGHTS, oldCatch.weight || "", "Select Weight")}
        </select>

        <label for="length">Length</label>
        <select        <h3 class="form-section-title">Location & Conditions</h3>

        <label for="waterName">Lake / Pond Name</label>
        <input
          id="waterName"
          type="text"
          placeholder="Ex: Rock Creek"
          value="${oldCatch.waterName || ""}"
        />

        <label for="waterType">Water Type</label>
        <select id="waterType">
          ${optionList(
            LAKES,
            oldCatch.waterType || oldCatch.lake || "",
            "Select Water Type"
          )}
        </select>

        <label for="waterTemp">Water Temp (°F)</label>
        <input
          id="waterTemp"
          type="number"
          min="32"
          max="120"
          placeholder="Ex: 72"
          value="${oldCatch.waterTemp || ""}"
        />

        <label for="airTemp">Air Temp (°F)</label>        <label for="weather">Weather</label>
        <select id="weather">
          ${optionList(WEATHER, oldCatch.weather || "", "Select Weather")}
        </select>

        <label for="waterClarity">Water Clarity</label>
        <select id="waterClarity">
          ${optionList(
            WATER_CLARITY,
            oldCatch.waterClarity || "",
            "Select Water Clarity"
          )}
        </select>

        <label for="wind">Wind</label>
        <select id="wind">
          ${optionList(WIND, oldCatch.wind || "", "Select Wind")}
        </select>

        <label for="windDirection">Wind Direction</label>
        <select id="windDirection">
          ${optionList(
            WIND_DIRECTION,
            oldCatch.windDirection || "",
            "Select Wind Direction"
          )}
        </select>

        <label for="barometricTrend">Barometric Trend</label>
        <select id="barometricTrend">
          ${optionList(
            BAROMETRIC,
            oldCatch.barometricTrend || "",
            "Select Barometric Trend"
          )}
        </select>

        <label for="fishStage">Fish Stage</label>
        <select id="fishStage">
          ${optionList(
            FISH_STAGE,
            oldCatch.fishStage || "",
            "Select Fish Stage"
          )}
        </select>
         <h3 class="form-section-title">Bait Details</h3>

        <label for="lure">Lure</label>
        <select id="lure">
          ${optionList(LURES, oldCatch.lure || "", "Select Lure")}
        </select>

        <label for="baitColor">Bait Color</label>
        <select id="baitColor">
          ${optionList(
            BAIT_COLORS,
            oldCatch.baitColor || "",
            "Select Bait Color"
          )}
        </select>

        <h3 class="form-section-title">Notes</h3>

        <label for="notes">Catch Notes</label>
        <textarea
          id="notes"
          placeholder="Cover, depth, retrieve, trailer, or anything else..."
        >${escapeHtml(oldCatch.notes || "")}</textarea>

        <button class="card primary back-button" type="submit">
          ${editing ? "Save Changes" : "Save Catch"}
        </button>

        <button class="card back-button" type="button" id="backHome">
          ${editing ? "Cancel Edit" : "Back Home"}
        </button>
      </form>
    </section>
  `;

  document.getElementById("catchForm").addEventListener("submit", event => {
    event.preventDefault();

    const savedCatch = {
      catchDate: document.getElementById("catchDate").value,
      catchTime: document.getElementById("catchTime").value,
      species: document.getElementById("species").value,
      weight: document.getElementById("weight").value,
      length: document.getElementById("length").value,
      waterName: document.getElementById("waterName").value.trim(),
      waterType: document.getElementById("waterType").value,
      waterTemp: document.getElementById("waterTemp").value,
      airTemp: document.getElementById("airTemp").value,
      weather: document.getElementById("weather").value,
            waterClarity: document.getElementById("waterClarity").value,
      wind: document.getElementById("wind").value,
      windDirection: document.getElementById("windDirection").value,
      barometricTrend: document.getElementById("barometricTrend").value,
      fishStage: document.getElementById("fishStage").value,
      lure: document.getElementById("lure").value,
      baitColor: document.getElementById("baitColor").value,
      notes: document.getElementById("notes").value.trim()
    };

    if (editing) {
      catches[editIndex] = savedCatch;
    } else {
      catches.push(savedCatch);
    }

    saveCatches(catches);
    showCatches();
  });

  document.getElementById("backHome").onclick = editing
    ? showCatches
    : showHome;
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
              <p><strong>Water:</strong> ${escapeHtml(fish.waterName || "Not entered")}</p>
              <p><strong>Water Type:</strong> ${escapeHtml(fish.waterType || fish.lake || "Not entered")}</p>
              <p><strong>Lure:</strong> ${escapeHtml(fish.lure || "Not entered")}</p>
              <p><strong>Bait Color:</strong> ${escapeHtml(fish.baitColor || "Not entered")}</p>
              <p><strong>Water Temp:</strong> ${escapeHtml(fish.waterTemp || "Not entered")}</p>
              <p><strong>Air Temp:</strong> ${escapeHtml(fish.airTemp || "Not entered")}</p>
              <p><strong>Weather:</strong> ${escapeHtml(fish.weather || "Not entered")}</p>
              <p><strong>Water Clarity:</strong> ${escapeHtml(fish.waterClarity || "Not entered")}</p>
                            <p>
                <strong>Wind:</strong>
                ${escapeHtml(fish.wind || "Not entered")}
                ${fish.windDirection ? ` ${escapeHtml(fish.windDirection)}` : ""}
              </p>

              <p>
                <strong>Barometric Trend:</strong>
                ${escapeHtml(fish.barometricTrend || "Not entered")}
              </p>

              <p><strong>Fish Stage:</strong> ${escapeHtml(fish.fishStage || "Not entered")}</p>
              <p><strong>Notes:</strong> ${escapeHtml(fish.notes || "None")}</p>

              <button
                class="card back-button editBtn"
                data-index="${index}"
                type="button"
              >
                Edit
              </button>

              <button
                class="card back-button deleteBtn"
                data-index="${index}"
                type="button"
              >
                Delete
              </button>
            </div>
          `).join("")
      }

      <button class="card primary back-button" id="addCatch" type="button">
        Log Another Catch
      </button>

      <button class="card back-button" id="backHome" type="button">
        Back Home
      </button>
    </section>
  `;
    document.getElementById("addCatch").onclick = () => showCatchForm();
  document.getElementById("backHome").onclick = showHome;

  document.querySelectorAll(".editBtn").forEach(button => {
    button.onclick = () => {
      showCatchForm(Number(button.dataset.index));
    };
  });

  document.querySelectorAll(".deleteBtn").forEach(button => {
    button.onclick = () => {
      const index = Number(button.dataset.index);

      if (!window.confirm("Delete this catch?")) {
        return;
      }

      const updated = getCatches();
      updated.splice(index, 1);
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

      <div class="catch-card">
        <p><strong>Total Catches:</strong> ${catches.length}</p>
        <p><strong>Top Lure:</strong> ${getTopValue(catches, "lure")}</p>
        <p><strong>Top Bait Color:</strong> ${getTopValue(catches, "baitColor")}</p>
        <p><strong>Top Bass Type:</strong> ${getTopValue(catches, "species")}</p>
        <p><strong>Top Water:</strong> ${getTopWater(catches)}</p>
        <p><strong>Biggest Fish:</strong> ${getBiggestFish(catches)}</p>
      </div>

      <button class="card back-button" id="backHome" type="button">
        Back Home
      </button>
    </section>
  `;

  document.getElementById("backHome").onclick = showHome;
}

function getTopValue(catches, key) {
  const counts = {};

  catches.forEach(fish => {
    const value = fish[key];

    if (value) {
      counts[value] = (counts[value] || 0) + 1;
    }
  });

  const top = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])[0];

  return top ? `${top[0]} (${top[1]})` : "None yet";
}

function getTopWater(catches) {
  const counts = {};

  catches.forEach(fish => {
    const value = fish.waterName || fish.location;

    if (value) {
      counts[value] = (counts[value] || 0) + 1;
    }
  });

  const top = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])[0];

  return top ? `${top[0]} (${top[1]})` : "None yet";
}

function parseWeight(weight) {
  if (!weight) return 0;
  if (weight === "<1 lb") return 0.5;
  if (weight === "15 lb+") return 15;

  const parsed = parseFloat(weight);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function getBiggestFish(catches) {
  if (!catches.length) return "None yet";

  const biggest = [...catches].sort(
    (a, b) => parseWeight(b.weight) - parseWeight(a.weight)
  )[0];

  if (!biggest || !biggest.weight) return "None yet";

  const details = [
    biggest.weight,
    biggest.species,
    biggest.waterName || biggest.location
  ].filter(Boolean);

    return details.join(" - ");
}