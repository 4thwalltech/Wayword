
///////////////////////////////////////////////////////////////////////
//                        Drawing Event Functions
///////////////////////////////////////////////////////////////////////

function DrawEventPoster(data)
{	
    //grab the variables
    var template = data['template'];
    var header   = data['place'];
    var desc     = data['desc'];
    var thumb    = data['thumb'];
    var joined   = data['joined'];
    var date     = data['start'];
    
    var htmlStr = '<div class="' + template + '">'; 

    //Add header                                 
    htmlStr += '<header>';
    htmlStr += header;
    htmlStr += '</header>';

    //Add text                                 
    htmlStr += '<description>';
    htmlStr += desc;
    htmlStr += '</description>';

    //Add thumbnail..
    htmlStr += '<thumb>';
    htmlStr += '<img src="' + thumb + '"/>';
    htmlStr += '</thumb>';
    
    //Add...bio?
    var userData = MainApp.app.database.getUserData();
    if (userData != null)
    {
        bioPic = userData['thumb'];
        htmlStr += '<bio>';
        htmlStr += '<img src="' + bioPic + '"/>';
        htmlStr += '</bio>';
    }
    

    //Add going.. 
    htmlStr += '<going>Going: ' + joined + '</going>';
    htmlStr += '<date>Date: ' + date + '</date>';
                   
    htmlStr += '</div>';

    return htmlStr;
}

///////////////////////////////////////////////////////////////////////

function CreateCoverStory(story)
{
    var userData = MainApp.app.database.getUserData();
    
    var htmlStr = '<div>';
    htmlStr     += '<div class="cover_event"><img src="' + story['thumb'] + '" /></div>';
    htmlStr     += '<div class="cover_topevent"><img src="Media/topevent_scrim.png" /></div>';
    htmlStr     += '<div class="cover_join">Joined : ' + story['joined'] + '</div>';
    htmlStr     += '<div class="cover_header">' + story['place'] + '</div>';
    htmlStr     += '<div class="cover_description">' + story['desc'] + '</div>';
    
    htmlStr     += '<div class="cover_profile"><img src="' + story['creatorthumb'] + '" /></div>';
    htmlStr     += '<div class="cover_name">' + story['creator'] + '</div>';
    htmlStr     += '<div class="cover_ranking">' + userData['level'] + '</div>';  
    
    htmlStr     += '</div>';
    
    return htmlStr;
}

///////////////////////////////////////////////////////////////////////

function CreateTocPage(store, startIdx)
{
    var total = store.data.items.length;
    var endItem = ((startIdx + 5) > total) ? total-1 : (startIdx + 4);
    
    var htmlStr  = '<div class="toc_background">';
    htmlStr     += '<div class="toc_ImageLower"><img src="' + store.data.items[startIdx].data['thumb'] + '" /></div>';
    htmlStr     += '<div class="toc_ImageUpper"><img src="' + store.data.items[endItem].data['thumb'] + '" /></div>';
    
    var entry = 1;
    for (var item  = startIdx; item <= endItem; item++)
    {
        htmlStr     += '<div class="toc_entry' + entry +'" id="' + item + '"';
        htmlStr     += 'type="toc" page='+ item +'>';
        
        htmlStr     += '<div class="toc_header" page="' + item + '" guid="' + store.data.items[item].data['guid'] +'">';
        htmlStr     += store.data.items[item].data['place'] + '</div>';
        htmlStr     += '<div class="toc_description">'+ store.data.items[item].data['desc'] + '</div>';
        htmlStr     += '</div>'; 
        
        entry++;
    }
    
    htmlStr     += '</div>';
    
    return htmlStr;
}

