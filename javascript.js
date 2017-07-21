function initMap(data) {
  var searchLocation = data.results[0].geometry.location;

  map = new google.maps.Map(document.getElementById("map"), {
    center: searchLocation,
    zoom: 12
  });

  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch({
      location: searchLocation,
      radius: 8500,
      type: ["cafe"],
      keyword: ["coffee -starbucks -kneaders -dutch -dunkin"]
    },
    processResults
  );

  // infowindow.open(map, service);
}

function addScript(url, callback) {
  var script = document.createElement("script");
  if (callback) script.onload = callback;
  script.type = "text/javascript";
  script.src = url;
  document.body.appendChild(script);
}

function processResults(results, status, pagination) {
  if (status !== google.maps.places.PlacesServiceStatus.OK) {
    return;
  } else {
    createMarkers(results);
    console.log(results);
    if (pagination.hasNextPage) {
      var moreButton = document.getElementById("more");

      moreButton.disabled = false;

      moreButton.addEventListener("click", function() {
        moreButton.disabled = true;
        pagination.nextPage();
      });
    }
  }
}

function createMarkers(places) {
  var bounds = new google.maps.LatLngBounds();
  var placesList = document.getElementById("places");
  console.log(placesList);

  for (var i = 0, place;
    (place = places[i]); i++) {
    var image = {
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25)
    };
    console.log(place);
    var name = place.name;
    var rating = place.rating || "";
    var vicinity = place.vicinity;
    var phone = place.formatted_phone_number || "";
    var website = place.website || "";
    var contentString = '<span style="padding: 0px; text-align:left" align="left"><h5>' + name + "&nbsp; &nbsp; " + rating + "</h5><p>" + vicinity + (phone ? "<br />" + phone : "") + (website ? "<br />" + '<a  target="_blank" href=' + website + ">" + website + "</a>" : "") + "</p>";
    console.log(place);
    var infowindow = new google.maps.InfoWindow({
      content: contentString
    });

    var marker = new google.maps.Marker({
      map: map,
      icon: image,
      title: place.name,
      position: place.geometry.location
    });
    marker.name = name;
    marker.rating = rating;
    marker.vicinity = vicinity
    marker.phone = phone;
    marker.website = website;

    marker.addListener("click", function() {
      infowindow.setContent('<span style="padding: 0px; text-align:left" align="left"><h5>' + this.title + "&nbsp; &nbsp; " + this.rating + "</h5><p>" + this.vicinity + (this.phone ? "<br />" + this.phone : "") + (this.website ? "<br />" + '<a  target="_blank" href=' + this.website + ">" + this.website + "</a>" : "") + "</p>")
      infowindow.open(map, this);
    });

    // console.log(place.geometry.location)
    placesList.innerHTML += "<li>" + place.name + " | " + place.rating + " | " + place.vicinity + "</li>";

    bounds.extend(place.geometry.location);
  }
  map.fitBounds(bounds);
}


function mapsApiReady() {
  $("#button").click(function() {
    $("#places").empty();
    var searchStr = $("#text").val();
    console.log(searchStr);
    $.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + searchStr + "&key=AIzaSyD4eZE48-juA4qtWRJgeLIxx0nzultOfa0", function(data) {
      console.log(data.results[0].geometry.location);
      var map;
      initMap(data);
    });
  });
}
