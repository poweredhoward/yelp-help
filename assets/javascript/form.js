var floatingpanel;
var cuisine;
var origin;
var transport;
var duration;
var finalResults = [];
var markersArray;
var labels = "ABCDEFGHIJKLMNOP";
var allowedLocation;

console.log("Outside");

$("#btn-float").click( function(){
    
    console.log("hi");
    cuisine = $("#cuisine-float").val().toLowerCase();
    transport = $("#transport-float :selected").text().toUpperCase();
    duration = $("#duration-float").val();
    origin = $("#origin-float").val();
    o = origin;
    

    termd = cuisine;
    travelModed = transport;
    radiusd = String( timeToDistance( parseInt(duration), transport) );

    console.log(cuisine, transport, duration);


    var t =  $("#transport-float option:selected").val();
    console.log("hello" + t);
    $("#transport-header").val(t);

    $("#header").css("display" , "inline-block" );
    $("#cuisine-header").val(cuisine);
    $("#origin-header").val(origin);
    floatingpanel = $("#floating-panel").detach();
    $("#duration-header").val(duration);
    placeMarkers();
});

//Submit button on header >>
$("#btn-header").click( function(){
    deleteMarkers(markersArray);
    cuisine = $("#cuisine-header").val().toLowerCase();
    transport = $("#transport-header :selected").text().toUpperCase();
    duration = $("#duration-header").val();

    termd = cuisine;
    travelModed = transport;
    radiusd = String( timeToDistance( parseInt(duration), transport) );

    console.log(cuisine, transport, duration);
    //floatingpanel = $("#floating-panel").detach();
    placeMarkers();
});


//Convert time in minutes to meters for Yelp
//Assume driving is 45mph and walking is 3.5mph
var timeToDistance = function (time, method){
    if( method === "DRIVING"){
        //1207 is meters per minute @ 45 mph
        return time * 1207;
    }
    else{
        return time * 96;
    }
    
};

//Sort selector for Results output
function sortThis() {
    console.log("Clicked");
    var selectBox = $("#selectBox");
    //var selectedValue = selectBox.options[selectBox.selectedIndex].value;
    var selectedIndex = $("#selectBox option:selected").index();
    console.log("Selected index: " + selectedIndex);

    if (selectedIndex === 1) {
        finalResults.sort(function (a, b) {
            return a.duration.value - b.duration.value;
            //return sorted;
        });
        //$("#output").html(sorted);
    } else if (selectedIndex === 2) {
        finalResults.sort(function (a, b) {
            return  b.rating - a.rating;
           // return sorted;
        });
       // $("#output").html(sorted);
    } 
    else if (selectedIndex === 3) {
        finalResults.sort(function (a, b) {
            return  a.price.length - b.price.length;
           // return sorted;
        });
       // $("#output").html(sorted);
    } 
    else {
        return false;
    }

    console.log("Final Results: ");
    console.log(finalResults);

    changeOrder();
}

function changeOrder(){
    $("#output").empty();

    for( var i=0 ; i <finalResults.length ; i++){

        //Updates labels for markers so they match the new results order
        changeMarkerLabel(finalResults[i].name, i);
        var option = $("<div>").html(
            "<b>" + labels[i] + "</b>" +
            " To " + finalResults[i].name + ": " + finalResults[i].distance
            + " in " + finalResults[i].duration.text + "<br> Rating: " + finalResults[i].rating
            + "<br> Price: " + finalResults[i].price
        );

        $("#output").append(option);
    }

    //console.log(markersArray);
}

//Updates labels for markers so they match the new results order
function changeMarkerLabel(name, index){
    for(var i=0 ; i< markersArray.length ; i++){
        if (markersArray[i].getTitle() === name){
            console.log("Marker: ");
            console.log(markersArray[i]);
            markersArray[i].setLabel( {"text": labels[index]} );
        }
    }
}



//Determines if possible destination is within user's minutes parameter
var closeEnough = function(destination){
    if(destination.duration.value > parseInt(duration)*60)
    {
        return false;
    }
    else{
        return true;
    }
}
