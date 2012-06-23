

///////////////////////////////////////////////////////////////////////
//                        New Event Screen Class
///////////////////////////////////////////////////////////////////////

function EventViewer()
{
    //Create event board...
    this.create    = CreateEventViewer;
    this.viewEvent = ViewEventFromGuid;
    
    this.goTo      = GoToEventViewer;    
    this.screen    = this.create();
}

///////////////////////////////////////////////////////////////////////
//                        CREATE GUI SCREENS
///////////////////////////////////////////////////////////////////////

function CreateEventViewer()
{
    //Header for board
    this.footer  = new Ext.Toolbar(
    {
        docked :'bottom',
        
        items : 
        [{
            xtype:'button',
            ui:'back',
            text:'back',
         
             handler: function()
             {
                MainApp.app.newEventForm.goTo();
             }
        }]                               
    });
    
    var screen = new Ext.Panel(
    {
        layout  : 'card',
        items: [this.footer],

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

function ViewEventFromGuid(store, guid)
{
    var event = store.findRecord('guid', guid);
    
    if (event)
    {
        var htmlStr = DrawEventPoster(event);
        this.screen.setHtml(htmlStr);
    }
}

///////////////////////////////////////////////////////////////////////

function GoToEventViewer()
{
    MainApp.app.appLayer.layer.setActiveItem(MainApp.app.newEventLayer.layer);
    MainApp.app.newEventLayer.layer.animateActiveItem(this.screen, {type: 'slide', direction: 'left'});
}