const gClipboardHelper = Components.classes["@mozilla.org/widget/clipboardhelper;1"].getService(Components.interfaces.nsIClipboardHelper)

/**
 * Render links list
 */
function renderLinksList() {
    if('arguments' in window && window.arguments.length > 0) {
        var linksList = window.arguments[0].linksList
        var listBox = document.getElementById('links-list')
        
        for ( var i in linksList ) {
            let label = linksList[i].text.toString()
            let url  = linksList[i].url.toString()
            listBox.appendItem(label, url).ondblclick = function(){ window.open(url, '_blank') }
        }
    }
}

/**
 * Copy link text to clipboard
 */
function copyText(){
    var listBox = document.getElementById('links-list')
    gClipboardHelper.copyString(listBox.selectedItem.label)
}

/**
 * Copy link url to clipboard
 */
function copyLink(){
    var listBox = document.getElementById('links-list')
    gClipboardHelper.copyString(listBox.selectedItem.value)
}