/**
 * Renders links list
 */
function renderLinksList() {
    if('arguments' in window && window.arguments.length > 0) {
        var linksList = window.arguments[0].linksList
        var listBox = document.getElementById('links-list')
        
        for ( var i in linksList ) {
            let text = linksList[i].text.toString()
            let url  = linksList[i].url.toString()
            listBox.appendItem(text, '').ondblclick = function(){ window.open(url, '_blank') }
        }
    }
}