const electron = require('electron')
remote = require('electron').remote;
dialog = remote.dialog;

function selectDirectory()
{
    return dialog.showOpenDialog(electron.BrowserWindow, {properties: ['openDirectory']});
}

// select project path
var selectProjButton = document.getElementById('selectProjButton');
var projPathTextBox = document.getElementById('projPathTextBox');
selectProjButton.onclick = function()
{
    var path = selectDirectory();
    //if (path !== null && path.length !== 0) projPathTextBox.setAttribute('text', path);
    if (path !== null && path.length !== 0) projPathTextBox.text = path;
}