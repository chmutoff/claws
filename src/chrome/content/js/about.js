function getversion() {
    Components.utils.import("resource://gre/modules/AddonManager.jsm");
    AddonManager.getAddonByID("claws@alicante.university.project", function(addon) {
        // This is an asynchronous callback function that might not be called immediately
        let version = "Claws v" + addon.version
        let versionElement = document.getElementById('claws-version')
        versionElement.appendChild(document.createTextNode(version))
    });
}