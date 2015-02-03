// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

var App = {
  missedConnections: [],
  baseUrl: '/api/v1/missed_connections/',

  //FUNCTION TO ADD POINTS TO MAP AND SET MAP LOCATION TO BUSHWICK
  initialize: function() {
    var missedConnectionParam = window.location.pathname.match(/missed_connections\/(\d*)/);
    var mapOptions = {
      zoom: 12,
      center: new google.maps.LatLng(40.711815, -73.968449)
    };

    App.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    if (missedConnectionParam != null) {
      var url = App.baseUrl + missedConnectionParam[1];
    } else {
      var url = App.baseUrl;
    }

    //AJAX REQUEST TO ADD MARKERS TO MAP FROM MISSED CONNECTION DATA
    $.ajax({
      url: url,
      success: function(data) {
        var missedConnections = $.makeArray(data.missed_connections);
        App.addMarkers(missedConnections);
      }
    });
  },

  addMarkers: function(missedConnections) {
    for (i = 0; i < missedConnections.length; i++) {
      var missedConnection = missedConnections[i];
      missedConnection.marker = new google.maps.Marker({
        map: App.map,
        position: new google.maps.LatLng(missedConnection.latitude, missedConnection.longitude),
        infoWindow: new google.maps.InfoWindow(),
      });
      App.missedConnections.push(missedConnection);

      App.addMissedConnectionLinkEvent();
      App.addMarkerClickEvent(missedConnection);
      App.addInfoWindowCloseClickEvent(missedConnection);

      if (missedConnections.length === 1) {
        App.setBoundsOfSingleMarker(missedConnection.marker);
      }
    }
  },

  //PANS TO SPECIFIC GOOGLE MAP MARKER WHEN CLICKED FROM MENU, SETS ZOOM
  moveToMarker: function(marker) {
    App.map.panTo(marker.position);
    App.map.setZoom(15);
  },

  //OPENS MARKER INFO BOX ON MISSED CONNECTION
  setActiveMissedConnection: function(missedConnection) {
    App.removeActiveMissedConnection();
    $('.missed-connection[data-missed-connection-id="' + missedConnection.id + '"]').addClass('active');
  },

  //REMOVES MARKER INFO BOX ON MISSED CONNECTION
  removeActiveMissedConnection: function() {
    $('.missed-connection[data-missed-connection-id]').removeClass('active');
  },

  //CLOSES MARKER WINDOW ON GOOGLE MAP POINT
  closeAllInfoWindows: function() {
    for (i = 0; i < App.missedConnections.length; i++) {
      App.missedConnections[i].marker.infoWindow.close();
    }
  },

<<<<<<< HEAD
  //OPENS CORRECT DATA FOR MISSED CONNECTION MAP POINT USING ID #
=======
  
>>>>>>> 9b0df8ffd6eb67e03740f1d5b2ed9e41c64ec201
  addMissedConnectionLinkEvent: function() {
    $('.missed-connection').click(function(event) {
      event.preventDefault();
      var missedConnectionId = $(this).data('missedConnectionId');
      var missedConnection = $.grep(App.missedConnections, function(e) {
        return e.id === missedConnectionId;
      })[0];
      google.maps.event.trigger(missedConnection.marker, 'click');
    });
  },

  //FORMATTING FOR MISSED CONNECTION INFO INSIDE MISSED CONNECTION INFO BOX @ MARKER
  addMarkerClickEvent: function(missedConnection) {
    google.maps.event.addListener(missedConnection.marker, 'click', (function(missedConnection) {
      return function() {
        App.closeAllInfoWindows();
        App.setActiveMissedConnection(missedConnection);
        missedConnection.marker.infoWindow.setContent(
          '<h4>' + missedConnection.title + '</h4>' + "\n" +
          '<p>' + missedConnection.body + '</p><br>' + "\n" +
          '<a href="' + window.location.origin + missedConnection.verification_path + '">' + "That's Me!" + '</a>'
        )
        missedConnection.marker.infoWindow.open(App.map, missedConnection.marker);
        App.moveToMarker(missedConnection.marker);
      }
    })(missedConnection));
  },

  //CLOSES INFO WINDOW ON MARKER
  addInfoWindowCloseClickEvent: function(missedConnection) {
    google.maps.event.addListener(missedConnection.marker.infoWindow, 'closeclick', (function() {
      return function() {
        App.removeActiveMissedConnection();
      }
    })());
  },

  //SETS MAP BOUNDS FOR SINGLE MARKER 
  setBoundsOfSingleMarker: function(marker) {
    google.maps.event.trigger(marker, 'click');
    App.map.setZoom(17);
  }
}

google.maps.event.addDomListener(window, 'load', App.initialize);
