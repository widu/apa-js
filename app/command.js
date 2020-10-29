const MD5 = require("crypto-js/md5");

function Command() {
    this.dot_file_content = "";
};

Command.prototype.initialByKey = function(key) {
    this.key = key;
    // this.dot_file_content = dot_file_content;
}

Command.prototype.update = async function(db, dot_file_content, isRunning) {
    this.dot_file_content = dot_file_content;
    this.isRunning = isRunning;
    let ret = '';
    await db.get(this.key).then((ret_success)=> {
        console.log('ret_success',ret_success);
        if (ret_success != null) {
            ret = ret_success;
        } ;
    });
    this.command_name = ret.command_name;
    this.command_param_1 = ret.command_param_1;
    this.command_param_2 = ret.command_param_2;
    this.command_param_3 = ret.command_param_3;
    this.dot_file = ret.dot_file;
    this.save(db, isRunning);
};

Command.prototype.initialByProperties = function(command_name, command_param_1, command_param_2='', command_param_3 = '', dot_file='') {
    this.command_name = command_name;
    this.command_param_1 = command_param_1;
    this.command_param_2 = command_param_2;
    this.command_param_3 = command_param_3;
    this.dot_file = dot_file;
    this.is_saved = null;
    this.cmdGen();
    this.keyGen();
};

Command.prototype.keyGen = function() {
    this.key = MD5(this.cmd).toString();
};

Command.prototype.cmdGen = function() {
    let para2_param3 = "";
    if (this.command_param_2 != '') {
        para2_param3 =  this.command_param_2+ ' "' + this.command_param_3.replace(/\n/g, " ") + '"'
    } 
    this.cmd = this.command_name + ' "' + this.command_param_1 + '" ' + para2_param3;
};

Command.prototype.getReport = function() {
    console.log('Command: ', this.cmd )
};

Command.prototype.save = function(db, isRunning) {
    let cmd = {
        "command_name":  this.command_name,
        "command_param_1": this.command_param_1,
        "command_param_2": this.command_param_2,
        "command_param_3": this.command_param_3,
        "dot_file":  this.dot_file,
        "dot_file_content": this.dot_file_content,
        "isRunning": isRunning,
        "date": Date.now()
    };
    db.set(this.key, cmd);
};

Command.prototype.runCommand = async function(db, fn) {
    let ret = '';
    await db.get(this.key).then((ret_success)=> {
        console.log('ret_success',ret_success);
        if (ret_success != null) {
            ret = ret_success;
        } ;
    });
    console.log('ret ', ret);
    this.is_saved = true;
    fn(ret);
};

exports.Command = Command ;