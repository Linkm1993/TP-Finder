var map, datasource, popup, fullTP, results = [];


function GetMap(){
//cleanline = shopData.toString();
//console.log(cleanline);
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
    //Wait until the map resources are ready.
    map.events.add('ready', function() {
        //=====TESTING ADDRESS RETRIEVAL ===== ///
       storeTest = [];
       $.get("/api/stores", function(storeDataLogs) {
        storesinfo = storeDataLogs;
        console.log(storeDataLogs);
        storesinfo.forEach(obj => {
            uniqueTag = obj.id;
            existingStore = obj.longlat;
            console.log(existingStore);
            userLocation.add(new atlas.data.Point([existingStore]));
        })})
//=====TESTING ADDRESS RETRIEVAL ===== ///

       startSearch();
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
   //console.log("the onestore command: " + oneStore);
   //Load the custom image icon into the map resources.
   
   

   //Add a layer for rendering data.
   //map.layers.add(new atlas.layer.SymbolLayer(existingLocations));
   existingLocations = new atlas.source.DataSource();
   map.sources.add(existingLocations);
    map.imageSprite.add('tp-full', 'https://cdn.shopify.com/s/files/1/0251/2525/7269/files/tp-full.png');
    
    var fullTP = new atlas.layer.SymbolLayer(existingLocations,null, {
           iconOptions: {
               image: 'tp-full',
               anchor: 'center',
               size: 0.4,
               allowOverlap: false
           }
        
         });
         
         map.layers.add(fullTP);
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
            allowOverlap: false
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
    });
    
    var pipeline = atlas.service.MapsURL.newPipeline(new atlas.service.SubscriptionKeyCredential(atlas.getSubscriptionKey()));
    searchLat = new atlas.service.SearchURL(pipeline);
    searchURL = new atlas.service.SearchURL(pipeline);
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
       console.log("store Response: " +storeResponse.id);

       // Uses the response data for clicked icon to pull data and plug into sql script below
       for(storeData=0; storeData < 10; storeData++){
           store_ID = storeResponse.id;
           store_Name = storeResponse.poi.name;
           store_Long = position[0];
           store_Lat = position[1];
           store_Inventory = 1;
           console.log("store ID: " +store_ID + ", store Name: " + store_Name + " ,longitude: " + store_Long)
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
        </div>

        `
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
              uniqueID: store_ID,
              availability: store_Inventory,
              longlat : store_Long +","+ store_Lat
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
    }


//============================== ADDED BY RICARDO TO GET LOGLAT

var map, existingLocations, searchLat;
var start, end, isBusy = false;
       
var results = [];

var searchOptions = {
    view: 'Auto',
    limit: 1    //Only need one result per address.
};

//Set of addresses to geocode.
//var latlong = [cleanline];
//console.log(latlong.length);


function startSearch() {
    if (!isBusy) {
        isBusy = true;
        results = [];

        start = window.performance.now();

                parallelGeocode();

        }
    }

/**
 * This method will iterate through all the locations and make multiple parallel requests.
 * The browser will limit the number of concurrent requests to the same domain.
 */
async function parallelGeocode() {
    var requests = [];
    var searchOptions = {
        view: 'Auto',
        limit: 1    //Only need one result per address.
    };
    //Create the request promises.

        $.get("/api/stores", function(storeDataLogs) {
            
            storesinfo = storeDataLogs;
            console.log(storeDataLogs);
            storesinfo.forEach(obj => {
                uniqueTag = obj.id;
                existingStore = obj.longlat;
                userLocation.add(new atlas.data.Point([existingStore]));
                
                //shopData.push(existingStore);
                requests.push(searchLat.searchAddressReverse(atlas.service.Aborter.timeout(10000), existingStore, searchOptions));
                console.log(requests);
            })})






    // for (var i = 0; i < latlong.length; i++) {
    //     requests.push(searchLat.searchAddressReverse(atlas.service.Aborter.timeout(10000), latlong[i]));
    // }

    //Process the promises in parallel.
    var responses = await Promise.all(requests);

    //Extract the GeoJSON feature results.
    responses.forEach(r => {
        var fc = r.geojson.getFeatures();

        if (fc.features.length > 0) {
            results.push(fc.features[0]);
        }
    });
    existingLocations.add(results);
    console.log(results);
    isBusy = false;
    //Done.
   endSearch();
}


// function endSearch() {

// }
}

