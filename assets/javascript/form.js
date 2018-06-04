var floatingpanel;

$("#go").on("click", function(){
    console.log("egg");
    $("#distance-time").val( $("#cusine").val() );
    //event.preventDefault();
    floatingpanel = $("#floating-panel").detach();
});

