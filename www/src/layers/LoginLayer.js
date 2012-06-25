
///////////////////////////////////////////////////////////////////////
//                        App Layer
///////////////////////////////////////////////////////////////////////

function LoginLayer()
{
    //Here is the holder screen.
    this.layer = new Ext.Panel(
    {
        id      : 'loginLayer',
        layout  : 'card',
        fullscreen : true,

        items: [MainApp.app.loginScreen.screen, MainApp.app.appLayer.layer],

        listeners:
        {
            activate:function()
            {
                //Try and log the user via cache
                var cache =
                {
                    username : window.localStorage.getItem("username"),
                    password : window.localStorage.getItem("password")
                };
                               
                if (cache.username && cache.password)
                {
                    MainApp.app.database.loginUser(cache);
                }
            }
        },
    });
}