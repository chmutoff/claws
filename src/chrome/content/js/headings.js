const gClipboardHelper = Components.classes["@mozilla.org/widget/clipboardhelper;1"].getService(Components.interfaces.nsIClipboardHelper)

/**
 * Render headings list
 */
function renderHeadingsList() {
    if('arguments' in window && window.arguments.length > 0) {
        var headingsList = window.arguments[0].headingsList     // object with headings 
        var listBox = document.getElementById('headings-list')  // reference to the listBox in the document
        
        for ( var i in headingsList ) {
            var row = document.createElement('listitem');
            var cell = document.createElement('listcell');
            
            cell.setAttribute('label', headingsList[i].text);
            row.appendChild(cell);
        
            cell = document.createElement('listcell');
            cell.setAttribute('label', headingsList[i].level );
            row.appendChild(cell);
        
            listBox.appendChild(row)
        }
    }
}

/**
 * Copy heading text to clipboard
 */
function copyHeading() {
    var listBox = document.getElementById('headings-list')
    gClipboardHelper.copyString(listBox.selectedItem.firstChild.getAttribute('label'))
}