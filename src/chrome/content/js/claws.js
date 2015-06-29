Components.utils.import('resource://claws/OutputFactory.js')
Components.utils.import('resource://claws/DomWalker.js')
Components.utils.import('resource://claws/whitespaceHelper.js')

const gClipboardHelper = Components.classes["@mozilla.org/widget/clipboardhelper;1"].getService(Components.interfaces.nsIClipboardHelper)

var _linksList
var _headingsList

/**
 * Extension entry point
 *
 * @param {Window} sourceWindow is the reference to the  window which contains the HTML to process
 */
function start(sourceWindow){
    
    // get localized text bundles
    var stringBundles = {
        nvdaStringBundle : document.getElementById('NVDA-string-bundle'),
        clawsStringBundle : document.getElementById('CLAWS-string-bundle')
    }
    
    // get settings
    var application = Components.classes["@mozilla.org/fuel/application;1"].getService(Components.interfaces.fuelIApplication)
    var mode = application.prefs.get("extensions.claws.output.mode").value
    var quote = application.prefs.get("extensions.claws.output.quote").value
    var address = application.prefs.get("extensions.claws.output.address").value
    var docLang = sourceWindow.content.document.getElementsByTagName('html')[0].getAttribute('lang')
    var settings = {
        docLang: docLang,
        quote: quote,
        address: address
    }
    
    // get the output funcions for selected mode
    var outputFactory = new OutputFactory(stringBundles, settings)
    var textProvider = outputFactory.createTextProvider(mode)
    
    // walk DOM and generate otput with previously generated output functions
    var dw = new DomWalker(textProvider, sourceWindow)
    var output = dw.walkDOM(sourceWindow.content.document.body)
    var iframe = document.getElementById('output-iframe').contentDocument
    
    // get user preferences for output style
    var application = Components.classes["@mozilla.org/fuel/application;1"].getService(Components.interfaces.fuelIApplication)
    var colorPref = application.prefs.get("extensions.claws.output.element.text.color")
    var backgroundPref = application.prefs.get("extensions.claws.output.element.text.background") 
    
    // style the output
    var style = iframe.createElement('style')
    style.type = 'text/css'
    style.innerHTML = '.tag-output{color: '+colorPref.value+'; background-color: '+backgroundPref.value+'; margin-right: 5px; padding: 2px 5px;}'
    style.innerHTML += '.output{line-height: 25px}'
    iframe.getElementsByTagName('head')[0].appendChild(style);
    
    // usefull post process elements
    _linksList = dw.linkList
    _headingsList = dw.headingList
    var formsList = dw.formsList
    
    // prepend document information like page title, number of links and forms, etc...
    var docInfo = {
        docTitle : sourceWindow.content.document.title,
        nOfLinks : _linksList.length,
        nOfForms : formsList.length
    }
    var firstChild = sourceWindow.content.document.createTextNode(textProvider.getIntroText(docInfo) + ' ')
    output.insertBefore(firstChild, output.firstChild)
    
    // dump the output <div> into iframe
    iframe.body.appendChild(output)
}

/**
 * Opens a window with links list
 *
 * _linksList is a new window parameter. Links are rendered in the new window
 */
function openLinksWindow()
{
    window.openDialog('chrome://claws/content/links.xul', 'links', 'menubar,close,minimizable,scrollbars,resizable,modal,width=450,height=250', {linksList: _linksList});
}

/**
 * Opens a window with links list
 * _headingsList is a new window parameter. Headings are rendered in the new window
 */
function openHeadingsWindow()
{
    window.openDialog('chrome://claws/content/headings.xul', 'headings', 'menubar,close,minimizable,scrollbars,resizable,modal,width=450,height=250', {headingsList: _headingsList});    
}

function copySelectedOutput(){
    var selectedText = document.commandDispatcher.focusedWindow.getSelection().toString()
    var cleanSelectedText = cleanText(selectedText)
    gClipboardHelper.copyString(cleanSelectedText)
}

function copyAllOutput(){
    var selectedText = document.getElementById('output-iframe').contentDocument.body.textContent
    var cleanSelectedText = cleanText(selectedText)
    gClipboardHelper.copyString(cleanSelectedText)
}