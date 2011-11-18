var food_restler = require('restler');
var querystring = require('querystring');
var BASE_PATH = 'http://fbam.dev2.zitec.ro/';

function getList(_user) { 
	food_restler.get(BASE_PATH + 'food/api_meals').on('success', function(data) {
		var meals = JSON.parse(data);
		var _message = '';
		for(var i in meals.meals) {
			var meal = meals.meals[i];
			_message +=  meal.meal_id;
			//_message += ' ' + meal.meal_title + ' from ' + meal.supplier_name + '(' + meal.supplier_url + ')';
			//_message += ' ' + meal.meal_order_dt;
			_message += '\n\r';
		}
		console.log(_message.length);
		_user.sendMessage(_message);
	}).on('error', function(data){
		console.log(data);
	});

}
exports.applyRule = function(parser, yahoo) {
	parser.on('add', 'add an item', function(yahoo_user, _args) {
		console.log(yahoo_user.user_id + ' should do ' + _args);		
	});

	parser.on('list', 'list all open orders', function(yahoo_user, _args) {
		getList(yahoo_user);		
	});

	parser.on('cancel', 'cancel an item', function(yahoo_user, _args) {
		console.log(yahoo_user + ' should do ' + _args);		
	});

	parser.on('done', 'mark an order as delivered', function(yahoo_user, _args) {
		console.log(yahoo_user + ' should do ' + _args);		
	});

	parser.on('view', 'view your items', function(yahoo_user, _args) {
		console.log(yahoo_user + ' should do ' + _args);		
	});

}
