const { classes: Cc, interfaces: Ci, utils: Cu } = Components;
Cu.import('resource://claws/OutputFactory.js')
Cu.import('resource://claws/DomWalker.js')
Cu.import('resource://claws/whitespaceHelper.js')

const gClipboardHelper = Cc["@mozilla.org/widget/clipboardhelper;1"].getService(Ci.nsIClipboardHelper)

var _linksList
var _headingsList
var _preferencesWindow = null

/**
 * Extension entry point
 *
 * @param {Window} Reference to the  window which contains the HTML to process
 */
function start(sourceWindow){
   
    // get preferences
    var prefs = Cc["@mozilla.org/preferences-service;1"]
                    .getService(Ci.nsIPrefService).getBranch("extensions.claws.output.");

    var mode = prefs.getCharPref("mode")
    var quote = prefs.getBoolPref("quote")
    var address = prefs.getBoolPref("address")
    var claws_mode_title = prefs.getBoolPref("claws.mode.title")
    var heading_background_color = prefs.getCharPref("heading.background.color")
    var heading_underline = prefs.getBoolPref("heading.underline")
    var heading_line_break = prefs.getBoolPref("heading.line.break")
    var link_background_color = prefs.getCharPref("link.background.color")
    var link_underline = prefs.getBoolPref("link.underline")
    
    // object with preferences for output modes
    var preferences = {
        quote: quote,
        address: address,
        claws : {
            title: claws_mode_title
        }
    }
    //TODO: separate preferences in arrays
    
    // get the output funcions for selected mode
    var outputFactory = new OutputFactory(preferences)
    var textProvider = outputFactory.createTextProvider(mode)
    
    // walk DOM and generate otput with previously generated output functions
    var dw = new DomWalker(textProvider, sourceWindow)
    var output = dw.walkDOM(sourceWindow.content.document.body)    
    
    var iframe = document.getElementById('output-iframe')
    var iframeContent = iframe.contentDocument
    // reset iframe (just in case it was used before)
    iframeContent.head.innerHTML = ''
    iframeContent.body.innerHTML = ''

    // get user preferences for output style
    var elemColorPref = prefs.getCharPref("element.text.color")
    var elemBackgroundPref = prefs.getCharPref("element.text.background.color")
    var backgroundColor = prefs.getCharPref("background.color")

    // create the output style
    var css = 'body{background-color: '+backgroundColor+'; line-height: 25px; font-family: "Verdana" font-size: 13px; color: #333}'
    css += '.tag-output{color: '+elemColorPref+'; background-color: '+elemBackgroundPref+'; margin-right: 5px; padding: 2px 5px;}'
    css += '.heading-text{background-color:'+heading_background_color+'; text-decoration:'+(heading_underline ? 'underline' : 'none')+';}'
    css += '.link-text{background-color:'+link_background_color+'; text-decoration:'+(link_underline ? 'underline' : 'none')+';}'
    if (heading_line_break) {
        css += '.heading{display:block; margin-top:20px;} .heading-text{display:block; margin-bottom:20px;}'
    }
    
    // create style element
    var style = iframeContent.createElement('style')
    style.type = 'text/css'
    style.appendChild(document.createTextNode(css));
    
    // append style to document
    iframeContent.getElementsByTagName('head')[0].appendChild(style);
    
    // usefull post process elements
    _linksList = dw.linkList
    _headingsList = dw.headingList
    var formsList = dw.formsList
    
    // prepend document information like page title, number of links and forms, etc...
    var docInfo = {
        docTitle : sourceWindow.content.document.title,
        nOfLinks : _linksList.length,
        nOfForms : formsList.length,
        nOfHeadings : _headingsList.length
    }
    var firstChild = sourceWindow.content.document.createTextNode(textProvider.getIntroText(docInfo) + ' ')
    output.insertBefore(firstChild, output.firstChild)
    
    // dump the output <div> into iframe
    iframeContent.body.appendChild(output)
}

/**
 * Open links list window
 *
 * _linksList is a new window parameter. Links are rendered in the new window
 */
function openLinksWindow()
{
    window.openDialog('chrome://claws/content/links.xul', 'links', 'menubar,close,minimizable,scrollbars,resizable,modal,width=450,height=250', {linksList: _linksList});
}

/**
 * Open headings list window
 * _headingsList is a new window parameter. Headings are rendered in the new window
 */
function openHeadingsWindow()
{
    window.openDialog('chrome://claws/content/headings.xul', 'headings', 'menubar,close,minimizable,scrollbars,resizable,modal,width=450,height=250', {headingsList: _headingsList});    
}

/**
 * Copy selected text to clipboard
 */
function copySelectedOutput(){
    var selectedText = document.commandDispatcher.focusedWindow.getSelection().toString()
    var cleanSelectedText = cleanText(selectedText)
    gClipboardHelper.copyString(cleanSelectedText)
}

/**
 * Copy all the output to clipboard
 */
function copyAllOutput(){
    var selectedText = document.getElementById('output-iframe').contentDocument.body.textContent
    var cleanSelectedText = cleanText(selectedText)
    gClipboardHelper.copyString(cleanSelectedText)
}

/**
 * Open preferences window from main window
 */
function openPreferencesWindow(){
  if (null == this._preferencesWindow || this._preferencesWindow.closed) {
    let features = "chrome,titlebar,toolbar,centerscreen,modal";

    this._preferencesWindow =
      window.openDialog(
        "chrome://claws/content/preferences.xul",
        "claws-preferences-window", features);
  }

  this._preferencesWindow.focus();
}

/**
 * Open About Claws window
 */
function openAboutWindow() {
    window.openDialog('chrome://claws/content/about.xul', 'about', 'menubar,close,minimizable,scrollbars,resizable,modal,width=450,height=150');    
}