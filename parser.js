// Import the optparse script
var COMMAND_CHAR = "\\+";
var COMMAND_STRING = '^' + COMMAND_CHAR + "(\\w*) (.*)$";
var parser = {
    rules : {},
    on: function(value, fn) {
        this.rules[value] = fn;
    },
    parse: function(message) {
        var regexp = new RegExp(COMMAND_STRING);
        var parts = regexp.exec(message);
        if(parts) {
            this.processCommand(parts[1], parts[2]);
        }
    },
    processCommand: function (command, _args) {
        if( this.rules[command] ) {
            this.rules[command](_args);
        }
        else{
            this.help();
        }
    },
    help: function() {
        console.log('Unpropper use of the commands');
    }
};


/**
 * Exports section
 */
exports.parse = function(message) {
    parser.parse(message);
};

exports.on = function(command, _function) {
    parser.on(command, _function);
};