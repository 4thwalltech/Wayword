

///////////////////////////////////////////////////////////////////////
//                        New Event Screen Class
///////////////////////////////////////////////////////////////////////

function NewEventEditor()
{
    //Create event board...
    this.create            = CreateNewEventEditor;
    this.createTempSelect  = CreateTemplateSelector;
    this.createHandler     = CreateEventHandler;
    this.updateData        = UpdateEventData;
    this.updateTempl       = UpdatePrevTemplate;
    this.refresh           = RefreshEventData;
    this.loadTempl         = LoadTemplateSelector;
    
    this.goTo              = GoToEventEditor;
    
    this.screen         = this.create();
    this.tempSelect     = this.createTempSelect();
    //this.createHandler();
    
    this.template       = "template_layout3";
}

///////////////////////////////////////////////////////////////////////
//                        CREATE GUI SCREENS
///////////////////////////////////////////////////////////////////////

function CreateNewEventEditor()
{
    //Button for templates
    this.styleButton = Ext.create('Ext.Button', 
    {
        text: 'Select Style',
        id: 'styleButton',
        
        handler: function()
        {
            MainApp.app.newEventEditor.tempSelect.showBy(MainApp.app.newEventEditor.styleButton);
        }
    });
    
    //Header for board
    this.header  = new Ext.Toolbar(
    {
        id: 'newEventEditorHead',
        docked :'top',
        
        items : 
        [{
            xtype:'button',
            ui:'back',
            text:'back',
         
             handler: function()
             {
                MainApp.app.newEventForm.goTo();
             }
        },
        this.styleButton,
        { xtype:'spacer' },
        {
            text: 'share',
            ui: 'action',
            handler: function () 
            {
                var thumb = "default.jpg";

                //Uploads the image
                if (MainApp.app.cameraUtil.tookPhoto)
                {
                    var date = new Date();
                    thumb = MainApp.app.database.getUserId() + "_" + date + ".jpg";

                    MainApp.app.database.uploadImage(MainApp.app.cameraUtil.photoUrl, 
                                                     thumb);
                }
                
                MainApp.app.database.createNewEvent(
                MainApp.app.newEventForm.screen.getValues(),
                MainApp.app.locationUtil.curlat,
                MainApp.app.locationUtil.curlon,
                MainApp.app.newEventEditor.temp,
                thumb);
         
                //Move to your list to see
                MainApp.app.eventBroswer.goTo('user');
            }
        }]                               
    });
    
    var screen = new Ext.Panel(
    {
        id      : 'eventEditor',
        layout  : 'card',
        items: [this.header],

        listeners:
        {
            activate:function()
            {
            },
        },
    });
    
    return screen;
}

///////////////////////////////////////////////////////////////////////
//                        GUI EVENT FUNCTIONS
///////////////////////////////////////////////////////////////////////

function CreateEventHandler()
{
    this.screen.element.on(
    {
        delegate: 'img',
        tap: function (e) 
        {
            //Take a photo
            MainApp.app.cameraUtil.takePhoto(navigator.camera.PictureSourceType.CAMERA);
        }
    });
    
    this.screen.element.on(
    {
        delegate: 'header',
        tap: function (e) 
        {
            Ext.Msg.prompt('Header', 'Enter Header Text', 
            function(button, value)
            {
                MainApp.app.newEventForm.screen.setValues(
                {
                      location : value
                });
                           
                MainApp.app.newEventEditor.refresh();
            });
        }
    });
    
    this.screen.element.on(
    {
        delegate: 'description',
        tap: function (e) 
        {
            Ext.Msg.prompt('Description', 'Enter Event Text', 
            function(button, value)
            {
                MainApp.app.newEventForm.screen.setValues(
                {
                    description : value
                });

                MainApp.app.newEventEditor.refresh();
            });
        }
    });
}

///////////////////////////////////////////////////////////////////////

function CreateTemplateSelector()
{
    var screen = Ext.create('Ext.Panel', 
    {
        html: 'Floating Panel',
        left: 0,
        width : 200,
        height : 200,
        padding: 10,
        docked :'bottom',
                            
    });
    
    //Register some listeners
    screen.element.on(
    {
        delegate: 'img',
        tap: function (e,t) 
        {
            var id = t.getAttribute('id');
            MainApp.app.newEventEditor.updateTempl(id);
            MainApp.app.newEventEditor.tempSelect.hide();
        }
    });
    
    //screen.hide();
    return screen;
}

///////////////////////////////////////////////////////////////////////
//                        EVENTS
///////////////////////////////////////////////////////////////////////

function UpdateEventData(data, newTemp)
{
    var template = newTemp;
    var header   = data.location;
    var desc     = data.description;
    var thumb    = MainApp.app.cameraUtil.photoUrl;
    var joined   = "0";
    
    var item = 
    {
        template : template,
        place    : header,
        desc     : desc,
        thumb    : thumb,
        joined   : 0
    }
    
    var htmlStr = DrawEventPoster(item);

    this.screen.replaceCls(this.temp, template);
    //this.header.removeCls(template);
    
    this.temp = template;
    this.screen.setHtml(htmlStr);
}

///////////////////////////////////////////////////////////////////////

function RefreshEventData()
{
    MainApp.app.newEventEditor.updateData(MainApp.app.newEventForm.screen.getValues(), 
                                          this.template);
}

///////////////////////////////////////////////////////////////////////

function UpdatePrevTemplate( newTemplate )
{
    MainApp.app.newEventEditor.updateData(MainApp.app.newEventForm.screen.getValues(), newTemplate);
}

///////////////////////////////////////////////////////////////////////

function LoadTemplateSelector()
{
    var htmlStr = "";
    
    MainApp.app.database.templateStore.data.each(function(item, index, totalItems) 
    {
        var id = item.data['name'];
        var thumb = ServerBase + 'templates/Media/' + item.data['thumb'];
        htmlStr += '<img src="' + thumb + '" id="' + id + '" />';
    });
                                                 
    this.tempSelect.setHtml(htmlStr);
}

///////////////////////////////////////////////////////////////////////

function GoToEventEditor()
{
    MainApp.app.appLayer.layer.setActiveItem(MainApp.app.newEventLayer.layer);
    MainApp.app.newEventLayer.layer.animateActiveItem(this.screen, {type: 'slide', direction: 'left'});
}