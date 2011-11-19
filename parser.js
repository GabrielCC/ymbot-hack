// Import the optparse script
var COMMAND_CHAR = "\\+";
var COMMAND_STRING = '^' + COMMAND_CHAR + "(\\w*)(.*?)$";
var COMMAND_STRING_SIMPLE = '^' + COMMAND_CHAR + "(\\w*)";
var parser = {
    rules: {},
    help_messages: {},
    on: function(value, message, fn) {
        this.rules[value] = fn;
        this.help_messages[value] = message;
    },
    parse: function(user, message) {
        var regexp = new RegExp(COMMAND_STRING, "gxm");
        var parts = regexp.exec(message);
        if (parts) {
            this.processCommand(user, parts[1], parts[2]);
        }
	else{
	    this.help(user);
	}
	
    },
    processCommand: function(user, command, _args) {
        if (this.rules[command]) {
            this.rules[command](user, _args);
        }
        else {
            this.help(user);
        }
    },
    help: function(user) {
        var _message =  'Nu inteleg ce zici tu acolo\\n';
        _message += 'Raspund la urmatoarele comenzi:';
	_message += '\\n';
        for(var i in this.help_messages) {
            _message +=  this.help_messages[i] + '\\n';
        }
	user.sendMessage(_message);
    }
};
/**
 * Exports section
 */
exports.parse = function(user, message) {
    parser.parse(user, message);
};
exports.on = function(command, message, _function) {
    parser.on(command, message, _function);
};
