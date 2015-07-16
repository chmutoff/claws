var EXPORTED_SYMBOLS = ['OutputFactory']
Components.utils.import('resource://claws/NvdaOutput.js')
Components.utils.import('resource://claws/ClawsOutput.js')

/**
 * Factory design pattern is used to generate output text functions for DomWalker
 *
 * @param {Object} stringBundles -> contains all the stringBudles for all the output modes   
 */
function OutputFactory(stringBundles, settings){
        /** 
         * Generates an object with text functions for selected output mode
         *
         * @returns {textProvider} 
         */
        this.createTextProvider = function(mode){
                var textProvider = {}    
                switch (mode) {
                        case 'NVDA':
                                textProvider = new NvdaOutput(stringBundles.nvdaStringBundle)
                                break
                        case 'CLAWS':
                                textProvider = new ClawsOutput(stringBundles.clawsStringBundle, settings)
                                break                        
                }
                return textProvider
        }
}