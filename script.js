const app = document.getElementById("app");

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

const WEATHER = [
  "Sunny",
  "Partly Cloudy",
  "Cloudy",
  "Rain",
  "Storm"
];

const WATER_TYPES = [
  "Pond",
  "Lake",
  "River",
  "Creek",
  "Reservoir",
  "Farm Pond",
  "Other"
];

let currentLatitude = "";
let currentLongitude = "";


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


function optionList(items, selected = "", placeholder = "Select") {
  return `
    <option value="">${placeholder}</option>
    ${items.map(item =>
      `<option ${item === selected ? "selected" : ""}>${item}</option>`
    ).join("")}
  `;
}
function header(title = "BUILT ON THE WATER") {
  return `
    <section class="hero">
      <button class="brand" onclick="showHome()">
        <span class="brand-main">2° BAITS</span>
        <span class="tagline">${title}</span>
      </button>
    </section>
  `;
}


function showHome() {
  const catches = getCatches();

  app.innerHTML = `
    ${header()}

    <section class="grid">

      <button class="card primary" id="logCatch">
        <div class="icon">🐟</div>
        <h2>Log a Catch</h2>
        <p>Record a new fish</p>
      </button>

      <button class="card" id="myTrips">
        <div class="icon">📍</div>
        <h2>My Trips</h2>
        <p>${catches.length} catches saved</p>
      </button>

      <button class="card" id="stats">
        <div class="icon">📊</div>
        <h2>Statistics</h2>
        <p>Analyze your data</p>
      </button>

      <button class="card" id="settings">
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
function refreshGPS() {
  if (!navigator.geolocation) return;

  navigator.geolocation.getCurrentPosition(
    position => {
      currentLatitude = position.coords.latitude.toFixed(6);
      currentLongitude = position.coords.longitude.toFixed(6);

      const lat = document.getElementById("latitude");
      const lon = document.getElementById("longitude");

      if (lat) lat.value = currentLatitude;
      if (lon) lon.value = currentLongitude;
    },
    () => {
      currentLatitude = "";
      currentLongitude = "";
    }
  );
}


function showCatchForm(editIndex = null) {

  refreshGPS();

  const catches = getCatches();
  const oldCatch = editIndex !== null ? catches[editIndex] : {};

  app.innerHTML = `
    ${header(editIndex !== null ? "EDIT CATCH" : "LOG A CATCH")}

    <section class="form-card">

      <form id="catchForm">

        <label>Date</label>
        <input id="catchDate" type="date"
        value="${oldCatch.catchDate || new Date().toISOString().slice(0,10)}">

        <label>Time</label>
        <input id="catchTime" type="time"
        value="${oldCatch.catchTime || ""}">

        <label>Latitude</label>
        <input id="latitude" readonly value="${currentLatitude}">

        <label>Longitude</label>
        <input id="longitude" readonly value="${currentLongitude}">

        <label>Water Name</label>
        <input id="waterName"
        value="${oldCatch.waterName || ""}">

        <label>Water Type</label>
        <select id="waterType">
          ${optionList(
            WATER_TYPES,
            oldCatch.waterType || localStorage.getItem("defaultWaterType") || "",
            "Select Water Type"
          )}
        </select>

        <label>Species</label>
        <select id="species">
          ${optionList(
            SPECIES,
            oldCatch.species || localStorage.getItem("defaultSpecies") || "",
            "Select Species"
          )}
        </select>

        <label>Weight</label>
        <input id="weight"
        value="${oldCatch.weight || ""}">

        <label>Length</label>
        <input id="length"
        value="${oldCatch.length || ""}">

        <label>Lure</label>
        <select id="lure">
          ${optionList(
            LURES,
            oldCatch.lure || localStorage.getItem("defaultLure") || "",
            "Select Lure"
          )}
        </select>

        <label>Weather</label>
        <select id="weather">
          ${optionList(WEATHER, oldCatch.weather || "", "Select Weather")}
        </select>

        <label>Water Temp</label>
<input id="waterTemp" type="number" value="${oldCatch.waterTemp || ""}">

<label>Water Clarity</label>
<select id="waterClarity">
${optionList(WATER_CLARITY, oldCatch.waterClarity || "", "Select Water Clarity")}
</select>

<label>Wind Direction</label>
<select id="windDirection">
${optionList(WIND_DIRECTION, oldCatch.windDirection || "", "Select Wind Direction")}
</select>

<label>Wind</label>
<select id="wind">
${optionList(WIND, oldCatch.wind || "", "Select Wind")}
</select>

<label>Barometric Trend</label>
<select id="barometricTrend">
${optionList(BAROMETRIC, oldCatch.barometricTrend || "", "Select Barometric Trend")}
</select>

<label>Air Temp</label>
<input id="airTemp" type="number" value="${oldCatch.airTemp || ""}">

<label>Fish Stage</label>
<select id="fishStage">
${optionList(FISH_STAGE, oldCatch.fishStage || "", "Select Fish Stage")}
</select>

<label>Bait Color</label>
<select id="baitColor">
${optionList(BAIT_COLORS, oldCatch.baitColor || "", "Select Bait Color")}
</select>
        <label>Notes</label>
        <textarea id="notes">${oldCatch.notes || ""}</textarea>


        <button class="card primary" type="submit">
          Save Catch
        </button>

      </form>

      <button class="card back-button" onclick="showHome()">
        Cancel
      </button>

    </section>
  `;


  document.getElementById("catchForm").onsubmit = e => {
    e.preventDefault();

    const saved = {
      catchDate: document.getElementById("catchDate").value,
      catchTime: document.getElementById("catchTime").value,
      latitude: document.getElementById("latitude").value,
      longitude: document.getElementById("longitude").value,
      waterName: document.getElementById("waterName").value,
      waterType: document.getElementById("waterType").value,
      species: document.getElementById("species").value,
      weight: document.getElementById("weight").value,
      length: document.getElementById("length").value,
      lure: document.getElementById("lure").value,
      weather: document.getElementById("weather").value,
      notes: document.getElementById("notes").value
      waterTemp: document.getElementById("waterTemp").value,
waterClarity: document.getElementById("waterClarity").value,
windDirection: document.getElementById("windDirection").value,
wind: document.getElementById("wind").value,
barometricTrend: document.getElementById("barometricTrend").value,
airTemp: document.getElementById("airTemp").value,
fishStage: document.getElementById("fishStage").value,
baitColor: document.getElementById("baitColor").value,
    };


    if (editIndex !== null) {
      catches[editIndex] = saved;
    } else {
      catches.push(saved);
    }

    saveCatches(catches);

    showHome();
  };
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

            <h3>${fish.species || "Bass"}</h3>

            <p><strong>Date:</strong> ${fish.catchDate || ""}</p>
            <p><strong>Water:</strong> ${fish.waterName || ""}</p>
            <p><strong>Lure:</strong> ${fish.lure || ""}</p>
            <p><strong>Weight:</strong> ${fish.weight || ""}</p>
            <p><strong>Length:</strong> ${fish.length || ""}</p>
            <p><strong>Water Temp:</strong> ${fish.waterTemp || ""}</p>
<p><strong>Water Clarity:</strong> ${fish.waterClarity || ""}</p>
<p><strong>Wind:</strong> ${fish.wind || ""} ${fish.windDirection || ""}</p>
<p><strong>Barometric:</strong> ${fish.barometricTrend || ""}</p>
<p><strong>Air Temp:</strong> ${fish.airTemp || ""}</p>
<p><strong>Fish Stage:</strong> ${fish.fishStage || ""}</p>
<p><strong>Bait Color:</strong> ${fish.baitColor || ""}</p>

            <button class="card back-button editBtn"
            data-index="${index}">
              Edit
            </button>

            <button class="card back-button deleteBtn"
            data-index="${index}">
              Delete
            </button>

          </div>

        `).join("")
      }


      <button class="card primary" onclick="showCatchForm()">
        Log Another Catch
      </button>

      <button class="card back-button" onclick="showHome()">
        Back Home
      </button>

    </section>
  `;


  document.querySelectorAll(".editBtn").forEach(button => {

    button.onclick = () => {
      showCatchForm(Number(button.dataset.index));
    };

  });


  document.querySelectorAll(".deleteBtn").forEach(button => {

    button.onclick = () => {

      const updated = getCatches();

      updated.splice(
        Number(button.dataset.index),
        1
      );

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

      <h2>Statistics</h2>

      <p><strong>Total Catches:</strong> ${catches.length}</p>

      <button class="card back-button" onclick="showHome()">
        Back Home
      </button>

    </section>
  `;

}



function showSettings() {

  app.innerHTML = `
    ${header("SETTINGS")}

    <section class="form-card">

      <h2>Settings</h2>


      <label>Default Water Type</label>
      <select id="defaultWaterType">
        ${optionList(
          WATER_TYPES,
          localStorage.getItem("defaultWaterType") || "",
          "Select Water Type"
        )}
      </select>


      <label>Default Species</label>
      <select id="defaultSpecies">
        ${optionList(
          SPECIES,
          localStorage.getItem("defaultSpecies") || "",
          "Select Species"
        )}
      </select>


      <label>Default Lure</label>
      <select id="defaultLure">
        ${optionList(
          LURES,
          localStorage.getItem("defaultLure") || "",
          "Select Lure"
        )}
      </select>


      <button class="card primary" id="saveSettings">
        Save Settings
      </button>


      <button class="card back-button" onclick="showHome()">
        Back Home
      </button>


    </section>
  `;


  document.getElementById("saveSettings").onclick = () => {

    localStorage.setItem(
      "defaultWaterType",
      document.getElementById("defaultWaterType").value
    );


    localStorage.setItem(
      "defaultSpecies",
      document.getElementById("defaultSpecies").value
    );


    localStorage.setItem(
      "defaultLure",
      document.getElementById("defaultLure").value
    );


    alert("Settings saved!");

    showHome();

  };

}



showHome();