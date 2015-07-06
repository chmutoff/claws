/**
 * Disable CLAWS output mode options when different
 * output mode is selected in order to avoid user confussion
 */
function toggleClawsPrefs(event, menulist)
{
    if (menulist.value == 'CLAWS' ) {
        document.getElementById('quote').disabled = false
        document.getElementById('address').disabled = false
        document.getElementById('claws_mode_title').disabled = false
    }
    else {
        document.getElementById('quote').disabled = true
        document.getElementById('address').disabled = true
        document.getElementById('claws_mode_title').disabled = true
    }
}