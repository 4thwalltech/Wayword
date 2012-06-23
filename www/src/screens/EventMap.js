
var form;
var map;

///////////////////////////////////////////////////////////////////////
//                        Event Screen Class
///////////////////////////////////////////////////////////////////////

function EventScreen()
{
    //Create event board...
    this.eventMap     = CreateEventMap();
    this.activeEvents = CreateEventBoard();
    this.newEvent     = CreateNewEventScreen();
    
    this.loadActiveEvents = PopulateEventBoard;
    
    //Here is the holder screen.
    this.eventHolder = new Ext.Panel(
    {
        title   : 'Events',
        xtype   : 'panel',
        id      : 'eventHolder',
        layout  : 'card',
                                  
        fullscreen      : true,
        iconCls         : "favorites",
        cardAnimation   : 'slide',
                                  
        items: [this.activeEvents, this.newEvent, this.eventMap],
        
        listeners:
        {
            activate:function()
            {
                //Load active user events
                database.getUserEvents();
									 
				//reset the photo bool
				photoTook = false;
            }
        },
    });
}

///////////////////////////////////////////////////////////////////////
//                        CREATE GUI SCREENS
///////////////////////////////////////////////////////////////////////

function CreateEventMap()
{
    map = new Ext.ux.Leaflet(
    {
        mapOptions: 
        {
            center          : [28.77, -81.35],
            zoom            : 14
        },
                                 
        markers: 
        {
            data            : database.activeEventsStore,
            latField        : 'lat',
            lngField        : 'lon',
            titleField      : 'desc',
            iconSize        : 
            {
                w           : 32,
                h           : 37
            }
        },

        getMarkerImage : function (type) 
        {
            /*if (type == 'Monument') return 'src/demos/leaflet/images/marker-monument.png';
            else if (type == 'Restaurant') return 'src/demos/leaflet/images/marker-restaurant.png';
            else return 'src/demos/leaflet/images/marker.png';*/
            return 'Media/leaflet/marker.png';
        }
     });

    //Header for map
    var header  = new Ext.Toolbar(
    {
        id: 'eventmaphead',
        title: 'EVENTS',

        layout: 
        {
            pack: 'justify',
            align: 'center'
        },

        items : 
        [{
            text: 'back',
            ui: 'back',
            handler: function () 
            {
                mainMenu.setActiveItem('myCanvas',
                                      {type: 'slide', direction: 'right'});
            }
        },
        {
            xtype : 'spacer'
        },
        {
            iconCls :'add',
            iconMask: true,
            handler: function () 
            {
                eventScreen.eventHolder.setActiveItem('newEvent',
                                                 {type: 'slide', direction: 'down'});
            }
        }]                               
    });

    var screen = new Ext.Panel(
    {
        title   : 'Event Map',
        id      : 'eventMap',
                               
        fullscreen      : true,
        dockedItems: [header],
        items: [map],

        listeners:
        {
            activate:function()
            {
            },
        },
    });
    
    return screen;
}

///////////////////////////////////////////////////////////////////////

function CreateEventBoard()
{
    //Header for board
    var header  = new Ext.Toolbar(
    {
        id: 'eventboardhead',
        title: 'EVENTS',
        
        layout: 
        {
            pack: 'justify',
            align: 'center'
        },
                                  
        items : 
        [{
            text: 'back',
            ui: 'back',
            handler: function () 
            {
                 mainMenu.setActiveItem('myCanvas',
                                    {type: 'slide', direction: 'right'});
            }
        },
        {
            xtype : 'spacer'
        },
        {
            iconCls :'add',
            iconMask: true,
            handler: function () 
            {
                 eventScreen.eventHolder.setActiveItem('newEvent',
                                        {type: 'slide', direction: 'down'});
            }
        }]                               
    });
    
    var screen = new Ext.Panel(
    {
        title   : 'Active Events',
        xtype   : 'panel',
        id      : 'activeEvent',
        layout  : 'card',
        scroll  : 'vertical',
                               
        bodyStyle   : "background-image:url(Media/tile_corkboard.jpg)",

        fullscreen      : true,
        iconCls         : "favorites",
        cardAnimation   : 'slide',
                               
        dockedItems: [header],

        listeners:
        {
            activate:function()
            {
            },
        },
    });
    
    //Handler for the close button
    screen.el.on(
    {
        scope : screen,
        delegate : 'div',
        tap : function(e, t) 
        {
			var divClass = t.getAttribute('class');
			if (divClass == "closebutton")
			{
				var guid = t.getAttribute('guid');
				database.removeUserEvent( guid );
			}
			else if (divClass == "joinIn")
			{
				var guid = t.getAttribute('guid');
				
				database.userJoinEvent( guid );
				database.removeUserEvent( guid );
				food.create('Media/crumple.png');
			}
        }
    });
    
    return screen;
}

///////////////////////////////////////////////////////////////////////

function CreateNewEventScreen()
{
    //Header for board
    var header  = new Ext.Toolbar(
    {
        id: 'newEventHead',
        title: 'NEW EVENT',
        items : 
        [{
            text: 'back',
            ui: 'back',
            handler: function () 
            {
                 eventScreen.eventHolder.setActiveItem('activeEvent',
                                         {type: 'slide', direction: 'up'});
            }
        },
        { xtype:'spacer' },
        {
            text: 'share',
            ui: 'action',
            handler: function () 
            {
                 navigator.geolocation.getCurrentPosition
                 (
                    function success( position )
                    {
						var thumb = "default.jpg";
				  
						//Uploads the image
						if (photoTook)
						{
							var date = new Date();
							thumb = database.getUserId() + "_" + date + ".jpg";
							
							database.uploadImage(lastPhotoUrl, thumb);
						}
				  
						database.createNewEvent(eventScreen.newEvent.getValues(),
												position.coords.latitude,
												position.coords.longitude,
												thumb);
                        
                        eventScreen.eventHolder.setActiveItem('activeEvent',
                                                {type: 'slide', direction: 'up'});
                    }
                );
            }
        }]                               
    });
    
	var camButton = new Ext.Button(
	{   
		iconCls : 'search', 
		iconMask: true,
	    text : 'Take photo for event!',
		
		handler: function()
		{
			getPhoto(navigator.camera.PictureSourceType.CAMERA);
		}
	}); 
	
    form = CreateNewEventForm();
	    
    var screen = new Ext.form.FormPanel(
    {
        title   : 'New Event',
        id      : 'newEvent',
        scroll  : 'vertical',

        bodyStyle   : "background-image:url(Media/Event_BG.png)",
		html : "<br/><img src='http://www.4thwalltech.com/Fetch/upload/default.jpg'/>",
		
        fullscreen      : true,
        cardAnimation   : 'slide',

        dockedItems: [header],
        items : [form, camButton]
	});
    
    return screen;
}

///////////////////////////////////////////////////////////////////////

function CreateNewEventForm()
{  
    var form = 
    {
        xtype: 'fieldset',
        title: 'New Event',
        instructions: 'Please enter the information above.',
        defaults: 
        {
            labelWidth: '35%'
        },
        
        items: 
        [{
             xtype:'textfield',
             name: 'location',
             label:'Location',
             autoCapitalize : true,
             required: true,
         },
         {
             xtype:'textfield',
             name: 'description',
             label:'Description',
             autoCapitalize : true,
             required: true,
         }]
    };
    
    return form;
}

///////////////////////////////////////////////////////////////////////
//                        Event Class Functions
///////////////////////////////////////////////////////////////////////

function PopulateEventBoard()
{	
	var htmlStr = '<ul>';
    database.activeEventsStore.data.each(function(item, index, totalItems) 
    {
        htmlStr += '<li>';
        htmlStr += '<a href="#">';
        
        //Add the close button
        htmlStr += '<div class="closebutton"';
        htmlStr += ' guid="' + item.data['guid'] + '"></div>';
										 
		//Add the checkin button
		htmlStr += '<div class="joinIn"';
		htmlStr += ' guid="' + item.data['guid'] + '"></div>';
                                         
        //Add header                                 
        htmlStr += '<h2>';
        htmlStr += item.data['place'];
        htmlStr += '</h2>';
        
        //Add text                                 
        htmlStr += '<p>';
        htmlStr += item.data['desc'];
        htmlStr += '</p>';
										 
		//Add thumbnail..
		htmlStr += '<img src="' + item.data['thumb'] + '" width="70" height="70"/>';
		
		//Add joined.. 
		htmlStr += '<p>Joined : ' + item.data['joined'] + '</p>';
										 
        htmlStr += '</a>';
        htmlStr += '</li>';
    });

    htmlStr += '</ul>';
    this.activeEvents.update(htmlStr);
}