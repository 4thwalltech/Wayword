
///////////////////////////////////////////////////////////////////////
//                        App Layer
///////////////////////////////////////////////////////////////////////

function NewEventLayer()
{
    //Here is the holder screen.
    this.layer = new Ext.Panel(
    {
        id      : 'newEventLayer',
        layout  : 'card',
        iconCls : 'add',
        title   : 'New',

        items: [MainApp.app.newEventForm.screen, MainApp.app.newEventEditor.screen],

        listeners:
        {
            activate:function()
            {
            }
        },
    });
}