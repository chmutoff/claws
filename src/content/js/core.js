console.log('File core.js loaded')

// TODO: replace some var for let (if necesary)

var _iframe
var _iframeDocument
var _output
var _source
var _NVDAStringBundle

function init()
{
  _iframe = document.getElementById('output-iframe')
  _iframeDocument = _iframe.contentDocument
  _output = _iframeDocument.getElementById('screen-output')
  _source = window.opener.content.document
  _NVDAStringBundle = document.getElementById('NVDA-string-bundle');
}

function start()
{   
  //console.log('Walking source DOM')
  walkDOM(_source.body)
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

/**
 * Cleans an input text by removing all the multiple whitespaces and brakelines
 *
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

/**
 * THIS IS DA MAIN FUNCTION (:
 */
function walkDOM(dom)
{
  var nodeStack = new Array()
  cleanWhitespace(dom)
  nodeStack.push(dom)

  do
  {       
    var nodeToExpand = nodeStack.pop()
    //console.log(nodeStack)
    
    // nodeType == 1 -> ELEMENT_NODE
    if (nodeToExpand.nodeType == 1) {      
      // insert tag text
      appendSpanToOutput(getOutput4Element(nodeToExpand))
      
      // insert text of revelant attributes
      appendTextToOutput(getRelevantInfo(nodeToExpand))
      
      // check if node needs to be expanded
      if ( !isNodeExcluded(nodeToExpand) && !isNodeHidden(nodeToExpand) )
      {
        // insert closing tag var node with text if necesary
        var closingText = getClosingText(nodeToExpand)
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
          var closingText = getClosingText(nodeToExpand)
          if ( closingText != '' ) {
            nodeStack.push(closingText)
          }
        }
      }
    }
    // nodeType == 3 -> TEXT_NODE    
    else if(nodeToExpand.nodeType == 3)
    {
      //console.log(nodeToExpand)
      // print textNode content
      appendTextToOutput(nodeToExpand.textContent + ' ')
    }
    // string contains tag closing announcement
    else if (typeof(nodeToExpand) == 'string') {
      appendSpanToOutput(nodeToExpand)
    }      
    //console.log(nodeStack)    
  }while(nodeStack.length > 0)
}

function appendTextToOutput(text)
{
  if ( text != '' )
  {
    var child = _iframeDocument.createTextNode(text + ' ')
    _output.appendChild(child)
  }
}

function appendSpanToOutput(text)
{
  if ( text != '' )
  {
    var spanNode = _iframeDocument.createElement('span')
    spanNode.className = 'tag-output'
    var textNode = _iframeDocument.createTextNode(text)
    spanNode.appendChild(textNode)
    _output.appendChild(spanNode)
  }
}

/**
 * Returns text for certain tags
 */
function getOutput4Element(node)
{
  var tagName = node.tagName
  //console.log('Number of nodes: '+ countListNodes(node));
  
  switch(tagName) {
    case 'A':
      // NVDA annouces if link have been visited
      // it is not possible for javascript to detect if a link is visited in either Firefox or Chrome (security reasons)
      // https://developer.mozilla.org/en-US/docs/Web/CSS/Privacy_and_the_:visited_selector
      addLink(node)
      return _NVDAStringBundle.getString('NVDA.output.link')
    case 'ADDRESS':
      return ''
    case 'AREA':
      addLink(node)
      return _NVDAStringBundle.getString('NVDA.output.link')
    case 'ASIDE':
      return _NVDAStringBundle.getString('NVDA.output.aside')
    case 'BLOCKQUOTE':
      return _NVDAStringBundle.getString('NVDA.output.quote')
    case 'BUTTON':
      return _NVDAStringBundle.getString('NVDA.output.button')
    case 'CITE':
      return ''
    case 'DATALIST':
      return _NVDAStringBundle.getString('NVDA.output.datalist')
    case 'DL':
      return _NVDAStringBundle.getFormattedString('NVDA.output.list', [countListNodes(node)])
    case 'FOOTER':
      if (node.parentNode.nodeName == 'BODY') {
        // NVDA only anounces the page footer
        return _NVDAStringBundle.getString('NVDA.output.body.footer')
      }
      else return ''
    case 'H1':
      addHeading(node)
      return _NVDAStringBundle.getFormattedString('NVDA.output.heading.level', [1])
    case 'H2':
      addHeading(node)
      return _NVDAStringBundle.getFormattedString('NVDA.output.heading.level', [2])
    case 'H3':
      addHeading(node)
      return _NVDAStringBundle.getFormattedString('NVDA.output.heading.level', [3])
    case 'H4':
      addHeading(node)
      return _NVDAStringBundle.getFormattedString('NVDA.output.heading.level', [4])
    case 'H5':
      addHeading(node)
      return _NVDAStringBundle.getFormattedString('NVDA.output.heading.level', [5])
    case 'H6':
      addHeading(node)
      return _NVDAStringBundle.getFormattedString('NVDA.output.heading.level', [6])
    case 'HEADER':
      return _NVDAStringBundle.getString('NVDA.output.header')
    case 'HR':
      return _NVDAStringBundle.getString('NVDA.output.hr')
    case 'IFRAME':
      return _NVDAStringBundle.getString('NVDA.output.iframe')
    case 'IMG':
      return ''
    case 'INPUT':
      return getInputNodeOutputText(node)
    case 'MAIN':
      return _NVDAStringBundle.getString('NVDA.output.main')
    case 'MAP':
      return _NVDAStringBundle.getString('NVDA.output.map')
    case 'METER':
      return ''
    case 'NAV':
      return _NVDAStringBundle.getString('NVDA.output.nav')
    case 'OBJECT':
      return _NVDAStringBundle.getString('NVDA.output.object')
    case 'OL':
      return _NVDAStringBundle.getFormattedString('NVDA.output.list', [countListNodes(node)])
    case 'PRE':
      return ''
    case 'PROGRESS':
      return _NVDAStringBundle.getString('NVDA.output.progress')
    case 'Q':
      return ''
    case 'SELECT':
      return _NVDAStringBundle.getString('NVDA.output.select') // TODO: show if is expanded or not. Any sense???
    case 'TABLE':
      return _NVDAStringBundle.getFormattedString('NVDA.output.table', [getNumRowsInTable(node), getNumCellsInTable(node)])
    case 'TD':
      return _NVDAStringBundle.getFormattedString('NVDA.output.table.column', [(node.cellIndex+1)])
    case 'TEXTAREA':
      return _NVDAStringBundle.getString('NVDA.output.textarea')
    case 'TH':
      return _NVDAStringBundle.getFormattedString('NVDA.output.table.column', [(node.cellIndex+1)])
    case 'TR':
      return _NVDAStringBundle.getFormattedString('NVDA.output.table.row', [(node.rowIndex+1)])
    case 'UL':
      return _NVDAStringBundle.getFormattedString('NVDA.output.list', countListNodes(node))
    default:
      return ''
  }
}

function getClosingText(node)
{
  var tagName = node.tagName
  switch (tagName) {
    case 'BLOCKQUOTE':
      return  _NVDAStringBundle.getString('NVDA.output.quote.end')
    case 'CITE':
      return ''
    case 'DL':
      return _NVDAStringBundle.getString('NVDA.ouptut.list.end')
    case 'IFRAME':
      return _NVDAStringBundle.getString('NVDA.output.iframe.end')
    case 'OL':
      return _NVDAStringBundle.getString('NVDA.ouptut.list.end')
    case 'Q':
      return ''
    case 'TABLE':
      return _NVDAStringBundle.getString('NVDA.output.table.end')
    case 'UL':
      return _NVDAStringBundle.getString('NVDA.ouptut.list.end')
    default:
      return ''
  }
}

function getInputNodeOutputText(node)
{
  var inputType = node.type
  switch (inputType){
    case 'button':
      return _NVDAStringBundle.getString('NVDA.output.button')
    case 'checkbox':
      return _NVDAStringBundle.getString('NVDA.output.input.checkbox') + ' ' + ((node.checked)? _NVDAStringBundle.getString('NVDA.output.input.checkbox.checked') : _NVDAStringBundle.getString('NVDA.output.input.checkbox.unchecked'))
    case 'color':
      return _NVDAStringBundle.getString('NVDA.output.button')
    /*
    case 'date':
      return _NVDAStringBundle.getString('NVDA.output.input.text') + ((node.autocomplete != 'off')? _NVDAStringBundle.getString('NVDA.output.input.text.autocomplete') : '')
    case 'datetime':
      return _NVDAStringBundle.getString('NVDA.output.input.text') + ((node.autocomplete != 'off')? _NVDAStringBundle.getString('NVDA.output.input.text.autocomplete') : '')
    case 'datetime-local':
      return _NVDAStringBundle.getString('NVDA.output.input.text') + ((node.autocomplete != 'off')? _NVDAStringBundle.getString('NVDA.output.input.text.autocomplete') : '')
    case 'email':
      return _NVDAStringBundle.getString('NVDA.output.input.text') + ((node.autocomplete != 'off')? _NVDAStringBundle.getString('NVDA.output.input.text.autocomplete') : '')
    */
    case 'file':
      return _NVDAStringBundle.getString('NVDA.output.button') // TODO: get input button text and "no file selected" text
    case 'image':
      return _NVDAStringBundle.getString('NVDA.output.button')
    /*
    case 'month':
      return _NVDAStringBundle.getString('NVDA.output.input.text') + ((node.autocomplete != 'off')? _NVDAStringBundle.getString('NVDA.output.input.text.autocomplete') : '')
    */
    case 'number':
      return _NVDAStringBundle.getString('NVDA.output.input.number')
    case 'password':
      return _NVDAStringBundle.getString('NVDA.output.input.password')
    case 'radio':
      return _NVDAStringBundle.getString('NVDA.output.input.radio') + ' ' + ((node.checked)? _NVDAStringBundle.getString('NVDA.output.input.checkbox.checked') : _NVDAStringBundle.getString('NVDA.output.input.checkbox.unchecked'))
    case 'range':
      return _NVDAStringBundle.getString('NVDA.output.input.range')
    case 'reset':
      return 'botón' // TODO: get reset button text
    /*
    case 'search':
      return _NVDAStringBundle.getString('NVDA.output.input.text') + ((node.autocomplete != 'off')? _NVDAStringBundle.getString('NVDA.output.input.text.autocomplete') : '')
    */
    case 'submit':
      return 'botón' // TODO: get submit button text
    /*
    case 'tel':
      return _NVDAStringBundle.getString('NVDA.output.input.text') + ((node.autocomplete != 'off')? _NVDAStringBundle.getString('NVDA.output.input.text.autocomplete') : '')
    case 'text':
      return _NVDAStringBundle.getString('NVDA.output.input.text') + ((node.autocomplete != 'off')? _NVDAStringBundle.getString('NVDA.output.input.text.autocomplete') : '')
    case 'url':
      return _NVDAStringBundle.getString('NVDA.output.input.text') + ((node.autocomplete != 'off')? _NVDAStringBundle.getString('NVDA.output.input.text.autocomplete') : '')
    case 'week':
      return _NVDAStringBundle.getString('NVDA.output.input.text') + ((node.autocomplete != 'off')? _NVDAStringBundle.getString('NVDA.output.input.text.autocomplete') : '')
    */
    default:
      return _NVDAStringBundle.getString('NVDA.output.input.text') + ' ' + ((node.autocomplete != 'off')? _NVDAStringBundle.getString('NVDA.output.input.text.autocomplete') : '') // TODO: maybe remove all cases with this input...
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

function countListNodes(node) {
  return node.childNodes.length
}

function addHeading(node)
{
  var headingList = document.getElementById('heading-list')
  var headingText = node.textContent
  headingList.appendItem(headingText, '')
  
  // TODO: APPEND IMAGE ALT TEXT (if exists <h1>text<img src="" alt="altText"></h1>) 
}

/**
 * Possible href values (W3C)
 * /hello
 * #canvas
 * http://example.org/
 */
function addLink(node)
{
  var linkList = document.getElementById('link-list')
  var linkText = node.textContent
  var linkURL = node.getAttribute('href')
  linkText += ( (node.getAttribute('alt') != null)? node.getAttribute('alt') : '' ) // Get link title from alt attribute of AREA tag
  
  var item = linkList.appendItem(linkText, '')
  item.ondblclick = function(){window.open(linkURL, '_blank')}
  
  // TODO: APPEND IMAGE ALT TEXT (if exists <h1>text<img src="" alt="altText"></h1>) 
}

/**
 * Returns relevant node information
 * i.e: image alt attribute text,
 *      input value,
 *      etc...
 */
function getRelevantInfo(node) {
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

function getNumRowsInTable(table) {
  return table.rows.length
}

function getNumCellsInTable(table) {
  return table.rows[0].cells.length
}

function isNodeHidden(node)
{
  //return (node.style.display == 'none' || node.style.visibility == 'hidden')
}
