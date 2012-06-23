

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
        defaults:
        {
            iconMask: true,
            xtype:'button',
        },
        
        items : 
        [{
            xtype:'button',
            ui:'back',
            text:'back',
         
             handler: function()
             {
                MainApp.app.calendarScreen.goTo('back');
             }
        },
        {
            iconCls : "globe1",
            handler: function()
            {
            }
        },
        {
            iconCls : "mail5",
            handler: function()
            {
            }
        },
        {
            iconCls : "trash",
            handler: function()
            {
                //Delete from the user database
                MainApp.app.database.removeUserEvent(MainApp.app.eventViewer.guid);
                MainApp.app.calendarScreen.goTo('back');
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
    this.guid = guid;
    
    if (event)
    {
        var htmlStr = DrawEventPoster(event.data);
        this.screen.setHtml(htmlStr);
    }
}

///////////////////////////////////////////////////////////////////////

function GoToEventViewer()
{
    MainApp.app.calendarLayer.layer.animateActiveItem(this.screen, {type: 'slide', direction: 'left'});
}