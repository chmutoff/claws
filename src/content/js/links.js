function renderLinksList() {
    if('arguments' in window && window.arguments.length > 0) {
        var linksList = window.arguments[0].linksList
        var listBox = document.getElementById('links-list')
        
        console.log(linksList)
        
        for ( var i in linksList ) {
            let text = linksList[i].text.toString()
            let url  = linksList[i].url.toString()
            listBox.appendItem(text, '').ondblclick = function(){ window.open(url, '_blank') }
            
            /*
            console.log('i: '+i)
            console.log('text: ' + linksList[i].text)
            console.log('url: '+ linksList[i].url)
            */
            
            // for some reason the click event is working wrong!!!
            //.addEventListener("click", function(){alert(linksList[i].url)});
            //.ondblclick = function(){window.open(linksList[i].url, '_blank')}
        }
    }
}