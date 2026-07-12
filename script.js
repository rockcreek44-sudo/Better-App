const app = document.getElementById("app");
let currentLatitude = "";
let currentLongitude = "";
let currentLocationName = "";
function refreshGPS() {
  if (!navigator.geolocation) return;

  navigator.geolocation.getCurrentPosition(
    (position) => {
      currentLatitude = position.coords.latitude.toFixed(6);
      currentLongitude = position.coords.longitude.toFixed(6);
      
      detectLocationName(currentLatitude, currentLongitude);

      const latitudeField = document.getElementById("latitude");
      const longitudeField = document.getElementById("longitude");

      if (latitudeField) latitudeField.value = currentLatitude;
      if (longitudeField) longitudeField.value = currentLongitude;
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
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1&namedetails=1`
    );

    if (!response.ok) return;

    const data = await response.json();
    const address = data.address || {};

    currentLocationName =
    
      address.water ||
      address.reservoir ||
      address.river ||
      address.lake ||
      address.pond ||
      
      
      
      
      
      "";
     if (document.getElementById("waterName")) {
    document.getElementById("waterName").value = currentLocationName;
} 

    
  
  } catch (error) {
    console.error("Location detection failed:", error);
  }
}
refreshGPS();
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
    refreshGPS();
  const catches = getCatches();
  const editing = editIndex !== null;
  const oldCatch = editing ? catches[editIndex] : {};

  app.innerHTML = `
    ${header(editing ? "EDIT CATCH" : "LOG A CATCH")}

    <section class="form-card">
      <h2>${editing ? "Edit Catch" : "New Catch"}</h2>

      <form id="catchForm">
      <h3 class="form-section-title">Trip Info</h3>  
      <label for="catchDate">Date</label>
        <input id="catchDate" type="date" value="${oldCatch.catchDate || new Date().toISOString().slice(0, 10)}" />

        <label for="catchTime">Time</label>
        <input id="catchTime" type="time" value="${oldCatch.catchTime || new Date().toTimeString().slice(0, 5)}" />
        <label for="latitude">Latitude</label>
<input id="latitude" type="text" readonly value="${currentLatitude}" />

<label for="longitude">Longitude</label>
<input id="longitude" type="text" readonly value="${currentLongitude}" />

        <label for="waterTemp">Water Temp (°F)</label>
        <input id="waterTemp" type="number" min="32" max="120" placeholder="Ex: 72" value="${oldCatch.waterTemp || ""}" />

        <label for="weather">Weather</label>
        <select id="weather">${optionList(WEATHER, oldCatch.weather || "", "Select Weather")}</select>

        <label for="waterClarity">Water Clarity</label>
        <select id="waterClarity">${optionList(WATER_CLARITY, oldCatch.waterClarity || "", "Select Water Clarity")}</select>

        <label for="windDirection">Wind Direction</label>
        <select id="windDirection">${optionList(WIND_DIRECTION, oldCatch.windDirection || "", "Select Wind Direction")}</select>

        <label for="wind">Wind</label>
        <select id="wind">${optionList(WIND, oldCatch.wind || "", "Select Wind")}</select>

        <label for="barometricTrend">Barometric Trend</label>
        <select id="barometricTrend">${optionList(BAROMETRIC, oldCatch.barometricTrend || "", "Select Barometric Trend")}</select>

        <label for="airTemp">Air Temp (°F)</label>
        <input id="airTemp" type="number" min="-20" max="130" placeholder="Ex: 78" value="${oldCatch.airTemp || ""}" />

        <label for="fishStage">Fish Stage</label>
        <select id="fishStage">${optionList(FISH_STAGE, oldCatch.fishStage || "", "Select Fish Stage")}</select>

        <label for="species">Bass Type</label>
        <select id="species">${optionList(SPECIES, oldCatch.species || localStorage.getItem("defaultSpecies") || "Largemouth Bass", "Select Bass Type")}</select>

        <label for="weight">Weight</label>
        <select id="weight">${optionList(WEIGHTS, oldCatch.weight || "", "Select Weight")}</select>

        <label for="length">Length</label>
        <select id="length">${optionList(LENGTHS, oldCatch.length || "", "Select Length")}</select>
        
        <label for="lake">Water Type</label>
        <select id="lake">${optionList(LAKES, oldCatch.lake || localStorage.getItem("defaultWaterType") || "", "Select Water Type")}</select>
        <label for="waterName">Water Name</label>
<input id="waterName" type="text" value="${escapeHtml(oldCatch.waterName || "")}" readonly>
        <label for="lure">Lure</label>
        <select id="lure">${optionList(LURES, oldCatch.lure || localStorage.getItem("defaultLure") || "", "Select Lure")}</select>

        <label for="baitColor">Bait Color</label>
        <select id="baitColor">${optionList(BAIT_COLORS, oldCatch.baitColor || "", "Select Bait Color")}</select>

        <label for="photo">Photo</label>
<input id="photo" type="file" accept="image/*">
        <label for="notes">Notes</label>
        <textarea id="notes" placeholder="Water color, cover, retrieve, etc.">${escapeHtml(oldCatch.notes || "")}</textarea>

        <button class="card primary back-button" type="submit">${editing ? "Save Changes" : "Save Catch"}</button>
        <button class="card back-button" type="button" id="backHome">Back Home</button>
      </form>
    </section>
  `;

  document.getElementById("catchForm").addEventListener("submit", async event => {
    event.preventDefault();
  const photoInput = document.getElementById("photo");
  let photoData = oldCatch?.photo || "";

  if (photoInput.files && photoInput.files[0]) {
    photoData = await new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);

      reader.readAsDataURL(photoInput.files[0]);
    });
  }

  const savedCatch = {
    catchDate: document.getElementById("catchDate").value,
    catchTime: document.getElementById("catchTime").value,
    latitude: document.getElementById("latitude").value,
    longitude: document.getElementById("longitude").value,
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
    lake: document.getElementById("lake").value,
    lure: document.getElementById("lure").value,
    baitColor: document.getElementById("baitColor").value,
    waterName: document.getElementById("waterName").value,
    photo: photoData,
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
              ${fish.photo ? '<img src="' + fish.photo + '" alt="Catch photo" class="catch-photo photo-viewer" data-photo="' + fish.photo + '" style="width:100%;height:250px;object-fit:cover;display:block;cursor:pointer;">' : ''}
              <p><strong>Date:</strong> ${escapeHtml(fish.catchDate || "Not entered")}</p>
              <p><strong>Time:</strong> ${escapeHtml(fish.catchTime || "Not entered")}</p>
              <p><strong>Latitude:</strong> ${escapeHtml(fish.latitude || "Not entered")}</p>
              <p><strong>Longitude:</strong> ${escapeHtml(fish.longitude || "Not entered")}</p>
              <p><strong>Weight:</strong> ${escapeHtml(fish.weight || "Not entered")}</p>
              <p><strong>Length:</strong> ${escapeHtml(fish.length || "Not entered")}</p>
              <p><strong>Water Type:</strong> ${escapeHtml(fish.lake || "Not entered")}</p>
              <p><strong>Lure:</strong> ${escapeHtml(fish.lure || "Not entered")}</p>
              <p><strong>Water Name:</strong> ${escapeHtml(fish.waterName || "Not entered")}</p>
              <p><strong>Bait Color:</strong> ${escapeHtml(fish.baitColor || "Not entered")}</p>
              <p><strong>Water Temp:</strong> ${escapeHtml(fish.waterTemp || "Not entered")}</p>
              <p><strong>Air Temp:</strong> ${escapeHtml(fish.airTemp || "Not entered")}</p>
              <p><strong>Weather:</strong> ${escapeHtml(fish.weather || "Not entered")}</p>
              <p><strong>Water Clarity:</strong> ${escapeHtml(fish.waterClarity || "Not entered")}</p>
              <p><strong>Wind:</strong> ${escapeHtml(fish.wind || "Not entered")} ${escapeHtml(fish.windDirection || "")}</p>
              <p><strong>Barometric Trend:</strong> ${escapeHtml(fish.barometricTrend || "Not entered")}</p>
              <p><strong>Fish Stage:</strong> ${escapeHtml(fish.fishStage || "Not entered")}</p>
              <p><strong>Notes:</strong> ${escapeHtml(fish.notes || "None")}</p>
              <div class="photo-hint">Tap photo to enlarge</div>

              <button class="card back-button editBtn" data-index="${index}" type="button">Edit</button>
              <button class="card back-button mapBtn" data-lat="${fish.latitude}" data-lon="${fish.longitude}" type="button">Map</button>
              <button class="card back-button deleteBtn" data-index="${index}" type="button">Delete</button>
            </div>
          `).join("")
      }

      <button class="card primary back-button" id="addCatch" type="button">Log Another Catch</button>
      <button class="card back-button" id="backHome" type="button">Back Home</button>
    </section>
  `;

  document.getElementById("addCatch").onclick = () => showCatchForm();
  document.getElementById("backHome").onclick = showHome;

  document.querySelectorAll(".editBtn").forEach(button => {
    button.onclick = () => showCatchForm(Number(button.dataset.index));
  });
document.querySelectorAll(".mapBtn").forEach(button => {
  button.onclick = () => {
    const lat = button.dataset.lat;
    const lon = button.dataset.lon;
    if (lat && lon) {
      window.open(`https://www.google.com/maps?q=${lat},${lon}`, "_blank");
    }
  };
});

document.querySelectorAll(".photo-viewer").forEach(photo => {
  photo.onclick = () => {
    const src = photo.dataset.photo;
    if (!src) return;

    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.background = "rgba(0,0,0,0.9)";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.zIndex = "9999";

    const img = document.createElement("img");
    img.src = src;
    img.style.maxWidth = "95%";
    img.style.maxHeight = "95%";
    img.style.objectFit = "contain";

    overlay.appendChild(img);
    overlay.onclick = () => overlay.remove();

    document.body.appendChild(overlay);
  };
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
      <button class="card back-button" id="backHome" type="button">Back Home</button>
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

      <label for="defaultLake">Home Lake / Pond</label>
      <input
        id="defaultLake"
        type="text"
        placeholder="Ex: Morse Reservoir"
        value="${localStorage.getItem("defaultLake") || ""}"
      />

      <label for="defaultSpecies">Default Bass Species</label>
      <select id="defaultSpecies">
        ${optionList(
          SPECIES,
          localStorage.getItem("defaultSpecies") || "Largemouth Bass",
          "Select Bass Species"
        )}
      </select>

      <label for="defaultLure">Default Lure</label>
      <select id="defaultLure">
        ${optionList(
          LURES,
          localStorage.getItem("defaultLure") || "",
          "Select Lure"
        )}
      </select>

      <label for="defaultWaterType">Default Water Type</label>
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
      "defaultLake",
      document.getElementById("defaultLake").value.trim()
    );

    localStorage.setItem(
      "defaultSpecies",
      document.getElementById("defaultSpecies").value
    );

    localStorage.setItem(
      "defaultLure",
      document.getElementById("defaultLure").value
    );

    localStorage.setItem(
      "defaultWaterType",
      document.getElementById("defaultWaterType").value
    );

    alert("Settings saved!");
    showHome();
  };

  document.getElementById("backHome").onclick = showHome;
}

showHome();