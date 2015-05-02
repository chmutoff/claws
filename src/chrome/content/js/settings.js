
function toggleClawsPrefs(event, menulist)
{
    if (menulist.value == 'CLAWS' ) {
        document.getElementById('quote').disabled = false
        document.getElementById('address').disabled = false
    }
    else {
        document.getElementById('quote').disabled = true
        document.getElementById('address').disabled = true
    }
}