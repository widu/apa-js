const {app, BrowserWindow } = require('electron');
const fs = require('fs');

let mainWindow = null;

app.on('ready', () => {
    let mainWindow = new BrowserWindow({
        x: "200px", 
        y: "150ppx",
        show: false,
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.loadFile(`${__dirname}/index.html`);

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        file = "/Volumes/Mac SSD/Users/annaraurowicz/graphviz-example/graph3.dot";
        const content = fs.readFileSync(file).toString();
        console.log(content);
        mainWindow.webContents.send('file-opened', file, content);

        //getFileFromUser();
        //mainWindow.webContents.openDevTools();
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    })
})