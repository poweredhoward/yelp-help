var floatingpanel;
var cuisine;
var origin;
var transport;
var duration;
// var transportBox = $("#transport-float");
// var transportSelected = transportBox.options[transportBox.selectedIndex].value;
console.log("Outside");

$("#btn-float").click( function(){
    
    console.log("hi");
    cuisine = $("#cuisine-float").val().toLowerCase();
    transport = $("#transport-float :selected").text().toUpperCase();
    duration = $("#duration-float").val();

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
