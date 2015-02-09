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
    var nodeToExpand = nodeStack.pop()
    //console.log(nodeStack)
    
    // nodeType == 1 -> ELEMENT_NODE
    if (nodeToExpand.nodeType == 1) {      
      // insert tag text
      appendSpanToOutput(getOutput4Element(nodeToExpand))
      
      // insert text of revelant attributes
      appendTextToOutput(getAttributeText(nodeToExpand))
      
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
      return 'enlace'
    case 'ADDRESS':
      return ''
    case 'AREA':
      addLink(node)
      return 'enlace '
    case 'ASIDE':
      return 'complementario punto de referencia'
    case 'BLOCKQUOTE':
      return 'Cita'
    case 'BUTTON':
      return 'botón'
    case 'CITE':
      return ''
    case 'DATALIST':
      return 'subMenú tiene auto completado'
    case 'DL':
      return 'lista  con  ' + countListNodes(node) + ' elementos'
    case 'FOOTER':
      if (node.parentNode.nodeName == 'BODY') {
        // NVDA only anounces the page footer
        return 'información de contenido punto de referencia'
      }
      else return ''
    case 'HEADER':
      return 'báner punto de referencia'
    case 'H1':
      addHeading(node)
      return 'encabezado  nivel 1'    
    case 'H2':
      addHeading(node)
      return 'encabezado  nivel 2'
    case 'H3':
      addHeading(node)
      return 'encabezado  nivel 3'
    case 'H4':
      addHeading(node)
      return 'encabezado  nivel 4'
    case 'H5':
      addHeading(node)
      return 'encabezado  nivel 5'
    case 'H6':
      addHeading(node)
      return 'encabezado  nivel 6'
    case 'HR':
      return 'Separador'
    case 'IFRAME':
      return 'Marco en línea'
    case 'IMG':
      return ''
    case 'INPUT':
      return getInputNodeOutputText(node)
    case 'MAIN':
      return 'principal punto de referencia'
    case 'MAP':
      return 'gráfico'
    case 'METER':
      return ''
    case 'NAV':
      return 'navegación punto de referencia'
    case 'OBJECT':
      return 'objeto integrado'
    case 'OL':
      return 'lista  con ' + countListNodes(node) + ' elementos'
    case 'PRE':
      return ''
    case 'PROGRESS':
      return 'barra de progreso'
    case 'Q':
      return ''
    case 'SELECT':
      return 'cuadro combinado ' + node.value // TODO: show if is expanded or not
    case 'TABLE':
      return 'tabla con ' + getNumRowsInTable(node) + ' filas y ' + getNumCellsInTable(node) + ' columnas'
    case 'TD':
      return 'columna ' + (node.cellIndex+1)
    case 'TEXTAREA':
      return 'edición  multi línea' 
    case 'TH':
      return 'columna ' + (node.cellIndex+1)
    case 'TR':
      return 'fila ' + (node.rowIndex+1)
    case 'UL':
      return 'lista  con ' + countListNodes(node) + ' elementos'
    default:
      return ''
  }
}

function getClosingText(node)
{
  var tagName = node.tagName
  switch (tagName) {
    case 'BLOCKQUOTE':
      return 'fuera de cita'
    case 'CITE':
      return ''
    case 'DL':
      return 'fuera de lista'
    case 'IFRAME':
      return 'fuera de Marco en línea'
    case 'OL':
      return 'fuera de lista'
    case 'Q':
      return ''
    case 'TABLE':
      return 'fuera de tabla'
    case 'UL':
      return 'fuera de lista'
    default:
      return ''
  }
}

function getInputNodeOutputText(node)
{
  var inputType = node.type
  switch (inputType){
    case 'button':
      return 'botón ' + node.value
    case 'checkbox':
      return 'casilla de verificación ' + ((node.checked)? 'marcado' : 'no marcado')
    case 'color':
      return 'botón'
    case 'date':
      return 'edición ' + ((node.autocomplete != 'off')? 'tiene auto completado' : '')
    case 'datetime':
      return 'edición ' + ((node.autocomplete != 'off')? 'tiene auto completado' : '')
    case 'datetime-local':
      return 'edición ' + ((node.autocomplete != 'off')? 'tiene auto completado' : '')
    case 'email':
      return 'edición ' + ((node.autocomplete != 'off')? 'tiene auto completado' : '')
    case 'file':
      return 'botón' // TODO: get input button text and "no file selected" text
    case 'image':
      return 'botón ' + node.alt
    case 'month':
      return 'edición ' + ((node.autocomplete != 'off')? 'tiene auto completado' : '')
    case 'number':
      return 'Botón Giratorio edición'
    case 'password':
      return 'edición contraseña'
    case 'radio':
      return 'botón de opción  ' + ((node.checked)? 'marcado' : 'no marcado')
    case 'range':
      return 'deslizador ' + node.value
    case 'reset':
      return 'botón' // TODO: get reset button text
    case 'search':
      return 'edición ' + ((node.autocomplete != 'off')? 'tiene auto completado' : '')
    case 'submit':
      return 'botón' // TODO: get submit button text
    case 'tel':
      return 'edición ' + ((node.autocomplete != 'off')? 'tiene auto completado' : '')
    case 'text':
      return 'edición ' + ((node.autocomplete != 'off')? 'tiene auto completado' : '')
    case 'url':
      return 'edición ' + ((node.autocomplete != 'off')? 'tiene auto completado' : '')
    case 'week':
      return 'edición ' + ((node.autocomplete != 'off')? 'tiene auto completado' : '')
    default:
      return 'edición'
  }  
}


/**
 * Returns true if node should not be expanded
 */
function isNodeExcluded(node) {
  var tag = node.tagName
  
  var excludedTagNames = [
    'AUDIO', //???
    'BASE', // specifies the base URL to use for all relative URLs contained within a document
    'CANVAS', // draw graphics via scripting
    'DATA', // Only in WHATWG version of HTML, not in W3C. Just in case...
    'EMBED', // tag defines a container for an external application or interactive content (a plug-in)
    'HEAD', //  specifies the base URL to use for all relative URLs contained within a document
    'IFRAME', // TODO: process iframe
    'LINK', //  specifies relationships between the current document and an external resource
    'META', // represents any metadata information that cannot be represented by one of the other HTML meta-related elements
    'NOSCRIPT',
    //'OBJECT', // tag defines an embedded multimedia object(like audio, video, Java applets, ActiveX, PDF, and Flash)
              // TODO: Process MAP tag inside of object!
    'OPTION',
    'PARAM',  // tag is used to define parameters for plugins embedded with an <object> element
    'SCRIPT',
    'STYLE', // contains style information for a document, or a part of document
    'TABLE',
    'TITLE', // defines the title of the document, shown in a browser's title bar or on the page's tab
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
  var linkURL = node.getAttribute('href')
  linkText += node.getAttribute('alt')
  
  var item = linkList.appendItem(linkText, '')
  item.ondblclick = function(){window.open(linkURL, '_blank')}
  
  // TODO: APPEND IMAGE ALT TEXT (if exists <h1>text<img src="" alt="altText"></h1>) 
}

// Maybe rename to getImportantAttributeText
function getAttributeText(node) {
  var tagName = node.tagName
  switch (tagName) {
    case 'AREA':
      return node.getAttribute('alt')
    case 'IMG':
      return node.getAttribute('alt')
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
  return (node.style.display == 'none' || node.style.visibility == 'hidden')
}


