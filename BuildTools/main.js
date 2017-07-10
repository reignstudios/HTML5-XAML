const fs = require('fs')
const path = require('path')

const electron = require('electron')
remote = require('electron').remote;
dialog = remote.dialog;

function selectDirectory()
{
    var path = dialog.showOpenDialog(electron.BrowserWindow, {properties: ['openDirectory']});
    if (path === undefined || path.length === 0) path = null;
    else path = path[0];
    return path;
}

function loadHTML(path, elementFoundCallback, doneCallback)
{
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function()
    {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200)
        {
            var parser = new DOMParser();
            var responseDoc = parser.parseFromString (xmlhttp.responseText, "text/html");
            for (var element of responseDoc.querySelectorAll( 'body *' ))
            {
                if (element.id && elementFoundCallback !== null) elementFoundCallback(element);
            }

            if (doneCallback !== null) doneCallback();
        }
    }

    xmlhttp.open("GET", path);
    xmlhttp.send();
}

// select project path
var selectProjButton = document.getElementById('selectProjButton');
var compileButton = document.getElementById('compileButton');
var projPathTextBox = document.getElementById('projPathTextBox');

selectProjButton.onclick = function()
{
    var path = selectDirectory();
    if (path !== null) projPathTextBox.text = path;
}

function generateCodeBehind(rootPath, type)
{
    for (var p of fs.readdirSync(rootPath))
    {
        // get path info
        var fullPath = rootPath + '\\' + p;
        result = fs.statSync(fullPath);

        // scan sub directory
        if (result.isDirectory())
        {
            generateCodeBehind(fullPath, type);
            continue;
        }

        // generate code behind if html file
        var ext = path.extname(p);
        if (ext === '.html' || ext === '.htm')
        {
            var file = fs.createWriteStream(fullPath + type);
            if (type === '.cs')
            {
                var name = p.substring(0, p.lastIndexOf('.')).replace('.', '_');
                file.write(`namespace UI\n{\n\tpartial class ${name}\n\t{\n`);
            }

            loadHTML(fullPath, function(element)
            {
                if (type === '.js') file.write(`const ${element.id} = document.getElementById('${element.id}');\n`);
                else if (type === '.ts') file.write(`const ${element.id}: HTMLElement = document.getElementById('${element.id}');\n`);
                else if (type === '.cs') file.write(`\t\treadonly HTMLElement ${element.id} = Document.GetElementById<HTMLElement>("${element.id}");\n`);
                else
                {
                    console.error('Unsuported type: ' + type);
                    return;
                }
            }, function()
            {
                if (type === '.cs') file.write('\t}\n}');
                file.end();
            });
        }
    }
}

compileButton.onclick = function()
{
    try
    {
        // validate path
        var projPath = projPathTextBox.text;
        var result = fs.statSync(projPath);
        if (result === null || !result.isDirectory())
        {
            alert('Folder doesnt exists: ' + projPath);
            return;
        }

        // scan .html / .htm files
        generateCodeBehind(projPath, '.js');
    }
    catch (e)
    {
        alert(e);
    }
}