var floatingpanel;
var cuisine;
var origin;
var transport;
var duration;
console.log("Outside");

$("#btn").click( function(){
    cuisine = $("#cuisine").val().toLowerCase();
    origin = $("#origin").val().toLowerCase();    
    transport = $("#transport :selected").text().toLowerCase();
    duration = $("#duration").val().toLowerCase();

    termd = cuisine;
    travelModed = transport;
    radiusd = duration;

    console.log(cuisine, transport, duration);
    floatingpanel = $("#floating-panel").detach();
    placeMarkers();
})
