window.onload = function () {

  const app = document.querySelector(".app");

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
  document.getElementById("stats").onclick = () => alert("Statistics coming soon.");
  document.getElementById("settings").onclick = () => alert("Settings coming soon.");
}

function deleteCatch(index) {
  const catches = JSON.parse(localStorage.getItem("catches")) || [];
  catches.splice(index, 1);
  localStorage.setItem("catches", JSON.stringify(catches));
  homeScreen();
}

window.deleteCatch = deleteCatch;

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
          <option>Under 1 lb</option>
          <option>1 lb</option>
          <option>1.5 lb</option>
          <option>2 lb</option>
          <option>2.5 lb</option>
          <option>3 lb</option>
          <option>3.5 lb</option>
          <option>4 lb</option>
          <option>4.5 lb</option>
          <option>5 lb</option>
          <option>5.5 lb</option>
          <option>6 lb</option>
          <option>6.5 lb</option>
          <option>7 lb</option>
          <option>7.5 lb</option>
          <option>8 lb</option>
          <option>8.5 lb</option>
          <option>9 lb</option>
          <option>9.5 lb</option>
          <option>10+ lb</option>
        </select>

        <label>Length (inches)</label>
        <select id="length">
          <option value="">Select Length</option>
          <option>8"</option>
          <option>9"</option>
          <option>10"</option>
          <option>11"</option>
          <option>12"</option>
          <option>13"</option>
          <option>14"</option>
          <option>15"</option>
          <option>16"</option>
          <option>17"</option>
          <option>18"</option>
          <option>19"</option>
          <option>20"</option>
          <option>21"</option>
          <option>22"</option>
          <option>23"</option>
          <option>24"</option>
          <option>25"</option>
          <option>26"</option>
          <option>27"</option>
          <option>28"+</option>
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
      const catches = JSON.parse(localStorage.getItem("catches") || "[]");

      catches.push({
        species: document.getElementById("species").value,
        weight: document.getElementById("weight").value,
        length: document.getElementById("length").value,
        lake: document.getElementById("lake").value,
        lure: document.getElementById("lure").value,
        notes: document.getElementById("notes").value,
        date: new Date().toLocaleString()
      });

      localStorage.setItem("catches", JSON.stringify(catches));
      alert("Bass saved!");
      homeScreen();
    };

    document.getElementById("backHome").onclick = homeScreen;
  }

  function showTrips() {
    const catches = JSON.parse(localStorage.getItem("catches") || "[]");

    let catchCards = "";

    if (catches.length === 0) {
      catchCards = `<p>No catches saved yet.</p>`;
    } else {
      catches.slice().reverse().forEach(function(c) {
        catchCards += `
          <div class="form-card">
            <h2>${c.species}</h2>
            <p><strong>Weight:</strong> ${c.weight || "Not entered"}</p>
            <p><strong>Length:</strong> ${c.length || "Not entered"}</p>
            <p><strong>Lake / Pond:</strong> ${c.lake || "Not entered"}</p>
            <p><strong>Lure:</strong> ${c.lure || "Not entered"}</p>
            <p><strong>Date:</strong> ${c.date}</p>
            <p><strong>Notes:</strong> ${c.notes || "None"}</p>
          </div>
        `;
      });
    }

    app.innerHTML = `
      <section class="hero">
        <div class="brand">2° BAITS&trade;</div>
        <div class="tagline">MY TRIPS</div>
      </section>

      <section class="form-card">
        <h2>Fishing Log</h2>
        <button class="card" id="backHome">Back Home</button>
      </section>

      ${catchCards}
    `;

    document.getElementById("backHome").onclick = homeScreen;
  }

  document.querySelectorAll(".card")[0].onclick = showCatchForm;
  document.querySelectorAll(".card")[1].onclick = showTrips;

  document.querySelectorAll(".card")[2].onclick = function () {
    alert("Statistics coming soon.");
  };

  document.querySelectorAll(".card")[3].onclick = function () {
    alert("Settings coming soon.");
  };

};