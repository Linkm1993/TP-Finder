$('#search-input').click(function() {
  getLocation();
})
function getLocation() {
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(showPosition);
} else {
  x.innerHTML = "Geolocation is not supported by this browser.";
}
}

function showPosition(position) {
  latitudeLoc = position.coords.latitude;
  longitudeLoc = position.coords.longitude;
console.log("Latitude: " + position.coords.latitude + "Longitude: " + position.coords.longitude);
GetMap();
}

$("#submit-button").click(function() {
  console.log("Yay it worked!")
})