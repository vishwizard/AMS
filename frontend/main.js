const {app, BrowserWindow} = require('electron');

const path = require('path');

let mainWindow;

app.on('ready',()=>{
    mainWindow = new BrowserWindow({
        Title:"Goutammi Nityannadana Trust Room Management System",
        width:1200,
        height:800,
        webPreferences:{
            nodeIntegration:true,
        },
    });

    mainWindow.loadFile('index.html');
});

app.on('window-all-closed',()=>{
    if(process.platform!=='darwin') app.quit();
})

