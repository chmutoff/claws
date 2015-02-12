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
  
  
  _init : function() {
    let application =
      Components.classes["@mozilla.org/fuel/application;1"].getService(Components.interfaces.fuelIApplication);

    this._modePref =
      application.prefs.get("extensions.claws.output.mode");
  },
  
  get mode() { return this._modePref.value; },
  
  openClaws : function(aEvent) {
    //alert('value: ' + ClawsChrome.BrowserOverlay.mode)
    window.open('chrome://claws/content/claws.xul', 'Claws', 'menubar=1,close=1,minimizable=1,scrollbars=1,resizable=1');
  }    
};

// Constructor.
(function() { this._init(); }).
  apply(ClawsChrome.BrowserOverlay);