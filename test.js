var yahoo = require('./yahoo.js');

yahoo.setCallback(function(message) {
   if (message.message) {
           console.log(message.message.sender + ': ' + message.message.msg);
        }
});
yahoo.login();
//yahoo.sendMessage('gabriel_croitoru11', 'alt test pe aici');