

///////////////////////////////////////////////////////////////////////
//                        New Event Screen Class
///////////////////////////////////////////////////////////////////////

function EventList()
{
    //Create event board...
    this.create      = CreateEventList;
    this.goTo        = GoToEventList;
    
    //set your thumbnail.
    this.screen = this.create();
}

///////////////////////////////////////////////////////////////////////
//                        CREATE GUI SCREENS
///////////////////////////////////////////////////////////////////////

function CreateEventList()
{
    //Button for delete
    this.button = 
    {
        xtype :'button',
        ui    :'action',
        docked:'bottom',
        text  :'delete!',
        
        handler: function () 
        {
        }
    };
    
    var csstemp = '<tpl for=".">';
    csstemp    += '<div class="list_textbox">';
    csstemp    += '<list_header>{place} - </list_header>';
    csstemp    += '<list_description>{desc}</list_description>';
    csstemp    += '</div>';
    
    csstemp    += '<div class="list_imagebox">';
    csstemp    += '<list_delete><img src="Media/delete.png" id="delete" guid={guid}/>';
    csstemp    += '</list_delete></div>';
    csstemp    += '</tpl>';
    
    var screen = Ext.create('Ext.List', 
    {
        iconCls    : 'note1',
        title      : 'Your Events',
        fullscreen : true,
                            
        store: MainApp.app.database.eventsNearByStore,
        itemTpl: csstemp,

        listeners:
        {
            painted :function()
            {
                MainApp.app.database.getEventList("created");
            }
        }
    });
    
    //Register tap events on the items
    screen.element.on(
    {
        delegate: 'img',
        tap: function (e,t) 
        {
            var id = t.getAttribute('id');
            if (id == 'delete')
            {
                var guid = t.getAttribute('guid');
                MainApp.app.database.deleteEvent(guid);
            }
        }
    });
    
    
    return screen;
}

///////////////////////////////////////////////////////////////////////

function GoToEventList()
{
    MainApp.app.appLayer.layer.setActiveItem(MainApp.app.userInfoLayer.layer);
    MainApp.app.userInfoLayer.layer.animateActiveItem(this.screen, {type: 'slide', direction: 'up'});
}