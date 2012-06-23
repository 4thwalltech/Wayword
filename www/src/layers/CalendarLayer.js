
///////////////////////////////////////////////////////////////////////
//                        App Layer
///////////////////////////////////////////////////////////////////////

function CalendarLayer()
{
    this.globalHeader = new Ext.Toolbar(
    {
        title  : 'Calendar',
        docked :'top',
        items  : 
        [{
            text: 'Main Menu',
            ui: 'back',
            handler: function () 
            {
                MainApp.app.mainMenu.goTo();
            }
        }]
    }); 
    
    //Here is the holder screen.
    this.layer = new Ext.Panel(
    {
        layout  : 'card',
        title   : 'CalendarLayer',

        items: [MainApp.app.calendarScreen.screen,
                MainApp.app.eventViewer.screen,
                this.globalHeader],

        listeners:
        {
            activate:function()
            {
            }
        },
    });
    
    //GOTO function
    this.goTo = function( screen )
    {
        MainApp.app.appLayer.layer.setActiveItem(this.layer);
        screen.goTo();
    };
}