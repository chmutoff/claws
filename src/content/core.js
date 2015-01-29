console.log('File core.js loaded')

var _iframe
var _iframeDocument
var _output
var _source

function init() {
  _iframe = document.getElementById('output-iframe')
  _iframeDocument = _iframe.contentDocument
  _output = _iframeDocument.getElementById('screen-output')
  _source = window.opener._content.document
}

function start()
{   
  console.log('Walking source DOM')
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
    //console.log('processing node')
    //var node = nodeToExpand;    
    if( nodeToExpand.lastChild != null && ignoreNode(nodeToExpand.tagName) == -1)
    {
      //console.log('Expanding node' + nodeToExpand.tagName)
      appendSpanToOutput(getOutput4Element(nodeToExpand))
      nodeToExpand = nodeToExpand.lastChild
      while(nodeToExpand)
      {
        //console.log('whiling...')
        nodeStack.push(nodeToExpand)
        nodeToExpand = nodeToExpand.previousSibling
      }
    }
    else if(nodeToExpand.nodeType == 3)
    {
      appendTextToOutput(nodeToExpand.textContent + ' ')
    }
      
    //console.log(nodeStack)
    
  }while(nodeStack.length > 0) 
  
}

function appendTextToOutput(text)
{
  var child = _iframeDocument.createTextNode(text + ' ')
  _output.appendChild(child)
}

function appendSpanToOutput(text)
{
  var spanNode = _iframeDocument.createElement('span')
  spanNode.className = 'tag-output'
  var textNode = _iframeDocument.createTextNode(text + ' ')
  spanNode.appendChild(textNode)
  _output.appendChild(spanNode)
}

/**
 * Returns text for certain tags
 */
function getOutput4Element(node)
{
  var tagName = node.tagName;  
  //console.log('Number of nodes: '+ countListNodes(node));
  //var output = '<span class="tag-output">';
  
    switch(tagName) {
        case 'H1':
          return 'Heading one'    
        case 'H2':
          return 'Heading two'
        case 'UL':
          return ('Unordered list of ' + countListNodes(node) + ' elements')
        default:
            return tagName
    }
  //output += '<span>'
  
  //return output
}

/**
 * Returns -1 if node can be processed
 * othervice returns a positive number
 */
function ignoreNode(nodeTag) {
  var excludedNodes = [
    'AUDIO', //???    
    'CANVAS', //???
    'DIALOG', //???
    'HEAD',
    'IFRAME',
    'MAP', //???
    'META',
    'NOSCRIPT',
    'OBJECT', //???
    'SCRIPT',
    'VIDEO' //???    
  ]
  
  return excludedNodes.indexOf(nodeTag)
  
}

function countListNodes(node) {
  return node.childNodes.length
}

