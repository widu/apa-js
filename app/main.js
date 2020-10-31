const {app, BrowserWindow, ipcMain, dialog } = require('electron');
const fs = require('fs');

let mainWindow = null;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        x: "250px", 
        y: "200ppx",
        show: false,
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.loadFile(`${__dirname}/index.html`);

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();

        ipcMain.on('run-command', (event, cmd, dot, key) => {
            console.log(cmd) // prints "ping"
        
            if (dot != null) {
        
            var exec = require('child_process').exec
            function Callback(err, stdout, stderr) {
                if (err) {
                    console.log(`exec error: ${err}`);
                    console.log('error koniec');
                    return;
                    }else{
                    console.log(`${stdout}`);
                    // file = "/Users/wdulek001/Documents/ProcessLibrary/FaktsPresentation/res_graph1.dot";
                    file = dot;
                    const content = fs.readFileSync(file).toString();
                    console.log(content);
                    event.reply('file-opened', file, content, key);
                    console.log('key ', key);
                    console.log('success koniec');
                }
            }
        
            console.log(cmd);
                // res = exec('cd /Users/wdulek001/Documents/ProcessLibrary/FaktsPresentation & rdf_process faktspresentation.process', Callback);
                // res = exec('rdf_process /Users/wdulek001/Documents/ProcessLibrary/FaktsPresentation/faktspresentation.process', Callback);
                res = exec(cmd, Callback);
            // event.reply('asynchronous-reply', 'pong')
            } else {
                file = cmd;
                const content = fs.readFileSync(file).toString();
                console.log(content);
                event.reply('file-opened', file, content);
                console.log('success koniec');
            }
        
          });
        

        ipcMain.on('get-file-message', (event, arg) => {
            console.log(arg) // prints "ping"
            const files = dialog.showOpenDialogSync(mainWindow, {
                properties: ['openFile'],
                filters: [
                    {name: 'Dot file', extensions: ['dot']},
                    {name: 'Process file', extensions: ['process']}
                ]     
            });
            event.returnValue = files[0];
            let file = files[0];
            if (arg == 'yes') {
                let content = fs.readFileSync(file).toString();
                console.log(content);
                event.reply('file-opened', file, content);
                console.log('get-file-message success koniec');
            }
          }
        );

        
        // mainWindow.removeMenu();
        
        //mainWindow.webContents.openDevTools();
    });


    mainWindow.on('closed', () => {
        mainWindow = null;
    });
});


