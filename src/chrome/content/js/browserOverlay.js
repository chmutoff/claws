/**
 * ClawsChrome namespace.
 */
if ("undefined" == typeof(ClawsChrome)) {
  var ClawsChrome = {}
}

/**
 * Controls the browser overlay for the Claws extension.
 */
ClawsChrome.BrowserOverlay = {
  openClaws: function(aEvent) {
    window.open('chrome://claws/content/claws.xul', 'claws', 'chrome,menubar,close,minimizable,scrollbars,resizable,width=700,height=450');
  }
}