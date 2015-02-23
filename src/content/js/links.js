function renderLinksList() {
    if('arguments' in window && window.arguments.length > 0) {
        var linksList = window.arguments[0].linksList
        var listBox = document.getElementById('links-list')
        
        for ( var i in linksList ) {
            listBox.appendItem(linksList[i].text, '')
            // for some reason the click event is working wrong!!!
            //.addEventListener("click", function(){alert(linksList[i].url)});
            //.ondblclick = function(){window.open(linksList[i].url, '_blank')}
        }
    }
}