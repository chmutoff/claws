var EXPORTED_SYMBOLS = ['ClawsOutput']

const { classes: Cc, interfaces: Ci, utils: Cu } = Components;
Cu.import('resource://claws/outputHelper.js');
const {console} = Cu.import("resource://gre/modules/devtools/Console.jsm", {});

function ClawsOutput(settings){
    
    function getString(msg, args){ //get localized message
        var stringBundle = Components.classes["@mozilla.org/intl/stringbundle;1"]
               .getService(Components.interfaces.nsIStringBundleService)
               .createBundle("chrome://claws/locale/CLAWS.properties");

        if (args){
            args = Array.prototype.slice.call(arguments, 1);            
            return stringBundle.formatStringFromName(msg,args,args.length);
        } else {
            return stringBundle.GetStringFromName(msg);
        }
    }
    
    /******************Settings******************/
    /** @private
     * Announce or not <cite> and <q> tags
     */
    var showQuote = function(){
        if (settings === undefined || settings.quote === undefined) {
            return false;
        }else return settings.quote
    }
    
    /** @private
     * Announce or not <address> tags
     */
    var showAddress = function(){
        if (settings === undefined || settings.address === undefined) {
            return false;
        }else return settings.address
    }
    
    /** @private
     * Announce or not 'title' atribute of the node
     */
    var _showTittle = (function(){
        if (settings === undefined || settings.claws === undefined) {
            return false;
        }else return settings.claws.title
    })()
    /***************END of Settings***************/
    
    /** @private
     * Calculates the position of the <li> element inside of the list
     * 
     * @returns {Integer} position of list item inside of the list
     */
    var getListItemText = function(node){
        var total = outputHelper.countListNodes(node.parentNode)
        var pos = outputHelper.countItemPositionInList(node)
       
        return getString('CLAWS.output.list.item.pos', pos, total)
    }
    
    /** @public
     * Create an introduction text of the document in following format:
     * Document title Page with n links and n forms.
     * 
     * @returns {String} Text with document info
     */
    var getClawsIntroText = function(docInfo){
        return docInfo.docTitle + ' ' + getString('CLAWS.output.pageinfo', docInfo.nOfLinks.toString(), docInfo.nOfForms.toString())
    }
    
    /** @public
     * Generate text output for HTML5 tags and attributes
     *
     * @param {DOM Node} node which tag is analyzed
     * 
     * @returns {String} Text with Claws output
     */
    var getClawsTagText = function(node){
        var tagName = node.tagName.toUpperCase()
        var output = ''
        
        switch(tagName){
            case 'A':
                output += getString('CLAWS.output.link')
                break
            case 'ADDRESS':
                if (showAddress()) {
                    output += getString('CLAWS.output.address')
                }
                break
            case 'AREA':
                output += getString('CLAWS.output.link')
                break
            case 'ASIDE':
                output += getString('CLAWS.output.aside')
                break
            case 'BLOCKQUOTE':
                if (showQuote()) {
                    output += getString('CLAWS.output.blockquote')
                }
                break               
            case 'BUTTON':
                output += getString('CLAWS.output.button')
                break
            case 'DL':
                output += getString('CLAWS.output.list', outputHelper.countListNodes(node))
                break
            case 'FOOTER':
                if (node.parentNode.nodeName == 'BODY') {
                    output += getString('CLAWS.output.page.footer')
                }
                else{
                    output += getString('CLAWS.output.footer')
                }
                break
            case 'H1':
                output += getString('CLAWS.output.heading.level', 1)
                break
            case 'H2':
                output += getString('CLAWS.output.heading.level', 2)
                break
            case 'H3':
                output += getString('CLAWS.output.heading.level', 3)
                break
            case 'H4':
                output += getString('CLAWS.output.heading.level', 4)
                break
            case 'H5':
                output += getString('CLAWS.output.heading.level', 5)
                break
            case 'H6':
                output += getString('CLAWS.output.heading.level', 6)
                break
            case 'HEADER':
                output += getString('CLAWS.output.header')
                break
            case 'HR':
                output += getString('CLAWS.output.hr')
                break
            case 'IFRAME':                
                output += getString('CLAWS.output.iframe')
                break
            case 'IMG':
                output += getString('CLAWS.output.image')
                break
            case 'INPUT':
                if (node.hasAttribute('list')) {
                    output += getString('CLAWS.output.datalist')
                }
                else output += getInputClawsText(node)
                break
            case 'LI':
                output += getListItemText(node)
                break
            case 'MAIN':
                output += getString('CLAWS.output.main')
                break
            case 'MAP':
                output += getString('CLAWS.output.map')
                break
            case 'NAV':
                output += getString('CLAWS.output.nav')
                break
            case 'OBJECT':
                output += getString('CLAWS.output.object')
                break
            case 'OL':
                output += getString('CLAWS.output.list', outputHelper.countListNodes(node))
                break
            case 'PROGRESS':
                output += getString('CLAWS.output.progress')
                break
            case 'Q':
                if (showQuote()) {
                    output += getString('CLAWS.output.quote')
                }
                break
            case 'SELECT':
                output += getString('CLAWS.output.select')
                break
            case 'TABLE':
                output += getString('CLAWS.output.table', outputHelper.getNumRowsInTable(node).toString(), outputHelper.getNumColumnsInTable(node).toString())
                break
            case 'TD':
                output += outputHelper.getCellHeading(node) + ' ' + outputHelper.getHorizontalHeading(node) + ' ' +  getString('CLAWS.output.table.column', (node.cellIndex+1))
                break
            case 'TEXTAREA':
                output += getString('CLAWS.output.textarea')
                break
            case 'TH':
                output += outputHelper.getCellHeading(node) + ' ' +  getString('CLAWS.output.table.column', (node.cellIndex+1))
                break
            case 'TR':
                output += getString('CLAWS.output.table.row', (node.rowIndex+1))
                break
            case 'UL':
                output += getString('CLAWS.output.list', outputHelper.countListNodes(node))
                break
        }
        
        return output
    }
    
    /** @public
     * Generate text output for HTML5 closing tags
     * Some elements has output text for closing tag
     * i.e.: <li> tag output "List of n elems" ... "End of list"
     *
     * @param {DOM Node} node which tag is analyzed
     * 
     * @returns {String} Text string with Claws output
     */
    var getClawsClosingTagText = function(node){
        var tagName = node.tagName.toUpperCase()
        var output = '';
        
        switch (tagName) {
            case 'BLOCKQUOTE':
                if (showQuote()) {
                    output +=  getString('CLAWS.output.blockquote.end')
                }
                break
            case 'DL':
                output += getString('CLAWS.ouptut.list.end')
                break
            case 'IFRAME':
                output += getString('CLAWS.output.iframe.end')
                break
            case 'OL':
                output += getString('CLAWS.ouptut.list.end')
                break
            case 'Q':
                if (showQuote()) {
                    output +=  getString('CLAWS.output.quote.end')
                }
                break
            case 'TABLE':
                output += getString('CLAWS.output.table.end')
                break
            case 'UL':
                output += getString('CLAWS.ouptut.list.end')
                break
        }
        
        return output
    }
    
    /** @public
     * Generate text output for <input type="..."> HTML5 element
     *
     * @param {DOM Node} input node which type is analyzed
     * 
     * @returns {String} Text string with Claws output
     */
    var getInputClawsText = function(node){
        var inputType = node.getAttribute('type').toLowerCase()
        switch (inputType){
            case 'button':
              return getString('CLAWS.output.button')
            case 'checkbox':
              return getString('CLAWS.output.input.checkbox') + ' ' + ((node.checked)? getString('CLAWS.output.input.checkbox.checked') : getString('CLAWS.output.input.checkbox.unchecked'))
            case 'color':
              return getString('CLAWS.output.input.color')
            case 'date':
              return getString('CLAWS.output.input.date')
            case 'datetime':
              return getString('CLAWS.output.input.datetime')
            case 'datetime-local':
              return getString('CLAWS.output.input.datetime')
            case 'email':
                return getString('CLAWS.output.input.type.email')
            case 'file':
              return getString('CLAWS.output.input.file')
            case 'hidden':
              return ''
            case 'image':
              return getString('CLAWS.output.button')
            case 'number':
              return getString('CLAWS.output.input.number')
            case 'password':
              return getString('CLAWS.output.input.password')
            case 'radio':
              return getString('CLAWS.output.input.radio') + ' ' + ((node.checked)? getString('CLAWS.output.input.checkbox.checked') : getString('CLAWS.output.input.checkbox.unchecked'))
            case 'range':
              return getString('CLAWS.output.input.range')
            case 'reset':
              return getString('CLAWS.output.input.reset')
            case 'search':
              return getString('CLAWS.output.input.search') + ' ' + ((node.autocomplete != 'off')? getString('CLAWS.output.input.text.autocomplete') : '')
            case 'submit':
              return getString('CLAWS.output.input.submit')
            case 'time':
                return getString('CLAWS.output.input.time')
            default:
                return getString('CLAWS.output.input.text') + ' ' + ((node.autocomplete != 'off')? getString('CLAWS.output.input.text.autocomplete') : '')
        } 
    }
    
    /** @public
     * Generate relevant node information
     * i.e: image alt attribute text,
     *      input value,
     *      etc...
     *
     * @param {DOM Node} node to extract the information
     *
     * @returns {String} output for relevant attributes
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
     * Generate the output text for Aria Roles.
     * Most of them has equivalent HTML5 tag
     * i.e.: banner role is the same as header tag
     * 
     * @param {String} Text of ARIA role atribute
     * 
     * @returns {String} Announcement for corresponding ARIA Landmark
     */
    var getClawsAriaLandmarkText = function(role)
    {
        switch (role.toUpperCase()) {
            case 'BANNER':
                return getString('CLAWS.output.header')
            case 'COMPLEMENTARY':
                return getString('CLAWS.output.aside')
            case 'CONTENTINFO':
                return getString('CLAWS.output.footer')
            case 'FORM':
                return getString('CLAWS.output.form')
            case 'MAIN': 
                return getString('CLAWS.output.main')
            case 'NAVIGATION':
                return getString('CLAWS.output.nav')
            case 'SEARCH':
                return getString('CLAWS.output.search')
            case 'APPLICATION':
                return '' // ???
            default:
                return ''
        }
    }
    
    /** @public
     *  Generate output for lang change: language changed from currentLang to newLang
     *
     *  @param currentLang current languange
     *  @param newLang new language
     *
     *  @returns {String} output text
     */
    var getClawsLangChangeText = function(currentLang, newLang)
    {
        return getString('CLAWS.output.lang.change.from.to', currentLang, newLang)
    }
    
    return{
        getIntroText : getClawsIntroText,
        getText : getClawsTagText,
        getClosingText : getClawsClosingTagText,
        getInputText : getInputClawsText,
        getRelevantText : getClawsRelevantText,
        getAriaLandmarkText : getClawsAriaLandmarkText,
        getLangChangeText : getClawsLangChangeText
    }
}