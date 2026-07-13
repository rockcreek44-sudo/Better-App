const app = document.getElementById("app");

let currentLatitude = "";
let currentLongitude = "";
let currentLocationName = "";

let catchFilters = {
  search: "",
  species: "",
  waterType: "",
  lure: ""
};

const STORAGE_KEY = "betterAppCatches";

const LURES = [
  "Workhorse",
  "Mini",
  "Mesh",
  "Darkhorse",
  "Karashi",
  "Swim Jig",
  "Other"
];

const SPECIES = [
  "Largemouth Bass",
  "Smallmouth Bass",
  "Spotted Bass"
];

const LAKES = [
  "Pond",
  "Lake",
  "River",
  "Creek",
  "Reservoir",
  "Farm Pond",
  "Other"
];

const WEATHER = [
  "Sunny",
  "Partly Cloudy",
  "Cloudy",
  "Rain",
  "Storm"
];

const WATER_CLARITY = [
  "Clear",
  "Slightly Stained",
  "Stained",
  "Muddy"
];

const WIND = [
  "Calm",
  "Light",
  "Moderate",
  "Strong"
];

const BAROMETRIC = [
  "Rising",
  "Stable",
  "Falling"
];

const FISH_STAGE = [
  "Pre-Spawn",
  "Spawn",
  "Post-Spawn",
  "Summer",
  "Fall",
  "Winter"
];

const WEIGHTS = [
  "<1 lb",
  "1 lb",
  "2 lb",
  "3 lb",
  "4 lb",
  "5 lb",
  "6 lb",
  "7 lb",
  "8 lb",
  "9 lb",
  "10 lb",
  "15 lb+"
];

const LENGTHS = Array.from(
  { length: 23 },
  (_, i) => `${i + 8}"`
);

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[character]));
}

function getCatches() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCatches(catches) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(catches)
  );
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
  `;

  document.getElementById("logCatch").onclick = () => showCatchForm();
  document.getElementById("myTrips").onclick = showCatches;
  document.getElementById("stats").onclick = showStats;
  document.getElementById("settings").onclick = showSettings;
}
function refreshGPS() {
  if (!navigator.geolocation) return;

  navigator.geolocation.getCurrentPosition(
    position => {
      currentLatitude = position.coords.latitude.toFixed(6);
      currentLongitude = position.coords.longitude.toFixed(6);

      detectLocationName(
        currentLatitude,
        currentLongitude
      );

      const latitudeField = document.getElementById("latitude");
      const longitudeField = document.getElementById("longitude");

      if (latitudeField) {
        latitudeField.value = currentLatitude;
      }

      if (longitudeField) {
        longitudeField.value = currentLongitude;
      }
    },
    () => {
      currentLatitude = "";
      currentLongitude = "";
    }
  );
}

async function detectLocationName(latitude, longitude) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
    );

    if (!response.ok) return;

    const data = await response.json();
    const address = data.address || {};

    currentLocationName =
      address.water ||
      address.reservoir ||
      address.lake ||
      address.river ||
      address.pond ||
      "";

    const waterField = document.getElementById("waterName");

    if (waterField) {
      waterField.value = currentLocationName;
    }

  } catch (error) {
    console.log("Location error", error);
  }
}
refreshGPS();

function showCatches() {
  const catches = getCatches();

  const filteredCatches = catches.filter(fish => {
    const search = catchFilters.search;

    return (
      !search ||
      JSON.stringify(fish)
        .toLowerCase()
        .includes(search)
    );
  });

  app.innerHTML = `
    ${header("MY TRIPS")}

    <section class="form-card">

      <h2>Saved Catches</h2>

      <input
        id="catchSearch"
        class="search-box"
        type="text"
        placeholder="Search catches..."
      >

      ${
        filteredCatches.length === 0
          ? `<p>No catches logged yet.</p>`
          : filteredCatches.map((fish, index) => `
          
          <div class="catch-card">

            <h3>${escapeHtml(fish.species || "Bass")}</h3>

            ${
              fish.photo
                ? `
                <img 
                  src="${fish.photo}"
                  class="catch-photo photo-viewer"
                  data-photo="${fish.photo}"
                >
                `
                : ""
            }

            <p><strong>Water:</strong> ${escapeHtml(fish.waterName)}</p>
            <p><strong>Lure:</strong> ${escapeHtml(fish.lure)}</p>
            <p><strong>Weight:</strong> ${escapeHtml(fish.weight)}</p>
            <p><strong>Length:</strong> ${escapeHtml(fish.length)}</p>

            <button class="card back-button editBtn" data-index="${index}" type="button">
              Edit
            </button>

            <button class="card back-button mapBtn" data-lat="${fish.latitude}" data-lon="${fish.longitude}" type="button">
              Map
            </button>

            <button class="card back-button deleteBtn" data-index="${index}" type="button">
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

  const searchBox = document.getElementById("catchSearch");

  if (searchBox) {
    searchBox.value = catchFilters.search;

    searchBox.oninput = () => {
      catchFilters.search = searchBox.value.toLowerCase();
      showCatches();
    };
  }

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

  document.querySelectorAll(".mapBtn").forEach(button => {
    button.onclick = () => {
      const lat = button.dataset.lat;
      const lon = button.dataset.lon;

      if (lat && lon) {
        window.open(
          `https://www.google.com/maps?q=${lat},${lon}`,
          "_blank"
        );
      }
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

      <button class="card back-button" id="backHome" type="button">
        Back Home
      </button>
    </section>
  `;

  document.getElementById("backHome").onclick = showHome;
}

function showSettings() {
  app.innerHTML = `
    ${header("SETTINGS")}

    <section class="form-card">
      <h2>Settings</h2>

      <label>Default Water Type</label>
      <select id="defaultWaterType">
        ${optionList(
          LAKES,
          localStorage.getItem("defaultWaterType") || "",
          "Select Water Type"
        )}
      </select>

      <button class="card primary back-button" id="saveSettings" type="button">
        Save Settings
      </button>

      <button class="card back-button" id="backHome" type="button">
        Back Home
      </button>

    </section>
  `;

  document.getElementById("saveSettings").onclick = () => {
    localStorage.setItem(
      "defaultWaterType",
      document.getElementById("defaultWaterType").value
    );

    alert("Settings saved!");
    showHome();
  };

  document.getElementById("backHome").onclick = showHome;
}

showHome();function showCatchForm(editIndex = null) {
  refreshGPS();

  const catches = getCatches();
  const editing = editIndex !== null;
  const oldCatch = editing ? catches[editIndex] : {};

  app.innerHTML = `
    ${header(editing ? "EDIT CATCH" : "LOG A CATCH")}

    <section class="form-card">

      <h2>${editing ? "Edit Catch" : "New Catch"}</h2>

      <form id="catchForm">

        <label>Date</label>
        <input id="catchDate" type="date" value="${oldCatch.catchDate || new Date().toISOString().slice(0,10)}">

        <label>Time</label>
        <input id="catchTime" type="time" value="${oldCatch.catchTime || new Date().toTimeString().slice(0,5)}">

        <label>Water Name</label>
        <input id="waterName" value="${oldCatch.waterName || currentLocationName || ""}">

        <label>Water Type</label>
        <select id="lake">
          ${optionList(
            LAKES,
            oldCatch.lake || localStorage.getItem("defaultWaterType") || "",
            "Select Water Type"
          )}
        </select>

        <label>Latitude</label>
        <input id="latitude" readonly value="${oldCatch.latitude || currentLatitude}">

        <label>Longitude</label>
        <input id="longitude" readonly value="${oldCatch.longitude || currentLongitude}">

        <label>Species</label>
        <select id="species">
          ${optionList(SPECIES, oldCatch.species || "", "Select Species")}
        </select>

        <label>Weight</label>
        <select id="weight">
          ${optionList(WEIGHTS, oldCatch.weight || "", "Select Weight")}
        </select>

        <label>Length</label>
        <select id="length">
          ${optionList(LENGTHS, oldCatch.length || "", "Select Length")}
        </select>

        <label>Lure</label>
        <select id="lure">
          ${optionList(LURES, oldCatch.lure || "", "Select Lure")}
        </select>

        <label>Notes</label>
        <textarea id="notes">${oldCatch.notes || ""}</textarea>

        <input id="photo" type="file" accept="image/*">

        <button class="card primary back-button" type="submit">
          Save Catch
        </button>

      </form>

      <button class="card back-button" id="backHome" type="button">
        Cancel
      </button>

    </section>
  `;

  document.getElementById("backHome").onclick = showHome;

  document.getElementById("catchForm").onsubmit = async event => {
    event.preventDefault();

    const savedCatch = {
      catchDate: document.getElementById("catchDate").value,
      catchTime: document.getElementById("catchTime").value,
      waterName: document.getElementById("waterName").value,
      lake: document.getElementById("lake").value,
      latitude: document.getElementById("latitude").value,
      longitude: document.getElementById("longitude").value,
      species: document.getElementById("species").value,
      weight: document.getElementById("weight").value,
      length: document.getElementById("length").value,
      lure: document.getElementById("lure").value,
      notes: document.getElementById("notes").value,
      photo: oldCatch.photo || ""
    };

    if (editing) {
      catches[editIndex] = savedCatch;
    } else {
      catches.push(savedCatch);
    }

    saveCatches(catches);
    showCatches();
  };
}
function optionList(options, selected = "", placeholder = "Select") {
  return `
    <option value="">${placeholder}</option>
    ${
      options.map(option => `
        <option value="${escapeHtml(option)}" ${option === selected ? "selected" : ""}>
          ${escapeHtml(option)}
        </option>
      `).join("")
    }
  `;
}
