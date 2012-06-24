///////////////////////////////////////////////////////////////////////
//                         Databse Manager
///////////////////////////////////////////////////////////////////////
           
Ext.define('EventInfo',
{
    extend: 'Ext.data.Model',
    config :
    {
        fields: 
        [
            {name: 'items',     type: 'auto'},
            {name: 'desc',      type: 'string'}, 
            {name: 'place',     type: 'string'}, 
            {name: 'thumb',     type: 'string'}, 
            {name: 'template',  type: 'string'},
            {name: 'guid',      type: 'int'}, 
            {name: 'lat',       type: 'float'}, 
            {name: 'lon',       type: 'float'}, 
            {name: 'dist',      type: 'int'},
            {name: 'views',     type: 'int'},
            {name: 'joined',    type: 'int'},
         
            {name: 'creator',        type: 'string'},
            {name: 'creatorthumb',   type: 'string'},
         
            {name: 'start',     type: 'string'},
            {name: 'pinday',    type: 'string'}
        ]
    }
});

Ext.define('UserInfo',
{
    extend: 'Ext.data.Model',
    config : 
    {
        fields: 
        [
            {name: 'name'  ,  type: 'string'},
            {name: 'userid',  type: 'int'},
            {name: 'thumb',   type: 'string'},
            {name: 'bio',     type: 'string'},
            {name: 'score' ,  type: 'score'},
            {name: 'level'  , type: 'string'}
        ]
    }
});

Ext.define('TemplateInfo',
{
    extend: 'Ext.data.Model',
    config : 
    {
        fields: 
        [
            {name: 'name'  ,  type: 'string'},
            {name: 'thumb' ,  type: 'string'},
            {name: 'id',      type: 'int'}
        ]
    }
});


///////////////////////////////////////////////////////////////////////

function DataBaseInterface() 
{
    this.eventsNearByStore = CreateNearByStore();
    this.userInfoStore     = CreateUserInfoStore();
    this.templateStore     = CreateTemplateStore();
    this.loadingMask       = CreateLoadingScreen();  
    
    this.getEventList      = GetEventList;
    this.getUserInfo       = GetUserInfo;
    this.getUserId         = GetUserId;
    this.checkUserin       = CheckUserIn;
    this.getUserData       = GetUserData;
    this.addUserEvent      = AddUserEvent;
    this.removeUserEvent   = RemoveUserEvent;
    this.addPointsForUser  = AddPointsForUser;
    this.userJoinEvent     = UserJoinEvent;
    this.uploadImage       = UploadImage;
    this.deleteEvent       = DeleteEvent;
    
    this.createNewUser     = CreateNewUser;
    this.loginUser         = LoginUser;
    this.updateUserData    = UpdateUserData;
    
    this.createNewEvent    = CreateNewEvent;
    
    this.loggedIn          = false;
}


///////////////////////////////////////////////////////////////////////

function CreateLoadingScreen()
{
    var loadingMask = new Ext.LoadMask(Ext.getBody(), {msg:"Please wait..."}); 
    
    // invokes before each ajax request 
    Ext.Ajax.on('beforerequest', function()
    {        
        loadingMask.show();
    });
    
    Ext.Ajax.on('requestcomplete', function()
    {      
        loadingMask.hide();
    });             
    
    Ext.Ajax.on('requestexception', function()
    {         
        //TODO: need to handle the server exceptions
    });
    
    return loadingMask;
}

///////////////////////////////////////////////////////////////////////
//                         Store Creator
///////////////////////////////////////////////////////////////////////

function CreateNearByStore()
{
    var store = Ext.create('Ext.data.Store',
    {
        model: 'EventInfo',
        proxy: 
        {
            type: 'ajax',
            url : 'http://www.4thwalltech.com/Fetch/testDb.php',
            reader: 
            {
                type: 'xml',
                record: 'items'
            },
                           
            extraParams: 
            {
                action: 'getEvents',
                userId : '0',
                filter : 'top',
                lat : '0',
                lon : '0',
                dist: '25'
            }    
        }
    });
    
    //When this store loads, we should populate the screen..
    store.on('load', function () 
    {
        MainApp.app.eventBroswer.loadActiveEvents(MainApp.app.database.eventsNearByStore);
        MainApp.app.calendarScreen.refresh(MainApp.app.database.eventsNearByStore);
    });
    
    return store;
}

///////////////////////////////////////////////////////////////////////

function CreateUserInfoStore()
{
    var store = Ext.create('Ext.data.Store',
    {
        model: 'UserInfo',
        proxy: 
        {
            type: 'ajax',
            url : 'http://www.4thwalltech.com/Fetch/testDb.php',

            extraParams: 
            {
                action:   'getUserInfo',
                userName: 'None'
            },
                        
            reader: 
            {
                type:   'xml',
                record: 'items'
            }
        },
    });
    
    //When this store loads, we should populate the screen..
    store.on('load', function () 
    {
        MainApp.app.environment.dispScore = 
            MainApp.app.database.userInfoStore.data.items[0].data['score'];
                    
        //load your user events here
        MainApp.app.database.loggedIn = true;
             
        //Refresh stuff with user data
        MainApp.app.mainMenu.refresh();
        MainApp.app.userInfoForm.refresh();
             
        MainApp.app.userInfoScreen.loadData(MainApp.app.database.getUserData());
    });
    
    return store;
}

///////////////////////////////////////////////////////////////////////

function CreateTemplateStore()
{
    var store = Ext.create('Ext.data.Store',
    {
        model: 'TemplateInfo',
        autoLoad: true,
        proxy: 
        {
            type: 'ajax',
            url : 'http://www.4thwalltech.com/Fetch/testDb.php',
            reader: 
            {
                type: 'xml',
                record: 'items'
            },

            extraParams: 
            {
                action: 'getTemplates'
            }    
        }
    });
    
    //When this store loads, we should populate the screen..
    store.on('load', function () 
    {
        //Include all of the templates in the browser
        MainApp.app.eventBroswer.loadTemplates();
        MainApp.app.newEventEditor.loadTempl();
    });
    
    return store;
}

///////////////////////////////////////////////////////////////////////
//                         DB Functions Creator
///////////////////////////////////////////////////////////////////////

function GetUserInfo( userName )
{
    this.userInfoStore.getProxy().setExtraParam('userName', userName);
    this.userInfoStore.load();   
}

///////////////////////////////////////////////////////////////////////

function GetUserId()
{
    var id = -1;
    
    if (MainApp.app.database.loggedIn)
    {
        id = MainApp.app.database.userInfoStore.data.items[0].data['userid'];
    }
    
    return id;
}

///////////////////////////////////////////////////////////////////////

function GetUserData()
{
    var data = null;
    
    if (MainApp.app.database.loggedIn)
    {
        data = MainApp.app.database.userInfoStore.data.items[0].data;
    }
    
    return data;
}

///////////////////////////////////////////////////////////////////////

function UpdateUserData( data, thumb )
{
    var userid = GetUserId();
    
    Ext.Ajax.request(
    {
        url: 'http://www.4thwalltech.com/Fetch/testDb.php?action=updateUserData',
        method: 'post',
        params:
        {
            userid : userid,
            bio    : data.biography,
            thumb  : thumb
        },

        success: function(response, opts) 
        {
             console.log(response);
             MainApp.app.database.userInfoStore.load();  
        }
    });
}

///////////////////////////////////////////////////////////////////////

function GetEventList( filter )
{
    var userId = GetUserId();
    
    this.eventsNearByStore.getProxy().setExtraParam('userId', userId);
    this.eventsNearByStore.getProxy().setExtraParam('lat', MainApp.app.locationUtil.curlat);
    this.eventsNearByStore.getProxy().setExtraParam('lon', MainApp.app.locationUtil.curlon);
    this.eventsNearByStore.getProxy().setExtraParam('filter', filter);
    this.eventsNearByStore.getProxy().setExtraParam('dist', 25);
    
    this.eventsNearByStore.load(function(records, operation, success) 
    {
    }); 
}

///////////////////////////////////////////////////////////////////////

function AddUserEvent( guid, date )
{
    var userid = GetUserId();
    console.log(guid);
    Ext.Ajax.request(
    {
        url: 'http://www.4thwalltech.com/Fetch/testDb.php?action=addUserEvent',
        method: 'post',
        params: 
        {   
            guid    : guid,
            userid  : userid,
            date    : date
        },
        success: function(response, opts) 
        {
            console.log(response);
            MainApp.app.database.eventsNearByStore.load();
        }
    });
}

///////////////////////////////////////////////////////////////////////

function RemoveUserEvent( guid )
{
    var userid = GetUserId();
    
    Ext.Ajax.request(
    {
        url: 'http://www.4thwalltech.com/Fetch/testDb.php?action=removeUserEvent',
        method: 'post',
        params: 
        {   
            guid    : guid,
            userid  : userid
        },
        success: function(response, opts) 
        {
             MainApp.app.database.eventsNearByStore.load();
        }
    });
}

///////////////////////////////////////////////////////////////////////

function CreateNewEvent( data, lat, lon, template, thumb )
{
    var userid = GetUserId();
    
    Ext.Ajax.request(
    {
        url: 'http://www.4thwalltech.com/Fetch/testDb.php?action=createNewEvent',
        method: 'post',
        params:
        {
            userid : userid,
            desc   : data.description,
            place  : data.location,
            start  : data.startdate,
            lat    : lat,
            lon    : lon,
            temp   : template,
            thumb  : thumb
        },
  
        success: function(response, opts) 
        {
            MainApp.app.instructPop.showInstr(INSTR_CREATE);
            MainApp.app.database.addPointsForUser(100);
        }
    });
}

///////////////////////////////////////////////////////////////////////

function DeleteEvent( guid )
{
    Ext.Ajax.request(
    {
        url: 'http://www.4thwalltech.com/Fetch/testDb.php?action=deleteEvent',
        method: 'post',
        params: 
        {   
            guid  : guid,
        },
                     
        success: function(response, opts) 
        {
            MainApp.app.database.eventsNearByStore.load();
        }
    });
}

///////////////////////////////////////////////////////////////////////

function CreateNewUser(data)
{
    UserName = data.username;
    
    Ext.Ajax.request(
    {
        url: 'http://www.4thwalltech.com/Fetch/testDb.php?action=createNewUser',
        method: 'post',
        
        params:
        {
            userName : data.username,
            passWord : data.password
        },

        success: function(response, opts) 
        {
            if (response.responseText != "")
            {
                alert(response.responseText);
            }
            else
            {
                //First get the user information..
                MainApp.app.database.getUserInfo(UserName);
                MainApp.app.loginLayer.layer.setActiveItem(MainApp.app.appLayer.layer,
                                                        {type: 'slide', direction: 'up'});
            }
        }
    });
}

///////////////////////////////////////////////////////////////////////

function LoginUser(data)
{
    UserName = data.username;
    
    Ext.Ajax.request(
    {
        url: 'http://www.4thwalltech.com/Fetch/testDb.php?action=loginUser',
        method: 'post',

        params:
        {
            userName : data.username,
            passWord : data.password
        },

        success: function(response, opts) 
        {
            if (response.responseText != "")
            {
                alert(response.responseText);
            }
            else
            {
                //First get the user information..
                MainApp.app.database.getUserInfo(UserName);
                MainApp.app.loginLayer.layer.setActiveItem(MainApp.app.appLayer.layer,
                                               {type: 'slide', direction: 'up'});
            }
        }
    });
}

///////////////////////////////////////////////////////////////////////

function AddPointsForUser( points )
{
    var userid = GetUserId();
    
    Ext.Ajax.request(
    {
        url: 'http://www.4thwalltech.com/Fetch/testDb.php?action=addPointsForUser',
        method: 'post',
        params:
        {
            userid : userid,
            points : points
        },

        success: function(response, opts) 
        {
            MainApp.app.database.userInfoStore.load(); 
        }
    });
}

///////////////////////////////////////////////////////////////////////

function CheckUserIn( guid )
{
    var userid = GetUserId();
    MainApp.app.instructPop.showInstr(INSTR_CHECKIN);
    MainApp.app.database.addPointsForUser(100);
    
    var date   = new Date();
    this.addUserEvent(guid, date);
}

///////////////////////////////////////////////////////////////////////

function UserJoinEvent( guid )
{
    Ext.Ajax.request(
    {
        url: 'http://www.4thwalltech.com/Fetch/testDb.php?action=userJoinEvent',
        method: 'post',
        params:
        {
            userid : userid,
            guid   : guid
        },

        success: function(response, opts) 
        {
            console.log(response);
        }
    });
}

///////////////////////////////////////////////////////////////////////
//                         Image Upload
///////////////////////////////////////////////////////////////////////

function UploadImage ( imageURL, imgName )
{
    var options      = new FileUploadOptions();
    options.fileKey  ="file";
    options.fileName = imageURL.substr(imageURL.lastIndexOf('/')+1);
    options.mimeType ="image/jpeg";
    
    var params = new Object();
    params.thumb = imgName;
    
    options.params      = params;
    options.chunkedMode = false;
    
    var ft = new FileTransfer();
    ft.upload(imageURL, 
              "http://www.4thwalltech.com/Fetch/testDb.php?action=uploadPhoto", 
              win, fail, options);
}

///////////////////////////////////////////////////////////////////////

function win(r) 
{
    console.log("Code = " + r.responseCode);
    console.log("Response = " + r.response);
    console.log("Sent = " + r.bytesSent);
}

///////////////////////////////////////////////////////////////////////

function fail(error) 
{
    alert("An error has occurred: Code = " = error.code);
}