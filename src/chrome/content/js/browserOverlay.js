/**
 * ClawsChrome namespace.
 */
if ("undefined" == typeof(ClawsChrome)) {
        var ClawsChrome = {}
}

var windowObjectReference = null;

/**
 * Controls the browser overlay for Claws extension.
 */
ClawsChrome.BrowserOverlay = {
        openClaws: function(event) {
                if(windowObjectReference == null || windowObjectReference.closed)
                /* if the pointer to the window object in memory does not exist
                 or if such pointer exists but the window was closed */
                {
                        windowObjectReference = window.open('chrome://claws/content/claws.xul', 'CLAWS', 'status,menubar,close,minimizable,scrollbars,resizable,chrome,width=700,height=450');
                }
                else
                {
                        windowObjectReference.focus();
                        /* else the window reference must exist and the window
                         is not closed; therefore, we can bring it back on top of any other
                         window with the focus() method. There would be no need to re-create
                         the window or to reload the referenced resource. */
                };
        }
}