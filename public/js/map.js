$('#search-input').click(function() {
  getLocation();
  // Get all Stores from database when page loads
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
  var radioValue = $("input[name='tp-status']:checked").val();
  var storeID = $("#exampleModalLongTitle").data("storeID");
  console.log("you chose"+ " " + radioValue);
  console.log(storeID);
  sendTPStatus(storeID, radioValue);
});

function sendTPStatus(storeID, radioValue) {
  // var storeID = p.poi.id; //DONT ACTUALLY KNOW WHAT API VAL IS CALLED, JUST MADE UP
}

$( document ).ready(function() {
  $('#search-input').trigger("click");
});