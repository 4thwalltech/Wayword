
///////////////////////////////////////////////////////////////////////
//                        App Layer
///////////////////////////////////////////////////////////////////////

function AppLayer()
{
    //Here is the holder screen.
    this.layer = Ext.create('Ext.Panel', 
    {
        id                  : 'appLayer',
        layout              : 'card',
                                  
        items: [MainApp.app.mainMenu.screen,
                MainApp.app.browseEventLayer.layer,  
                MainApp.app.newEventLayer.layer,
                MainApp.app.calendarLayer.layer,
                MainApp.app.userInfoLayer.layer],
        
        listeners:
        {
            activate:function()
            {
            }
        },
    });
}
