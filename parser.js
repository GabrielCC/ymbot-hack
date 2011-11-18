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
            this.process_command(parts[1], _args);
        }
    }
};


// Handle the --include-file switch
parser.on('include-file', function(name, value) {
    options.files.push(value);
});

// Handle the --print switch
parser.on('print', function(name, value) {
    console.log('PRINT: ' + (value || 'No message entered'));
});

// Handle the --date switch
parser.on('date', function(name, value) {
    options.date = value;
});

// Handle the --number switch
parser.on('number', function(name, value) {
    options.number = value;
});

// Handle the --debug switch
parser.on('debug', function() {
    options.debug = true;
});

// Handle the --help switch
parser.on('help', function() {
    console.log(parser.toString());
});


function help() {
    console.log(parser.toString());
}

/**
 * Exports section
 */
exports.parse = function(message) {
    parser.parse(message);
};