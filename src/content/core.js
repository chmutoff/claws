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

function walkDOM(dom)
{
  var nodeStack = new Array()
  cleanWhitespace(dom)
  nodeStack.push(dom)

  do
  {
    //console.log(nodeStack)
    var nodeToExpand = nodeStack.pop()
    
    var node = nodeToExpand;
    if( nodeToExpand.lastChild != null )
    {
      appendToOutput(getOutput4Tag(node.tagName))
       /* 
      if(node.tagName == 'H1')
        appendToOutput('HEADING ONE ')
      else
        appendToOutput(node.tagName + ' ')
      */
      node = nodeToExpand.lastChild
      while(node)
      {
        nodeStack.push(node)
        node = node.previousSibling
      }
    }
    else
    {
      appendToOutput(node.textContent + ' ')
    }
      
    //console.log(nodeStack)
    
  }while(nodeStack.length > 0) 
  
}

function appendToOutput(text)
{
    var child = _iframeDocument.createTextNode(text + ' ')
    _output.appendChild(child)
}

function getOutput4Tag(tagName)
{
    switch(tagName) {
        case 'H1':
            return 'Heading one'    
        
        case 'H2':
            return 'Heading two'
        
        default:
            return tagName
    } 
}

