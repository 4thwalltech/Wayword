

///////////////////////////////////////////////////////////////////////
//                        New Event Screen Class
///////////////////////////////////////////////////////////////////////

function UserInfoForm()
{
    //Create event board...
    this.create      = CreateUserInfoFormScreen;
    this.updateThumb = UpdateUserThumb;
    this.refresh     = PopulateUserForm;
    this.goTo        = GoToUserForm;
    
    //set your thumbnail.
    this.screen = this.create();
    this.updateThumb("Media/camera.jpg");
}

///////////////////////////////////////////////////////////////////////
//                        CREATE GUI SCREENS
///////////////////////////////////////////////////////////////////////

function CreateUserInfoFormScreen()
{
    //Button for submission
    var submit = 
    {
        xtype :'button',
        ui    :'action',
        docked:'bottom',
        text  :'Update!',
        
        handler: function () 
        {
            var thumb = "users/profile.jpg";

            //Uploads the image
            if (MainApp.app.cameraUtil.tookPhoto)
            {
                var date = new Date();
                thumb = "users/" + MainApp.app.database.getUserId() + ".jpg";
                
                MainApp.app.database.uploadImage(MainApp.app.cameraUtil.photoUrl, 
                                                 thumb);
            }

            MainApp.app.database.updateUserData(
                                MainApp.app.userInfoForm.screen.getValues(),
                                thumb);
        }
    };
	
    var form = CreateUserProfileForm();
	    
    var screen = Ext.create('Ext.form.Panel',
    {
        title      : 'Edit Profile',
        scrollable : 'vertical',
        cls        : 'createform',
        iconCls    : 'doc_compose1',
        
        layout: 
        {
            type: 'vbox',
            pack: 'center'                        
        },
        
        config:{},
        items : [form, submit]
	});
    
    screen.element.on(
    {
        delegate: 'img',
        tap: function (e) 
        {
            //Take a photo
            MainApp.app.cameraUtil.takePhoto(navigator.camera.PictureSourceType.CAMERA,
                                             PHOTO_PROFILE);
        }
    });
    
    return screen;
}

///////////////////////////////////////////////////////////////////////

function CreateUserProfileForm()
{  
    var form = 
    {
        xtype: 'fieldset',
        title: 'About Me',
        instructions: 'Please enter the information above.',
        defaults: 
        {
            labelWidth: '35%'
        },
        
        items: 
        [{
             xtype:'textareafield',
             name: 'biography',
             label:'Bio',
             placeholder : 'About Me',
             autoCapitalize : true,
             required: true,
         }]
    };
    
    return form;
}

///////////////////////////////////////////////////////////////////////

function PopulateUserForm()
{
    //Get the user data..
    var userData = MainApp.app.database.getUserData();
    if (userData != null)
    {
        this.screen.setValues(
        {
              biography : userData['bio']
        });
        
        this.updateThumb(userData['thumb']);
    }
}

///////////////////////////////////////////////////////////////////////

function UpdateUserThumb(thumb)
{
    var htmlStr = "<center><img src='" + thumb + "' width='128' height='128' /></center>";
    this.screen.setHtml(htmlStr);
}

///////////////////////////////////////////////////////////////////////

function GoToUserForm()
{
    MainApp.app.cameraUtil.tookPhoto = false;
    MainApp.app.appLayer.layer.setActiveItem(MainApp.app.userInfoLayer.layer);
    MainApp.app.userInfoLayer.layer.animateActiveItem(this.screen, {type: 'slide', direction: 'up'});
}