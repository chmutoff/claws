var EXPORTED_SYMBOLS = ['JawsOutput']
const { classes: Cc, interfaces: Ci, utils: Cu } = Components;
Cu.import('resource://claws/outputHelper.js')

/**
 * Creates an output class for  mode
 * 
 * @param {Object} stringBundle contains all the localized strings
 * @returns {Object} functions to generate all the output
 *
 * NOTE: all the tag names are transfromed to upper case because
 * depending on doctype they could be in lower/upper case * 
 */
function JawsOutput()
{
    var stringBundle = Cc["@mozilla.org/intl/stringbundle;1"]
                        .getService(Ci.nsIStringBundleService)
                        .createBundle("chrome://claws/locale/JAWS.properties");

    function getString(msg, args){ //get localized message
        if (args){ //for message with parameters
            args = Array.prototype.slice.call(arguments, 1);
            return stringBundle.formatStringFromName(msg,args,args.length);
        } else { //for message without parameters
            return stringBundle.GetStringFromName(msg);
        }
    }

    /** @public
     * Create an introduction text of the document in following format:
     * Document title
     * 
     * @returns {String} Text with document info
     */
    function getJawsIntroText(docInfo) {
        //return docInfo.docTitle
    }
    
    /** @public
     * Generates text output for HTML5 tags
     *
     * @param {DOM Node} node which tag is analyzed
     * @returns {String} Text string as JAWS scren reader would do
     */
    function getJawsTagText(node){
        var tagName = node.tagName.toUpperCase()
        
        switch(tagName){
            case 'A':
                // JAWS annouces if link have been visited
                // it is not possible for javascript to detect if a link is visited in either Firefox or Chrome (security reasons)
                // https://developer.mozilla.org/en-US/docs/Web/CSS/Privacy_and_the_:visited_selector
                //return stringBundle.getString('JAWS.output.link')
            case 'AREA':
                //return stringBundle.getString('JAWS.output.link')
            case 'ASIDE':
                //return stringBundle.getString('JAWS.output.aside')
            case 'BLOCKQUOTE':
                //return stringBundle.getString('JAWS.output.quote')
            case 'BUTTON':
                //return stringBundle.getString('JAWS.output.button')
            case 'DL':
                //return stringBundle.getFormattedString('JAWS.output.list', [outputHelper.countListNodes(node)])
            case 'FOOTER':
                if (node.parentNode.nodeName == 'BODY') {
                    // JAWS only anounces the page footer
                    //return stringBundle.getString('JAWS.output.footer')
                }
                //else return ''
            case 'H1':
                //return stringBundle.getFormattedString('JAWS.output.heading.level', [1])
            case 'H2':
                //return stringBundle.getFormattedString('JAWS.output.heading.level', [2])
            case 'H3':
                //return stringBundle.getFormattedString('JAWS.output.heading.level', [3])
            case 'H4':
                //return stringBundle.getFormattedString('JAWS.output.heading.level', [4])
            case 'H5':
                //return stringBundle.getFormattedString('JAWS.output.heading.level', [5])
            case 'H6':
                //return stringBundle.getFormattedString('JAWS.output.heading.level', [6])
            case 'HEADER':
                //return stringBundle.getString('JAWS.output.header')
            case 'HR':
                //return stringBundle.getString('JAWS.output.hr')
            case 'IFRAME':                
                //return stringBundle.getString('JAWS.output.iframe')
            case 'IMG':
                //return stringBundle.getString('JAWS.output.img') + ((node.hasAttribute('longdesc'))? ' ' + stringBundle.getString('JAWS.output.img.longdesc') : '')
            case 'INPUT':
                if (node.hasAttribute('list')) {
                    //return stringBundle.getString('JAWS.output.datalist')
                }
                //else return getInputJawsText(node)
            case 'MAIN':
                //return stringBundle.getString('JAWS.output.main')
            case 'MAP':
                //return stringBundle.getString('JAWS.output.map')
            case 'NAV':
                //return stringBundle.getString('JAWS.output.nav')
            case 'OBJECT':
                //return stringBundle.getString('JAWS.output.object')
            case 'OL':
                //return stringBundle.getFormattedString('JAWS.output.list', [outputHelper.countListNodes(node)])
            case 'PROGRESS':
                //return stringBundle.getString('JAWS.output.progress')
            case 'SELECT':
                //return stringBundle.getString('JAWS.output.select')
            case 'TABLE':
                //return stringBundle.getFormattedString('JAWS.output.table', [outputHelper.getNumRowsInTable(node), outputHelper.getNumColumnsInTable(node)])
            case 'TD':
                //return outputHelper.getCellHeading(node) + ' ' +  stringBundle.getFormattedString('JAWS.output.table.column', [(node.cellIndex+1)])
            case 'TEXTAREA':
                //return stringBundle.getString('JAWS.output.textarea')
            case 'TH':
                //return outputHelper.getCellHeading(node) + ' ' +  stringBundle.getFormattedString('JAWS.output.table.column', [(node.cellIndex+1)])
            case 'TR':
                //return stringBundle.getFormattedString('JAWS.output.table.row', [(node.rowIndex+1)])
            case 'UL':
                //return stringBundle.getFormattedString('JAWS.output.list', [outputHelper.countListNodes(node)])
            default:
                //return ''
        }
    }
    
    /** @public
     * Generates text output for HTML5 closing tags
     * because elements has output text for closing tag
     *
     * @param {DOM Node} node which tag is analyzed
     * @returns {String} Text string as JAWS scren reader would do
     */
    function getJawsClosingTagText(node){
        var tagName = node.tagName.toUpperCase()
        switch (tagName) {
            case 'BLOCKQUOTE':
                //return  stringBundle.getString('JAWS.output.quote.end')
            case 'DL':
                //return stringBundle.getString('JAWS.ouptut.list.end')
            case 'IFRAME':
                //return stringBundle.getString('JAWS.output.iframe.end')
            case 'OL':
                //return stringBundle.getString('JAWS.ouptut.list.end')
            case 'TABLE':
                //return stringBundle.getString('JAWS.output.table.end')
            case 'UL':
                //return stringBundle.getString('JAWS.ouptut.list.end')
            default:
                //return ''
        }
    }
    
    /** @public
     * Generates text output for <input type="..."> HTML5 element
     *
     * @param {DOM Node} input node which type is analyzed
     * @returns {String} Text string as JAWS scren reader would do
     */
    function getJawsInputText(node){
        var inputType = node.type.toLowerCase()
        switch (inputType){
            case 'button':
                //return stringBundle.getString('JAWS.output.button')
            case 'checkbox':
                //return stringBundle.getString('JAWS.output.input.checkbox') + ' ' + ((node.checked)? stringBundle.getString('JAWS.output.input.checkbox.checked') : stringBundle.getString('JAWS.output.input.checkbox.unchecked'))
            case 'color':
                //return stringBundle.getString('JAWS.output.button')
            case 'file':
                //return stringBundle.getString('JAWS.output.button') // TODO: get input button text and "no file selected" text
            case 'hidden':
                //return ''
            case 'image':
                //return stringBundle.getString('JAWS.output.button')
            case 'number':
                //return stringBundle.getString('JAWS.output.input.number')
            case 'password':
                //return stringBundle.getString('JAWS.output.input.password')
            case 'radio':
                //return stringBundle.getString('JAWS.output.input.radio') + ' ' + ((node.checked)? stringBundle.getString('JAWS.output.input.checkbox.checked') : stringBundle.getString('JAWS.output.input.checkbox.unchecked'))
            case 'range':
                //return stringBundle.getString('JAWS.output.input.range')
            case 'reset':
                //return stringBundle.getString('JAWS.output.button') // TODO: get reset button text
            case 'submit':
                //return stringBundle.getString('JAWS.output.button') // TODO: get submit button text
            default:
                //return stringBundle.getString('JAWS.output.input.text') + ' ' + ((node.autocomplete != 'off')? stringBundle.getString('JAWS.output.input.text.autocomplete') : '')
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
    function getJawsRelevantText(node){
        var tagName = node.tagName.toUpperCase()
      
        switch (tagName) {
            case 'AREA':
                //return node.alt
            case 'IMG':               
                //return node.alt
            case 'INPUT':
                var inputType = node.type
                switch (inputType) {
                  case 'hidden':
                    //return ''
                  case 'image':
                    //return node.alt
                  case 'radio':
                    //return ''
                  default:
                    //return node.value
                }
            case 'SELECT':
                //return node.value
            case 'TABLE':
                //return node.summary
            default:
                //return ''
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
    function getJawsAriaLandmarkText(role)
    {
        switch (role.toUpperCase()) {
            case 'BANNER':
                //return stringBundle.getString('JAWS.output.header')
            case 'COMPLEMENTARY':
                //return stringBundle.getString('JAWS.output.aside')
            case 'CONTENTINFO':
                //return stringBundle.getString('JAWS.output.footer')
            case 'FORM':
                //return stringBundle.getString('JAWS.output.form')
            case 'MAIN': 
                //return stringBundle.getString('JAWS.output.main')
            case 'NAVIGATION':
                //return stringBundle.getString('JAWS.output.nav')
            case 'SEARCH':
                //return stringBundle.getString('JAWS.output.search')
            case 'APPLICATION':
                //return '' // ???
            default:
                //return ''
        }
    }
    
    /** @public
     * Language changes don't generate ANY textual output in JAWS
     */
    function getJawsLangChangeText(currentLang, newLang) {
        //return ''
    }
    
    return{
        getIntroText : getJawsIntroText,
        getText : getJawsTagText,
        getClosingText : getJawsClosingTagText,
        getInputText : getJawsInputText,
        getRelevantText : getJawsRelevantText,
        getAriaLandmarkText : getJawsAriaLandmarkText,
        getLangChangeText : getJawsLangChangeText
    }
}