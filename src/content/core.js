console.log('File core.js loaded')

var iframe = document.getElementById('output-iframe')
var iframeDocument = iframe.contentDocument
var output = iframeDocument.getElementById('screen-output')
var source = window.opener._content.document

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
      
      if(node.tagName == 'H1')
        appendToOutput('HEADING ONE ')
      else
        appendToOutput(node.tagName + ' ')
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
    var child = iframeDocument.createTextNode(text)
    output.appendChild(child)
}

function start()
{   
    console.log('Walking source DOM')
    walkDOM(source.body)
}
