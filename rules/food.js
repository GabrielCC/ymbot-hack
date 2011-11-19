var food_restler = require('restler');
var querystring = require('querystring');
var BASE_PATH = 'http://fbam.dev2.zitec.ro/';

var ADDED_ORDER_MESSAGE = 'Done. Te anunt cand se face comanda.';
var DONE_MESSAGE = 'Am notat ca sa livrat comanda. O sa anunt pe toata lume.';
var ERROR_MESSAGE_LIST = 'Am probleme sa preiau lista de mese. Poti sa intri aici ' + BASE_PATH;
var ERROR_MESSAGE_ADD = 'N-am reusit sa-ti adaug comanda. Poti sa mai incerci sau sa dai de pe web ' + BASE_PATH;
var ERROR_MESSAGE_CANCEL = 'N-am reusit sa-ti anulez comanda. Poti sa mai incerci sau sa o anulezi de pe web ' + BASE_PATH;
var ERROR_MESSAGE_DONE = 'N-am reusit sa inchid comanda. Poti sa mai incerci sau sa o inchizi de pe web ' + BASE_PATH;
var ERROR_MESSAGE_VIEW = 'N-am reusit sa vad ce ai comandat azi. Poti sa mai incerci sau sa verfici pe web ' + BASE_PATH;

function headers(user) {
	return {
		'ym_id' : user.user_id
	}
}
function getList(_user) { 
	food_restler.get(BASE_PATH + 'food/api_meals', {headers: headers(_user)}).on('success', function(data) {
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
		_user.sendMessage(ERROR_MESSAGE_LIST);
	});

}
exports.applyRule = function(parser, yahoo) {
	parser.on('add', '+add number text  |: comandati de mancare', function(yahoo_user, _args) {
		var add_command = /^ ([0-9]*) (.*)$/;
		var parts = add_command.exec(_args);
		if(parts) {
			var data = {
				meal_id: parts[1],
				text: parts[2],
				ym_id: yahoo_user.user_id
			}			
			food_restler.post(BASE_PATH + 'food/api_orders', {
					data : data, 
					headers: headers(yahoo_user)} ).on('success', function(data) {
				yahoo_user.sendMessage(ADDED_ORDER_MESSAGE);
			}).on('error', function(data) {
				yahoo_user.sendMessage(ERROR_MESSAGE_ADD);
			});
		}
	});

	parser.on('list', '+list |: vezi cine si ce comanda', function(yahoo_user, _args) {
		getList(yahoo_user);		
	});

	parser.on('cancel', '+cancel numar  |: te-ai razgandit, anuleaza o comanda', function(yahoo_user, _args) {
		var delete_command = /^ ([0-9]*)$/;
		var parts = delete_command.exec(_args);
		if(parts) {
			var data = {
				'meal_id': parts[1],
				'ym_id': yahoo_user.user_id
			}
			var url = BASE_PATH + 'food/api_orders/1';
			food_restler.del(url,  {headers : data} ).on('success', function(data) {
				yahoo_user.sendMessage(USER_CANCEL_ORDER);
			}).on('error', function(data) {
				yahoo_user.sendMessage(ERROR_MESSAGE_CANCEL);
			});
		}		
	});

	parser.on('done', '+done numar  |: a venit mancarea, anunta pe toata lumea', function(yahoo_user, _args) {
		var regexp = /^ ([0-9]*)$/;
		var parts = regexp.exec(_args);
		if( parts ) {
		var url = BASE_PATH + 'food/api_meals/' + parts[1];
		var data = {
			status: 'done'
		}
		food_restler.post(url, {data:data, headers:headers(yahoo_user)}).on('success', function(data) {
			yahoo_user.sendMessage(DONE_MESSAGE);
		}).on('error', function(data) {
			yahoo_user.sendMessage(ERROR_MESSAGE_DONE);
		});
		}
	});

	parser.on('view', '+view  |: vezi ce comanzi azi', function(yahoo_user, _args) {
		food_restler.get(BASE_PATH + 'food/api_orders', {
				headers: headers(yahoo_user)} ).on('success', function(data) {
			var orders = JSON.parse(data);
			orders = orders.orders;
			var message = 'Comenzile tale actuale:';
			for(var i in orders) {
				message += '\\n#';
				message += orders[i].meal_id + ' - ' + orders[i].text.replace('\n', '\\n');
			}
			yahoo_user.sendMessage(message);
		}).on('error', function(data) {
			yahoo_user.senddMessage(ERROR_MESSAGE_VIEW);
		});
	});

}
