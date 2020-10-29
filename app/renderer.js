const {Command} = require('./command');
const {cmdDB} = require('./database');
const {paginator} = require('./paginator');
const MD5 = require("crypto-js/md5");
const {remote, ipcRenderer, shell} = require('electron');
const { watchFile } = require('fs');
const { waitForDebugger } = require('inspector');
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
const operation_def = document.getElementById('operation-def');
let indexes = [];



let command2 = new Command();
command2.initialByProperties('rdf_process', 'dupa');
command2.save(cmdDB, false);
const fn1 = function (p1) {
  console.log('p1: ', p1);
};
// command2.isSaved(cmdDB, fn1);
console.log('index: ', cmdDB.allKeysFromIndex('date')); 


var dotFile = '';
console.log('md5: ', MD5('test').toString());
console.log(cmdDB);
let ret = cmdDB.set('command3', 'rezultata command 3');
console.log('database set: ',ret);
console.log(cmdDB.get('command2'));

ipcRenderer.on('file-opened', (event, file, content, key="") => {
  dotFile = content;
  output.innerText = content;
  dotF.value = content;
  var event = new Event('change');
  operation_def.innerHTML = file.match(/\w+.\w+$/);
    // Dispatch it.
  dotF.dispatchEvent(event);
  console.log('key ', key);
  if (key != "") {
    alert('command will be updated');
    const command3 = new Command();
    command3.initialByKey(key);
    command3.update(cmdDB, content, false);
    updatePaginator(); 
  };
});

const runCommand = document.getElementById('runCommand');
sendCommand = () => {

  // console.log(Command);
  let command1 = new Command();
  command1.initialByProperties(command_name.value , command_param_1.value, command_param_2.value, command_param_3.value, dot_file.value);
  console.log(command1.getReport());
  // command2.isSaved(cmdDB);

  let runCmdFnc = function(cmd_obj) {
    let choice = document.getElementById("Choice2").checked;
    if (choice == true) {
      ipcRenderer.send('run-command', dot_file.value);
    } else {
      if (cmd_obj != '') { 
        console.log('jest w bazie');
        // alert('jest w bazie');
        if (cmd_obj.isRunning == true) {
          alert('is already running');
          return null;
        };
        answer = confirm('Wynik polecenia jest w bazie. Czy polecenie wykonać ponownie?');
        if (answer) {
          //some code
          ipcRenderer.send('run-command', command1.cmd , dot_file.value, command1.key);
          command1.save(cmdDB, true);
        } else {
          output.innerText = cmd_obj.dot_file_content;
          dotF.value = cmd_obj.dot_file_content;
          var event = new Event('change');
          dotF.dispatchEvent(event);
        }
      } 
      else { 
        ipcRenderer.send('run-command', command1.cmd , dot_file.value, command1.key);
        command1.save(cmdDB, true);
      }
  };
    
  };

  command1.runCommand(cmdDB, runCmdFnc);
  
};

runCommand.addEventListener("click", sendCommand);

// pobieranie nazwy pliku

function getFileName( nazwa_pola, render = 'no' )  {
  const pole = document.getElementById(nazwa_pola);
  pole.value = ipcRenderer.sendSync('get-file-message', render);
};


button_get_param_1.addEventListener('click', function() { 
    getFileName('command-param-1');
  }
);

open_dot_file.addEventListener('click', function() { 
  getFileName('operation-def', 'yes');
}
);

button_get_dot_file.addEventListener('click', function() { 
  getFileName('dot-file');
}
);


// **************** paginator *****************
// pobieranie i wyświetlanie dot z bazy dla historii - pagination
function updatePaginator () {
  cmdDB.allKeysFromIndex('date').then((ret_success)=> {
    paginator.index = ret_success;
    console.log('ret_success', ret_success);
    console.log('paginator.indexes ', paginator.indexes);
  
    paginator.drawPaginator(document.getElementById('paginator'), function(key) {
      const command = new Command();
      command.initialByKey(key);
      command.runCommand(cmdDB, function(cmd_obj) {
        command_name.value = cmd_obj.command_name;
        command_param_1.value = cmd_obj.command_param_1;
        command_param_2.value = cmd_obj.command_param_2;
        command_param_3.value = cmd_obj.command_param_3;
        dot_file.value = cmd_obj.dot_file;
        output.innerText = cmd_obj.dot_file_content;
        dotF.value = cmd_obj.dot_file_content;
        var event = new Event('change');
        dotF.dispatchEvent(event);
      });
    });
  
  });
};

updatePaginator(); 




