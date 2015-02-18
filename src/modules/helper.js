var EXPORTED_SYMBOLS = ['cleanWhitespace', 'cleanText']

/** Removes useless whitespace text nodes
 * Source: http://reference.sitepoint.com/javascript/Node/normalize 
 * by Alex Vincent
 */

function cleanWhitespace(node) {
    for (var i = 0; i < node.childNodes.length; i++) {
        var child = node.childNodes[i];
        if (child.nodeType == 3 && !/\S/.test(child.nodeValue)) {
            node.removeChild(child);
            i--;
        }
        if (child.nodeType == 1) {
            cleanWhitespace(child);
        }
    }
    return node;
}

/** Cleans an input text by removing all the multiple whitespaces and brakelines
 * Source1: TextFixer (http://www.textfixer.com/tutorials/javascript-line-breaks.php)
 * Source2: MDN Reference (http://www.textfixer.com/tutorials/javascript-line-breaks.php)
 */

function cleanText(text) {
    //Replace all 3 types of line breaks with a space
    text = text.replace(/(\r\n|\n|\r)/gm, " ")

    //Replace all double white spaces with single spaces
    text = text.replace(/\s+/g, " ")

    //Remove whitespace from both ends of a string
    text = text.trim()

    return text;
}