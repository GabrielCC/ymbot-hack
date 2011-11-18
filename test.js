var yahoo = require('./yahoo.js');
var parser = require('./parser.js');
var fs = require('fs');
var messager = require('./message.js');


fs.readdir('./rules', function(err, files) {
	for(var i in files) {
		var rule = require('./rules/' + files[i]);
		rule.applyRule(parser, yahoo);
	}
});


yahoo.setCallback(function(_message) {
   if (_message.message) {
           //console.log(message.message.sender + ': ' + message.message.msg);
	   var _messager = messager.createUser(_message.message.sender, yahoo);
           parser.parse(_messager, _message.message.msg);
        }
});
yahoo.login();
//yahoo.sendMessage('gabriel_croitoru11', 'alt test pe aici');
