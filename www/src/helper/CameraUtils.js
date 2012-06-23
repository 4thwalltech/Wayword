
var PHOTO_EVENT    = 0;
var PHOTO_PROFILE  = 1;

///////////////////////////////////////////////////////////////////////
//                        Camera Util Functions
///////////////////////////////////////////////////////////////////////

function CameraUtils()
{
    this.takePhoto = TakePhoto;
    this.success   = onPhotoURISuccess;
    this.failed    = onFail;
    this.tookPhoto = false;
    this.dest      = PHOTO_EVENT;
    this.photoUrl  = "http://www.4thwalltech.com/Fetch/upload/default.jpg";
}

///////////////////////////////////////////////////////////////////////

function TakePhoto(source, dest) 
{
    this.dest = dest;
    
    // Retrieve image file location from specified source
    navigator.camera.getPicture(this.success, this.failed, 
                                { 
                                    quality: 90, 
                                    allowEdit: true,
                                    targetWidth: 256,
                                    targetHeight: 256,
                                    destinationType: destinationType.FILE_URI,
                                    sourceType: source 
                                });
}

///////////////////////////////////////////////////////////////////////

function onPhotoURISuccess(imageURI)
{
    MainApp.app.cameraUtil.photoUrl  = imageURI;
    MainApp.app.cameraUtil.tookPhoto = true;
    
    //HACKY, but update the photothumb..
    if (MainApp.app.cameraUtil.dest == PHOTO_EVENT)
    {
        MainApp.app.newEventForm.updateThumb(imageURI);
        MainApp.app.newEventEditor.refresh();
    }
    else
    {
        MainApp.app.userInfoForm.updateThumb(imageURI);
    }
}

///////////////////////////////////////////////////////////////////////

function onFail(message) 
{
    console.log('PHOTO FAILED' + message);
}