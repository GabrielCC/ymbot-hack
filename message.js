exports.createUser = function(user_id, yahoo_server) {
	var user = {
		user_id: user_id,
		server: yahoo_server,
		sendMessage: function(message) {
			this.server.sendMessage(this.user_id, message);
		},
		toString: function() {
			return this.user_id;
		}
	};
	return user;
}


