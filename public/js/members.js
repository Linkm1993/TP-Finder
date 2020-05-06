$(document).ready(function() {
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  $.get("/api/user_data").then(function(data) {
    $(".member-name").text(data.email);
  });
});

function submitTP() {
  var radioValue = $("input[name='tp-status']:checked").val();
  var storeID = $("input[name='storeID']").val();
  console.log("you chose"+ " " + radioValue);
  console.log(storeID);
  sendTPStatus(storeID, radioValue);
};

function sendTPStatus(storeID, radioValue) {
  $.ajax({
    type: "POST",
    url: "/api/status",
    data: {
      storeID: storeID,
      radioValue: radioValue
    }
  });
}