
       


podmap.controller('HomeCtrl', function($http, $scope, $ionicPopup, $firebase, Items){

  var lat;
  $scope.items = Items;
  var lng;
  var loc;
  var geometry;
  var placename;
   $scope.data = {};
   $scope.event = {};
  var geojsonpoint =   {};

  var eventsource = {
    "type": "FeatureCollection",
        "features": []
  };



//---------------------------------popup functions for add event----------------------------


  $scope.addpopup = function() {

  
  var myPopup = $ionicPopup.show({
    templateUrl: 'templates/popup.html',
    title: 'Add Event',
    subTitle: 'Enter a description of your event',
    scope: $scope,
    buttons: [
      { text: 'Cancel' },
      {
        text: '<b>Save</b>',
        type: 'button-positive',
        onTap: function(e) {
          if (!$scope.event.description) {
          console.log(""+$scope.event.location);
          console.log(""+$scope.event.description);
          console.log(""+$scope.event.time);


            //don't allow the user to close unless he enters a description
          } else {
          console.log(""+$scope.event.location);
          console.log(""+$scope.event.description);
          console.log(""+$scope.event.time);

          
          // each geojson is composed of three elements 
          // these are type, which is always feature
          // then geometry - which should be set as the rootscope geometry 
          // then comes the properties, under which description needs to be created
          // the whole array needs to be created outside of the function set data - set data is final.
          // wait why dont we take it from the already existing file? just put var array = one of the files. 
          
          //the setting up firebase pushing data
          var database = firebase.database();
        
          var ref = firebase.database().ref("eventstorage");

      
                
          var number = eventsource.features.length;

          geojsonpoint.number = {
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": []
            },
            "properties": {
              "description": "h",
              "time":"x"
            }
          };

          console.log(""+JSON.stringify(eventsource));

          geojsonpoint.number.geometry = geometry;

          geojsonpoint.number.properties.description = $scope.event.description;

          geojsonpoint.number.properties.time = $scope.event.time;

          eventsource.features.push(geojsonpoint.number);

          map.getSource('events').setData(eventsource);

          console.log(""+JSON.stringify(eventsource));

// firebase if required 
            firebase.database().ref("eventstorage").set({
         data: eventsource,
           });


          //to remove the single point once the data has been stored in an alternative file 
          map.getSource('single-point').setData({"type":"Point","coordinates":[,]});

        
            //get this object of description and add it to an array upon add data
        //set the source of data to the whole array
        //also take the object of geometry and add it before the data
            return $scope.event.description;
          }
        }
      }
    ]
  });

};


// -----------------getting current location ----------------------------------------
    
   navigator.geolocation.getCurrentPosition(function(position){
  	lat = position.coords.latitude;
  	lng = position.coords.longitude;
  	console.log("lat is "+lat);
  	console.log("lng is "+lng);   

   });

// ----------------------------getting weather ---------------------------------------

   $http.get('http://api.openweathermap.org/data/2.5/weather?lat=1.2966195&lon=103.7878815&APPID=46dbff62ac4fb2c897ee4fd887955380').then(function(response){
    $scope.rain = response.data.weather[0].description;
    $scope.humidity = response.data.main.humidity;
    $scope.temp = response.data.main.temp;
   }, function(error){
    //there was an error fetching from the server
   });

// ---------------------------mapbox setup and style----------------------------    
   
	mapboxgl.accessToken = 'pk.eyJ1Ijoia2VzaGF2c2l2YWt1bWFyIiwiYSI6ImNpdG55YW9lNDAyMGszcHNidzJnb3JpZmgifQ.FW-zM4aFCWwtcB3f4Jplrg';
	var map = new mapboxgl.Map({
	    container: 'map',
	    style: 'mapbox://styles/keshavsivakumar/citnz88z300052iql9rq6boyl',
	    zoom: 10
	});


// -------------------geocoder and related functions -----------------------------------

var geocoder = new mapboxgl.Geocoder({
      container: 'geocoder-container' 

});

  map.addControl(geocoder);

  geocoder.on('result', function(ev) {
    //getting place name and setting it 
        var placename = JSON.stringify(ev.result.place_name);
        var placename1 = placename.split(",");
        console.log(""+placename1[0]);
        $scope.event.location = placename1[0];

        geometry = ev.result.geometry;
        map.getSource('single-point').setData(ev.result.geometry);

        
    });



// -------------------------------centering -------------------------------------------
	(function() {
   	  map.flyTo({
        center: [103.7878815,1.2987645]
      });
    })();

// ---------------------on load ------------------------------------------------

	map.on('load',function(){

// -----------------------adding permanent source for location of events --------------------

map.addSource('events', {
        "type": "geojson",
        "data": eventsource
    });

map.addLayer({
        "id": "events",
        "source": "events",
        "type": "symbol",
        "layout": {
      'icon-image': 'cafe-15',
      'icon-size': 2,
      'icon-allow-overlap': true
    }
        
    });

// ---------------temporary source for the geocoder search function--------------------------

    map.addSource('single-point', {
        "type": "geojson",
        "data": {
            "type": "FeatureCollection",
            "features": []

        }
    });

map.addLayer({
        "id": "point",
        "source": "single-point",
        "type": "symbol",
        "layout": {
      'icon-image': 'castle-15',
      'icon-size': 2,
      'icon-allow-overlap': true
    }
        
    });
   
// ------------------- adding a a marker for personal locations (sorry but the browser thinks its off the coast of africa) --------------
    
		map.addSource("points",{
			"type": "geojson",
			"data": {
				"type": "FeatureCollection",
				"features": [{
					"type": "Feature",
					"geometry": {
						"type": "Point",
						"coordinates": [lat,lng]
					},
					"properties": {
						"description": "<strong>Me!</strong>"
            }

					}
				]
			}
		});

map.addLayer({
    "id": 'points',
    "type": 'symbol',
    "source": 'points',
    "layout": {
      'icon-image': 'marker-15',
      'icon-size': 2,
      'icon-allow-overlap': true
    },
      "paint": {
      'icon-opacity': 0.99,
      'icon-color': "#00ffff"
    }

    
  });
// ------------------------this is adding the hardcoded stores to the map (the layer and source) ----------------

			map.addSource('places', {
    		type: 'geojson',
    		data: stores
  		});

	map.addLayer({
    "id": 'locations',
  "type": 'symbol',
   "source": 'places',
   "layout": {
     'icon-image': 'information-15',
     'icon-size': 2,
     'icon-allow-overlap': true
 }
 });
	
	});
// ---------------hard-coded stores variable for trial --------------------------------//


   var stores = {
 
        "type": "FeatureCollection",
        "features": [
          {
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [
                103.79672499999999,
                1.2966195999999999
              ]
            },
            "properties": {
              'marker-color': '#3ca0d3',
              'marker-size': 'large',
              'marker-symbol': 'rocket',
              "phoneFormatted": "(202) 234-7336",
              "phone": "2022347336",
              "address": "1471 P St NW",
              "city": "Washington DC",
              "country": "United States",
              "crossStreet": "at 15th St NW",
              "postalCode": "20005",
              "state": "D.C.",
              "description": "<strong>Starbucks Fusionopolis</strong><p>Best coffee shop</p>"
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [
                103.78672499999999,
                1.3176195999999999
              ]
            },
            "properties": {
              'marker-color': '#3ca0d3',
              'marker-size': 'large',
              'marker-symbol': 'rocket',
              "phoneFormatted": "(202) 507-8357",
              "phone": "2025078357",
              "address": "2221 I St NW",
              "city": "Washington DC",
              "country": "United States",
              "crossStreet": "at 22nd St NW",
              "postalCode": "20037",
              "state": "D.C."
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [
                103.76972499999999,
                1.3076195999999999              ]
            },
            "properties": {
              'marker-color': '#3ca0d3',
              'marker-size': 'large',
              'marker-symbol': 'rocket',
              "phoneFormatted": "(202) 387-9338",
              "phone": "2023879338",
              "address": "1512 Connecticut Ave NW",
              "city": "Washington DC",
              "country": "United States",
              "crossStreet": "at Dupont Circle",
              "postalCode": "20036",
              "state": "D.C."
            }
          }
         ]
};


//------------------------------on click for popups----------------------


	map.on('click', function (e) {


    if (!$scope.event.description){

            var features = map.queryRenderedFeatures(e.point, { layers: ['point'] });
      if (!features.length) {
          return;
      }
      
      var feature = features[0];

      // Populate the popup and set its coordinates
      // based on the feature found.

         var popup = new mapboxgl.Popup()
          .setLngLat(geometry.coordinates)
          .setHTML("Want to add an event?")
          .addTo(map); 

    } else {

	    var features = map.queryRenderedFeatures(e.point, { layers: ['events'] });
	    if (!features.length) {
	        return;
	    }
      
	    var feature = features[0];

	    // Populate the popup and set its coordinates
	    // based on the feature found.

         var popup = new mapboxgl.Popup()
          .setLngLat(feature.geometry.coordinates)
          .setHTML("<strong> Event: </strong>"+feature.properties.description+"<strong> Date: </strong>"+feature.properties.time)
          .addTo(map); 
        
};

	});

  });

// --------------------------------------------------------the end -----------


	

	