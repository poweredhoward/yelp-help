var floatingpanel;
var cuisine;
var origin;
var transport;
var duration;
var finalResults = [];
var markersArray;
var labels = "ABCDEFGHIJKLMNOP";
var allowedLocation;

function newQuery(){
    deleteMarkers(markersArray);
    finalResults = [];
    $("#output").empty();
    possibleDestinations = [];
    placeMarkers();
}

$("#btn-float").click( function() {
    cuisine = $("#cuisine-float").val().toLowerCase();
    transport = $("#transport-float :selected").text().toUpperCase();
    duration = $("#duration-float").val();

    if (!allowedLocation) {
        origin = $("#origin-float").val();
        o = origin;
    }   

    termd = cuisine;
    travelModed = transport;
    radiusd = String( timeToDistance( parseInt(duration), transport) );

    var t =  $("#transport-float option:selected").val();

    $("#transport-header").val(t);
    $("#floating-panel").slideDown();    
    $("#header").slideDown();
    $("#right-panel").css("display", "inline-block" );
    $("#map").css("width", "70%" );   
    $(".blurred").css("filter", "blur(0px)" );
    $("#map").css("transition-duration", "1s" );                    
    $("#cuisine-header").val(cuisine);
    $("#origin-header").val(origin);
    $("#duration-header").val(duration);

    floatingpanel = $("#floating-panel").detach();
    
    placeMarkers();
});

$("#btn-header").click( function() {
    cuisine = $("#cuisine-header").val().toLowerCase();
    transport = $("#transport-header :selected").text().toUpperCase();
    duration = $("#duration-header").val();

    termd = cuisine;
    travelModed = transport;
    radiusd = String( timeToDistance( parseInt(duration), transport) );

    newQuery();
});


//Convert time in minutes to meters for Yelp
//Assume driving is 45mph and walking is 3.5mph
var timeToDistance = function (time, method) {
    if (method === "DRIVING") {
        return time * 1107;
    } else if (method === "TRANSIT") {
        return time * 900;
    } else {
        return time * 96;
    };
};

//Sort selector for Results output
function sortThis() {
    var selectedIndex = $("#selectBox option:selected").index();

    if (selectedIndex === 1) {
        finalResults.sort(function (a, b) {
            return a.duration.value - b.duration.value;
        });
    } else if (selectedIndex === 2) {
        finalResults.sort(function (a, b) {
            return  b.rating - a.rating;
        });
    } else if (selectedIndex === 3) {
        finalResults.sort(function (a, b) {
            return  a.price.length - b.price.length;
        });
    } else {
        return false;
    };

    changeOrder();
}

function changeOrder(){
    $("#output").empty();

    for (var i = 0; i < finalResults.length; i++) {
        changeMarkerLabel(finalResults[i].name, i);
        
        var option = $("<div>").html(
            "<b>" + labels[i] + "</b>" +
            " To " + finalResults[i].name + ": " + finalResults[i].distance
            + " in " + finalResults[i].duration.text + "<br> Rating: " + finalResults[i].rating
            + "<br> Price: " + finalResults[i].price
        );

        $("#output").append(option);
    }
}

function changeMarkerLabel(name, index) {
    for (var i = 0; i < markersArray.length; i++) {
        if (markersArray[i].getTitle() === name){
            markersArray[i].setLabel( {"text": labels[index]} );
        }
    };
}

var closeEnough = function(destination) {
    if (destination.duration.value > parseInt(duration) * 60) {
        return false;
    } else {
        return true;
    };
}

function isFoodTruck(result) {
    var r = false;

    result.categories.forEach( function(category){
        if (category.alias==="foodtrucks") {
            r = true;
        }
    })

    return r;
}