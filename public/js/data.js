$( window ).ready(function(){
    getStores();
})
var storesinfo = [];
var oneStore;
var trialRUN;
var trialValue = [];

function getStores() {
  $.get("/api/stores", function(storeDataLogs) {
    
      storesinfo = storeDataLogs;
      console.log(storeDataLogs);
      storeDataLogs.forEach(obj => {
        //Object.entries(obj).forEach(([key, value]) => {
          existingID = obj.id;
          existingStore = obj.longlat;
          existingInventory = obj.availability;
          dataLinesReturned = storeDataLogs.length;
          //new atlas.data.Feature(new atlas.data.Point([-122.335, 47.645])
          trialValue.push("store"+ obj.id++);
          console.log(trialValue);
          //trialRUNprepend = trialValue + "= new atlas.source.DataSource();"
          trialRUN = "var store"+ obj.id +" = new atlas.data.Feature(new atlas.data.Point(" + existingStore + "));";
          //return obj.longlat, obj.availability;
       // console.log("obj ID: " + existingID + "location long/lat: " + obj.longlat + "store Inventory: " + obj.availability + ", store name: " + obj.store_name + " , object length: " + storeDataLogs.length);
          
        //});

      })
  })
  //console.log(trialValue);
  
}

function obj(item, index) {
    document.getElementsByClassName("store-container").innerHTML += index + ":" + item + "<br>";
    console.log(index + item)
}
