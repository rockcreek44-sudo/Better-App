window.onload = function () {
  const app = document.querySelector(".app");

  function getCatches() {
    return JSON.parse(localStorage.getItem("catches")) || [];
  }

  function saveCatches(catches) {
    localStorage.setItem("catches", JSON.stringify(catches));
  }

  function homeScreen() {
    app.innerHTML = `
      <section class="hero">
        <div class="brand">2° BAITS&trade;</div>
        <div class="tagline">BUILT ON THE WATER</div>
      </section>

      <section class="menu-grid">
        <button class="card primary" id="newCatch">
          <div class="icon">🐟</div>
          <h2>Log a Catch</h2>
          <p>Record a new fish</p>
        </button>

        <button class="card" id="myTrips">
          <div class="icon">📍</div>
          <h2>My Trips</h2>
          <p>View your history</p>
        </button>

        <button class="card" id="stats">
          <div class="icon">📊</div>
          <h2>Statistics</h2>
          <p>Analyze your data</p>
        </button>

        <button class="card" id="settings">
          <div class="icon">⚙️</div>
          <h2>Settings</h2>
          <p>Preferences & Gear</p>
        </button>
      </section>

      <div class="footer-logo">2°</div>
      <div class="footer-text">BUILT BY ANGLERS. FOR ANGLERS.</div>
    `;

    document.getElementById("newCatch").onclick = showCatchForm;
    document.getElementById("myTrips").onclick = showTrips;
    document.getElementById("stats").onclick = function () {
      alert("Statistics coming soon.");
    };
    document.getElementById("settings").onclick = function () {
      alert("Settings coming soon.");
    };
  }

  function showCatchForm() {
    app.innerHTML = `
      <section class="hero">
        <div class="brand">2° BAITS&trade;</div>
        <div class="tagline">LOG A BASS</div>
      </section>

      <section class="form-card">
        <h2>Bass Catch</h2>

        <label>Species</label>
        <select id="species">
          <option>Largemouth Bass</option>
          <option>Smallmouth Bass</option>
          <option>Spotted Bass</option>
        </select>

        <label>Weight (lb)</label>
        <select id="weight">
          <option value="">Select Weight</option>
          ${Array.from({ length: 15 }, (_, i) => `<option>${i + 1} lb</option>`).join("")}
        </select>

        <label>Length (inches)</label>
        <select id="length">
          <option value="">Select Length</option>
          ${Array.from({ length: 19 }, (_, i) => `<option>${i + 10}"</option>`).join("")}
        </select>

        <label>Lake / Pond</label>
        <input id="lake" type="text">

        <label>Lure</label>
        <select id="lure">
          <option value="">Select Lure</option>
          <option>Workhorse</option>
          <option>Mini</option>
          <option>Mesh</option>
          <option>Darkhorse</option>
          <option>Karashi</option>
          <option>Swim Jig</option>
          <option>Other</option>
        </select>

        <label>Notes</label>
        <textarea id="notes"></textarea>

        <button class="card primary" id="saveCatch">Save Catch</button>
        <button class="card" id="backHome">Back Home</button>
      </section>
    `;

    document.getElementById("saveCatch").onclick = function () {
      const catches = getCatches();

      catches.push({
        species: document.getElementById("species").value,
        weight: document.getElementById("weight").value,
        length: document.getElementById("length").value,
        lake: document.getElementById("lake").value,
        lure: document.getElementById("lure").value,
        notes: document.getElementById("notes").value,
        date: new Date().toLocaleString()
      });

      saveCatches(catches);
      alert("Bass saved!");
      homeScreen();
    };

    document.getElementById("backHome").onclick = homeScreen;
  }

  function deleteCatch(index) {
    const catches = getCatches();

    if (confirm("Delete this catch?")) {
      catches.splice(index, 1);
      saveCatches(catches);
      showTrips();
    }
  }

  window.deleteCatch = deleteCatch;

  function showTrips() {
    const catches = getCatches();

    let catchCards = "";

    if (catches.length === 0) {
      catchCards = `<p>No catches saved yet.</p>`;
    } else {
      catchCards = catches
        .map(function (c, index) {
          return { catchData: c, originalIndex: index };
        })
        .reverse()
        .map(function (item) {
          const c = item.catchData;
          const index = item.originalIndex;

          return `
            <section class="form-card">
              <h2>${c.species || "Bass"}</h2>
              <p><strong>Weight:</strong> ${c.weight || "Not entered"}</p>
              <p><strong>Length:</strong> ${c.length || "Not entered"}</p>
              <p><strong>Lake / Pond:</strong> ${c.lake || "Not entered"}</p>
              <p><strong>Lure:</strong> ${c.lure || "Not entered"}</p>
              <p><strong>Date:</strong> ${c.date || "Not entered"}</p>
              <p><strong>Notes:</strong> ${c.notes || "None"}</p>
              <button class="card danger" onclick="deleteCatch(${index})">Delete Catch</button>
            </section>
          `;
        })
        .join("");
    }

    app.innerHTML = `
      <section class="hero">
        <div class="brand">2° BAITS&trade;</div>
        <div class="tagline">MY TRIPS</div>
      </section>

      <section class="form-card">
        <h2>Fishing Log</h2>
        <button class="card primary" id="backHome">🏠 Back Home</button>
      </section>

      ${catchCards}
    `;

    document.getElementById("backHome").onclick = homeScreen;
  }

  homeScreen();
};