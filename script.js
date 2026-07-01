window.onload = function () {
  const cards = document.querySelectorAll(".card");

  cards[0].onclick = function () {
    document.body.innerHTML = `
      <main class="app">
        <section class="hero">
          <div class="brand">LOG A BASS</div>
          <div class="tagline">2° BAITS CATCH LOG</div>
        </section>

        <section class="form-card">
          <h2>Bass Catch Details</h2>

          <label>Bass Type</label>
          <select>
            <option>Largemouth Bass</option>
            <option>Smallmouth Bass</option>
            <option>Spotted Bass</option>
          </select>

          <label>Weight</label>
          <input placeholder="Example: 4 lb 6 oz">

          <label>Length</label>
          <input placeholder="Example: 19 inches">

          <label>Lake / Pond</label>
          <input placeholder="Where did you catch it?">

          <label>Lure</label>
          <input placeholder="Example: 2° Baits Mesh">

          <label>Notes</label>
          <textarea placeholder="Cover, water clarity, retrieve, weather..."></textarea>

          <button class="card primary" onclick="location.reload()">Back Home</button>
        </section>
      </main>
    `;
  };

  cards[1].onclick = function () {
    alert("📍 My Trips is coming soon.");
  };

  cards[2].onclick = function () {
    alert("📊 Statistics is coming soon.");
  };

  cards[3].onclick = function () {
    alert("⚙️ Settings is coming soon.");
  };
};