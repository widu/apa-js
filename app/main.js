const {app, BrowserWindow, ipcMain, dialog } = require('electron');
const fs = require('fs');

let mainWindow = null;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
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

        ipcMain.on('run-command', (event, c, a1, a2, a3, dot) => {
            console.log(c, a1, a2, a3) // prints "ping"
        
            if (a1 != null) {
        
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
                    event.reply('file-opened', file, content);
                    console.log('success koniec');
                }
            }
        
            const cmd = c + ' ' + a1 + ' ' + a2 + ' "' + a3.replace(/\n/g, " "); + '"';
            console.log(cmd);
                // res = exec('cd /Users/wdulek001/Documents/ProcessLibrary/FaktsPresentation & rdf_process faktspresentation.process', Callback);
                // res = exec('rdf_process /Users/wdulek001/Documents/ProcessLibrary/FaktsPresentation/faktspresentation.process', Callback);
                res = exec(cmd, Callback);
            // event.reply('asynchronous-reply', 'pong')
            } else {
                file = c;
                const content = fs.readFileSync(file).toString();
                console.log(content);
                event.reply('file-opened', file, content);
                console.log('success koniec');
            }
        
          });
        

        ipcMain.on('get-file-message', (event, arg) => {
            console.log(arg) // prints "ping"
            // const files = dialog.showOpenDialogSync(mainWindow, {
            //     properties: ['openFile'],
            //     filters: [
            //         {name: 'Dot file', extensions: ['dot']}
            //     ]     
            // });
            event.returnValue = 'pong';
          }
        );

        
        // mainWindow.removeMenu();

        // ************************************8
        // var exec = require('child_process').exec
        // function Callback(err, stdout, stderr) {
        // if (err) {
        //     console.log(`exec error: ${err}`);
        //     console.log('error koniec');
        //     return;
        //     }else{
        //     console.log(`${stdout}`);
        //     file = "/Users/wdulek001/Documents/ProcessLibrary/FaktsPresentation/res_graph1.dot";
        //     const content = fs.readFileSync(file).toString();
        //     console.log(content);
        //     mainWindow.webContents.send('file-opened', file, content);
        //     console.log('success koniec');
        //     }
        // }

        // res = exec('cd /Users/wdulek001/Documents/ProcessLibrary/FaktsPresentation & rdf_process faktspresentation.process', Callback);
        //****************************************************** */
        
        //getFileFromUser();
        //mainWindow.webContents.openDevTools();
    });


    mainWindow.on('closed', () => {
        mainWindow = null;
    });
});


