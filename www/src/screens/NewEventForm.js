
var EDITOR_NEW = 0;
var EDITOR_UPDATE = 1;

///////////////////////////////////////////////////////////////////////
//                        New Event Screen Class
///////////////////////////////////////////////////////////////////////

function NewEventForm()
{
    //Create event board...
    this.create      = CreateNewEventFormScreen;
    this.updateThumb = UpdatePhotoThumb;
    this.reset       = ResetForm;
    this.goTo        = GoToEventForm;
    
    //set your thumbnail.
    this.screen = this.create();
    this.mode   = EDITOR_NEW;
    this.updateThumb("Media/camera.jpg");
}

///////////////////////////////////////////////////////////////////////
//                        CREATE GUI SCREENS
///////////////////////////////////////////////////////////////////////

function CreateNewEventFormScreen()
{
    //Header for board
    var header  = new Ext.Toolbar(
    {
        id: 'newEventHead',
        title  : 'NEW EVENT',
        docked :'top',
        items  : 
        [{
            text: 'back',
            ui: 'back',
            handler: function () 
            {
                MainApp.app.mainMenu.goTo();
            }
        },
        { xtype:'spacer' },
        {
            text: 'Next',
            ui: 'action',
            handler: function () 
            {
                //Update your values and make a preview
                MainApp.app.newEventEditor.refresh();
                MainApp.app.newEventEditor.goTo();
            }
        }]                               
    });
	
    var form = CreateNewEventForm();
	    
    var screen = Ext.create('Ext.form.Panel',
    {
        title      : 'New Event',
        id         : 'newEvent',
        scrollable : 'vertical',
        cls        : 'createform',
        
        layout: 
        {
            type: 'vbox',
            pack: 'center'                        
        },
        
        config:{},
		
        fullscreen      : true,
        cardAnimation   : 'slide',

        items : [header, form]
	});
    
    screen.element.on(
    {
        delegate: 'img',
        tap: function (e) 
        {
            //Take a photo
            MainApp.app.cameraUtil.takePhoto(navigator.camera.PictureSourceType.CAMERA,
                                             PHOTO_EVENT);
        }
    });
    
    return screen;
}

///////////////////////////////////////////////////////////////////////

function CreateNewEventForm()
{  
    var form = 
    {
        xtype: 'fieldset',
        title: 'New Event',
        instructions: 'Please enter the information above.',
        defaults: 
        {
            labelWidth: '35%'
        },
        
        items: 
        [{
             xtype:'textfield',
             name: 'location',
             label:'Header',
             autoCapitalize : true,
             placeholder : 'Header',
             required: true,
         },
         {
             xtype:'textareafield',
             name: 'description',
             label:'Description',
             placeholder : 'Description',
             autoCapitalize : true,
             required: true,
         },
         {
             xtype : 'datepickerfield',
             label : 'StartDate',
             name  : 'startdate',
             value : new Date()
         }]
    };
    
    return form;
}

///////////////////////////////////////////////////////////////////////

function ResetForm()
{
    this.screen.setValues(
    {
        location : 'Header',
        description : 'Description'
    });
}

///////////////////////////////////////////////////////////////////////

function UpdatePhotoThumb(thumb)
{
    var htmlStr = "<center><img src='" + thumb + "' width='128' height='128' /></center>";
    this.screen.setHtml(htmlStr);
}

///////////////////////////////////////////////////////////////////////

function GoToEventForm( mode )
{
    this.mode = mode;

    MainApp.app.cameraUtil.tookPhoto = false;
    MainApp.app.appLayer.layer.setActiveItem(MainApp.app.newEventLayer.layer);
    MainApp.app.newEventLayer.layer.animateActiveItem(this.screen, 
                                                     {type: 'slide', direction: 'up'});
}