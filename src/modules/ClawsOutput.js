var EXPORTED_SYMBOLS = ['ClawsOutput']

const { classes: Cc, interfaces: Ci, utils: Cu } = Components;
Cu.import('resource://claws/outputHelper.js');
const {console} = Cu.import("resource://gre/modules/devtools/Console.jsm", {});

function ClawsOutput(stringBundle, settings){    
    
    /******************Settings******************/
    /** @private
     * Announce or not <cite> and <q>
     */
    var showQuote = function(){
        if (settings === undefined || settings.quote === undefined) {
            return false;
        }else return settings.quote
    }
    
    /** @private
     * Announce or not <address>
     */
    var showAddress = function(){
        if (settings === undefined || settings.address === undefined) {
            return false;
        }else return settings.address
    }
    
    var _showTittle = (function(){
        if (settings === undefined || settings.claws === undefined) {
            return false;
        }else return settings.claws.title
    })()
    /***************END of Settings***************/
    
    /** @private
     * Calculates the position of the <li> element inside of the list
     * 
     * @returns {Integer}
     */
    var getListItemText = function(node){
        var total = outputHelper.countListNodes(node.parentNode)
        var pos = outputHelper.countItemPositionInList(node)
       
        return stringBundle.getFormattedString('CLAWS.output.list.item.pos', [pos, total])
    }
    
    /** @public
     * Create an introduction text of the document in following format:
     * Document title Page with n links and n forms.
     * 
     * @return {String}
     */
    var getClawsIntroText = function(docInfo){        
        return docInfo.docTitle + ' ' + stringBundle.getFormattedString('CLAWS.output.pageinfo', [docInfo.nOfLinks, docInfo.nOfForms])
    }
    
    /** @public
     * Generates text output for HTML5 tags and attributes
     *
     * @param {DOM Node} node which tag is analyzed
     * @returns {String} Text string with Claws output
     */
    var getClawsText = function(node){
        var tagName = node.tagName.toUpperCase()
        var output = ''
        
        switch(tagName){
            case 'A':
                output += stringBundle.getString('CLAWS.output.link')
                break
            case 'ADDRESS':
                if (showAddress()) {
                    output += stringBundle.getString('CLAWS.output.address')
                }
                break
            case 'AREA':
                output += stringBundle.getString('CLAWS.output.link')
                break
            case 'ASIDE':
                output += stringBundle.getString('CLAWS.output.aside')
                break
            case 'BLOCKQUOTE':
                if (showQuote()) {
                    output += stringBundle.getString('CLAWS.output.blockquote')
                }
                break               
            case 'BUTTON':
                output += stringBundle.getString('CLAWS.output.button')
                break
            case 'DL':
                output += stringBundle.getFormattedString('CLAWS.output.list', [outputHelper.countListNodes(node)])
                break
            case 'FOOTER':
                if (node.parentNode.nodeName == 'BODY') {
                    output += stringBundle.getString('CLAWS.output.page.footer')
                }
                else{
                    output += stringBundle.getString('CLAWS.output.footer')
                }
                break
            case 'H1':
                output += stringBundle.getFormattedString('CLAWS.output.heading.level', [1])
                break
            case 'H2':
                output += stringBundle.getFormattedString('CLAWS.output.heading.level', [2])
                break
            case 'H3':
                output += stringBundle.getFormattedString('CLAWS.output.heading.level', [3])
                break
            case 'H4':
                output += stringBundle.getFormattedString('CLAWS.output.heading.level', [4])
                break
            case 'H5':
                output += stringBundle.getFormattedString('CLAWS.output.heading.level', [5])
                break
            case 'H6':
                output += stringBundle.getFormattedString('CLAWS.output.heading.level', [6])
                break
            case 'HEADER':
                output += stringBundle.getString('CLAWS.output.header')
                break
            case 'HR':
                output += stringBundle.getString('CLAWS.output.hr')
                break
            case 'IFRAME':                
                output += stringBundle.getString('CLAWS.output.iframe')
                break
            case 'IMG':
                output += stringBundle.getString('CLAWS.output.image')
                break
            case 'INPUT':
                if (node.hasAttribute('list')) {
                    output += stringBundle.getString('CLAWS.output.datalist')
                }
                else output += getInputClawsText(node)
                break
            case 'LI':
                output += getListItemText(node)
                break
            case 'MAIN':
                output += stringBundle.getString('CLAWS.output.main')
                break
            case 'MAP':
                output += stringBundle.getString('CLAWS.output.map')
                break
            case 'NAV':
                output += stringBundle.getString('CLAWS.output.nav')
                break
            case 'OBJECT':
                output += stringBundle.getString('CLAWS.output.object')
                break
            case 'OL':
                output += stringBundle.getFormattedString('CLAWS.output.list', [outputHelper.countListNodes(node)])
                break
            case 'PROGRESS':
                output += stringBundle.getString('CLAWS.output.progress')
                break
            case 'Q':
                if (showQuote()) {
                    output += stringBundle.getString('CLAWS.output.quote')
                }
                break
            case 'SELECT':
                output += stringBundle.getString('CLAWS.output.select')
                break
            case 'TABLE':
                output += stringBundle.getFormattedString('CLAWS.output.table', [outputHelper.getNumRowsInTable(node), outputHelper.getNumColumnsInTable(node)])
                break
            case 'TD':
                output += outputHelper.getCellHeading(node) + ' ' + outputHelper.getHorizontalHeading(node) + ' ' +  stringBundle.getFormattedString('CLAWS.output.table.column', [(node.cellIndex+1)])
                break
            case 'TEXTAREA':
                output += stringBundle.getString('CLAWS.output.textarea')
                break
            case 'TH':
                output += outputHelper.getCellHeading(node) + ' ' +  stringBundle.getFormattedString('CLAWS.output.table.column', [(node.cellIndex+1)])
                break
            case 'TR':
                output += stringBundle.getFormattedString('CLAWS.output.table.row', [(node.rowIndex+1)])
                break
            case 'UL':
                output += stringBundle.getFormattedString('CLAWS.output.list', [outputHelper.countListNodes(node)])
                break
        }
        
        return output
    }
    
    /** @public
     * Generates text output for HTML5 closing tags
     * Some elements has output text for closing tag
     * i.e.: <li> tag output "List of n elems" ... "End of list"
     *
     * @param {DOM Node} node which tag is analyzed
     * @returns {String} Text string with Claws output
     */
    var getClosingClawsText = function(node){
        var tagName = node.tagName.toUpperCase()
        var output = '';
        
        switch (tagName) {
            case 'BLOCKQUOTE':
                if (showQuote()) {
                    output +=  stringBundle.getString('CLAWS.output.blockquote.end')
                }
                break
            case 'DL':
                output += stringBundle.getString('CLAWS.ouptut.list.end')
                break
            case 'IFRAME':
                output += stringBundle.getString('CLAWS.output.iframe.end')
                break
            case 'OL':
                output += stringBundle.getString('CLAWS.ouptut.list.end')
                break
            case 'Q':
                if (showQuote()) {
                    output +=  stringBundle.getString('CLAWS.output.quote.end')
                }
                break
            case 'TABLE':
                output += stringBundle.getString('CLAWS.output.table.end')
                break
            case 'UL':
                output += stringBundle.getString('CLAWS.ouptut.list.end')
                break
        }
        
        return output
    }
    
    /** @public
     * Generates text output for <input type="..."> HTML5 element
     *
     * @param {DOM Node} input node which type is analyzed
     * @returns {String} Text string with Claws output
     */
    var getInputClawsText = function(node){
        var inputType = node.getAttribute('type').toLowerCase()
        switch (inputType){
            case 'button':
              return stringBundle.getString('CLAWS.output.button')
            case 'checkbox':
              return stringBundle.getString('CLAWS.output.input.checkbox') + ' ' + ((node.checked)? stringBundle.getString('CLAWS.output.input.checkbox.checked') : stringBundle.getString('CLAWS.output.input.checkbox.unchecked'))
            case 'color':
              return stringBundle.getString('CLAWS.output.input.color')
            case 'date':
              return stringBundle.getString('CLAWS.output.input.date')
            case 'datetime':
              return stringBundle.getString('CLAWS.output.input.datetime')
            case 'datetime-local':
              return stringBundle.getString('CLAWS.output.input.datetime')
            case 'email':
                return stringBundle.getString('CLAWS.output.input.type.email')
            case 'file':
              return stringBundle.getString('CLAWS.output.input.file')
            case 'hidden':
              return ''
            case 'image':
              return stringBundle.getString('CLAWS.output.button')
            case 'number':
              return stringBundle.getString('CLAWS.output.input.number')
            case 'password':
              return stringBundle.getString('CLAWS.output.input.password')
            case 'radio':
              return stringBundle.getString('CLAWS.output.input.radio') + ' ' + ((node.checked)? stringBundle.getString('CLAWS.output.input.checkbox.checked') : stringBundle.getString('CLAWS.output.input.checkbox.unchecked'))
            case 'range':
              return stringBundle.getString('CLAWS.output.input.range')
            case 'reset':
              return stringBundle.getString('CLAWS.output.input.reset')
            case 'search':
              return stringBundle.getString('CLAWS.output.input.search') + ' ' + ((node.autocomplete != 'off')? stringBundle.getString('CLAWS.output.input.text.autocomplete') : '')
            case 'submit':
              return stringBundle.getString('CLAWS.output.input.submit')
            case 'time':
                return stringBundle.getString('CLAWS.output.input.time')
            default:
                return stringBundle.getString('CLAWS.output.input.text') + ' ' + ((node.autocomplete != 'off')? stringBundle.getString('CLAWS.output.input.text.autocomplete') : '')
        } 
    }
    
    /** @public
     * Returns relevant node information
     * i.e: image alt attribute text,
     *      input value,
     *      etc...
     *
     * @param {DOM Node} node to extract the information
     *
     * NOTE: all the tag names are transfromed to upper case because
     * depending on doctype they could be in lower/upper case
     */
    var getClawsRelevantText = function(node){
        var tagName = node.tagName.toUpperCase()
        var output = ''
        
        if (_showTittle && node.hasAttribute('title')) {
            output += node.getAttribute('title')
        }
        
        switch (tagName) {
            case 'AREA':
                output += node.alt
                break
            case 'IMG':
                output += node.alt + ((node.hasAttribute('longdesc')) ? ' ' + node.getAttribute('longdesc') : '')
                break
            case 'INPUT':
                var inputType = node.type
                switch (inputType) {
                    case 'hidden':
                      output += ''
                      break
                    case 'image':
                      output += node.alt
                      break
                    case 'radio':
                      output += ''
                      break
                    default:
                      output += node.value
                }
                break
            case 'SELECT':
                output += node.value
                break
            case 'TABLE':
                output += node.summary
                break
            default:
                output += ''
        }
        
        return output
    }
    
    /** @public
     *
     * @param {String} Text of ARIA role atribute
     * @returns {String} Announcement for corresponding ARIA Landmark
     */
    var getClawsAriaLandmarkText = function(role)
    {
        switch (role.toUpperCase()) {
            case 'BANNER':
                return stringBundle.getString('CLAWS.output.header')
            case 'COMPLEMENTARY':
                return stringBundle.getString('CLAWS.output.aside')
            case 'CONTENTINFO':
                return stringBundle.getString('CLAWS.output.footer')
            case 'FORM':
                return stringBundle.getString('CLAWS.output.form')
            case 'MAIN': 
                return stringBundle.getString('CLAWS.output.main')
            case 'NAVIGATION':
                return stringBundle.getString('CLAWS.output.nav')
            case 'SEARCH':
                return stringBundle.getString('CLAWS.output.search')
            case 'APPLICATION':
                return '' // ???
            default:
                return ''
        }
    }
    
    var getClawsLangChangeText = function(currentLang, newLang)
    {
        return stringBundle.getFormattedString('CLAWS.output.lang.change.from.to', [currentLang, newLang])
    }
    
    return{
        getIntroText : getClawsIntroText,
        getText : getClawsText,
        getClosingText : getClosingClawsText,
        getInputText : getInputClawsText,
        getRelevantText : getClawsRelevantText,
        getAriaLandmarkText : getClawsAriaLandmarkText,
        getLangChangeText : getClawsLangChangeText
    }
}