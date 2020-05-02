//MapQuest api key
L.mapquest.key = 'AE679ItGuD0Kuf8tb45Ir4Koo7Bh2D1L';

//Generating map in the mapid div in html
let map = L.mapquest.map('mapid', {
  center: [37.7749, -122.4194],
  layers: L.mapquest.tileLayer('map'),
  zoom: 12
  });

//Adding controls to map ex: zoom in and out
map.addControl(L.mapquest.control());
