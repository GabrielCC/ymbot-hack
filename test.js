var yahoo = require('./yahoo.js');
var parser = require('./parser.js');
var fs = require('fs');
var rest = require('restler');

rest.get('http://www.google.com').on('complete', function(data){
    console.log(data);
});


yahoo.setCallback(function(message) {
   if (message.message) {
           console.log(message.message.sender + ': ' + message.message.msg);
           parser.parse(message.message.msg);
        }
});
yahoo.login();
//yahoo.sendMessage('gabriel_croitoru11', 'alt test pe aici');