console.log('core.js loaded')
// TODO: replace some var for let (if necesary)

function countListNodes(node){
  return node.childNodes.length
}

function addHeading(node){
  var headingList = document.getElementById('heading-list')
  var headingText = node.textContent
  headingList.appendItem(headingText, '')
  
  // TODO: APPEND IMAGE ALT TEXT (if exists <h1>text<img src="" alt="altText"></h1>) 
}

function addLink(node){
  var linkList = document.getElementById('link-list')
  var linkText = node.textContent
  var linkURL = node.getAttribute('href')
  linkText += ( (node.getAttribute('alt') != null)? node.getAttribute('alt') : '' ) // Get link title from alt attribute of AREA tag
  
  var item = linkList.appendItem(linkText, '')
  item.ondblclick = function(){window.open(linkURL, '_blank')}
  
  // TODO: APPEND IMAGE ALT TEXT (if exists <a>text<img src="" alt="altText"></a>) 
}

var nvdaText = {
    getNvdaText : function(node){
      var NVDAStringBundle = document.getElementById('NVDA-string-bundle');
      var tagName = node.tagName
      
      switch(tagName) {
        case 'A':
          // NVDA annouces if link have been visited
          // it is not possible for javascript to detect if a link is visited in either Firefox or Chrome (security reasons)
          // https://developer.mozilla.org/en-US/docs/Web/CSS/Privacy_and_the_:visited_selector
          addLink(node)
          return NVDAStringBundle.getString('NVDA.output.link')
        case 'ADDRESS':
          return ''
        case 'AREA':
          addLink(node)
          return NVDAStringBundle.getString('NVDA.output.link')
        case 'ASIDE':
          return NVDAStringBundle.getString('NVDA.output.aside')
        case 'BLOCKQUOTE':
          return NVDAStringBundle.getString('NVDA.output.quote')
        case 'BUTTON':
          return NVDAStringBundle.getString('NVDA.output.button')
        case 'CITE':
          return ''
        case 'DATALIST':
          return NVDAStringBundle.getString('NVDA.output.datalist')
        case 'DL':
          return NVDAStringBundle.getFormattedString('NVDA.output.list', [countListNodes(node)])
        case 'FOOTER':
          if (node.parentNode.nodeName == 'BODY') {
            // NVDA only anounces the page footer
            return NVDAStringBundle.getString('NVDA.output.body.footer')
          }
          else return ''
        case 'H1':
          addHeading(node)
          return NVDAStringBundle.getFormattedString('NVDA.output.heading.level', [1])
        case 'H2':
          addHeading(node)
          return NVDAStringBundle.getFormattedString('NVDA.output.heading.level', [2])
        case 'H3':
          addHeading(node)
          return NVDAStringBundle.getFormattedString('NVDA.output.heading.level', [3])
        case 'H4':
          addHeading(node)
          return NVDAStringBundle.getFormattedString('NVDA.output.heading.level', [4])
        case 'H5':
          addHeading(node)
          return NVDAStringBundle.getFormattedString('NVDA.output.heading.level', [5])
        case 'H6':
          addHeading(node)
          return NVDAStringBundle.getFormattedString('NVDA.output.heading.level', [6])
        case 'HEADER':
          return NVDAStringBundle.getString('NVDA.output.header')
        case 'HR':
          return NVDAStringBundle.getString('NVDA.output.hr')
        case 'IFRAME':
          return NVDAStringBundle.getString('NVDA.output.iframe')
        case 'IMG':
          return ''
        case 'INPUT':
          return getInputText(node)
        case 'MAIN':
          return NVDAStringBundle.getString('NVDA.output.main')
        case 'MAP':
          return NVDAStringBundle.getString('NVDA.output.map')
        case 'METER':
          return ''
        case 'NAV':
          return NVDAStringBundle.getString('NVDA.output.nav')
        case 'OBJECT':
          return NVDAStringBundle.getString('NVDA.output.object')
        case 'OL':
          return NVDAStringBundle.getFormattedString('NVDA.output.list', [countListNodes(node)])
        case 'PRE':
          return ''
        case 'PROGRESS':
          return NVDAStringBundle.getString('NVDA.output.progress')
        case 'Q':
          return ''
        case 'SELECT':
          return NVDAStringBundle.getString('NVDA.output.select') // TODO: show if is expanded or not. Any sense???
        case 'TABLE':
          return NVDAStringBundle.getFormattedString('NVDA.output.table', [getNumRowsInTable(node), getNumCellsInTable(node)])
        case 'TD':
          return NVDAStringBundle.getFormattedString('NVDA.output.table.column', [(node.cellIndex+1)])
        case 'TEXTAREA':
          return NVDAStringBundle.getString('NVDA.output.textarea')
        case 'TH':
          return NVDAStringBundle.getFormattedString('NVDA.output.table.column', [(node.cellIndex+1)])
        case 'TR':
          return NVDAStringBundle.getFormattedString('NVDA.output.table.row', [(node.rowIndex+1)])
        case 'UL':
          return NVDAStringBundle.getFormattedString('NVDA.output.list', countListNodes(node))
        default:
          return ''
      }
    },
    
    getClosingNvdaText : function(node){
      var NVDAStringBundle = document.getElementById('NVDA-string-bundle');
      var tagName = node.tagName
      switch (tagName) {
        case 'BLOCKQUOTE':
          return  NVDAStringBundle.getString('NVDA.output.quote.end')
        case 'CITE':
          return ''
        case 'DL':
          return NVDAStringBundle.getString('NVDA.ouptut.list.end')
        case 'IFRAME':
          return NVDAStringBundle.getString('NVDA.output.iframe.end')
        case 'OL':
          return NVDAStringBundle.getString('NVDA.ouptut.list.end')
        case 'Q':
          return ''
        case 'TABLE':
          return NVDAStringBundle.getString('NVDA.output.table.end')
        case 'UL':
          return NVDAStringBundle.getString('NVDA.ouptut.list.end')
        default:
          return ''
      }
    },
    
    getInputNvdaText : function(node){
      var NVDAStringBundle = document.getElementById('NVDA-string-bundle');
      var inputType = node.type
      switch (inputType){
        case 'button':
          return NVDAStringBundle.getString('NVDA.output.button')
        case 'checkbox':
          return NVDAStringBundle.getString('NVDA.output.input.checkbox') + ' ' + ((node.checked)? NVDAStringBundle.getString('NVDA.output.input.checkbox.checked') : NVDAStringBundle.getString('NVDA.output.input.checkbox.unchecked'))
        case 'color':
          return NVDAStringBundle.getString('NVDA.output.button')
        /*
        case 'date':
          return NVDAStringBundle.getString('NVDA.output.input.text') + ((node.autocomplete != 'off')? NVDAStringBundle.getString('NVDA.output.input.text.autocomplete') : '')
        case 'datetime':
          return NVDAStringBundle.getString('NVDA.output.input.text') + ((node.autocomplete != 'off')? NVDAStringBundle.getString('NVDA.output.input.text.autocomplete') : '')
        case 'datetime-local':
          return NVDAStringBundle.getString('NVDA.output.input.text') + ((node.autocomplete != 'off')? NVDAStringBundle.getString('NVDA.output.input.text.autocomplete') : '')
        case 'email':
          return NVDAStringBundle.getString('NVDA.output.input.text') + ((node.autocomplete != 'off')? NVDAStringBundle.getString('NVDA.output.input.text.autocomplete') : '')
        */
        case 'file':
          return NVDAStringBundle.getString('NVDA.output.button') // TODO: get input button text and "no file selected" text
        case 'image':
          return NVDAStringBundle.getString('NVDA.output.button')
        /*
        case 'month':
          return NVDAStringBundle.getString('NVDA.output.input.text') + ((node.autocomplete != 'off')? NVDAStringBundle.getString('NVDA.output.input.text.autocomplete') : '')
        */
        case 'number':
          return NVDAStringBundle.getString('NVDA.output.input.number')
        case 'password':
          return NVDAStringBundle.getString('NVDA.output.input.password')
        case 'radio':
          return NVDAStringBundle.getString('NVDA.output.input.radio') + ' ' + ((node.checked)? NVDAStringBundle.getString('NVDA.output.input.checkbox.checked') : NVDAStringBundle.getString('NVDA.output.input.checkbox.unchecked'))
        case 'range':
          return NVDAStringBundle.getString('NVDA.output.input.range')
        case 'reset':
          return 'botón' // TODO: get reset button text
        /*
        case 'search':
          return NVDAStringBundle.getString('NVDA.output.input.text') + ((node.autocomplete != 'off')? NVDAStringBundle.getString('NVDA.output.input.text.autocomplete') : '')
        */
        case 'submit':
          return 'botón' // TODO: get submit button text
        /*
        case 'tel':
          return NVDAStringBundle.getString('NVDA.output.input.text') + ((node.autocomplete != 'off')? NVDAStringBundle.getString('NVDA.output.input.text.autocomplete') : '')
        case 'text':
          return NVDAStringBundle.getString('NVDA.output.input.text') + ((node.autocomplete != 'off')? NVDAStringBundle.getString('NVDA.output.input.text.autocomplete') : '')
        case 'url':
          return NVDAStringBundle.getString('NVDA.output.input.text') + ((node.autocomplete != 'off')? NVDAStringBundle.getString('NVDA.output.input.text.autocomplete') : '')
        case 'week':
          return NVDAStringBundle.getString('NVDA.output.input.text') + ((node.autocomplete != 'off')? NVDAStringBundle.getString('NVDA.output.input.text.autocomplete') : '')
        */
        default:
          return NVDAStringBundle.getString('NVDA.output.input.text') + ' ' + ((node.autocomplete != 'off')? NVDAStringBundle.getString('NVDA.output.input.text.autocomplete') : '') // TODO: maybe remove all cases with this input...
      } 
    },
    
    /** Returns relevant node information
     * i.e: image alt attribute text,
     *      input value,
     *      etc...
     */
    getRelevantText : function(node){
      var tagName = node.tagName
    
      switch (tagName) {
        case 'AREA':
          return node.getAttribute('alt')
        case 'IMG':
          return node.getAttribute('alt')
        case 'INPUT':
          var inputType = node.type
          switch (inputType) {      
            case 'image':
              return node.alt
            case 'radio':
              return ''
            default:
              return node.value
          }
        case 'SELECT':
          return node.value
        default:
          return ''
      }
    }
}


function TextFactory(){
  this.createTextProvider = function(mode){
    var textProvider = {}    
    switch (mode) {
      case 'NVDA':
        //console.log('NVDA mode selected')
        textProvider.getText = nvdaText.getNvdaText
        textProvider.getClosingText = nvdaText.getClosingNvdaText
        textProvider.getInputText = nvdaText.getInputNvdaText
        textProvider.getRelevantText = nvdaText.getRelevantText
    }
    return textProvider
  }
}


var Claws = function(){
  var _iframe
  var _iframeDocument
  var _output
  var _source  
  var _textProvider
  
  function init()
  {
    //console.log('fn init')
    _iframe = document.getElementById('output-iframe')
    _iframeDocument = _iframe.contentDocument
    _output = _iframeDocument.getElementById('screen-output')
    _source = window.opener.content.document
    
    var textFactory = new TextFactory();
    var application = Components.classes["@mozilla.org/fuel/application;1"].getService(Components.interfaces.fuelIApplication)
    var modePref = application.prefs.get("extensions.claws.output.mode")
    var mode = modePref.value
    _textProvider = textFactory.createTextProvider(mode)    
  }
  
  function cleanWhitespace(node)
  {
    for (var i=0; i<node.childNodes.length; i++)
    {
      var child = node.childNodes[i];
      if(child.nodeType == 3 && !/\S/.test(child.nodeValue))
      {
        node.removeChild(child);
        i--;
      }
      if(child.nodeType == 1)
      {
        cleanWhitespace(child);
      }
    }
    return node;
  }
  
  /** Cleans an input text by removing all the multiple whitespaces and brakelines
   * Source1: TextFixer (http://www.textfixer.com/tutorials/javascript-line-breaks.php)
   * Source2: MDN Reference (http://www.textfixer.com/tutorials/javascript-line-breaks.php)
   */
  function cleanText(text)
  {
    //Replace all 3 types of line breaks with a space
    text = text.replace(/(\r\n|\n|\r)/gm," ")
    
    //Replace all double white spaces with single spaces
    text = text.replace(/\s+/g," ")
    
    //Remove whitespace from both ends of a string
    text = text.trim()
    
    return text;
  }
  
  /** THIS IS THE MAIN FUNCTION (: */
  function walkDOM(dom){
    //console.log('walk dom')
    var nodeStack = new Array()
    cleanWhitespace(dom)
    nodeStack.push(dom)
  
    do{       
      var nodeToExpand = nodeStack.pop()
      //console.log(nodeStack)
      
      // nodeType == 1 -> ELEMENT_NODE
      if (nodeToExpand.nodeType == 1) {      
        // insert tag text
        appendSpanToOutput(_textProvider.getText(nodeToExpand))
        
        // insert text of revelant attributes
        appendTextToOutput(_textProvider.getRelevantText(nodeToExpand))
        
        // check if node needs to be expanded
        if ( !isNodeExcluded(nodeToExpand) && !isNodeHidden(nodeToExpand) ){
          // insert closing tag var node with text if necesary
          var closingText = _textProvider.getClosingText(nodeToExpand)
          if ( closingText != '' ) {
            nodeStack.push(closingText)
          }
          
          // expand node
          nodeToExpand = nodeToExpand.lastChild
          while(nodeToExpand)
          {
            nodeStack.push(nodeToExpand)
            nodeToExpand = nodeToExpand.previousSibling
          }       
          
          /*
          var children = nodeToExpand.children
          for( var i=children.length-1; i>=0; --i)
          {
            console.log(children[i].nodeType)
            nodeStack.push(children[i])
          }
          */            
        }
        else if (nodeToExpand.tagName == 'TABLE') {
          console.log('Processing table')
          var rows = nodeToExpand.rows
          for( var i = rows.length-1; i>=0; --i )
          {
            nodeStack.push(rows[i])         
          }
        }
        else if (nodeToExpand.tagName == 'IFRAME') {
          if(nodeToExpand.contentDocument != null)
          {	
            nodeStack.push(nodeToExpand.contentDocument.getElementsByTagName('html')[0]);
            var closingText = _textProvider.getClosingText(nodeToExpand)
            if ( closingText != '' ) {
              nodeStack.push(closingText)
            }
          }
        }
      }
      // nodeType == 3 -> TEXT_NODE    
      else if(nodeToExpand.nodeType == 3){
        //console.log(nodeToExpand)
        // print textNode content
        appendTextToOutput(nodeToExpand.textContent + ' ')
      }
      // string contains tag closing announcement
      else if (typeof(nodeToExpand) == 'string'){
        appendSpanToOutput(nodeToExpand)
      }      
      //console.log(nodeStack)    
    }while(nodeStack.length > 0)
  }
  
  function appendTextToOutput(text){
    if ( text != '' ){
      var child = _iframeDocument.createTextNode(text + ' ')
      _output.appendChild(child)
    }
  }
  
  function appendSpanToOutput(text){
    if ( text != '' ){
      var spanNode = _iframeDocument.createElement('span')
      spanNode.className = 'tag-output'
      var textNode = _iframeDocument.createTextNode(text)
      spanNode.appendChild(textNode)
      _output.appendChild(spanNode)
    }
  }
  
  /**
   * Returns true if node should not be expanded
   */
  function isNodeExcluded(node) {
    var tag = node.tagName
   
    var excludedTagNames = [
      'AUDIO',    // Nothing to process here
      'BASE',     // specifies the base URL to use for all relative URLs contained within a document
      'CANVAS',   // draw graphics via scripting
      'DATA',     // Only in WHATWG version of HTML, not in W3C. Just in case...
      'EMBED',    // tag defines a container for an external application or interactive content (a plug-in)
      'HEAD',     // specifies the base URL to use for all relative URLs contained within a document
      'IFRAME',   // TODO: process iframe THIS IS EXPANDED MANUALLY
      'LINK',     // specifies relationships between the current document and an external resource
      'META',     // represents any metadata information that cannot be represented by one of the other HTML meta-related elements
      'NOSCRIPT',
      'OPTION',
      'PARAM',    // tag is used to define parameters for plugins embedded with an <object> element
      'SCRIPT',
      'STYLE',    // contains style information for a document, or a part of document
      'TABLE',    // THIS IS EXPANDED MANUALLY
      'TITLE',    // defines the title of the document, shown in a browser's title bar or on the page's tab
      'VIDEO'     // Nothing to process here   
    ]
   
    return ( excludedTagNames.indexOf(tag) > -1 )   
  }
  
  function isNodeHidden(node)
  {
    //return (node.style.display == 'none' || node.style.visibility == 'hidden')
  }
  
  return {
    start : function(){
      init()
      walkDOM(_source.body)
    }
  }
  
}
























































/**
 * Returns text for tags
 */
function getText(node)
{
  
}





