var map, addresses, addressesHalf, addressesEmpty, datasource, popup, fullTP,
results = [];
resultsHalf = [];
resultsEmpty = [];
var featuresFULL = [];
var featuresHALF = [];
var featuresEMPTY = [];
//var inventoryAmt = [];
var searchOptions = {
   view: 'Auto',
   limit: 1 
};
var start, end, isBusy = false;
//var inventoryAmt = inventoryLevel;
var addresses = featuresFULL;
var addressesHalf = featuresHALF;
var addressesEmpty = featuresEMPTY;
//GET INFORMATION FROM SQL DATABASE
$.get("/api/stores", function(storeDataLogs) {
    storesinfo = storeDataLogs;
    console.log(storeDataLogs);
    // ITERATE THROUGH COORDINATES AND PASS TO FEATURESTEST ARRAY
    storesinfo.forEach(obj => {
        uniqueTag = obj.id;
        storeAddress = obj.store_address;
        storeInventory = obj.availability;
        existingStore = obj.longlat;
        //inventoryLevel.push(storeInventory)
        if(storeInventory === 2){
            featuresFULL.push(storeAddress);
            }
        if(storeInventory === 1){
            featuresHALF.push(storeAddress);
            }
        if(storeInventory === 0){
            featuresEMPTY.push(storeAddress);
            }
        
    ;
    })
})
  
function GetMap(){

   //Instantiate a map object
   var map = new atlas.Map("myMap", {
       showFeedbackLink: false,
       showLogo: false,
       style: 'grayscale_light',
       //Add your Azure Maps subscription key to the map SDK. Get an Azure Maps key at https://azure.com/maps
       authOptions: {
           authType: 'subscriptionKey',
           subscriptionKey: 'oZUx6Omt9NUikroHFTz8Ad3L9oNOBdAAsa19qIlPgNM'
       }
   });
   
   var pipeline = atlas.service.MapsURL.newPipeline(new atlas.service.SubscriptionKeyCredential(atlas.getSubscriptionKey()));
   searchURL = new atlas.service.SearchURL(pipeline);
   geoURL = new atlas.service.SearchURL(pipeline); // FOR FULL TP
   geoURLHALF = new atlas.service.SearchURL(pipeline); // FOR HALF TP
   geoURLEMPTY = new atlas.service.SearchURL(pipeline); // FOR EMPTY TP
   //Wait until the map resources are ready.
   map.events.add('ready', function() {
      

       parallelGeocode();
   //Load the custom image icon into the map resources.
   map.imageSprite.add('going-potty', 'https://cdn.shopify.com/s/files/1/0251/2525/7269/files/tp-hunter-lg.png').then(function () {
      userLocation = new atlas.source.DataSource();
      userLocation.add(new atlas.data.Point([lon, lat]));
      map.sources.add(userLocation);
       //var userSpot = new atlas.layer.SymbolLayer(userLocation, null, {
      map.layers.add(new atlas.layer.SymbolLayer(userLocation, null, {
          iconOptions: {
              image: 'going-potty',
              anchor: 'center',
              size: 0.5,
              allowOverlap: true
          }
      }));
  });

  //Create a data source and add it to the map.
  datasource = new atlas.source.DataSource();
  map.sources.add(datasource);
      

  //Add a layer for rendering point data.
  map.imageSprite.add('question-tp', 'https://cdn.shopify.com/s/files/1/0251/2525/7269/files/question-tp.png');
  var resultLayer = new atlas.layer.SymbolLayer(datasource, null, {
      iconOptions: {
          image: 'question-tp',
          anchor: 'center',
          size: 0.3,
          allowOverlap: true
      },
      textOptions: {
          anchor: "top"
      }
  });

  //map.layers.add(userSpot);
  map.layers.add(resultLayer);
  popup = new atlas.Popup();
  //Add a mouse over event to the result layer and display a popup when this event fires.
    map.events.add('click', resultLayer, showPopup);

//=============  toilet paper inventory IMAGES ==========//
// FULL INVENTORY
    geoSource = new atlas.source.DataSource();
    map.sources.add(geoSource);
    map.imageSprite.add('tp-full', 'https://cdn.shopify.com/s/files/1/0251/2525/7269/files/tp-full.png');
    var tpFound = new atlas.layer.SymbolLayer( geoSource,null, {
    iconOptions: {
        image: 'tp-full',
        anchor: 'center',
        size: 0.4,
        allowOverlap: true
    }
    });
        map.layers.add(tpFound);
// HALF INVENTORY
geoHalf = new atlas.source.DataSource();
map.sources.add(geoHalf);
map.imageSprite.add('tp-half', 'https://cdn.shopify.com/s/files/1/0251/2525/7269/files/tp-half.png');
var tpHalf = new atlas.layer.SymbolLayer( geoHalf,null, {
iconOptions: {
    image: 'tp-half',
    anchor: 'center',
    size: 0.4,
    allowOverlap: true
}
});
    map.layers.add(tpHalf);
    popup = new atlas.Popup();
    //Add a mouse over event to the result layer and display a popup when this event fires.
      map.events.add('click', tpHalf, showPopup);
// EMPTY INVENTORY
geoEmpty = new atlas.source.DataSource();
map.sources.add(geoEmpty);
map.imageSprite.add('tp-empty', 'https://cdn.shopify.com/s/files/1/0251/2525/7269/files/tp-empty.png');
var tpEmpty = new atlas.layer.SymbolLayer( geoEmpty,null, {
iconOptions: {
    image: 'tp-empty',
    anchor: 'center',
    size: 0.4,
    allowOverlap: true
}
});
    map.layers.add(tpEmpty);
    popup = new atlas.Popup();
    //Add a mouse over event to the result layer and display a popup when this event fires.
      map.events.add('click', tpEmpty, showPopup);

   });
//=============  END toilet paper inventory IMAGES ==========//

//============= START toilet paper inventory ROUTING ==========//
async function parallelGeocode() {
    var requests = [];
    var requestsHALF = [];
    var requestsEMPTY = [];

    //FULL TP Create the request promises.
    for (var i = 0; i < addresses.length; i++) {
        requests.push(geoURL.searchAddress(atlas.service.Aborter.timeout(10000), addresses[i], searchOptions));
    }
    //HALF TP Create the request promises.
    for (var i = 0; i < addressesHalf.length; i++) {
        requestsHALF.push(geoURLHALF.searchAddress(atlas.service.Aborter.timeout(10000), addressesHalf[i], searchOptions));
    }
    //EMPTY TP Create the request promises.
    for (var i = 0; i < addressesEmpty.length; i++) {
        requestsEMPTY.push(geoURLEMPTY.searchAddress(atlas.service.Aborter.timeout(10000), addressesEmpty[i], searchOptions));
    }
    //FUll TP Process the promises in parallel.
    var responses = await Promise.all(requests);
    //Some TP Process the promises in parallel.
    var responsesHalf = await Promise.all(requestsHALF);
    //No TP Process the promises in parallel.
    var responsesEmpty = await Promise.all(requestsEMPTY);
    //Extract the GeoJSON feature results.
    responses.forEach(r => {
        var fc = r.geojson.getFeatures();
        if (fc.features.length > 0) {
            results.push(fc.features[0]);
        }
    });
    //Extract the GeoJSON feature results.
    responsesHalf.forEach(r => {
        var fc = r.geojson.getFeatures();
        if (fc.features.length > 0) {
            resultsHalf.push(fc.features[0]);
        }
    });
    //Extract the GeoJSON feature results.
    responsesEmpty.forEach(r => {
        var fc = r.geojson.getFeatures();
        if (fc.features.length > 0) {
            resultsEmpty.push(fc.features[0]);
        }
    });
    //Done.
    endSearch();
}
function endSearch() {
    end = window.performance.now();
    geoSource.setShapes(results);
    geoHalf.setShapes(resultsHalf);
    geoEmpty.setShapes(resultsEmpty);
    isBusy = false;
}

//============= END full toilet paper inventory ==========//
   // Latitude & Longitude are provided by the 'map.js' script for geolocation function
   var query =  'grocery-store';
   var radius = 9000;
   var lat = latitudeLoc;
   var lon = longitudeLoc;
  
   searchURL.searchPOI(atlas.service.Aborter.timeout(10000), query, {
       limit: 10,
       lat: lat,
       lon: lon,
       radius: radius
  
   }).then((results) => {
       // Extract GeoJSON feature collection from the response and add it to the datasource
       var data = results.geojson.getFeatures();
       datasource.add(data);
       // set camera to bounds to show the results
       map.setCamera({
           bounds: data.bbox,
           zoom: 10
       });
      
   });
  
   //Create a popup but leave it closed so we can update it and display it later.
   function showPopup(e) {
       //Get the properties and coordinates of the first shape that the event occurred on.
       var p = e.shapes[0].getProperties();
       var position = e.shapes[0].getCoordinates();

       //==== gets data to put into sql
      let storeResponse = e.shapes[0].getProperties();
      console.log(storeResponse);

      // Uses the response data for clicked icon to pull data and plug into sql script below
      for(storeData=0; storeData < 10; storeData++){
          store_ID = storeResponse.id;
          store_Name = storeResponse.poi.name;
          store_address = storeResponse.address.freeformAddress;
          store_Long = position[0];
          store_Lat = position[1];
          store_Inventory = 3;
          console.log("address: "+ store_address + "store ID: " +store_ID + ", store Name: " + store_Name + " ,longitude: " + store_Long)
      }
      //=== end of custom sql code
  
       //Create HTML from properties of the selected result.
       var html = `
       <div style="padding:5px">
       <div><b>${p.poi.name}</b></div>
       <div>${p.address.freeformAddress}</div>
     </div>`
         ;
  
       //Update the content and position of the popup.
       popup.setPopupOptions({
           content: html,
           position: position
       });
       // ==============
       // write into db
       // ==============


       let newStore = {
           store_name: p.poi.name,
           store_address: p.address.freeformAddress,
             uniqueID: store_ID,
             availability: store_Inventory,
             longlat : store_Long + ","+ store_Lat
           };
           $.ajax({
               method: "POST",
               url: "/api/stores",
               data: newStore
             }).then(
             function() {
               console.log("new store added!");
             }
           );
       //================//
       //Open the popup.
       popup.open(map);
  
}}





