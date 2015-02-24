/**
 * Renders headings list
 */
function renderHeadingsList() {
    if('arguments' in window && window.arguments.length > 0) {
        var headingsList = window.arguments[0].headingsList
        var listBox = document.getElementById('headings-list')        
        for ( var i in headingsList ) {
            listBox.appendItem(headingsList[i].text, '')
        }
    }
}