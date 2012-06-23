

///////////////////////////////////////////////////////////////////////
//                        Author Info 
///////////////////////////////////////////////////////////////////////

function UserInfoScreen()
{
    //Create event board...
    this.create       = CreateUserInfoScreen;
    this.loadData     = LoadUserData;
    this.goTo         = GoToUserInfoScreen;
    
    this.screen       = this.create();
}

///////////////////////////////////////////////////////////////////////
//                        CREATE GUI SCREENS
///////////////////////////////////////////////////////////////////////

function CreateUserInfoScreen()
{
    var screen  = new Ext.Panel(
    {
        title      : 'Your Bio',
        cls        : 'user_background',
        iconCls    : 'user',

        listeners:
        {
            activate:function()
            {
            }
        },
    });

    return screen;
}

///////////////////////////////////////////////////////////////////////

function LoadUserData( data )
{
    var htmlStr = "Cannot Find User Info :(";
    
    if (data != null)
    {
        var thumb  = data['thumb'];
        var name   = data['name'];
        var bio    = data['bio'];
        var rating = data['level'];

        htmlStr   =  "<div class='user_name'>" + name + "</div>";
        htmlStr   += "<div class='user_profile'><img src='" + thumb + "'></img></div>";
        htmlStr   += "<div class='user_about'> '" + bio + "' </div>";
        htmlStr   += "<div class='user_rating'> '" + rating + "' </div>";
    }

    //Set it
    this.screen.setHtml(htmlStr);
}

///////////////////////////////////////////////////////////////////////

function GoToUserInfoScreen( data )
{
    MainApp.app.appLayer.layer.setActiveItem(MainApp.app.newEventLayer.layer);
    MainApp.app.newEventLayer.layer.animateActiveItem(this.screen, 
                                                     {type: 'slide', direction: 'up'});
}
