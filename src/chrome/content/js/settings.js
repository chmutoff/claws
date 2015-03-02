
function toggleClawsPrefs(event, menulist)
{
    if (menulist.value == 'CLAWS' ) {
        document.getElementById('quote').disabled = false
    }
    else {
        document.getElementById('quote').disabled = true
    }
}