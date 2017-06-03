// Creates global variables
var map, marker;
var markers = [];

function initMap() {

// Top places for 'Discovering Midtown-Reno' app
var locations = [
        {   title: '40 Mile Saloon',
            location: {lat: 39.509838, lng: -119.805449}
        },
        {   title: 'The Brewers Cabinet',
            location: {lat: 39.520518, lng: -119.817287}
        },
        {   title: 'Plumas Park',
            location: {lat: 39.513312, lng: -119.814212}
        },
        {   title: 'The Melting Pot',
            location: {lat: 39.513929, lng: -119.80733}
        },
        {   title: 'The Studio',
            location: {lat: 39.513131, lng: -119.807137}
        }
  ];

// Create a styles array to use with the map.
    var styles = [
      {
        featureType: 'water',
        stylers: [
          { color: '#19a0d8' }
        ]
      },{
        featureType: 'administrative',
        elementType: 'labels.text.stroke',
        stylers: [
          { color: '#ffffff' },
          { weight: 6 }
        ]
      },{
        featureType: 'administrative',
        elementType: 'labels.text.fill',
        stylers: [
          { color: '#e85113' }
        ]
      },{
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [
          { color: '#efe9e4' },
          { lightness: -40 }
        ]
      },{
        featureType: 'transit.station',
        stylers: [
          { weight: 9 },
          { hue: '#e85113' }
        ]
      },{
        featureType: 'road.highway',
        elementType: 'labels.icon',
        stylers: [
          { visibility: 'off' }
        ]
      },{
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [
          { lightness: 100 }
        ]
      },{
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [
          { lightness: -100 }
        ]
      },{
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [
          { visibility: 'on' },
          { color: '#f0e4d3' }
        ]
      },{
        featureType: 'road.highway',
        elementType: 'geometry.fill',
        stylers: [
          { color: '#efe9e4' },
          { lightness: -25 }
        ]
      }
    ];

// Constructor creates a new map
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 39.513295, lng: -119.81618},
      zoom: 14,
      styles: styles,
      mapTypeControl: false
    });
  
  // The following group uses the 'data' array to create an array of markers on 
  // initialize.
    var largeInfoWindow = new google.maps.InfoWindow(); 
    // Creates a "default location" marker color for when the user
    // mouses over the marker.
    var defaultIcon = makeMarkerIcon('551A8B');
    // Creates a "highlighted location" marker color for when the user
    // mouses over the marker.
    var highlightedIcon = makeMarkerIcon('FFFF24');
    for (var i = 0; i < locations.length; i++) {
      // Get the position and title from the data array.
      var position = locations[i].location;
      var title = locations[i].title;
      // Create a marker per location, and put into markers array.
      var marker = new google.maps.Marker({
        map: map,
        position: position,
        title: title,
        animation: google.maps.Animation.DROP,
        icon: defaultIcon,
        id: i
      });
      // Attach the marker to he place object
      vm.places()[i].marker = marker;
      // Push the marker to our array of markers.
      markers.push(marker);
      // Create an onclick event to open an infowindow at each marker.
      marker.addListener('click', function() {
        populateInfoWindow(this, largeInfoWindow);
      });
      // Two event listeners - one for mouseover, one for mouseout,
      // to change the colors back and forth.
      marker.addListener('click', function() {
        this.setIcon(highlightedIcon);
        this.setAnimation(google.maps.Animation.BOUNCE);
      });
      marker.addListener('mouseout', function() {
        this.setIcon(defaultIcon);
        this.setAnimation(null);
      });
    };

  // This function populates the infowindow when the marker is clicked. We'll only allow
  // one infowindow which will open at the marker that is clicked, and populate based
  // on that markers position.
  function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
      // Clear the infowindow content to give the streetview time to load.
      infowindow.setContent('');
      infowindow.marker = marker;
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick',function(){
        infowindow.setMarker = null;
      });
      var streetViewService = new google.maps.StreetViewService();
      var radius = 50;
      // In case the status is OK, which means the pano was found, compute the
      // position of the streetview image, then calculate the heading, then get a
      // panorama from that and set the options
      function getStreetView(data, status) {
        if (status == google.maps.StreetViewStatus.OK) {
          var nearStreetViewLocation = data.location.latLng;
          var heading = google.maps.geometry.spherical.computeHeading(
            nearStreetViewLocation, marker.position);
            infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
            var panoramaOptions = {
              position: nearStreetViewLocation,
              pov: {
                heading: heading,
                pitch: 30
              }
            };
          var panorama = new google.maps.StreetViewPanorama(
            document.getElementById('pano'), panoramaOptions);
        } else {
          infowindow.setContent('<div>' + marker.title + '</div>' +
            '<div>No Street View Found</div>');
        }
      }
      // Use streetview service to get the closest streetview image within
      // 50 meters of the markers position
      streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
      // Open the infowindow on the correct marker.
      infowindow.open(map, marker);
    }
  }

  // This function takes in a COLOR, and then creates a new marker
  // icon of that color. The icon will be 21 px wide by 34 high, have an origin
  // of 0, 0 and be anchored at 10, 34).
  function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
      'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
      '|40|_|%E2%80%A2',
      new google.maps.Size(21, 34),
      new google.maps.Point(0, 0),
      new google.maps.Point(10, 34),
      new google.maps.Size(21,34));
    return markerImage;
  };
}

function loadArticles() {
  // load nytimes
  var $nytElem = $('#places-list');
  $nytElem.text('');

  var placeStr = $(vm.places()[i].title).val();

  var nytimesUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + placeStr + '&sort=newest&api-key=0dade8ebd7a448ada515bb4ec61b9cb1';
  $.getJSON(nytimesUrl, function(data){

      articles = data.response.docs;
      for (var i = 0; i < articles.length; i++) {
          var article = articles[i];
          $nytElem.append('<li class="place-article">'+
              '<a href="'+article.web_url+'">'+article.headline.main+'</a>'+
              'data-bind="text: nytarticle"'+
          '</li>');
      };

  }).error(function(e){
      $nytElem.text('New York Times Articles Could Not Be Loaded');
  });
}

// My ViewModel.
ViewModel = function(){
  var self = this;

  self.places = ko.observableArray([
        {   title: '40 Mile Saloon',
            address: '1495 S Virginia St, Reno, NV 89502',
            pnumber: '(775) 323-1877',
            nytarticle: ''
        },
        {   title: 'The Brewers Cabinet',
            address: '475 S Arlington Ave, Reno, NV 89501',
            pnumber: '(775) 348-7481',
            nytarticle: ''
        },
        {   title: 'Plumas Park',
            address: '1200 Plumas St, Reno, NV 89500',
            pnumber: 'N/A',
            nytarticle: ''
        },
        {   title: 'The Melting Pot',
            address: '1049 S Virginia St, Reno, NV 89502',
            pnumber: '(775) 322-9445',
            nytarticle: ''
        },
        {   title: 'The Studio',
            address: '1085 S Virginia St, Reno, NV 89502',
            pnumber: '(775) 284-5545',
            nytarticle: ''
        }
  ]);


// Filters 'Top Places'.
  self.filter = ko.observable('');
  self.filteredPlaces = ko.computed(function() {
      var filter = self.filter().toLowerCase();
      if (!filter) {
        self.places().forEach(function(place) {
          if(place.marker) {
          place.marker.setVisible(true);
          }
        });
          return self.places();
      } else {
          return ko.utils.arrayFilter(self.places(), function(place) {
              if(place.title.toLowerCase().indexOf(filter) > -1) {
              	 place.marker.setVisible(true);
                 return true;
              }
                else {
                  place.marker.setVisible(false);
                  return false;
                }
          });
      }
  }, self);
}
var vm = new ViewModel();
ko.applyBindings(vm);