window.onload = function () {

  const cards = document.querySelectorAll(".card");

  cards[0].onclick = function () {
    alert("🎣 Log a Catch is coming next!");
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