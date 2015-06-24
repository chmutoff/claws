var EXPORTED_SYMBOLS = ['NvdaOutput']
Components.utils.import('resource://claws/outputHelper.js')

/**
 * Creates an output class for NVDA mode
 * 
 * @param {Object} stringBundle contains all the localized strings
 * @returns {Object} functions to generate all the output
 *
 * NOTE: all the tag names are transfromed to upper case because
 * depending on doctype they could be in lower/upper case * 
 */
function NvdaOutput(stringBundle)
{
    function getNvdaIntroText(docInfo) {
        return docInfo.docTitle
    }
    /**
     * Generates text output for HTML5 tags
     *
     * @param {DOM Node} node which tag is analyzed
     * @returns {String} Text string as NVDA scren reader would do
     */
    function getNvdaText(node){
        var tagName = node.tagName.toUpperCase()
        
        switch(tagName){
            case 'A':
                // NVDA annouces if link have been visited
                // it is not possible for javascript to detect if a link is visited in either Firefox or Chrome (security reasons)
                // https://developer.mozilla.org/en-US/docs/Web/CSS/Privacy_and_the_:visited_selector
                return stringBundle.getString('NVDA.output.link')
            case 'AREA':
                return stringBundle.getString('NVDA.output.link')
            case 'ASIDE':
                return stringBundle.getString('NVDA.output.aside')
            case 'BLOCKQUOTE':
                return stringBundle.getString('NVDA.output.quote')
            case 'BUTTON':
                return stringBundle.getString('NVDA.output.button')
            case 'DL':
                return stringBundle.getFormattedString('NVDA.output.list', [outputHelper.countListNodes(node)])
            case 'FOOTER':
                if (node.parentNode.nodeName == 'BODY') {
                    // NVDA only anounces the page footer
                    return stringBundle.getString('NVDA.output.footer')
                }
                else return ''
            case 'H1':
                return stringBundle.getFormattedString('NVDA.output.heading.level', [1])
            case 'H2':
                return stringBundle.getFormattedString('NVDA.output.heading.level', [2])
            case 'H3':
                return stringBundle.getFormattedString('NVDA.output.heading.level', [3])
            case 'H4':
                return stringBundle.getFormattedString('NVDA.output.heading.level', [4])
            case 'H5':
                return stringBundle.getFormattedString('NVDA.output.heading.level', [5])
            case 'H6':
                return stringBundle.getFormattedString('NVDA.output.heading.level', [6])
            case 'HEADER':
                return stringBundle.getString('NVDA.output.header')
            case 'HR':
                return stringBundle.getString('NVDA.output.hr')
            case 'IFRAME':                
                return stringBundle.getString('NVDA.output.iframe')
            case 'IMG':
                return stringBundle.getString('NVDA.output.img') + ((node.hasAttribute('longdesc'))? ' ' + stringBundle.getString('NVDA.output.img.longdesc') : '')
            case 'INPUT':
                if (node.hasAttribute('list')) {
                    return stringBundle.getString('NVDA.output.datalist')
                }
                else return getInputNvdaText(node)
            case 'MAIN':
                return stringBundle.getString('NVDA.output.main')
            case 'MAP':
                return stringBundle.getString('NVDA.output.map')
            case 'NAV':
                return stringBundle.getString('NVDA.output.nav')
            case 'OBJECT':
                return stringBundle.getString('NVDA.output.object')
            case 'OL':
                return stringBundle.getFormattedString('NVDA.output.list', [outputHelper.countListNodes(node)])
            case 'PROGRESS':
                return stringBundle.getString('NVDA.output.progress')
            case 'SELECT':
                return stringBundle.getString('NVDA.output.select')
            case 'TABLE':
                return stringBundle.getFormattedString('NVDA.output.table', [outputHelper.getNumRowsInTable(node), outputHelper.getNumColumnsInTable(node)])
            case 'TD':
                return outputHelper.getCellHeading(node) + ' ' +  stringBundle.getFormattedString('NVDA.output.table.column', [(node.cellIndex+1)])
            case 'TEXTAREA':
                return stringBundle.getString('NVDA.output.textarea')
            case 'TH':
                return outputHelper.getCellHeading(node) + ' ' +  stringBundle.getFormattedString('NVDA.output.table.column', [(node.cellIndex+1)])
            case 'TR':
                return stringBundle.getFormattedString('NVDA.output.table.row', [(node.rowIndex+1)])
            case 'UL':
                return stringBundle.getFormattedString('NVDA.output.list', [outputHelper.countListNodes(node)])
            default:
                return ''
        }
    }
    
    /**
     * Generates text output for HTML5 closing tags
     * because elements has output text for closing tag
     *
     * @param {DOM Node} node which tag is analyzed
     * @returns {String} Text string as NVDA scren reader would do
     */
    function getClosingNvdaText(node){
        var tagName = node.tagName.toUpperCase()
        switch (tagName) {
            case 'BLOCKQUOTE':
                return  stringBundle.getString('NVDA.output.quote.end')
            case 'DL':
                return stringBundle.getString('NVDA.ouptut.list.end')
            case 'IFRAME':
                return stringBundle.getString('NVDA.output.iframe.end')
            case 'OL':
                return stringBundle.getString('NVDA.ouptut.list.end')
            case 'TABLE':
                return stringBundle.getString('NVDA.output.table.end')
            case 'UL':
                return stringBundle.getString('NVDA.ouptut.list.end')
            default:
                return ''
        }
    }
    
    /**
     * Generates text output for <input type="..."> HTML5 element
     *
     * @param {DOM Node} input node which type is analyzed
     * @returns {String} Text string as NVDA scren reader would do
     */
    function getInputNvdaText(node){
        var inputType = node.type.toLowerCase()
        switch (inputType){
            case 'button':
                return stringBundle.getString('NVDA.output.button')
            case 'checkbox':
                return stringBundle.getString('NVDA.output.input.checkbox') + ' ' + ((node.checked)? stringBundle.getString('NVDA.output.input.checkbox.checked') : stringBundle.getString('NVDA.output.input.checkbox.unchecked'))
            case 'color':
                return stringBundle.getString('NVDA.output.button')
            case 'file':
                return stringBundle.getString('NVDA.output.button') // TODO: get input button text and "no file selected" text
            case 'hidden':
                return ''
            case 'image':
                return stringBundle.getString('NVDA.output.button')
            case 'number':
                return stringBundle.getString('NVDA.output.input.number')
            case 'password':
                return stringBundle.getString('NVDA.output.input.password')
            case 'radio':
                return stringBundle.getString('NVDA.output.input.radio') + ' ' + ((node.checked)? stringBundle.getString('NVDA.output.input.checkbox.checked') : stringBundle.getString('NVDA.output.input.checkbox.unchecked'))
            case 'range':
                return stringBundle.getString('NVDA.output.input.range')
            case 'reset':
                return stringBundle.getString('NVDA.output.button') // TODO: get reset button text
            case 'submit':
                return stringBundle.getString('NVDA.output.button') // TODO: get submit button text
            default:
                return stringBundle.getString('NVDA.output.input.text') + ' ' + ((node.autocomplete != 'off')? stringBundle.getString('NVDA.output.input.text.autocomplete') : '')
        } 
    }
    
    function getNvdaRelevantText(node){
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
    
    function getNvdaAriaLandmarkText(role)
    {
        switch (role.toUpperCase()) {
            case 'BANNER':
                return stringBundle.getString('NVDA.output.header')
            case 'COMPLEMENTARY':
                return stringBundle.getString('NVDA.output.aside')
            case 'CONTENTINFO':
                return stringBundle.getString('NVDA.output.footer')
            case 'FORM':
                return stringBundle.getString('NVDA.output.form')
            case 'MAIN': 
                return stringBundle.getString('NVDA.output.main')
            case 'NAVIGATION':
                return stringBundle.getString('NVDA.output.nav')
            case 'SEARCH':
                return stringBundle.getString('NVDA.output.search')
            case 'APPLICATION':
                return '' // ???
            default:
                return ''
        }
    }
    
    return{
        getNvdaIntroText : getNvdaIntroText,
        getNvdaText : getNvdaText,
        getClosingNvdaText : getClosingNvdaText,
        getInputNvdaText : getInputNvdaText,
        getNvdaRelevantText : getNvdaRelevantText,
        getNvdaAriaLandmarkText : getNvdaAriaLandmarkText
    }
}