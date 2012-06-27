
///////////////////////////////////////////////////////////////////////
//                        App Layer
///////////////////////////////////////////////////////////////////////

function UserInfoLayer()
{
    this.globalHeader = new Ext.Toolbar(
    {
        title  : 'User Info',
        docked :'top',
                                        
        layout: 
        {
            type: 'hbox',
            pack: 'center'                        
        },
                                        
        items  : 
        [{
            text: 'back',
            ui: 'back',
            handler: function () 
            {
                MainApp.app.mainMenu.goTo();
            }
         },
         { xtype :'spacer' },
         {
             text: 'logout',
             ui: 'action',
             handler: function () 
             {
                 //delete cache data
                window.localStorage.removeItem("username");
                window.localStorage.removeItem("password");
                MainApp.app.loginScreen.goTo();
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
                MainApp.app.eventList.screen,
                MainApp.app.friendsList.screen,
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