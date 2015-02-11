/**
 * ClawsChrome namespace.
 */
if ("undefined" == typeof(ClawsChrome)) {
  var ClawsChrome = {};
};

/**
 * Controls the browser overlay for the Claws extension.
 */
ClawsChrome.BrowserOverlay = {
  openClaws : function(aEvent) {
    window.open('chrome://claws/content/claws.xul', 'Claws', 'menubar=1,close=1,minimizable=1,scrollbars=1,resizable=1');
  }    
};
