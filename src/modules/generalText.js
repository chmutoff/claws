var EXPORTED_SYMBOLS = ['generalText']

var generalText = {
    countListNodes: function(node) {
        return node.childNodes.length
    },    

    getNumRowsInTable: function(table) {
        return table.rows.length
    },

    getNumCellsInTable: function(table) {
        return table.rows[0].cells.length
    },

    getCellHeading: function(node) {
        // table -> tr -> td
        if (node.parentNode.rowIndex != 0 && node.parentNode.parentNode.tagName == 'TABLE') {
            return node.parentNode.parentNode.getElementsByTagName('th')[node.cellIndex].textContent
        }
        // table -> tbody|tfoot -> td
        else if (node.parentNode.rowIndex != 0 && node.parentNode.parentNode.parentNode.tagName == 'TABLE') {
            return node.parentNode.parentNode.parentNode.getElementsByTagName('th')[node.cellIndex].textContent
        } else return ''
    }
}