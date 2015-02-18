var EXPORTED_SYMBOLS = ['nvdaText']

function countListNodes(node){
  return node.childNodes.length
}

function addHeading(node){
  // get heading text including all important atribute info like img alt text
  var headingText = ''
  var children = node.childNodes
  // TODO: maybe refactor domWalker to append nodeList automatically
  // TODO: maybe shoul use while loop instead of for...
  for( var i=0; i<children.length; ++i )
  {
    var out = Claws().getOutput(children[i])
    removeSpanFromOutput(out)
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
    removeSpanFromOutput(out)
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

function removeSpanFromOutput(node)
{
  var spans = node.getElementsByTagName('span')
  var span
  while((span = spans[0]))
  {
    span.parentNode.removeChild(span)
  }
}



function getNumRowsInTable(table) {
  return table.rows.length
}

function getNumCellsInTable(table) {
  return table.rows[0].cells.length
}

function getCellHeading(node) {
  // table -> tr -> td
  if (node.parentNode.rowIndex != 0 && node.parentNode.parentNode.tagName == 'TABLE'){
    return node.parentNode.parentNode.getElementsByTagName('th')[node.cellIndex].textContent
  }
  // table -> tbody|tfoot -> td
  else if (node.parentNode.rowIndex != 0 && node.parentNode.parentNode.parentNode.tagName == 'TABLE'){
    return node.parentNode.parentNode.parentNode.getElementsByTagName('th')[node.cellIndex].textContent
  }
  else return ''
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
