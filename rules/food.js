var food_restler = require('restler');
var querystring = require('querystring');
var BASE_PATH = 'http://fbam.cgc/';
var ADDED_ORDER_MESSAGE = 'Done. Te anunt cand se face comanda.';


function getList(_user) { 
	food_restler.get(BASE_PATH + 'food/api_meals').on('success', function(data) {
		var meals = JSON.parse(data);
		var _message = 'Lista comenzi deschise';
		for(var i in meals.meals) {
			var meal = meals.meals[i];
			_message += '\\n';
			_message += '#';
			_message +=  meal.meal_id;
			_message += ' ' + meal.meal_title + ' from ' + meal.supplier_name + ': ' + meal.supplier_url;
			var date = new Date(meal.meal_order_dt);
			_message += ' , ' + date.getHours() + ':' + date.getMinutes();
			
		}
        _user.sendMessage(_message);	
	}).on('error', function(data){
		console.log(data);
	});

}
exports.applyRule = function(parser, yahoo) {
	parser.on('add', 'add an item', function(yahoo_user, _args) {
		var add_command = /^ ([0-9]*) (.*)$/;
		var parts = add_command.exec(_args);
		if(parts) {
			var data = {
				meal_id: parts[1],
				text: parts[2],
				ym_id: yahoo_user.user_id
			}			
			food_restler.post(BASE_PATH + 'food/api_orders', {data : data} ).on('success', function(data) {
				yahoo_user.sendMessage(ADDED_ORDER_MESSAGE);
			}).on('error', function(data) {
				console.log(data);
			});
		}
	});

	parser.on('list', 'list all open orders', function(yahoo_user, _args) {
		getList(yahoo_user);		
	});

	parser.on('cancel', 'cancel an item', function(yahoo_user, _args) {
		var delete_command = /^ ([0-9]*)$/;
		var parts = delete_command.exec(_args);
		if(parts) {
			var data = {
				meal_id: parts[1],
				ym_id: yahoo_user.user_id
			}
			var url = BASE_PATH + 'food/api_orders/0';
			console.log(url);
			food_restler.del(url, data).on('success', function(data) {
				console.log(data);
			}).on('error', function(data) {
				console.log(data);
			});
		}		
	});

	parser.on('done', 'mark an order as delivered', function(yahoo_user, _args) {
		console.log(yahoo_user + ' should do ' + _args);		
	});

	parser.on('view', 'view your items', function(yahoo_user, _args) {
		console.log(yahoo_user + ' should do ' + _args);		
	});

}
