console.log('claws.js loaded')

Components.utils.import('resource://claws/helper.js');
Components.utils.import('resource://claws/generalText.js');
Components.utils.import('resource://claws/nvdaText.js');
Components.utils.import('resource://claws/domWalker.js');

function TextFactory(){
    this.createTextProvider = function(mode){
        var textProvider = {}    
        switch (mode) {
            case 'NVDA':
               
                var NVDAStringBundle = document.getElementById('NVDA-string-bundle');
                var nvdaText = new NvdaText(NVDAStringBundle)
                
                textProvider.getText = nvdaText.getNvdaText
                textProvider.getClosingText = nvdaText.getClosingNvdaText
                textProvider.getInputText = nvdaText.getInputNvdaText
                
                break
        }
        return textProvider
    }
}

var _linksList
var _headingsList

function start(sourceWindow){    
    var application = Components.classes["@mozilla.org/fuel/application;1"].getService(Components.interfaces.fuelIApplication)
    var modePref = application.prefs.get("extensions.claws.output.mode")
    var mode = modePref.value
    var textFactory = new TextFactory();
    var textProvider = textFactory.createTextProvider(mode)
    
    //var doc = document.implementation.createDocument( '', '', document.implementation.createDocumentType('html', '', '') )
    //console.log(sourceWindow.content.location.href)
    var dw = new DomWalker(textProvider, sourceWindow)
    var output = dw.walkDOM(sourceWindow.content.document.body)
    var iframe = document.getElementById('output-iframe').contentDocument
    
    // get user preferences for output style
    var application = Components.classes["@mozilla.org/fuel/application;1"].getService(Components.interfaces.fuelIApplication)
    var colorPref = application.prefs.get("extensions.claws.output.element.text.color")
    var backgroundPref = application.prefs.get("extensions.claws.output.element.text.background") 
    
    // style for output
    var style = iframe.createElement('style')
    style.type = 'text/css'
    style.innerHTML = '.tag-output{color: '+colorPref.value+'; background-color: '+backgroundPref.value+'; margin-right: 5px; padding: 2px 5px;}'
    style.innerHTML += '.output{line-height: 25px}'
    iframe.getElementsByTagName('head')[0].appendChild(style);
    
    _linksList = dw.linkList
    _headingsList = dw.headingList
    
    // dump the output into iframe
    iframe.body.appendChild(output)
}

function openLinksWindow()
{
    window.openDialog('chrome://claws/content/links.xul', 'links', 'menubar,close,minimizable,scrollbars,resizable', {linksList: _linksList});
}

function openHeadingsWindow()
{
    window.openDialog('chrome://claws/content/headings.xul', 'headings', 'menubar,close,minimizable,scrollbars,resizable', {headingsList: _headingsList});    
}