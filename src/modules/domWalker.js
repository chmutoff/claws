var EXPORTED_SYMBOLS = ['DomWalker']
Components.utils.import('resource://claws/helper.js');

/**
 * Params:
 * textProvider -> object which contains functions to generate node output
 * rootNode -> node to begin walking
 *
 * Returns:
 * WalkDOM function -> walks the dom and returns the output
 * linkList -> list which contains Object{ text: 'linkText', url: 'linkUrl' }
 * headingList -> list which contains Object{ text: 'headingText' }
 */
function DomWalker(textProvider, sourceWindow)
{
    // fields
    var _textProvider = textProvider
    var _sourceWindow = sourceWindow
    var _document = sourceWindow.content.document
    var _linkList = []
    var _headingList = []
    
    // methods
    function addLink(node){
        // get link text including all important atribute info like img alt text
        var linkText = ''
        var children = node.childNodes
        // TODO: maybe refactor domWalker to append nodeList automatically
        // TODO: maybe should use while loop instead of for...
        for( var i=0; i<children.length; ++i )
        {
            //var out = Claws().getOutput(children[i])
            var out = walkDOM(children[i])
            removeSpansFromNode(out)
            linkText += out.textContent
        }
        
        // Get link title from alt attribute of AREA tag
        linkText += ( node.hasAttribute('alt') ? node.alt : '' )
        var linkURL =  node.href
        linkText = ( linkText != '' ) ? cleanText(linkText) : linkURL // if link has no text show href text
        var item = {
            text : linkText,
            url : linkURL
        }
        _linkList.push(item)
    }
  
    function addHeading(node){
        // get heading text including all important atribute info like img alt text
        var headingText = ''
        var children = node.childNodes
        // TODO: maybe refactor domWalker to append nodeList automatically
        // TODO: maybe should use while loop instead of for...
        for( var i=0; i<children.length; ++i )
        {
            //var out = Claws().getOutput(children[i])
            var out = walkDOM(children[i])
            removeSpansFromNode(out)
            headingText += out.textContent
        }
        
        var item = {
            text : headingText
        }
        _headingList.push(item)
    }
  
    function removeSpansFromNode(node) {
        var spans = node.getElementsByTagName('span')
        var span
        while ((span = spans[0])) {
            span.parentNode.removeChild(span)
        }
    }
  
    function appendTextToOutput(text, output){
        if ( text != '' ){
            var child = _document.createTextNode(text + ' ')
            output.appendChild(child)
        }
    }
  
    function appendSpanToOutput(text, output){
        if ( text != '' ){
            var spanNode = _document.createElement('span')
            spanNode.className = 'tag-output'
            var textNode = _document.createTextNode(text)
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
  
    /** Returns true if node should not be expanded */
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
     * 3rd case -> hidden="true"
     * 4th case -> computedStyle "display:none"
     * 5th case -> computedStyle "visibility:hidden"
     * Note: hidden inputs are controlled by input text functions
     *
     * Returns true if the node is not visible
     */
    function isNodeHidden(node){
        return (
            node.style.display == 'none'
            || node.style.visibility == 'hidden'
            || node.hidden == true
            || _sourceWindow.getComputedStyle(node).display == 'none'
            || _sourceWindow.getComputedStyle(node).visibility == 'hidden'
        )
    }
    
    function walkDOM(dom){
        //console.log('walk dom')
        var nodeStack = new Array()
        var output = _document.createElement('div')
        output.className = 'output'    
        cleanWhitespace(dom)
        nodeStack.push(dom)
      
        do{       
          var nodeToExpand = nodeStack.pop()
          //console.log(nodeStack)
          
          // nodeType == 1 -> ELEMENT_NODE
          if ( nodeToExpand.nodeType == 1
                && !isNodeHidden(nodeToExpand)) {
            
            var tagName =  nodeToExpand.tagName.toUpperCase()
            
            // check if the node is a link and add it to the link list
            if ( tagName == 'A' || tagName == 'AREA' ) {
              addLink(nodeToExpand)
            }
            
            // check if the node is a heading (H1 - H6)
            var headingPattern = new RegExp('^H[1-6]$')
            if (headingPattern.test(tagName)) {
              addHeading(nodeToExpand)
            }
            
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
    } // end of walkDOM fn
    
    return{
        walkDOM : walkDOM,
        linkList : _linkList,
        headingList: _headingList
    } // end of return    
} // end of class definition
