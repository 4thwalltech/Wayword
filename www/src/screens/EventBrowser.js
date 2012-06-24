
//Filter enums
var BROWSER_TOP  = "top";
var BROWSER_USER = "user";

///////////////////////////////////////////////////////////////////////
//                        Event Screen Class
///////////////////////////////////////////////////////////////////////

function EventBrowser()
{
    //Create event board...
    this.create           = CreateEventBoard; 
    this.makeMenu         = CreateMenuPanel;
    
    this.loadTemplates    = LoadTemplates;
    this.loadActiveEvents = PopulateEventBoard;
    this.createToc        = CreateTableOfContents;
    this.goTo             = GoToEventBrowser;
    this.filter           = BROWSER_TOP;
    
    this.menu             = this.makeMenu();
    this.screen           = this.create();
    this.curPage          = 1;
    this.tocPages         = 0;
}

///////////////////////////////////////////////////////////////////////
//                        CREATE GUI SCREENS
///////////////////////////////////////////////////////////////////////

function CreateEventBoard()
{
    //Pick some ids.
    var headid = 'eventboardheadglobal';
    var bodyid = 'eventboardbodyglobal';
    
    this.filterButton = Ext.create('Ext.Button', 
    {
        xtype : 'button',
        text : 'Top',
        handler: function () 
        {
            MainApp.app.eventBroswer.filter.show();
        }
    });
    
    this.filter = Ext.Viewport.add(
    {
        hidden  : true,
        xtype   : 'actionsheet',
        zIndex  : 800,
        
        items : 
        [
            {
                text :'Top Events',
                scope : this,
                handler : function()
                {
                    MainApp.app.eventBroswer.filterButton.setText("Top");
                    MainApp.app.database.getEventList("top");
                    MainApp.app.eventBroswer.filter.hide();
                }
            },
            {
                text :'Favorites',
                scope : this,
                handler : function()
                {
                    MainApp.app.eventBroswer.filterButton.setText("Fav");
                    MainApp.app.database.getEventList("user");
                    MainApp.app.eventBroswer.filter.hide();
                }
            }
        ],
    });
    
    //Header for board
    var header  = new Ext.Toolbar(
    {
        id: headid,
        docked: 'bottom',
        
        style: 
        {
            borderTop: 'none',
            borderLeft: 'none',
            borderRight: 'none'
        },
                                  
        layout: 
        {
            pack: 'justify',
            align: 'center'
        },
            
        defaults:
        {
            iconMask: true,
            xtype:'button',
        },
                                  
        items : 
        [{
            iconCls : "rewind",
            handler: function()
            {
                 MainApp.app.eventBroswer.curPage = 1;
                 var book = $('#magazine');
                 book.turn('page', MainApp.app.eventBroswer.curPage);
            }
        },
        {
            iconCls : "arrow_left",
            handler: function()
            {
                var book = $('#magazine');
                book.turn('previous');
            }
        },
        {
            ui      : 'action',
            iconCls : 'note1',
            handler: function()
            {
                MainApp.app.eventBroswer.menu.showBy(this);
            }
        },
        {
            iconCls : "arrow_right",
            handler: function()
            {
                var book = $('#magazine');
                book.turn('next');
            }
        }]                               
    });
    
    var screen = Ext.create('Ext.Panel', 
    {
        id              : bodyid,
        fullscreen      : true,

        html: '',
        items: [header],

        listeners:
        {
            painted :function()
            {
                MainApp.app.database.getEventList("top");
            },
        },
    });
        
    return screen;
}

///////////////////////////////////////////////////////////////////////

function CreateMenuPanel()
{
    var screen = Ext.create('Ext.Panel', 
    {
        left: 0,
        width : 300,
        height : 300,
        padding: 10,
        modal : true,
        hideOnMaskTap: true,
        zIndex : 999,
        
        layout: 
        {
            pack: 'justify',
            align: 'center'
        },

        defaults:
        {
            iconMask: true,
            xtype:'button',
        },
                            
        items:[
        {
            ui: 'action',
            text : 'Pin to Calendar',
            iconCls : "locate4",
            handler: function()
            {
                //Do some riskey conversions...
                var book = $('#magazine');
                var page = book.turn('page') - (MainApp.app.eventBroswer.tocPages + 2);
                var guid = MainApp.app.eventBroswer.store.data.items[page].data['guid'];

                MainApp.app.database.checkUserin(guid);
                MainApp.app.eventBroswer.menu.hide();
               
                MainApp.app.calendarLayer.goTo(MainApp.app.calendarScreen);
            }
        },
        {
            iconCls : "globe1",
            text : 'See Map',
            handler: function()
            {
            }
        },
        {
            iconCls : "mail5",
            text : 'Share with Friends',
            handler: function()
            {
            }
        }]
    });
    
    return screen;
}

///////////////////////////////////////////////////////////////////////
//                        Event Class Functions
///////////////////////////////////////////////////////////////////////

function LoadTemplates()
{
    var htmlStr = "";
    MainApp.app.database.templateStore.data.each(function(item, index, totalItems) 
    {
        var css = ServerBase + 'templates/' + item.data['name'] + '.css';
        htmlStr += '<link rel="stylesheet" href="' + css + '" type="text/css">';
    });
    
    //Load this into the html
    this.screen.setHtml(htmlStr);
}

///////////////////////////////////////////////////////////////////////
//                       CREATING BOOK HTML
///////////////////////////////////////////////////////////////////////

function CreateTableOfContents(store)
{
    var htmlStr = '';
    
    //Iterate through the list in increments of 5
    this.tocPages = 0;
    
    for( var item = 0; item < store.data.items.length; item+=5)
    {
        htmlStr += CreateTocPage(store, item);
        this.tocPages++;
    }
    
    //Send data out
    return htmlStr;
}

///////////////////////////////////////////////////////////////////////

function PopulateEventBoard(store)
{	
    if (store.data.items.length > 0)
    {
        this.screen.removeAll();
        
        this.store = store;
        
        //Add some cards..
        var coverhtml = CreateCoverStory(store.data.items[0].data);
        var pageStr   =  '';
        
        //Create the toc
        var tocStr  = this.createToc(store);
        
        store.data.each(function(item, index, totalItems) 
        {
            pageStr += '<div class="' + item.data['template'] + '">';
            pageStr += DrawEventPoster(item.data);
            pageStr += '</div>';
        });
        
        htmlStr = '<div id="magazine">' + coverhtml + tocStr + pageStr + '</div>';
        
        var screen = new Ext.Panel(
        {
            html    : htmlStr,

            listeners:
            {
                painted :function()
                {
                    var book = $('#magazine');
                    book.turn(
                    {
                        display: 'single',
                        acceleration: true,
                        gradients: true,
                        inclination: '0.5',
                        duration: 800,
                        width: 320,
                        height: 385,
                        autoCenter: true,
                              
                        when: 
                        {
                            turned: function(e, page) 
                            {
                            }
                        }
                    });
                }
            }
        });
        

        //Register page moving
        screen.element.on(
        {
            delegate: 'div',
            tap: function (e,t) 
            {
                var cls = t.getAttribute('class');
                if (cls == 'toc_header')
                {
                    var page     = t.getAttribute('page');
                    var pageNum  = parseInt(page);
                    pageNum      += (MainApp.app.eventBroswer.tocPages + 2);
                    
                    if (pageNum != this.curPage)
                    {
                          var book = $('#magazine');
                          book.turn('page', pageNum);
                          this.curPage = pageNum;
                    }
                }
            }
        });
        
        MainApp.app.eventBroswer.screen.add(screen);
    }
}

///////////////////////////////////////////////////////////////////////

function GoToEventBrowser( filter )
{    
    //Reset the book
    this.curPage = 1;
    var book = $('#magazine');
    if (book.length)
    {
        book.turn('page', this.curPage);
    }
    
    MainApp.app.browseEventLayer.goTo();
    MainApp.app.browseEventLayer.layer.animateActiveItem(MainApp.app.eventBroswer.screen,
                                                     {type: 'slide', direction: 'left'});
    MainApp.app.database.getEventList(filter);
}