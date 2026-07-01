window.onload = function () {

  const app = document.querySelector(".app");

  function homeScreen() {
    location.reload();
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
        <input id="weight" type="text">

        <label>Length (inches)</label>
        <input id="length" type="text">

        <label>Lake / Pond</label>
        <input id="lake" type="text">

        <label>Lure</label>
        <input id="lure" type="text">

        <label>Notes</label>
        <textarea id="notes"></textarea>

        <button class="card primary" id="saveCatch">Save Catch</button>

        <button class="card" id="backHome">Back Home</button>
      </section>
    `;

    document.getElementById("saveCatch").onclick = function () {

      const catches =
        JSON.parse(localStorage.getItem("catches") || "[]");

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

    };

    document.getElementById("backHome").onclick = homeScreen;

  }

  document.querySelectorAll(".card")[0].onclick = showCatchForm;

  document.querySelectorAll(".card")[1].onclick = function () {

    const catches =
      JSON.parse(localStorage.getItem("catches") || "[]");

    if (catches.length === 0) {
      alert("No catches saved yet.");
      return;
    }

    let text = "";

    catches.forEach(function(c){

      text +=
        c.date +
        "\n" +
        c.species +
        " - " +
        c.weight +
        " lb\n\n";

    });

    alert(text);

  };

  document.querySelectorAll(".card")[2].onclick = function () {
    alert("Statistics coming soon.");
  };

  document.querySelectorAll(".card")[3].onclick = function () {
    alert("Settings coming soon.");
  };

};