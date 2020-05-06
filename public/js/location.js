var map, addresses, datasource, popup, fullTP, results = [];
var featuresTEST = [];
var searchOptions = {
   view: 'Auto',
   limit: 1 
};
var start, end, isBusy = false;

var addresses = featuresTEST;
//GET INFORMATION FROM SQL DATABASE
$.get("/api/stores", function(storeDataLogs) {
    storesinfo = storeDataLogs;
    console.log(storeDataLogs);
    // ITERATE THROUGH COORDINATES AND PASS TO FEATURESTEST ARRAY
    storesinfo.forEach(obj => {
        uniqueTag = obj.id;
        storeAddress = obj.store_address;
        existingStore = obj.longlat;
        featuresTEST.push(storeAddress)
    ;
    })})
    console.log(featuresTEST)
    
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
   geoURL = new atlas.service.SearchURL(pipeline);
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
    geoSource = new atlas.source.DataSource();
    map.sources.add(geoSource);
//Add a layer for rendering data.
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


   });
    //map.layers.add(new atlas.layer.BubbleLayer(geoSource));
    async function parallelGeocode() {
       var requests = [];

       //Create the request promises.
       for (var i = 0; i < addresses.length; i++) {
           requests.push(geoURL.searchAddress(atlas.service.Aborter.timeout(10000), addresses[i], searchOptions));
       }

       //Process the promises in parallel.
       var responses = await Promise.all(requests);

       //Extract the GeoJSON feature results.
       responses.forEach(r => {
           var fc = r.geojson.getFeatures();

           if (fc.features.length > 0) {
               results.push(fc.features[0]);
           }
       });

       //Done.
       endSearch();
   }


   function endSearch() {
       end = window.performance.now();
       geoSource.setShapes(results);
       isBusy = false;
   }

   function getSearchOptionsQueryParams() {
       //Creates a formatted key-value pair query string from a json object.
       return Object.keys(searchOptions).map(function (key) {
           return key + '=' + encodeURIComponent(searchOptions[key]);
       }).join('&');
   }


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
          store_Inventory = 1;
          console.log("address: "+ store_address + "store ID: " +store_ID + ", store Name: " + store_Name + " ,longitude: " + store_Long)
      }
      //=== end of custom sql code
  
       //Create HTML from properties of the selected result.
       var html = `
       <div style="padding:5px">
       <div><b>${p.poi.name}</b></div>
       <div>${p.address.freeformAddress}</div>
       <div>${position[1]}, ${position[0]}</div>
     </div>
     <form name="radio-buttons">
     <div class="row">
       <label class="col">
         <input type="radio" name="tp-status" value="0">
         <img class="col" src="img/empty-roll.PNG" alt="no toilet paper">
       </label>
       
       <label class="col">
         <input type="radio" name="tp-status" value="1">
         <img class="col" src="img/toilet-paper.svg" alt="moderate amount of toilet paper">
       </label>
       <label class="col">
         <input type="radio" name="tp-status" value="2">
         <img class="col" src="img/tower-of-tp.PNG" alt="tons of toilet paper">
       </label>
       <!-- Left as default selected radio button incase user doesn't select the options above. So we can identify junk in our db -->
       <label>
         <input type="radio" name="tp-status" value="3" checked>
       </label>
     </div>
   </form>
   <div class="modal-footer">
       <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
       <button type="button" class="btn btn-primary" id="submit-button" data-storeid="${p.id}" onclick="submitTP()">Submit</button>
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





