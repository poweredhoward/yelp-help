var proxy = 'https://cors-anywhere.herokuapp.com/';
var url = "https://api.yelp.com/v3/businesses/search";
var locationd;
var termd;
var radiusd;
var travelModed;
var limitd = 10;
var sort_byd = "distance";
var open_nowd = true;
var latituded = 34.064515;
var longituded = -118.407064;
var possibleDestinations = [];
var geocoder;
var directionsDisplay;
var directionsService;
var o;
var bounds;
var destinationIcon;
var originIcon;
var map;

function initMap() {
    geocoder = new google.maps.Geocoder;
    directionsService = new google.maps.DirectionsService;    
    directionsDisplay = new google.maps.DirectionsRenderer;
    directionsDisplay.setOptions({
        polylineOptions: {
            strokeColor: "blue"
        }
    });

    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 34.047519, lng: -118.525081},
        zoom: 12
    });


    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            allowedLocation = true;
            o = pos;

            map.setCenter(pos);

        }, function () {
            $(".location-stuff").css({
                "display": "inline-block",
            });

            $("#floating-panel").css({
                "height": "86%",
                "top": "7%"
            });

            allowedLocation = false;
        });
    } else {
        handleLocationError(false, infoWindow, map.getCenter());
    }

    bounds = new google.maps.LatLngBounds;
    markersArray = [];

    destinationIcon = 'https://chart.googleapis.com/chart?' +
        'chst=d_map_pin_letter&chld=D|FF0000|000000';
    originIcon = 'https://chart.googleapis.com/chart?' +
        'chst=d_map_pin_letter&chld=O|FFFF00|000000';

    directionsDisplay.setMap(map);
}

var placeMarkers = function() {
    if (allowedLocation) {
        $.ajax({
            url: proxy + "https://api.yelp.com/v3/businesses/search",
            data: {
                latitude: o.lat,
                longitude: o.lng,
                term: termd,
                radius: radiusd,
                sort_by: sort_byd,                // open_now: open_nowd,
                limit: limitd
            },

            headers: {
                "Authorization":
                    "Bearer siEX8OCYbi_jlP5s9XfsZIzFp7Y6-wLg1E9CDaP3dMl9pUBv5oSNNXDWJfXrVinZHlUQD8ParDCMjkUjt4irK5k-qnVL0IOo0sA0BHpVJnXxcGMOMhGc6QiRAEEQW3Yx"
            },

            method: 'GET'

        }).then(thenFunction);

    } else {
        $.ajax({
            url: proxy + "https://api.yelp.com/v3/businesses/search",
            data: {
                location: o,
                term: termd,
                radius: radiusd,
                sort_by: sort_byd,
                limit: limitd
            },

            headers: {
                "Authorization":
                    "Bearer siEX8OCYbi_jlP5s9XfsZIzFp7Y6-wLg1E9CDaP3dMl9pUBv5oSNNXDWJfXrVinZHlUQD8ParDCMjkUjt4irK5k-qnVL0IOo0sA0BHpVJnXxcGMOMhGc6QiRAEEQW3Yx"
            },

            method: 'GET'

        }).then(thenFunction);
    }
}


var thenFunction = function(data){
    var resultcount = 0;
    var results = data.businesses;

    results.forEach(function (result) {
        if (result.location.address1 !== null && result.location.address1.length > 2 && resultcount <= 8
            && !isFoodTruck(result)) {
            possibleDestinations.push(result.name + ", " + result.location.address1 + ", " + result.location.zip_code);
            resultcount++;
        }
    });

    var service = new google.maps.DistanceMatrixService;

    service.getDistanceMatrix({
        origins: [o],
        destinations: possibleDestinations,
        travelMode: travelModed,
        unitSystem: google.maps.UnitSystem.IMPERIAL,
        avoidHighways: false,
        avoidTolls: false
    }, function (response, status) {
        if (status !== 'OK') {
            alert('Error was: ' + status);
        } else {
            var originList = response.originAddresses;
            var destinationList = response.destinationAddresses;
            var outputDiv = document.getElementById('output');

            outputDiv.innerHTML = '';

            deleteMarkers(markersArray);

            var placeDestination = function (index) {
                return function (results, status) {
                    if (status === 'OK') {
                        var infowindow = new google.maps.InfoWindow({
                            content: "<b>" + possibleDestinations[index].split(",")[0] + "</b><br>" +
                                possibleDestinations[index].split(",")[1].trim() +
                                "<br><button class='directions'>Directions</button>"
                        });

                        map.fitBounds(bounds.extend(results[0].geometry.location));
                        
                        var v = results[0].geometry.viewport;
                        // var latlng = new google.maps.LatLng(v.f.f, v.b.f);

                        var marker = new google.maps.Marker({
                            title: possibleDestinations[index].split(",")[0],
                            map: map,
                            position: results[0].geometry.location,
                            // position: latlng,
                            label: labels[index]
                        });

                        marker.addListener("click", function () {
                            infowindow.open(map, marker);
                        });

                        markersArray.push(marker);

                    } else {
                        alert('Geocode was not successful due to: ' + status);
                    }
                };
            };

            var placeOrigin = function () {
                var icon = originIcon;
                return function (results, status) {
                    if (status === 'OK') {
                        var infowindow = new google.maps.InfoWindow({
                            content: "<b>Starting Point</b>" + "<br>" +
                                response.originAddresses[0]
                        });

                        map.fitBounds(bounds.extend(results[0].geometry.location));

                        var marker = new google.maps.Marker({
                            title: response.originAddresses[0],
                            map: map,
                            position: results[0].geometry.location,
                            icon: icon
                        });

                        marker.addListener("click", function () {
                            infowindow.open(map, marker);
                        });

                        markersArray.push(marker);
                    } else {
                        alert("Origin Geocode was not successful due to: " + status);
                    }
                }
            };

            function compare(a, b) {
                if (a.duration.value < b.duration.value)
                    return -1;
                if (a.duration.value > b.duration.value)
                    return 1;
                return 0;
            }

            for (var i = 0; i < originList.length; i++) {
                var results = response.rows[i].elements;

                geocoder.geocode({ 'address': originList[i] },
                    placeOrigin());

                for (var j = 0; j < results.length; j++) {
                    if (closeEnough(results[j])) {
                        finalResults.push({
                            "name": possibleDestinations[j].split(",")[0],
                            "address": destinationList[j],
                            "rating": data.businesses[j].rating,
                            "price": data.businesses[j].price,
                            "duration": {
                                "text": results[j].duration.text,
                                "value": results[j].duration.value
                            },
                            "distance": results[j].distance.text
                        });

                        geocoder.geocode({ 'address': destinationList[j] },
                            placeDestination(j));

                        var option = $("<div>").html(
                            "<b>" + labels[j] + "</b>" +
                            " To " + finalResults[j].name + ": " + finalResults[j].distance
                            + " in " + finalResults[j].duration.text + "<br> Rating: " + finalResults[j].rating
                            + "<br> Price: " + finalResults[j].price
                        );

                        option.attr("rating", data.businesses[j].rating);

                        $("#output").append(option);
                    } else {
                        console.log("*******Too far!!!!!!!******: " + destinationList[j] + results[j].duration.text);
                    };
                };
            }

            finalResults.sort(compare);
        };
    });
}

$(document).on("click", ".directions", function(){
    deleteMarkers(markersArray);

    $("#output").detach();
    $("#headline").text("Directions");

    var d = $(this)[0].parentElement.innerText.slice(0,-10)
    directionsService.route({
        origin: o,
        destination: d,
        travelMode: travelModed
    }, function(response, status) {
        if (status === "OK") {
            directionsDisplay.setDirections(response);
            directionsDisplay.setPanel( document.getElementById("right-panel"));
        } else {
            window.alert('Directions request failed due to ' + status);
        };
    });
});

function deleteMarkers(markersArray) {
    for (var i = 0; i < markersArray.length; i++) {
        markersArray[i].setMap(null);
    }

    markersArray = [];
}