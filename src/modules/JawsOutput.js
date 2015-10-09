var EXPORTED_SYMBOLS = ['JawsOutput']
const { classes: Cc, interfaces: Ci, utils: Cu } = Components;
Cu.import('resource://claws/outputHelper.js')
const {console} = Cu.import("resource://gre/modules/devtools/Console.jsm", {});

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
        //console.log("Getting text for: " + msg)
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
        //console.log(docInfo)
        if (docInfo.nOfHeadings == 0 && docInfo.nOfLinks == 0) {
            return getString('JAWS.output.pageinfo.nolinks') + ' ' + docInfo.docTitle
        }
        else if (docInfo.nOfHeadings > 0 && docInfo.nOfLinks == 0) {
            return getString('JAWS.output.pageinfo.headings.nolinks', docInfo.nOfHeadings.toString()) + ' ' + docInfo.docTitle
        }
        else if (docInfo.nOfHeadings == 0 && docInfo.nOfLinks > 0) {
            return getString('JAWS.output.pageinfo.links.noheadings', docInfo.nOfLinks.toString()) + ' ' + docInfo.docTitle
        }
        else return  getString('JAWS.output.pageinfo', docInfo.nOfHeadings.toString(), docInfo.nOfLinks.toString()) + ' ' + docInfo.docTitle
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
                if (node.getAttribute('href')[0] == '#') {
                    return getString('JAWS.output.link.same')
                }
                else if (outputHelper.isSendMailLink(node.getAttribute("href"))) {
                    return getString('JAWS.output.link.mailto')
                }
                else return getString('JAWS.output.link')
            /*
            case 'AREA':
                //return getString('JAWS.output.link')
            */
            case 'ARTICLE':
                return getString('JAWS.output.article')
            case 'ASIDE':
                return getString('JAWS.output.aside')
            
            case 'BLOCKQUOTE':
                return getString('JAWS.output.blockquote')
            /*
            case 'BUTTON':
                //return getString('JAWS.output.button')
            */
            case 'DL':
                return getString('JAWS.output.definitionlist', [outputHelper.countDListNodes(node)])
            case 'FIGURE':
                return getString('JAWS.output.figure')
            case 'FOOTER':
                if (node.parentNode.nodeName == 'BODY') {
                    // JAWS only anounces the page footer
                    return getString('JAWS.output.footer')
                }
                else return ''            
            case 'H1':
                return getString('JAWS.output.heading.level', 1)
            case 'H2':
                return getString('JAWS.output.heading.level', 2)
            case 'H3':
                return getString('JAWS.output.heading.level', 3)
            case 'H4':
                return getString('JAWS.output.heading.level', 4)
            case 'H5':
                return getString('JAWS.output.heading.level', 5)
            case 'H6':
                return getString('JAWS.output.heading.level', 6)
            
            case 'HEADER':
                return getString('JAWS.output.header')
            
            case 'HR':
                return getString('JAWS.output.hr')
            /*
            case 'IFRAME':                
                //return getString('JAWS.output.iframe')
                */
            case 'IMG':
                return getString('JAWS.output.img')
                //+ ((node.hasAttribute('longdesc'))? ' ' + getString('JAWS.output.img.longdesc') : '')
            /*
            case 'INPUT':
                if (node.hasAttribute('list')) {
                    //return getString('JAWS.output.datalist')
                }
                //else return getInputJawsText(node)
            */
            case 'MAIN':
                return getString('JAWS.output.main')
            /*    
            case 'MAP':
                //return getString('JAWS.output.map')
            */
            case 'NAV':
                return getString('JAWS.output.nav')
            /*
            case 'OBJECT':
                //return getString('JAWS.output.object')
            */
            case 'OL':
                var parentLists = outputHelper.countParentLists(node)
                if (parentLists == 0) {
                    return getString('JAWS.output.list', outputHelper.countListNodes(node))
                }
                else return getString('JAWS.output.list.nested', outputHelper.countListNodes(node), parentLists)
            /*
            case 'PROGRESS':
                //return getString('JAWS.output.progress')
            case 'SELECT':
                //return getString('JAWS.output.select')
            case 'TABLE':
                //return getString('JAWS.output.table', [outputHelper.getNumRowsInTable(node), outputHelper.getNumColumnsInTable(node)])
            case 'TD':
                //return outputHelper.getCellHeading(node) + ' ' +  getString('JAWS.output.table.column', [(node.cellIndex+1)])
            case 'TEXTAREA':
                //return getString('JAWS.output.textarea')
            case 'TH':
                //return outputHelper.getCellHeading(node) + ' ' +  getString('JAWS.output.table.column', [(node.cellIndex+1)])
            case 'TR':
                //return getString('JAWS.output.table.row', [(node.rowIndex+1)])
            */
            case 'UL':
                var parentLists = outputHelper.countParentLists(node)
                if (parentLists == 0) {
                    return getString('JAWS.output.list', outputHelper.countListNodes(node))
                }
                else return getString('JAWS.output.list.nested', outputHelper.countListNodes(node), parentLists)
            default:
                return ''
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
            case 'ARTICLE':
                return getString('JAWS.output.article.end')
            case 'ASIDE':
                return getString('JAWS.output.aside.end')            
            case 'BLOCKQUOTE':
                return  getString('JAWS.output.blockquote.end')
            case 'DL':
                return getString('JAWS.output.list.end')
            case 'FIGURE':
                return getString('JAWS.output.figure.end')
            case 'FOOTER':
                if (node.parentNode.nodeName == 'BODY') {
                    // JAWS only anounces the page footer
                    return getString('JAWS.output.footer.end')
                }
                else return '' 
            case 'HEADER':
                return getString('JAWS.output.header.end')
            /*
            case 'IFRAME':
                //return getString('JAWS.output.iframe.end')
                */
            case 'MAIN':
                return getString('JAWS.output.main.end')
            case 'NAV':
                return getString('JAWS.output.nav.end')
            
            case 'OL':
                var parentLists = outputHelper.countParentLists(node)
                if (parentLists == 0) {
                    return getString('JAWS.output.list.end')
                }
                else return getString('JAWS.output.list.nested.end', parentLists)
            /*
            case 'TABLE':
                //return getString('JAWS.output.table.end')
            */
            case 'UL':
                var parentLists = outputHelper.countParentLists(node)
                if (parentLists == 0) {
                    return getString('JAWS.output.list.end')
                }
                else return getString('JAWS.output.list.nested.end', parentLists)            
            default:
                return ''
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
            /*
            case 'button':
                //return getString('JAWS.output.button')
            case 'checkbox':
                //return getString('JAWS.output.input.checkbox') + ' ' + ((node.checked)? getString('JAWS.output.input.checkbox.checked') : getString('JAWS.output.input.checkbox.unchecked'))
            case 'color':
                //return getString('JAWS.output.button')
            case 'file':
                //return getString('JAWS.output.button') // TODO: get input button text and "no file selected" text
            case 'hidden':
                //return ''
            case 'image':
                //return getString('JAWS.output.button')
            case 'number':
                //return getString('JAWS.output.input.number')
            case 'password':
                //return getString('JAWS.output.input.password')
            case 'radio':
                //return getString('JAWS.output.input.radio') + ' ' + ((node.checked)? getString('JAWS.output.input.checkbox.checked') : getString('JAWS.output.input.checkbox.unchecked'))
            case 'range':
                //return getString('JAWS.output.input.range')
            case 'reset':
                //return getString('JAWS.output.button') // TODO: get reset button text
            case 'submit':
                //return getString('JAWS.output.button') // TODO: get submit button text
                */
            default:
                return ''
                //return getString('JAWS.output.input.text') + ' ' + ((node.autocomplete != 'off')? getString('JAWS.output.input.text.autocomplete') : '')
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
            /*
            case 'AREA':
                //return node.alt
            */
            case 'IMG':
                if (node.alt) {
                    return node.alt
                }
                return outputHelper.getFileNameFromPath(node.src)
            /*
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
            */
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
    function getJawsAriaLandmarkText(role)
    {
        switch (role.toUpperCase()) {
            /*
            case 'BANNER':
                //return getString('JAWS.output.header')
            case 'COMPLEMENTARY':
                //return getString('JAWS.output.aside')
            case 'CONTENTINFO':
                //return getString('JAWS.output.footer')
            case 'FORM':
                //return getString('JAWS.output.form')
            case 'MAIN': 
                //return getString('JAWS.output.main')
            case 'NAVIGATION':
                //return getString('JAWS.output.nav')
            case 'SEARCH':
                //return getString('JAWS.output.search')
            case 'APPLICATION':
                //return '' // ???
            */
            default:
                return ''
        }
    }
    
    /** @public
     * Language changes don't generate ANY textual output in JAWS
     */
    function getJawsLangChangeText(currentLang, newLang) {
        return ''
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