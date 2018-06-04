var floatingpanel;
var cuisine;
var transport;
var duration;
console.log("Outside");

$("#btn").click( function(){
    cuisine = $("#cuisine").val().toLowerCase();
    transport = $("#transport :selected").text().toUpperCase();
    duration = $("#duration").val();

    termd = cuisine;
    travelModed = transport;
    radiusd = String( timeToDistance( parseInt(duration), transport) );

    console.log(cuisine, transport, duration);
    floatingpanel = $("#floating-panel").detach();
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
