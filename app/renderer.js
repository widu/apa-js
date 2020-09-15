const {remote, ipcRenderer, shell} = require('electron');
// require('./viz/viz.js');
// require('./viz/full.render.js');

const output = document.getElementById('output');
const dotF = document.getElementById('dot');
var dotFile = '';

ipcRenderer.on('file-opened', (event, file, content) => {
  dotFile = content;
    output.innerText = content;
    dotF.value = content;
    var event = new Event('change');

    // Dispatch it.
    dotF.dispatchEvent(event);

});
