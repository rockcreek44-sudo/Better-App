const app = document.getElementById("app");

const STORAGE_KEY = "betterAppCatches";

function getCatches() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveCatches(catches) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(catches));
}

function showHome() {
  const catches = getCatches();

  app.innerHTML = `
    <section class="hero">
      <div class="brand">2° BAITS&trade;</div>
      <div class="tagline">LOG A BASS</div>
    </section>

    <section class="card">
      <h2>Fishing Log</h2>
      <p>Total Catches: ${catches.length}</p>
      <button class="card primary" id="newCatch">Log Catch</button>
      <button class="card" id="viewCatches">View Catches</button>
    </section>
  `;

  document.getElementById("newCatch").onclick = showCatchForm;
  document.getElementById("viewCatches").onclick = showCatches;
}

function showCatchForm(editIndex = null) {
  const catches = getCatches();
  const editing = editIndex !== null;
  const catchData = editing ? catches[editIndex] : {};

  app.innerHTML = `
    <section class="hero">
      <div class="brand">2° BAITS&trade;</div>
      <div class="tagline">LOG A BASS</div>
    </section>

    <section class="form-card">
      <h2>${editing ? "Edit Catch" : "Bass Catch"}</h2>

      <label>Species</label>
      <select id="species">
        <option>Largemouth Bass</option>
        <option>Smallmouth Bass</option>
        <option>Spotted Bass</option>
      </select>

      <label>Weight (lb)</label>
      <select id="weight">
        <option value="">Select Weight</option>
        ${["<1 lb","1 lb","2 lb","3 lb","4 lb","5 lb","6 lb","7 lb","8 lb","9 lb","10 lb","11 lb","12 lb","13 lb","14 lb","15 lb+"]
          .map(w => `<option>${w}</option>`)
          .join("")}
      </select>

      <label>Length (inches)</label>
      <select id="length">
        <option value="">Select Length</option>
        ${Array.from({ length: 21 }, (_, i) => `<option>${i + 8}"</option>`).join("")}
        <option>30"+</option>
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

      <button class="card primary" id="saveCatch">${editing ? "Save Changes" : "Save Catch"}</button>
      <button class="card" id="backHome">Back Home</button>
    </section>
  `;

  if (editing) {
    document.getElementById("species").value = catchData.species || "Largemouth Bass";
    document.getElementById("weight").value = catchData.weight || "";
    document.getElementById("length").value = catchData.length || "";
    document.getElementById("lake").value = catchData.lake || "";
    document.getElementById("lure").value = catchData.lure || "";
    document.getElementById("notes").value = catchData.notes || "";
  }

  document.getElementById("saveCatch").onclick = function () {
    const newCatch = {
      species: document.getElementById("species").value,
      weight: document.getElementById("weight").value,
      length: document.getElementById("length").value,
      lake: document.getElementById("lake").value,
      lure: document.getElementById("lure").value,
      notes: document.getElementById("notes").value,
      date: catchData.date || new Date().toLocaleDateString()
    };

    if (editing) {
      catches[editIndex] = newCatch;
    } else {
      catches.push(newCatch);
    }

    saveCatches(catches);
    showCatches();
  };

  document.getElementById("backHome").onclick = showHome;
}

function showCatches() {
  const catches = getCatches();

  app.innerHTML = `
    <section class="hero">
      <div class="brand">2° BAITS&trade;</div>
      <div class="tagline">LOG A BASS</div>
    </section>

    <section class="card">
      <h2>Saved Catches</h2>

      ${
        catches.length === 0
          ? `<p>No catches logged yet. Go stick one.</p>`
          : catches.map((c, index) => `
              <div class="catch-card">
                <h3>${c.species || "Bass"}</h3>
                <p><strong>Date:</strong> ${c.date || ""}</p>
                <p><strong>Weight:</strong> ${c.weight || "Not entered"}</p>
                <p><strong>Length:</strong> ${c.length || "Not entered"}</p>
                <p><strong>Lake / Pond:</strong> ${c.lake || "Not entered"}</p>
                <p><strong>Lure:</strong> ${c.lure || "Not entered"}</p>
                <p><strong>Notes:</strong> ${c.notes || "None"}</p>
                <button class="card" onclick="showCatchForm(${index})">Edit</button>
                <button class="card" onclick="deleteCatch(${index})">Delete</button>
              </div>
            `).join("")
      }

      <button class="card primary" id="addAnother">Log Another Catch</button>
      <button class="card" id="backHome">Back Home</button>
    </section>
  `;

  document.getElementById("addAnother").onclick = showCatchForm;
  document.getElementById("backHome").onclick = showHome;
}

function deleteCatch(index) {
  const catches = getCatches();
  catches.splice(index, 1);
  saveCatches(catches);
  showCatches();
}

showHome();