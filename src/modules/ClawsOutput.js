var EXPORTED_SYMBOLS = ['ClawsOutput']
Components.utils.import('resource://claws/outputHelper.js');

function ClawsOutput(stringBundle, settings){
    
    getListItemText = function(node){
        var total = outputHelper.countListNodes(node.parentNode)
        var pos = outputHelper.countItemPositionInList(node)
        
        return 'item '+pos+' of '+total
    }
    
    showQuote = function(){
        if (settings === undefined || settings.quote === undefined) {
            return true;
        }
        else return settings.quote
    }
    
    /**
     * Generates text output for HTML5 tags
     *
     * @param {DOM Node} node which tag is analyzed
     * @returns {String} Text string with Claws output
     */
    getClawsText = function(node){
        var tagName = node.tagName.toUpperCase()
        
        switch(tagName){
            case 'A':
                return stringBundle.getString('CLAWS.output.link')
            case 'AREA':
                return stringBundle.getString('CLAWS.output.link')
            case 'ASIDE':
                return stringBundle.getString('CLAWS.output.aside')
            case 'BLOCKQUOTE':
                if (showQuote) {
                    return stringBundle.getString('CLAWS.output.quote')
                }
                else return ''                
            case 'BUTTON':
                return stringBundle.getString('CLAWS.output.button')
            case 'DL':
                return stringBundle.getFormattedString('CLAWS.output.list', [outputHelper.countListNodes(node)])
            case 'FOOTER':
                if (node.parentNode.nodeName == 'BODY') {
                    return stringBundle.getString('CLAWS.output.body.footer')
                }
                else return ''
            case 'H1':
                return stringBundle.getFormattedString('CLAWS.output.heading.level', [1])
            case 'H2':
                return stringBundle.getFormattedString('CLAWS.output.heading.level', [2])
            case 'H3':
                return stringBundle.getFormattedString('CLAWS.output.heading.level', [3])
            case 'H4':
                return stringBundle.getFormattedString('CLAWS.output.heading.level', [4])
            case 'H5':
                return stringBundle.getFormattedString('CLAWS.output.heading.level', [5])
            case 'H6':
                return stringBundle.getFormattedString('CLAWS.output.heading.level', [6])
            case 'HEADER':
                return stringBundle.getString('CLAWS.output.header')
            case 'HR':
                return stringBundle.getString('CLAWS.output.hr')
            case 'IFRAME':                
                return stringBundle.getString('CLAWS.output.iframe')
            case 'INPUT':
                if (node.hasAttribute('list')) {
                    return stringBundle.getString('CLAWS.output.datalist')
                }
                else return getInputClawsText(node)
            case 'LI':
                return getListItemText(node)
            case 'MAIN':
                return stringBundle.getString('CLAWS.output.main')
            case 'MAP':
                return stringBundle.getString('CLAWS.output.map')
            case 'NAV':
                return stringBundle.getString('CLAWS.output.nav')
            case 'OBJECT':
                return stringBundle.getString('CLAWS.output.object')
            case 'OL':
                return stringBundle.getFormattedString('CLAWS.output.list', [outputHelper.countListNodes(node)])
            case 'PROGRESS':
                return stringBundle.getString('CLAWS.output.progress')
            case 'Q':
                if (showQuote) {
                    return stringBundle.getString('CLAWS.output.quote')
                }
                else return ''
            case 'SELECT':
                return stringBundle.getString('CLAWS.output.select')
            case 'TABLE':
                return stringBundle.getFormattedString('CLAWS.output.table', [outputHelper.getNumRowsInTable(node), outputHelper.getNumColumnsInTable(node)])
            case 'TD':
                return outputHelper.getCellHeading(node) + ' ' +  stringBundle.getFormattedString('CLAWS.output.table.column', [(node.cellIndex+1)])
            case 'TEXTAREA':
                return stringBundle.getString('CLAWS.output.textarea')
            case 'TH':
                return outputHelper.getCellHeading(node) + ' ' +  stringBundle.getFormattedString('CLAWS.output.table.column', [(node.cellIndex+1)])
            case 'TR':
                return stringBundle.getFormattedString('CLAWS.output.table.row', [(node.rowIndex+1)])
            case 'UL':
                return stringBundle.getFormattedString('CLAWS.output.list', [outputHelper.countListNodes(node)])
            default:
                return ''
        }
    }
    
    /**
     * Generates text output for HTML5 closing tags
     * because elements has output text for closing tag
     *
     * @param {DOM Node} node which tag is analyzed
     * @returns {String} Text string with Claws output
     */
    getClosingClawsText = function(node){
        var tagName = node.tagName.toUpperCase()
        switch (tagName) {
            case 'BLOCKQUOTE':
                if (showQuote) {
                    return  stringBundle.getString('CLAWS.output.quote.end')
                }
                else return ''
            case 'DL':
                return stringBundle.getString('CLAWS.ouptut.list.end')
            case 'IFRAME':
                return stringBundle.getString('CLAWS.output.iframe.end')
            case 'OL':
                return stringBundle.getString('CLAWS.ouptut.list.end')
            case 'Q':
                if (showQuote) {
                    return  stringBundle.getString('CLAWS.output.quote.end')
                }
                else return ''
            case 'TABLE':
                return stringBundle.getString('CLAWS.output.table.end')
            case 'UL':
                return stringBundle.getString('CLAWS.ouptut.list.end')
            default:
                return ''
        }
    }
    
    /**
     * Generates text output for <input type="..."> HTML5 element
     *
     * @param {DOM Node} input node which type is analyzed
     * @returns {String} Text string with Claws output
     */
    getInputClawsText = function(node){
        var inputType = node.type.toUpperCase()
        switch (inputType){
          case 'button':
            return stringBundle.getString('CLAWS.output.button')
          case 'checkbox':
            return stringBundle.getString('CLAWS.output.input.checkbox') + ' ' + ((node.checked)? stringBundle.getString('CLAWS.output.input.checkbox.checked') : stringBundle.getString('CLAWS.output.input.checkbox.unchecked'))
          case 'color':
            return stringBundle.getString('CLAWS.output.button')
          case 'date':
            return stringBundle.getString('CLAWS.output.input.text') + ((node.autocomplete != 'off')? stringBundle.getString('CLAWS.output.input.text.autocomplete') : '')
          case 'datetime':
            return stringBundle.getString('CLAWS.output.input.text') + ((node.autocomplete != 'off')? stringBundle.getString('CLAWS.output.input.text.autocomplete') : '')
          case 'datetime-local':
            return stringBundle.getString('CLAWS.output.input.text') + ((node.autocomplete != 'off')? stringBundle.getString('CLAWS.output.input.text.autocomplete') : '')
          case 'email':
            return stringBundle.getString('CLAWS.output.input.text') + ((node.autocomplete != 'off')? stringBundle.getString('CLAWS.output.input.text.autocomplete') : '')
          case 'file':
            return stringBundle.getString('CLAWS.output.button') // TODO: get input button text and "no file selected" text
          case 'hidden':
            return ''
          case 'image':
            return stringBundle.getString('CLAWS.output.button')
          case 'month':
            return stringBundle.getString('CLAWS.output.input.text') + ((node.autocomplete != 'off')? stringBundle.getString('CLAWS.output.input.text.autocomplete') : '')
          case 'number':
            return stringBundle.getString('CLAWS.output.input.number')
          case 'password':
            return stringBundle.getString('CLAWS.output.input.password')
          case 'radio':
            return stringBundle.getString('CLAWS.output.input.radio') + ' ' + ((node.checked)? stringBundle.getString('CLAWS.output.input.checkbox.checked') : stringBundle.getString('CLAWS.output.input.checkbox.unchecked'))
          case 'range':
            return stringBundle.getString('CLAWS.output.input.range')
          case 'reset':
            return 'botуn' // TODO: get reset button text
          case 'search':
            return stringBundle.getString('CLAWS.output.input.text') + ((node.autocomplete != 'off')? stringBundle.getString('CLAWS.output.input.text.autocomplete') : '')
          case 'submit':
            return 'botуn' // TODO: get submit button text
          case 'tel':
            return stringBundle.getString('CLAWS.output.input.text') + ((node.autocomplete != 'off')? stringBundle.getString('CLAWS.output.input.text.autocomplete') : '')
          case 'text':
            return stringBundle.getString('CLAWS.output.input.text') + ((node.autocomplete != 'off')? stringBundle.getString('CLAWS.output.input.text.autocomplete') : '')
          case 'url':
            return stringBundle.getString('CLAWS.output.input.text') + ((node.autocomplete != 'off')? stringBundle.getString('CLAWS.output.input.text.autocomplete') : '')
          case 'week':
            return stringBundle.getString('CLAWS.output.input.text') + ((node.autocomplete != 'off')? stringBundle.getString('CLAWS.output.input.text.autocomplete') : '')
          default:
            return stringBundle.getString('CLAWS.output.input.text') + ' ' + ((node.autocomplete != 'off')? stringBundle.getString('CLAWS.output.input.text.autocomplete') : '')
        } 
    }
    
    return{
        getClawsText : getClawsText,
        getClosingClawsText : getClosingClawsText,
        getInputClawsText : getInputClawsText
    }
}