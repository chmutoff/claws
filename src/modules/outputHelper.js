var EXPORTED_SYMBOLS = ['outputHelper']

const { classes: Cc, interfaces: Ci, utils: Cu } = Components;
const {console} = Cu.import("resource://gre/modules/devtools/Console.jsm", {});

// TODO: Maybe we should make outpuHelper a NameSpace ???

/**
 * Helper object which contains functions for Output modes
 */
var outputHelper = {
    
    /**
     * Counts the number of items in the list
     * 
     * @param {DOM node} list
     * @returns {Integer} number of items in the list
     */
    countListNodes: function(list){
        var count = 0
        var node=list.firstChild
        while (node) {
            // do not count: <!-- <li><a href=".">Home</a></li> -->
            if (node.nodeType == 1) {
                ++count
            }            
            node = node.nextSibling
        }
        return count
    },
    
    countItemPositionInList: function(node){
        var count = 0
        while(node)
        {
            // do not count: <!-- <li><a href=".">Home</a></li> -->
            if (node.nodeType == 1) {
                ++count
            }            
            node = node.previousSibling
        }
        return count
    },
    
    /**
     * Counts number of rows in a table
     *
     * @param {DOM Node} table
     * @returns {Integes} nubmer of rows in a table
     */
    getNumRowsInTable: function(table){
        return table.rows.length
    },
    
    /**
     * Counts number of columns in a table
     *
     * @param {DOM Node} table
     * @returns {Integer} number of columns in a table
     */
    getNumColumnsInTable: function(table){
        if (table.rows.length > 0) {
            return table.rows[0].cells.length
        }
        else return 0
    },

    /**
     * Obtains table heading for current cell
     * Table can have few structures
     *
     * @param {DOM Node} table cell
     * @returns {string} heading for current cell
     */
    getCellHeading: function(node){
        // table -> tr -> td
        if (node.parentNode.rowIndex != 0 && node.parentNode.parentNode.tagName == 'TABLE') {
            return node.parentNode.parentNode.getElementsByTagName('th')[node.cellIndex].textContent
        }
        // table -> tbody|tfoot -> td
        else if (node.parentNode.rowIndex != 0
                && node.parentNode.parentNode.parentNode.tagName == 'TABLE'
                && node.parentNode.parentNode.parentNode.getElementsByTagName('th').length > 0 
                && node.parentNode.parentNode.parentNode.getElementsByTagName('th').length > node.cellIndex) {
            //console.log("cell index " + node.cellIndex + " debug: "+node.parentNode.parentNode.parentNode.getElementsByTagName('th').length)
            return node.parentNode.parentNode.parentNode.getElementsByTagName('th')[node.cellIndex].textContent
        } else return ''
    },
    
    getHorizontalHeading : function(node){
        var heading = node.parentElement.firstChild
        if (heading.tagName.toUpperCase() == 'TH') {
            return heading.textContent
        }
        else return ''
    },
    
    getFileNameFromPath(path){
        return path.substring(path.lastIndexOf('/')+1, path.lastIndexOf('.'))
    }
    
}