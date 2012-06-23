
///////////////////////////////////////////////////////////////////////
//                        Camera Util Functions
///////////////////////////////////////////////////////////////////////

function GeoLocation()
{
    this.curlat = 28.765079;
    this.curlon = -81.342491;
    
    //Start up the watch...
    this.watchid = navigator.geolocation.watchPosition(success, error);
}

///////////////////////////////////////////////////////////////////////

function success(position) 
{
    MainApp.app.locationUtil.curlat = position.coords.latitude;
    MainApp.app.locationUtil.curlon = position.coords.longitude;
}

///////////////////////////////////////////////////////////////////////

function error()
{
}