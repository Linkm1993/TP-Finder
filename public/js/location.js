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
    //Wait until the map resources are ready.
    map.events.add('ready', function() {
         
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
   console.log("the onestore command: " + oneStore);
   //Load the custom image icon into the map resources.

   fullTP = new atlas.source.DataSource();
   map.sources.add(fullTP);
   map.imageSprite.add('tp-full', 'https://cdn.shopify.com/s/files/1/0251/2525/7269/files/tp-full.png').then(function () {
    trVal = trialValue.replace(/['"]+/g, ''); 
    console.log(trVal);
   fullTP.add(trialValue);
      //fullTP.add(new atlas.data.Point([-75.82479, 39.59081]));
      trialRUN;
      console.log(trialValue);
      
       map.layers.add(new atlas.layer.SymbolLayer(fullTP,{
           iconOptions: {
               image: 'tp-full',
               anchor: 'center',
               size: 0.4,
               allowOverlap: false
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
              uniqueID: store_ID,
              availability: store_Inventory,
              longlat : "["+store_Long +", "+store_Lat+"]"
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
}