    var map;

    function initMap(lat, lng, fixedCenter, zoom) {
      var latlng = new google.maps.LatLng(lat, lng);
      var opts = {
        gestureHandling: "auto",
        zoom: (zoom === undefined)? 8 : zoom,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: latlng
      };
      map = new google.maps.Map(document.getElementById("gmap"), opts);
	    setMarker(lat, lng, map, fixedCenter);
    

    function onError() {
      map.textContent = "Unable to locate you";
    }
    function onSuccess(geo) {
      const position1 = {
        lat: geo.coords.latitude,
        lng: geo.coords.longitude
      };
      // Reposition the map to the detected location
      map.setCenter(position1);
      map.setZoom(zoom === undefined)? 8 : zoom;
      // Add a marker
//      new google.maps.Marker({ position, map: map });
    }
    if(fixedCenter){
    if (!navigator.geolocation) {
      onError();
    } else {
      navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }
    }
  }

    function initMapSearchControl(controlUI) {
        controlUI.index = 1;
        controlUI.style.marginTop = "5px";
        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(controlUI);
    }
    function initMapCustomControl(controlUI) {
        controlUI.index = 1;
        controlUI.style.marginBottom = "15px";
        map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(controlUI);
    }

		function setLatLng(id) {
				document.getElementById(id).value= map.getCenter();
		}

		function clearLatLng(id) {
				document.getElementById(id).value= "";
		}

		function setMarker(lat,lng,map,fixedCenter){
				var latLng = new google.maps.LatLng(lat, lng);
        var marker = new google.maps.Marker({
            position: latLng,  map: map,
            zIndex: 1000
        });

				if(fixedCenter){
      	  cm_flag = true;
					google.maps.event.addListener(map, 'center_changed', function(none) {
   	         if (cm_flag) {
   	             marker.setMap(null);
   	             marker.setPosition(map.getCenter());
   	             marker.setMap(map);
   	         }
   	      });
				}
		}

    function searchMap() {
      var oSearch = document.getElementById("search");
      var value = oSearch.value;
      if (value.replace(/\s/g, "") != "") {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({address: value}, function(results) {
          if (results && results.length > 0) {
            var result = results[0];
            oSearch.value = result.formatted_address;
            if (result.geometry.viewport) {
              map.fitBounds(result.geometry.viewport);
            } else {
              map.setCenter(result.geometry.location);
            }
          } else {
            alert(oSearch.getAttribute("data-place-not-found-msg"));
            oSearch.select();
          }
        });
      }
    }

    function returnValue() {
			var latLng = map.getCenter();
      latLng = new google.maps.LatLng(latLng.lat(), latLng.lng()); // see https://code.google.com/p/gmaps-api-issues/issues/detail?id=3247
      window.opener.$("#" + window.name).val(latLng.lat() + "," + latLng.lng());
    }

