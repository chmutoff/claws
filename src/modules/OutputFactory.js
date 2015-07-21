var EXPORTED_SYMBOLS = ['OutputFactory']
const { utils: Cu } = Components;
Cu.import('resource://claws/NvdaOutput.js')
Cu.import('resource://claws/ClawsOutput.js')
Cu.import('resource://claws/JawsOutput.js')

/**
 * Factory design pattern is used to generate output text functions
 * for DomWalker depending on selected mode
 *
 * @param {Object} preferences -> contains output settings for each mode
 */
function OutputFactory(preferences){
        /** 
         * Generates an object with text functions for selected output mode
         *
         * @returns {textProvider} 
         */
        this.createTextProvider = function(mode){
                var textProvider = {}    
                switch (mode) {
                        case 'NVDA':
                                textProvider = new NvdaOutput()
                                break
                        case 'CLAWS':
                                //TODO: maybe settings shold be passed like settings.clawsSettings
                                textProvider = new ClawsOutput(preferences)
                                break                        
                        case 'JAWS':
                                textProvider = new JawsOutput()
                                break
                }
                return textProvider
        }
}