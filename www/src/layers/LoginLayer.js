
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
            }
        },
    });
}