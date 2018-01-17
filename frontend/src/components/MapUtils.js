var map = require('google_directions');
 
var params = {
    // REQUIRED 
    origin: {lat: 44.4809315, lng: 26.0732731 },
    destination: {lat: 44.4439, lng: 26.1033 },
    key: "AIzaSyBLIEagwB6Ns9H3hYGWP-NkOKYcOKPi6XE",
    mode: "walking"
    }
    
    // get the raw Google Directions API response as JSON object 
map.getDirections(params, function (err, data) {
    if (err) {
        console.log(err);
        return 1;
    }
    console.log(data);
});

// get total duration as string 
map.getDuration(params, function (err, data) {
    if (err) {
        console.log(err);
        return 1;
    }
    console.log(data);
});

