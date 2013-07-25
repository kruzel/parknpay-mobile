// JavaScript Document



function getLocation() {
    navigator.geolocation.getCurrentPosition(onGeolocationSuccess, onGeolocationError);
}

//=======================Geolocation Operations=======================//
// onGeolocationSuccess Geolocation
function onGeolocationSuccess(position) 
{
    // Use Google API to get the location data for the current coordinates
    var geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    geocoder.geocode({ "latLng": latlng }, function (results, status) 
    {
        if (status == google.maps.GeocoderStatus.OK) 
        {
            if ((results.length > 1) && results[1]) 
            {
                $("#region_selection_item_title").html(results[1].formatted_address);
                console.log("onGeolocationSuccess = "+ results[1].formatted_address);
                localStorage.setItem('geolocation',results[1].formatted_address);
            }
        }
    });

    // Use Google API to get a map of the current location
    // http://maps.googleapis.com/maps/api/staticmap?size=280x300&maptype=hybrid&zoom=16&markers=size:mid%7Ccolor:red%7C42.375022,-71.273729&sensor=true
    
    /*
    
    var googleApis_map_Url = 'http://maps.googleapis.com/maps/api/staticmap?size=300x300&maptype=hybrid&zoom=16&sensor=true&markers=size:mid%7Ccolor:red%7C' + latlng;
    var mapImg = '<img src="' + googleApis_map_Url + '" />';
    $("#map_canvas").html(mapImg);
    
    */
}

// onGeolocationError Callback receives a PositionError object
function onGeolocationError(error) {
    log.console("onGeolocationError : "+ error.message );
}
