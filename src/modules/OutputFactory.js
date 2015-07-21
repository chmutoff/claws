var EXPORTED_SYMBOLS = ['OutputFactory']
const { utils: Cu } = Components;
Cu.import('resource://claws/NvdaOutput.js')
Cu.import('resource://claws/ClawsOutput.js')
Cu.import('resource://claws/JawsOutput.js')

/**
 * Factory design pattern is used to generate output text functions
 * for DomWalker depending on selected mode
 *
 * @param {Object} stringBundles -> contains all the stringBudles for all the output modes
 * @param {Object} settings -> contains output settings for each mode
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
                                //TODO: maybe settings shold be passed like settings.clawsSettings
                                textProvider = new ClawsOutput(stringBundles.clawsStringBundle, settings)
                                break
                        case 'JAWS':
                                textProvider = new JawsOutput()
                                break
                }
                return textProvider
        }
}