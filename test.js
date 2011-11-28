var yahoo = require('./yahoo.js');
var parser = require('./parser.js');
var fs = require('fs');
var messager = require('./message.js');
var restler = require('restler');

fs.readdir('./rules', function(err, files) {
    console.log(files);
	for(var i in files) {
		var rule = require('./rules/' + files[i]);
		rule.applyRule(parser, yahoo);
	}
});


yahoo.setCallback(function(_message) {
   if (_message.message) {
           console.log(_message.message.sender + ': ' + _message.message.msg);
	   var _messager = messager.createUser(_message.message.sender, yahoo);
           parser.parse(_messager, _message.message.msg);
        }
   else if(_message.buddyAuthorize){ 
	yahoo.authorizeBuddy(_message.buddyAuthorize.sender);
   }
});
yahoo.login();
//yahoo.sendMessage('gabriel_croitoru11', 'alt test pe aici');
