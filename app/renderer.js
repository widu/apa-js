const {remote, ipcRenderer, shell} = require('electron');
// require('./viz/viz.js');
// require('./viz/full.render.js');

const output = document.getElementById('output');
const dotF = document.getElementById('dot');
const open_dot_file = document.getElementById('open-dot-file');
const button_get_param_1 = document.getElementById('get-param-1');
const button_get_dot_file = document.getElementById('get-dot-file');
const command_name = document.getElementById('command-name');
const command_param_1 = document.getElementById('command-param-1');
const command_param_2 = document.getElementById('command-param-2');
const command_param_3 = document.getElementById('command-param-3');
const dot_file = document.getElementById('dot-file');


var dotFile = '';

ipcRenderer.on('file-opened', (event, file, content) => {
  dotFile = content;
    output.innerText = content;
    dotF.value = content;
    var event = new Event('change');

    // Dispatch it.
    dotF.dispatchEvent(event);

});

const runCommand = document.getElementById('runCommand');
sendCommand = () => {

  let choice = document.getElementById("Choice2").checked;

  

  if (choice == true) {
    ipcRenderer.send('run-command', dot_file.value);
  } else {
    ipcRenderer.send('run-command', command_name.value , command_param_1.value, command_param_2.value, command_param_3.value, dot_file.value);
  }
  
};
runCommand.addEventListener("click", sendCommand);

// pobieranie nazwy pliku

function getFileName( nazwa_pola )  {
  const pole = document.getElementById(nazwa_pola);
  pole.value = ipcRenderer.sendSync('get-file-message', 'ping');
};


button_get_param_1.addEventListener('click', function() { 
    getFileName('command-param-1');
  }
);

open_dot_file.addEventListener('click', function() { 
  getFileName('command-param-1');
}
);

button_get_dot_file.addEventListener('click', function() { 
  getFileName('dot-file');
}
);