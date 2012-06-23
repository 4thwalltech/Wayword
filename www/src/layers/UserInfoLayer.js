
///////////////////////////////////////////////////////////////////////
//                        App Layer
///////////////////////////////////////////////////////////////////////

function UserInfoLayer()
{
    this.globalHeader = new Ext.Toolbar(
    {
        title  : 'User Info',
        docked :'top',
        items  : 
        [{
            text: 'back',
            ui: 'back',
            handler: function () 
            {
                MainApp.app.mainMenu.goTo();
            }
         }]
     }); 
    
    //Here is the holder screen.
    this.layer = Ext.create('Ext.TabPanel',
    {
        tabBarPosition: 'bottom',
        fullscreen      : true,
                            
        defaults: 
        {
            styleHtmlContent: true
        },
                            
        items: [MainApp.app.userInfoScreen.screen, 
                MainApp.app.userInfoForm.screen,
                this.globalHeader],

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