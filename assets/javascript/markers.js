// $(document).ready(function() {
//Parameters for the Yelp query
var proxy = 'https://cors-anywhere.herokuapp.com/';
//var proxy = "http://crossorigin.me/";
//var proxy = "https://cors-escape.herokuapp.com/";
var url = "https://api.yelp.com/v3/businesses/search";
var locationd;
// var termd = "italian food";
// var radiusd = 4000;
// var travelModed = 'DRIVING';
var termd;
var radiusd;
var travelModed;
var limitd = 10;
var sort_byd = "distance"; //Also can do by rating or best_match
var open_nowd = true;
var latituded = 34.064515;
var longituded = -118.407064;
var possibleDestinations = [];


//Var are declared out since need to be global, but have to be assigned inside
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

    
    //var line = new google.maps.PolylineOptions({strokeColor: "red"});
    
    directionsDisplay = new google.maps.DirectionsRenderer;
    directionsDisplay.setOptions({
        polylineOptions: {
            strokeColor: "blue"
            //editable: true
        },
       // draggable: true
    });
    // directionsDisplay.setOptions({
    //     option: google.maps.DirectionsRendererOptions({
    //         polylineOptions: "blue"
    //     })
    // });

     //Initialize map and Geocoder
     map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 34.047519, lng: -118.525081},
        zoom: 12
    });


    //Location object for origin
    //o = new google.maps.LatLng({"lat": latituded, "lng":longituded});
    // Geolocation
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                console.log("inside origin finding");
                allowedLocation = true;
                o = pos;
                // infoWindow.setPosition(pos);
                // infoWindow.setContent('You are around here!');
                // infoWindow.open(map);
                map.setCenter(pos);
            }, function () {
                //If they decline to share location
                console.log("Block click goes here");
                $(".location-stuff").css({
                    "display": "inline-block",                 
                });
                $("#floating-panel").css({
                    "height" : "86%",
                    "top": "7%",
                    "min-height": "660px" 
                });
                //$("#floating-panel").css("height", "88%");
                //o = origin;
                allowedLocation = false;
                console.log("Origin is: " + origin);
                console.log("O is: " + o);
                //handleLocationError(true, infoWindow, map.getCenter());
            });
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, map.getCenter());
        }

     //Size map should be
     bounds = new google.maps.LatLngBounds;
     markersArray = [];


     //What the markers will look like
     destinationIcon = 'https://chart.googleapis.com/chart?' +
         'chst=d_map_pin_letter&chld=D|FF0000|000000';
     originIcon = 'https://chart.googleapis.com/chart?' +
         'chst=d_map_pin_letter&chld=O|FFFF00|000000';


     directionsDisplay.setMap(map);

    
}


var placeMarkers = function() {
    console.log("Inside placeMarkers o: " + o);

    if(allowedLocation){

   
    $.ajax({
        
    //Making the Yelp query
    // url: proxy + "https://api.yelp.com/v3/businesses/search?term=delis&latitude=37.786882&longitude=-122.399972",
    url: proxy + "https://api.yelp.com/v3/businesses/search",
    data: {
        latitude: o.lat,
        longitude: o.lng,
        term: termd,
        radius: radiusd,
        sort_by: sort_byd,
        // open_now: open_nowd,
        limit: limitd

    },
    headers: {
        "Authorization":
        "Bearer siEX8OCYbi_jlP5s9XfsZIzFp7Y6-wLg1E9CDaP3dMl9pUBv5oSNNXDWJfXrVinZHlUQD8ParDCMjkUjt4irK5k-qnVL0IOo0sA0BHpVJnXxcGMOMhGc6QiRAEEQW3Yx"
    },
    method: 'GET'

    //Once the Yelp query has returned some businesses, do this
    }).then(thenFunction);
}

else{
    $.ajax({
        
        //Making the Yelp query
        // url: proxy + "https://api.yelp.com/v3/businesses/search?term=delis&latitude=37.786882&longitude=-122.399972",
        url: proxy + "https://api.yelp.com/v3/businesses/search",
        data: {
            location: o,
            term: termd,
            radius: radiusd,
            sort_by: sort_byd,
            // open_now: open_nowd,
            limit: limitd
    
        },
        headers: {
            "Authorization":
            "Bearer siEX8OCYbi_jlP5s9XfsZIzFp7Y6-wLg1E9CDaP3dMl9pUBv5oSNNXDWJfXrVinZHlUQD8ParDCMjkUjt4irK5k-qnVL0IOo0sA0BHpVJnXxcGMOMhGc6QiRAEEQW3Yx"
        },
        method: 'GET'
    
        //Once the Yelp query has returned some businesses, do this
        }).then(thenFunction);

}
}

var thenFunction = function(data){
    console.log(data);
        var resultcount = 0;
        var results = data.businesses;
        //console.log(businesses);
        results.forEach( function(result){
            console.log("Business name: " + result.name);
            // console.log("Latitude: " + result.coordinates.latitude);
            // console.log("Longitide: " + result.coordinates.longitude);
            // console.log("Phone: " + result.display_phone);
            // console.log("Distance: " + result.distance);
            // console.log("Price: " + result.price);
            console.log("Rating: " + result.rating);
            // console.log("Business id: " + result.id);
            console.log("Address: " + result.location.address1 + " " + result.location.city);
            console.log("");


            //var coordinates = {"lat": result.coordinates.latitude, "lng": result.coordinates.longitude}; 
            // google.maps.LatLng(result.coordinates.latitude,result.coordinates.longitude);
            //possibleDestinations.push( new google.maps.LatLng(coordinates));

            //Results from Yelp are put in this array and given to Google
            //Business name and street address are all that Google needs to find the right place
            //Only plot top 9
            //NO FOOD TRUCKS
            if( result.location.address1 !== null &&result.location.address1.length > 2 && resultcount <=8
            && !isFoodTruck(result)){
                possibleDestinations.push(result.name +", "+ result.location.address1 + ", " + result.location.zip_code);
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
        }, function(response, status) {
        if (status !== 'OK') {
            alert('Error was: ' + status);
        } else {

            console.log("Possible Destinations");
            console.log(possibleDestinations);

            console.log(response);

            //If successfully got distance matrix, put them on the map and
            //durations on the page

            //Get list of destination durations/distances
            var originList = response.originAddresses;
            var destinationList = response.destinationAddresses;

            //Div to add results on the side
            var outputDiv = document.getElementById('output');
            outputDiv.innerHTML = '';
            deleteMarkers(markersArray);


            //For destinations only
            var placeDestination= function(index) {

                //Determine if icon is origin or destination (false=origin)
                var icon = destinationIcon;
                console.log("Status: " + status);
                console.log("Index: " + index);
                return function(results, status) {
                    console.log("Weird result: ");
                    console.log(results);
                    if (status === 'OK') {

                        //What to display when marker is clicked
                        //Only show business name, address, and directions button
                        var infowindow = new google.maps.InfoWindow({
                            content: "<b>" + possibleDestinations[index].split(",")[0] + "</b><br>" +
                                possibleDestinations[index].split(",")[1].trim() + 
                                // "<br><b>Phone</b> " + finalResults[index].phone + 
                                // "<br><button id='testbutton'>Directions</button>"
                                "<br><button class='directions'>Directions</button>"
                        });
                    
                        
                        map.fitBounds(bounds.extend(results[0].geometry.location));
                        var v = results[0].geometry.viewport;
                        var latlng = new google.maps.LatLng(v.f.f, v.b.f);
                        
                        //Make marker and place it
                        var marker = new google.maps.Marker({
                            title:possibleDestinations[index].split(",")[0],
                            map: map,
                            //TODO: Check out formatted address on results[0]???? 
                            position: results[0].geometry.location,
                            // position: latlng,
                            label: labels[index],
                            //icon: icon
                        });

                        //What to do when marker is clicked
                        //https://developers.google.com/maps/documentation/javascript/events for more
                        //TODO: timer, stay open for 3 seconds or something
                        marker.addListener("click", function() {
                            infowindow.open(map, marker);
                        });

                        // marker.addListener("mouseout", function() {
                        //     infowindow.close();
                        // });

                        markersArray.push(marker);
                    } else {
                    alert('Geocode was not successful due to: ' + status);
                    }
                };
            };
            

            //For origin only
            var placeOrigin = function(){
                var icon = originIcon;
                console.log("Status: " + status);
                return function( results, status){
                    console.log("Weird result: ");
                    console.log(results);
                    if (status === 'OK'){

                        var infowindow = new google.maps.InfoWindow({
                            content: "<b>Starting Point</b>" + "<br>" +
                            response.originAddresses[0]
                        });

                        map.fitBounds(bounds.extend(results[0].geometry.location));
                        
                        //Make marker and place it
                        var marker = new google.maps.Marker({
                            title:response.originAddresses[0],
                            map: map,
                            position: results[0].geometry.location,
                            icon: icon
                        });

                        //What to do when marker is clicked
                        marker.addListener("click", function() {
                            infowindow.open(map, marker);
                        });
                        markersArray.push(marker);
                    }
                    else{
                        alert("Origin Geocode was not successful due to: " + status);
                    }
                }
            }

            function compare(a,b) {
                if (a.duration.value < b.duration.value)
                  return -1;
                if (a.duration.value > b.duration.value)
                  return 1;
                return 0;
              }


                //Read the matrix
                //Fortunate that the destinations are returned in the order they were given
                for (var i = 0; i < originList.length; i++) {
                    //For one origin, list of results, one for each destination
                    var results = response.rows[i].elements;
                    
                    console.log("results before sort");
                    console.log(results);
                   

                    

                    geocoder.geocode({'address': originList[i]},
                        placeOrigin());
                    
                    //Read each destination for one origin
                    for (var j = 0; j < results.length; j++) {

                        

                        //Only plot/display if within user's timeframe
                        if( closeEnough(results[j]) ){

                            finalResults.push( {
                                "name": possibleDestinations[j].split(",")[0],
                                //"address": possibleDestinations[j].split(",")[1],
                                "address": destinationList[j],
                                "rating": data.businesses[j].rating,
                                "price": data.businesses[j].price,
                                "duration" : {
                                    "text": results[j].duration.text,
                                    "value": results[j].duration.value
                                },
                                // "phone": data.businesses[j].display_phone,
                                "distance": results[j].distance.text
                                //"location": results[j].geometry.location
                                
                            } );
                            console.log(destinationList[j]);

                            //Place destination on the map
                            geocoder.geocode({'address': destinationList[j]},
                                placeDestination(j));
                            
                            //Put results on the side bar
                            // outputDiv.innerHTML += originList[i] + ' to ' + destinationList[j] +
                            //     ': ' + results[j].distance.text + ' in ' +
                            //     results[j].duration.text + "RATING: " + 
                            //     data.businesses[j].rating + '<br>';

                            // var option = $("<div>").html(
                            //     "<b>" + labels[j] + "</b>" + 
                            //     " To " +  data.businesses[j].name + ": " + results[j].distance.text
                            //     + " in " + results[j].duration.text + "<br> Rating: " + data.businesses[j].rating
                            // )

                            var option = $("<div>").html(
                                "<b>" + labels[j] + "</b>" +
                                " To " + finalResults[j].name + ": " + finalResults[j].distance
                                + " in " + finalResults[j].duration.text + "<br> Rating: " + finalResults[j].rating
                                + "<br> Price: " + finalResults[j].price
                            );

                            option.attr("rating", data.businesses[j].rating);


                            $("#output").append(option);
                        }

                        else{
                            console.log("*******Too far!!!!!!!******: " + 
                            destinationList[j] + results[j].duration.text);
                        }
                    }
                }

                finalResults.sort(compare);
                console.log("Final Results after sort");
                console.log(finalResults);


            }

            
        });

        
    }



//What to do when directions button is clicked
$(document).on("click", ".directions", function(){
    deleteMarkers(markersArray);
    $("#output").detach();
    $("#headline").text("Directions");

    //Get name and address from element
    //Search directions without the word "directions in the query"
    var d = $(this)[0].parentElement.innerText.slice(0,-10)
    directionsService.route({
        origin: o,
        destination: d,
        travelMode: travelModed
    }, function(response, status) {
        if(status === "OK"){
            //Get list of directions, put polyline on page, and put steps in panel
            directionsDisplay.setDirections(response);
            var data = response.routes[0];
            console.log(data);
            var steps = data.legs[0].steps;
            // steps.forEach( function(step) {
            //     $("#right-panel").append(step.instructions+"<br>");
            // });
            directionsDisplay.setPanel( document.getElementById("right-panel"));

        }
        else {
            window.alert('Directions request failed due to ' + status);
        }
    });
    
});




//Clear markers laying around on the map
function deleteMarkers(markersArray) {
    for (var i = 0; i < markersArray.length; i++) {
        markersArray[i].setMap(null);
    }
    markersArray = [];
}

    
// });
