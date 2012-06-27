

///////////////////////////////////////////////////////////////////////
//                        New Event Screen Class
///////////////////////////////////////////////////////////////////////

function FriendsList()
{
    //Create event board...
    this.create      = CreateFriendsList;
    this.goTo        = GoToFriendsList;
    
    this.screen = this.create();
}

///////////////////////////////////////////////////////////////////////
//                        CREATE GUI SCREENS
///////////////////////////////////////////////////////////////////////

function CreateFriendsList()
{
    //Button for submission
    this.search = 
    {
        xtype :'button',
        ui    :'action',
        docked:'bottom',
        text  :'Search',
        
        handler: function () 
        {
        }
    };
    
    var csstemp = '<tpl for=".">';
    csstemp    += '<div class="friend_photo"><img src="{thumb}"/></div>';
    csstemp    += '<div class="friend_name">{name}</div>';
    csstemp    += '</tpl>';
    
    var screen = Ext.create('Ext.List', 
    {
        iconCls    : 'team',
        cls        : 'blankPage',
        title      : 'Your Friends',
        fullscreen : true,
                            
        store: MainApp.app.database.friendStore,
        itemTpl: csstemp,
        items : [ this.search],

        listeners:
        {
            painted :function()
            {
                MainApp.app.database.getUserFriends();
            }
        }
    });
    
    //Register tap events on the items
    screen.element.on(
    {
    });
    
    
    return screen;
}

///////////////////////////////////////////////////////////////////////

function GoToFriendsList()
{
    MainApp.app.appLayer.layer.setActiveItem(MainApp.app.userInfoLayer.layer);
    MainApp.app.userInfoLayer.layer.animateActiveItem(this.screen, {type: 'slide', direction: 'up'});
}