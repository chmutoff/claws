Components.utils.import('resource://claws/OutputFactory.js')
Components.utils.import('resource://claws/DomWalker.js')
Components.utils.import('resource://claws/whitespaceHelper.js')

const gClipboardHelper = Components.classes["@mozilla.org/widget/clipboardhelper;1"].getService(Components.interfaces.nsIClipboardHelper)

var _linksList
var _headingsList
var _preferencesWindow = null

/**
 * Extension entry point
 *
 * @param {Window} Reference to the  window which contains the HTML to process
 */
function start(sourceWindow){
    
    // get localized text bundles
    var stringBundles = {
        nvdaStringBundle : document.getElementById('NVDA-string-bundle'),
        clawsStringBundle : document.getElementById('CLAWS-string-bundle')
    }
    
    // get preferences
    var application = Components.classes["@mozilla.org/fuel/application;1"].getService(Components.interfaces.fuelIApplication)
    var mode = application.prefs.get("extensions.claws.output.mode").value
    var quote = application.prefs.get("extensions.claws.output.quote").value
    var address = application.prefs.get("extensions.claws.output.address").value
    var claws_mode_title = application.prefs.get("extensions.claws.output.claws.mode.title").value
    var heading_background_color = application.prefs.get("extensions.claws.output.heading.background.color").value
    var heading_underline = application.prefs.get("extensions.claws.output.heading.underline").value
    var heading_line_break = application.prefs.get("extensions.claws.output.heading.line.break").value
    var link_background_color = application.prefs.get("extensions.claws.output.link.background.color").value
    var link_underline = application.prefs.get("extensions.claws.output.link.underline").value
    
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
    var outputFactory = new OutputFactory(stringBundles, preferences)
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
    var application = Components.classes["@mozilla.org/fuel/application;1"].getService(Components.interfaces.fuelIApplication)
    var elemColorPref = application.prefs.get("extensions.claws.output.element.text.color").value
    var elemBackgroundPref = application.prefs.get("extensions.claws.output.element.text.background.color").value
    var backgroundColor = application.prefs.get("extensions.claws.output.background.color").value
    
    // style the output
    var style = iframeContent.createElement('style')
    style.type = 'text/css'    
    style.innerHTML = 'body{background-color: '+backgroundColor+'; line-height: 25px; font-family: "Verdana" font-size: 13px; color: #333}'
    style.innerHTML += '.tag-output{color: '+elemColorPref+'; background-color: '+elemBackgroundPref+'; margin-right: 5px; padding: 2px 5px;}'
    if (heading_line_break) {
        style.innerHTML += '.heading{display:block; margin-top:20px;} .heading-text{display:block; margin-bottom:20px;}'
    }
    style.innerHTML += '.heading-text{background-color:'+heading_background_color+'; text-decoration:'+(heading_underline ? 'underline' : 'none')+';}'
    style.innerHTML += '.link-text{background-color:'+link_background_color+'; text-decoration:'+(link_underline ? 'underline' : 'none')+';}'
    iframeContent.getElementsByTagName('head')[0].appendChild(style);
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
    let instantApply =
      Application.prefs.get("browser.preferences.instantApply");
    let features =
      "chrome,titlebar,toolbar,centerscreen" +
      (instantApply.value ? ",dialog=no" : ",modal");

    this._preferencesWindow =
      window.openDialog(
        "chrome://claws/content/preferences.xul",
        "xulschoolhello-preferences-window", features);
  }

  this._preferencesWindow.focus();
}