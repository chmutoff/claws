console.log('File core.js loaded')

// TODO: replace some var for let (if necesary)

var _iframe
var _iframeDocument
var _output
var _source

function init()
{
  _iframe = document.getElementById('output-iframe')
  _iframeDocument = _iframe.contentDocument
  _output = _iframeDocument.getElementById('screen-output')
  _source = window.opener.content.document
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
    //console.log(nodeStack)    
    var nodeToExpand = nodeStack.pop()
    
    // nodeType == 1 -> ELEMENT_NODE
    if (nodeToExpand.nodeType == 1) {
      // insert tag text
      appendSpanToOutput(getOutput4Element(nodeToExpand))
      
      // insert text of revelant attributes
      appendTextToOutput(getAttributeText(nodeToExpand))
      
      // check if node needs to be expanded
      if ( nodeToExpand.lastChild != null && !isNodeExcluded(nodeToExpand) )
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
      }
    }
    // nodeType == 3 -> TEXT_NODE    
    else if(nodeToExpand.nodeType == 3)
    {
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
      addLink(node)
      return 'Link'
    case 'ADDRESS':
      return 'Addresss'
    case 'ASIDE':
      return 'Related content'
    case 'BLOCKQUOTE':
      return 'Quotation'
    case 'CITE':
      return 'Quotation'
    case 'DL':
      return ('Definition list of ' + countListNodes(node) + ' elements')
    case 'FOOTER':
      return 'Footer'
    case 'HEADER':
      return 'Header section'
    case 'H1':
      addHeading(node)
      return 'Heading one'    
    case 'H2':
      addHeading(node)
      return 'Heading two'
    case 'H3':
      addHeading(node)
      return 'Heading three'
    case 'H4':
      addHeading(node)
      return 'Heading four'
    case 'H5':
      addHeading(node)
      return 'Heading five'
    case 'H6':
      addHeading(node)
      return 'Heading six'
    case 'HR':
      return 'Separador'
    case 'IFRAME':
      return 'Marco en línea'
    case 'IMG':
      return ('Image')
    case 'MAIN':
      return 'Main content'
    case 'MAP':
      return 'gráfico'
    case 'NAV':
      return 'Navigation Element'
    case 'OBJECT':
      return 'objeto integrado'
    case 'OL':
      return ('Ordered list of ' + countListNodes(node) + ' elements')
    case 'PRE':
      return ''
    case 'Q':
      return 'Quotation'
    case 'UL':
      return ('Unordered list of ' + countListNodes(node) + ' elements')
    default:
      return ''
  }
}

function getClosingText(node)
{
  var tagName = node.tagName
  switch (tagName) {
    case 'BLOCKQUOTE':
      return 'End of quotation'
    case 'CITE':
      return 'End of quotation'
    case 'DL':
      return 'End of definition list'
    case 'IFRAME':
      return 'fuera de Marco en línea'
    case 'OL':
      return 'End of ordered list'
    case 'Q':
      return 'End of quotation'
    case 'UL':
      return 'End of unordered list'
    default:
      return ''
  }
}


/**
 * Returns true if node should not be expanded
 */
function isNodeExcluded(node) {
  var tag = node.tagName
  
  var excludedTagNames = [
    'AUDIO', //???
    'BASE',
    'CANVAS', //???
    'DATA', // Only in WHATWG version of HTML, not in W3C. Just in case...
    'EMBED', // tag defines a container for an external application or interactive content (a plug-in).
    'HEAD',
    'IFRAME', // TODO: process iframe
    'LINK',
    'META',
    'NOSCRIPT',
    'OBJECT', // tag defines an embedded multimedia object(like audio, video, Java applets, ActiveX, PDF, and Flash)
    'PARAM', // tag is used to define parameters for plugins embedded with an <object> element
    'SCRIPT',
    'STYLE',
    'TITLE',
    'VIDEO' //???    
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
  var linkURL = node.getAttribute('href');
  
  var item = linkList.appendItem(linkText, '')
  item.ondblclick = function(){window.open(linkURL, '_blank')}
  
  //console.log('append ' + linkText)  
  // TODO: APPEND IMAGE ALT TEXT (if exists <h1>text<img src="" alt="altText"></h1>) 
}

// Maybe rename to getImportantAttributeText
function getAttributeText(node) {
  var tagName = node.tagName
  switch (tagName) {
    case 'IMG':
      return node.getAttribute('alt')
    default:
      return ''
  }
}


