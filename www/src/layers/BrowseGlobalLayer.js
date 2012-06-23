
///////////////////////////////////////////////////////////////////////
//                        App Layer
///////////////////////////////////////////////////////////////////////

function BrowseEventLayer()
{
    this.globalHeader = new Ext.Toolbar(
    {
        title  : 'Hot List',
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
         MainApp.app.eventBroswer.filterButton]
    }); 
    
    //Here is the holder screen.
    this.layer = new Ext.Panel(
    {
        id      : 'browseEventLayer',
        layout  : 'card',
        iconCls : 'home',
        title   : 'Top',

        items: [MainApp.app.eventBroswer.screen, this.globalHeader],
        listeners:
        {
            activate:function()
            {
            }
        },
    });
    
    //GOTO function
    this.goTo = function()
    {
        MainApp.app.appLayer.layer.setActiveItem(this.layer);   
    };
}