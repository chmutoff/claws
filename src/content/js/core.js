console.log('core.js loaded')
// TODO: replace some var for let (if necesary)

Components.utils.import('resource://claws/helper.js');
Components.utils.import('resource://claws/generalText.js');

function addHeading(node){
  // get heading text including all important atribute info like img alt text
  var headingText = ''
  var children = node.childNodes
  // TODO: maybe refactor domWalker to append nodeList automatically
  // TODO: maybe shoul use while loop instead of for...
  for( var i=0; i<children.length; ++i )
  {
    var out = Claws().getOutput(children[i])
    generalText.removeSpansFromNode(out)
    headingText += out.textContent
  }
  
  // add heading to the list
  var headingList = document.getElementById('heading-list')
  headingList.appendItem(cleanText(headingText), '')
}

function addLink(node){
  // get link text including all important atribute info like img alt text
  var linkText = ''
  var children = node.childNodes
  // TODO: maybe refactor domWalker to append nodeList automatically
  // TODO: maybe shoul use while loop instead of for...
  for( var i=0; i<children.length; ++i )
  {
    var out = Claws().getOutput(children[i])
    generalText.removeSpansFromNode(out)
    linkText += out.textContent
  }
  
  // Get link title from alt attribute of AREA tag
  linkText += ( node.hasAttribute('alt') ? node.alt : '' )
  
  // add link to the list
  var linkList = document.getElementById('link-list')
  var linkURL = node.getAttribute('href') 
  linkText = ( linkText != '' ) ? cleanText(linkText) : linkURL // if link has no text show href text
  var item = linkList.appendItem(linkText, '')
 
  item.ondblclick = function(){window.open(linkURL, '_blank')}
}

var nvdaText = {
  getNvdaText : function(node){
    var NVDAStringBundle = document.getElementById('NVDA-string-bundle');
    var tagName = node.tagName.toUpperCase()
    
    switch(tagName){
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
        return nvdaText.getInputNvdaText(node)
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
        return getCellHeading(node) + ' ' +  NVDAStringBundle.getFormattedString('NVDA.output.table.column', [(node.cellIndex+1)])
      case 'TEXTAREA':
        return NVDAStringBundle.getString('NVDA.output.textarea')
      case 'TH':
        return getCellHeading(node) + ' ' +  NVDAStringBundle.getFormattedString('NVDA.output.table.column', [(node.cellIndex+1)])
      case 'TR':
        return NVDAStringBundle.getFormattedString('NVDA.output.table.row', [(node.rowIndex+1)])
      case 'UL':
        return NVDAStringBundle.getFormattedString('NVDA.output.list', [countListNodes(node)])
      default:
        return ''
    }
  },
  
  getClosingNvdaText : function(node){
    var NVDAStringBundle = document.getElementById('NVDA-string-bundle');
    var tagName = node.tagName.toUpperCase()
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
    var inputType = node.type.toUpperCase()
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
      case 'hidden':
        return ''
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
}

// iheritance! this is awesome (:
nvdaText.__proto__ = generalText

function TextFactory(){
  this.createTextProvider = function(mode){
    var textProvider = {}    
    switch (mode) {
      case 'NVDA':
        //console.log('NVDA mode selected')
        textProvider.getText = nvdaText.getNvdaText
        textProvider.getClosingText = nvdaText.getClosingNvdaText
        textProvider.getInputText = nvdaText.getInputNvdaText
        break
    }
    return textProvider
  }
}

function Claws(){
  var _textProvider
  
  function init()
  {
    // Get the output functions for selected output mode
    var textFactory = new TextFactory();
    var application = Components.classes["@mozilla.org/fuel/application;1"].getService(Components.interfaces.fuelIApplication)
    var modePref = application.prefs.get("extensions.claws.output.mode")
    var mode = modePref.value
    _textProvider = textFactory.createTextProvider(mode)    
  }
  
 
  /** THIS IS THE MAIN FUNCTION (: */
  function walkDOM(dom){
    //console.log('walk dom')
    var nodeStack = new Array()
    var output = window.opener.content.document.createElement('div')
    output.style["line-height"] = '25px'
    cleanWhitespace(dom)
    nodeStack.push(dom)
  
    do{       
      var nodeToExpand = nodeStack.pop()
      //console.log(nodeStack)
      
      // nodeType == 1 -> ELEMENT_NODE
      if ( nodeToExpand.nodeType == 1
            && !isNodeHidden(nodeToExpand)) {      
        // insert tag text
        appendSpanToOutput(_textProvider.getText(nodeToExpand), output)
        
        // insert text of relevant attributes
        appendTextToOutput(getRelevantText(nodeToExpand), output)
        
        // insert closing tag var node with text if necesary
        var closingText = {
          nodeType : 'closingText',
          textContent : _textProvider.getClosingText(nodeToExpand)
        }
        if ( closingText.textContent != '' ) {
          //console.log('closing object:' + closingText.textContent)
          nodeStack.push(closingText)
        } 
        
        // check if node needs to be expanded
        if ( !isNodeExcluded(nodeToExpand) ){
          //console.log('Expanding: ' + nodeToExpand.tagName)
          // expand node
          nodeToExpand = nodeToExpand.lastChild
          while(nodeToExpand)
          {
            nodeStack.push(nodeToExpand)
            nodeToExpand = nodeToExpand.previousSibling
          }
        }
        else if (nodeToExpand.tagName == 'TABLE') {
          // get table rows in a correct order (tfoot can be before tbody)          
          var rows = nodeToExpand.rows
          // add rows to stack
          for( var i=rows.length-1; i>=0; --i )
          {
            nodeStack.push(rows[i])        
          }
          // table can have a caption
          if (nodeToExpand.getElementsByTagName('caption')[0] != null) {
            nodeStack.push(nodeToExpand.getElementsByTagName('caption')[0])
          }
        }
        else if (nodeToExpand.tagName == 'IFRAME'){
          if(nodeToExpand.contentDocument != null)
          {
            cleanWhitespace(nodeToExpand.contentDocument.body)
            nodeStack.push(nodeToExpand.contentDocument.body);
          }
        }
      }
      // nodeType == 3 -> TEXT_NODE    
      else if(nodeToExpand.nodeType == 3){
        //console.log(nodeToExpand)
        // print textNode content
        appendTextToOutput(nodeToExpand.textContent + ' ', output)
      }
      // string contains tag closing announcement
      else if (nodeToExpand.nodeType == 'closingText'){
        appendSpanToOutput(nodeToExpand.textContent, output)
      }      
      //console.log(nodeStack)    
    }while(nodeStack.length > 0)
    return output
  }
  
  function appendTextToOutput(text, output){
    if ( text != '' ){
      var child = window.opener.content.document.createTextNode(text + ' ')
      output.appendChild(child)
    }
  }
  
  function appendSpanToOutput(text, output){
    if ( text != '' ){
      var spanNode = window.opener.content.document.createElement('span')
      spanNode.className = 'tag-output'
      var textNode = window.opener.content.document.createTextNode(text)
      spanNode.appendChild(textNode)
      output.appendChild(spanNode)
    }
  }
  
  /** Returns relevant node information
   * i.e: image alt attribute text,
   *      input value,
   *      etc...
   */
  function getRelevantText(node){
    var tagName = node.tagName.toUpperCase()
  
    switch (tagName) {
      case 'AREA':
        return node.alt
      case 'IMG':
        return node.alt
      case 'INPUT':
        var inputType = node.type
        switch (inputType) {
          case 'hidden':
            return ''
          case 'image':
            return node.alt
          case 'radio':
            return ''
          default:
            return node.value
        }
      case 'SELECT':
        return node.value
      case 'TABLE':
        return node.summary
      default:
        return ''
    }
  }
  
  /**
   * Returns true if node should not be expanded
   */
  function isNodeExcluded(node) {
    var tag = node.tagName.toUpperCase()
   
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
    /*
    if (excludedTagNames.indexOf(tag) > -1) {
      console.log('tag should be exluded: ' + tag)
    }
    */
    return ( excludedTagNames.indexOf(tag) > -1 )   
  }
  
  /** Determines whether the node is visible or not
   *
   * 1st case -> style="display:none"
   * 2nd case -> style="visibility:hidden"
   * 3rd case -> hidden="true"s
   * 4th case -> computedStyle "display:none"
   * 5th case -> computedStyle "visibility:hidden"
   * Note: hidden inputs are controlled by input text functions
   */
  function isNodeHidden(node)
  {
    return (node.style.display == 'none'
              || node.style.visibility == 'hidden'
                || node.hidden == true
                  || window.opener.getComputedStyle(node, '').display == 'none'
                    || window.opener.getComputedStyle(node, '').visibility == 'hidden'
    )
  }
  
  return {
    start : function(source){
      init()
      var output = walkDOM(source.body)
      var iframe = document.getElementById('output-iframe').contentDocument
      
      // get user preferences for output style
      var application = Components.classes["@mozilla.org/fuel/application;1"].getService(Components.interfaces.fuelIApplication)
      var colorPref = application.prefs.get("extensions.claws.output.element.text.color")
      var backgroundPref = application.prefs.get("extensions.claws.output.element.text.background") 
     
      // style for output
      var style = iframe.createElement('style')
      style.type = 'text/css'
      style.innerHTML = '.tag-output{color: '+colorPref.value+'; background-color: '+backgroundPref.value+'; margin-right: 5px; padding: 2px 5px;}'
      iframe.getElementsByTagName('head')[0].appendChild(style);
      
      // dump the output into iframe
      iframe.body.appendChild(output)
    },
    getOutput : function(node)
    {
      init()
      var output = walkDOM(node)
      return output
    }
  }  
}
