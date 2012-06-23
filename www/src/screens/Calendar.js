
///////////////////////////////////////////////////////////////////////

Ext.define('CalEvent',
{
    extend: 'Ext.data.Model',
    config :
    {
        fields: 
        [{
            name: 'header',
            type: 'string'
        }, 
        {
            name: 'desc',
            type: 'string'
        }, 
        {
            name: 'guid',      
            type: 'int'
        },
        {
            name: 'start',
            type: 'date',
            dateFormat: 'c'
        },
        {
            name: 'end',
            type: 'date',
            dateFormat: 'c'
        }]
    }
});

///////////////////////////////////////////////////////////////////////
//                        Calendar Screen
///////////////////////////////////////////////////////////////////////

function Calendar()
{
    //Create event board...
    this.create       = CreateCalendarScreen;
    this.refresh      = PopulateCalendar;
    this.goTo         = GoToEventCalendar;
    
    this.screen       = this.create();
}

///////////////////////////////////////////////////////////////////////
//                        CREATE GUI SCREENS
///////////////////////////////////////////////////////////////////////

function CreateCalendarScreen()
{
    //Create store
    this.events = new Ext.data.Store(
    {
        model: 'CalEvent',
        data: []
    });
    
    this.eventMgr = Ext.create('Ext.ux.TouchCalendarEvents', 
    {
        eventBarTpl: '{header} - {desc}'
    });
    
    this.calendar = Ext.create('Ext.ux.TouchCalendarView', 
    {
        minDate     : Ext.Date.add((new Date()), Ext.Date.DAY, -40),
        maxDate     : Ext.Date.add((new Date()), Ext.Date.DAY, 55),
        mode        : 'month',
        weekStart   : 0,
        value       : new Date(),
        eventStore  : this.events,

        plugins: [this.eventMgr]
    });
    
    this.calendar.on('eventtap', function(event)
    {
         MainApp.app.calendarLayer.switchTo(MainApp.app.eventViewer.screen);
    });
    
    var screen = Ext.create('Ext.Panel', 
    {
        title       : 'Calendar',
        fullscreen  : true,
        layout      : 'fit',
        items       : [this.calendar]
    });

    return screen;
}

///////////////////////////////////////////////////////////////////////

function PopulateCalendar( store )
{
    this.events.removeAll();
    
    store.data.each(function(item, index, totalItems) 
    {
        //add it in.
        var date      =  item.data['pinday'];
        if (date)
        {
            var datePiece =  date.split("-");
            
            var start     =  new Date(parseInt(datePiece[0]),
                                      parseInt(datePiece[1]-1),
                                      parseInt(datePiece[2]));
                        
            var event = 
            {
                header  : item.data['place'],
                desc    : item.data['desc'],
                guid    : item.data['guid'];
                start   : start,
                end     : start
            }
                  
            MainApp.app.calendarScreen.events.add(event);
        }
    });
    
    this.eventMgr.refreshEvents();
}

///////////////////////////////////////////////////////////////////////

function GoToEventCalendar()
{
    MainApp.app.database.getEventList("user");
    MainApp.app.calendarLayer.layer.setActiveItem(this.screen);
}
