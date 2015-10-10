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
function NvdaOutput()
{
    function getString(msg, args){ //get localized message
        var stringBundle = Components.classes["@mozilla.org/intl/stringbundle;1"]
               .getService(Components.interfaces.nsIStringBundleService)
               .createBundle("chrome://claws/locale/NVDA.properties");

        if (args){
            args = Array.prototype.slice.call(arguments, 1);
            return stringBundle.formatStringFromName(msg,args,args.length);
        } else {
            return stringBundle.GetStringFromName(msg);
        }
    }
    
    /** @public
     * Create an introduction text of the document in following format:
     * Document title
     * 
     * @returns {String} Text with document info
     */
    function getNvdaIntroText(docInfo) {
        return docInfo.docTitle
    }
    
    /** @public
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
                return getString('NVDA.output.link')
            case 'AREA':
                return getString('NVDA.output.link')
            case 'ASIDE':
                return getString('NVDA.output.aside')
            case 'BLOCKQUOTE':
                return getString('NVDA.output.quote')
            case 'BUTTON':
                return getString('NVDA.output.button')
            case 'DL':
                return getString('NVDA.output.list', outputHelper.countListNodes(node))
            case 'FOOTER':
                if (node.parentNode.nodeName == 'BODY') {
                    // NVDA only anounces the page footer
                    return getString('NVDA.output.footer')
                }
                else return ''
            case 'H1':
                return getString('NVDA.output.heading.level', 1)
            case 'H2':
                return getString('NVDA.output.heading.level', 2)
            case 'H3':
                return getString('NVDA.output.heading.level', 3)
            case 'H4':
                return getString('NVDA.output.heading.level', 4)
            case 'H5':
                return getString('NVDA.output.heading.level', 5)
            case 'H6':
                return getString('NVDA.output.heading.level', 6)
            case 'HEADER':
                return getString('NVDA.output.header')
            case 'HR':
                return getString('NVDA.output.hr')
            case 'IFRAME':                
                return getString('NVDA.output.iframe')
            case 'IMG':
                return getString('NVDA.output.img') + ((node.hasAttribute('longdesc'))? ' ' + getString('NVDA.output.img.longdesc') : '')
            case 'INPUT':
                if (node.hasAttribute('list')) {
                    return getString('NVDA.output.datalist')
                }
                else return getInputNvdaText(node)
            case 'MAIN':
                return getString('NVDA.output.main')
            case 'MAP':
                return getString('NVDA.output.map')
            case 'NAV':
                return getString('NVDA.output.nav')
            case 'OBJECT':
                return getString('NVDA.output.object')
            case 'OL':
                return getString('NVDA.output.list', outputHelper.countListNodes(node))
            case 'PROGRESS':
                return getString('NVDA.output.progress')
            case 'SELECT':
                return getString('NVDA.output.select')
            case 'TABLE':
                return getString('NVDA.output.table', outputHelper.getNumRowsInTable(node).toString(), outputHelper.getNumColumnsInTable(node).toString())
            case 'TD':
                return outputHelper.getCellHeading(node) + ' ' +  getString('NVDA.output.table.column', (node.cellIndex+1))
            case 'TEXTAREA':
                return getString('NVDA.output.textarea')
            case 'TH':
                return outputHelper.getCellHeading(node) + ' ' +  getString('NVDA.output.table.column', (node.cellIndex+1))
            case 'TR':
                return getString('NVDA.output.table.row', (node.rowIndex+1))
            case 'UL':
                return getString('NVDA.output.list', outputHelper.countListNodes(node))
            default:
                return ''
        }
    }
    
    /** @public
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
                return  getString('NVDA.output.quote.end')
            case 'DL':
                return getString('NVDA.ouptut.list.end')
            case 'IFRAME':
                return getString('NVDA.output.iframe.end')
            case 'OL':
                return getString('NVDA.ouptut.list.end')
            case 'TABLE':
                return getString('NVDA.output.table.end')
            case 'UL':
                return getString('NVDA.ouptut.list.end')
            default:
                return ''
        }
    }
    
    /** @public
     * Generates text output for <input type="..."> HTML5 element
     *
     * @param {DOM Node} input node which type is analyzed
     * @returns {String} Text string as NVDA scren reader would do
     */
    function getInputNvdaText(node){
        var inputType = node.type.toLowerCase()
        switch (inputType){
            case 'button':
                return getString('NVDA.output.button')
            case 'checkbox':
                return getString('NVDA.output.input.checkbox') + ' ' + ((node.checked)? getString('NVDA.output.input.checkbox.checked') : getString('NVDA.output.input.checkbox.unchecked'))
            case 'color':
                return getString('NVDA.output.button')
            case 'file':
                return getString('NVDA.output.button') // TODO: get input button text and "no file selected" text
            case 'hidden':
                return ''
            case 'image':
                return getString('NVDA.output.button')
            case 'number':
                return getString('NVDA.output.input.number')
            case 'password':
                return getString('NVDA.output.input.password')
            case 'radio':
                return getString('NVDA.output.input.radio') + ' ' + ((node.checked)? getString('NVDA.output.input.checkbox.checked') : getString('NVDA.output.input.checkbox.unchecked'))
            case 'range':
                return getString('NVDA.output.input.range')
            case 'reset':
                return getString('NVDA.output.button') // TODO: get reset button text
            case 'submit':
                return getString('NVDA.output.button') // TODO: get submit button text
            default:
                return getString('NVDA.output.input.text') + ' ' + ((node.autocomplete != 'off')? getString('NVDA.output.input.text.autocomplete') : '')
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
    
    /** @public
     * Generate the output text for Aria Roles.
     * Most of them has equivalent HTML5 tag
     * i.e.: banner role is the same as header tag
     * 
     * @param {String} Text of ARIA role atribute
     * 
     * @returns {String} Announcement for corresponding ARIA Landmark
     */
    function getNvdaAriaLandmarkText(role)
    {
        switch (role.toUpperCase()) {
            case 'BANNER':
                return getString('NVDA.output.header')
            case 'COMPLEMENTARY':
                return getString('NVDA.output.aside')
            case 'CONTENTINFO':
                return getString('NVDA.output.footer')
            case 'FORM':
                return getString('NVDA.output.form')
            case 'MAIN': 
                return getString('NVDA.output.main')
            case 'NAVIGATION':
                return getString('NVDA.output.nav')
            case 'SEARCH':
                return getString('NVDA.output.search')
            case 'APPLICATION':
                return '' // ???
            default:
                return ''
        }
    }
    
    /** @public
     * Language changes don't generate ANY textual output in NVDA
     */
    function getNvdaLangChangeText(currentLang, newLang) { return '' }
    
    function getClawsClosingAriaLandmarkText(role){ return '' }
    
    return{
        getIntroText : getNvdaIntroText,
        getText : getNvdaText,
        getClosingText : getClosingNvdaText,
        getInputText : getInputNvdaText,
        getRelevantText : getNvdaRelevantText,
        getAriaLandmarkText : getNvdaAriaLandmarkText,
        getClosingAriaLandmarkText : getClawsClosingAriaLandmarkText,
        getLangChangeText : getNvdaLangChangeText
    }
    
    //TODO: rename returned functions getTagText and getClosingTagText
    //TODO: rename internal functions to getClaws...() and getNvda...()
}