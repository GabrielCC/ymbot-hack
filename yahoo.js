// trebe schimbat userul,
// parola si numele friendului

var hash = require('./md5.js');
var querystring = require('querystring');
var rest = require('restler');



var yahoo_user = {
    username: 'gabrielassistant',
    password: 'qwaszx110887',
    admin: 'gabriel_croitoru11',
    requestToken: false,
    request_params: false,
    sessionID: false,
    oauth_token: false,
    oauth_signature: false,
    auth_data: false
};
var TOTAL_GET_MESSAGES = 1000;
var presence = '{ }';
var yahoo_key = 'dj0yJmk9c3hOWTNJTnBVbE1UJmQ9WVdrOVltTmlaMWhrTm1jbWNHbzlNVGczT1RrMk1nLS0mcz1jb25zdW1lcnNlY3JldCZ4PTg2';
var yahoo_secret = 'ba2d284216099caa121c1babfbd6e35437a74760';

var captchadata = false;
var captchaword = false;

var yahoo_api = {
    login: 'https://login.yahoo.com/WSLogin/V1/get_auth_token?&login=' + yahoo_user.username + '&passwd=' + yahoo_user.password + '&oauth_consumer_key=' + yahoo_key,
    login_captcha: 'https://login.yahoo.com/WSLogin/V1/get_auth_token?&login=' + yahoo_user.username + '&passwd=' + yahoo_user.password + '&oauth_consumer_key=' + yahoo_key + '&captchadata=' + captchadata + '&captchaword=' + captchaword,
    server: 'http://developer.mesclsenger.yahooapis.com/',
    notification_server: 'http://developer.messenger.yahooapis.com/v1/notifications',
    contacts: 'v1/session?fieldsBuddyList=%2Bgroups',
    presence: 'v1/presence?sid=',

}

if (captchaword) {
    yahoo_api.login = yahoo_api.login_captcha;
}


function randomString(time) {
    var str = time + Math.floor(Math.random() * 1000);
    return hash.md5(str).substr(0, 13);
}

var time = new Date().getTime() / 1000;
time = Math.floor(time);
var oauth_nonce_value = randomString(time);

function oauthCredentials() {
    var url = 'https://api.login.yahoo.com/oauth/v2/get_token';
    url += '?oauth_consumer_key=' + querystring.escape(yahoo_key);
    url += '&oauth_nonce=' + querystring.escape(oauth_nonce_value);
    url += '&oauth_signature=' + yahoo_secret + '%26';
    url += '&oauth_signature_method=PLAINTEXT';
    url += '&oauth_timestamp=' + time;
    url += '&oauth_token=' + (yahoo_user.requestToken);
    url += '&oauth_version=1.0';
    rest.get(url).on('success', function(data) {
        signIn(data);
    }).on('error', errorCallback);
}

var messages_count = 1;
var get_messages_interval;
var start_notifications = -1;

function getMessages() {
    messages_count += 1;
    if (messages_count == TOTAL_GET_MESSAGES) {
        clearInterval(get_messages_interval);
        console.log('by, by');
        process.exit();
    }
    var session_id = yahoo_user.sessionID;
    var url = yahoo_api.notification_server + '?sid=' + session_id + '&seq=' + (start_notifications + 1);
    url = generateCompleteUrl(url);
    url += '&count=100';

    rest.get(url, {
        headers: getJsonHeader()
    }).on('success', function(data) {
        parseResponseMessage(data);
    }).on('error', errorCallback);
}

function parseResponseMessage(data) {
    var response = eval(data);
    if (response.responses.length > 0) {
        start_notifications += response.responses.length;
        var individual_response;
        for (var i in response.responses) {
            individual_response = eval(response.responses[i]);
            if(individual_response.buddyInfo != undefined) {
                continue;
            }
            console.log(individual_response.message.sender + ': ' + individual_response.message.msg );
        }
    }
}

function setSessionIdFromData(data) {
    var params = eval(data);
    var session_id = params.sessionId;
    yahoo_user.sessionID = session_id;
    yahoo_user.oauth_signature = yahoo_secret + '%26' + yahoo_user.request_params.oauth_token_secret;
    yahoo_user.oauth_token = yahoo_user.request_params.oauth_token;
}

function generateCompleteUrl(url) {
    var time = Math.floor(new Date().getTime() / 1000);
    url += '&oauth_consumer_key=' + yahoo_key;
    url += '&realm=yahooapis.com'
    url += '&oauth_nonce=' + randomString(time);
    url += '&oauth_signature=' + yahoo_user.oauth_signature;
    url += '&oauth_signature_method=PLAINTEXT';
    url += '&oauth_timestamp=' + time;
    url += '&oauth_token=' + querystring.escape(yahoo_user.oauth_token);
    url += '&oauth_version=1.0';
    url += '&notifyServerToken=1';

    return url;
}

function getJsonHeader() {
    var header = {
        'Content-Type': 'application/json',
        'charset': 'utf-8'
    };
    return header;
}

function sendPm(user, message) {
    var session_id = yahoo_user.sessionID;
    var url = 'http://developer.messenger.yahooapis.com/v1/message/yahoo/' + user + '?sid=' + session_id;
    
    url = generateCompleteUrl(url);
    error_flag = false;
    var smessage = '{"message" : message}';
    smessage = {
        "message" : message
    };
    rest.post(url, {
        headers: getJsonHeader(),
        data: smessage
    }).on('success', function(data) {
        if (!error_flag) {
            
        }
    }).on('error', errorCallback);

}

function errorCallback(data) {
    console.log(data);
    error_flag = true;
    var error_data = querystring.parse(data, '\n', '=');
    if (error_data['CaptchaUrl']) {
        console.log(error_data['ErrorDescription']);
        captchadata = error_data['CaptchaData'];
        console.log(error_data['CaptchaUrl']);
        readCaptchaWord();
    }
    else {
        console.log(data);
    }
}
var error_flag = false;

function signIn(data) {
    yahoo_user.request_params = querystring.parse(data, '&', '=');

    var time = Math.floor(new Date().getTime() / 1000)
    var oauth_signature = yahoo_secret + '%26' + yahoo_user.request_params['oauth_token_secret'];
    var oauth_token = yahoo_user.request_params['oauth_token'];
    var url = 'http://developer.messenger.yahooapis.com/v1/session';
    url += '?oauth_consumer_key=' + yahoo_key;
    url += '&realm=yahooapis.com'
    url += '&oauth_nonce=' + randomString(time);
    url += '&oauth_signature=' + oauth_signature;
    url += '&oauth_signature_method=PLAINTEXT';
    url += '&oauth_timestamp=' + time;
    url += '&oauth_token=' + querystring.escape(oauth_token);
    url += '&oauth_version=1.0';
    url += '&notifyServerToken=1';
    var header = {
        'Content-Type': 'application/json',
        'charset': 'utf-8'
    };
    error_flag = false;
    rest.post(url, {
        headers: header,
        data: presence
    }).on('complete', function(data) {
        yahoo_user.auth_user_data = eval(data);
        sendPm(yahoo_user.admin, "Hello from NodeJS land");
        get_messages_interval = setInterval(getMessages, 5000);
    }).on('error', errorCallback);
}

function login()  {
    rest.get(yahoo_api.login).on('success', function(data) {
        if (!error_flag) {
            yahoo_user.requestToken = data.replace('RequestToken=', '').replace('\n', '');
            oauthCredentials();
        }
    }).on('error', errorCallback);
}

var stdin = process.openStdin(),
    stdio = process.binding("stdio");

function sendCaptcha() {
    var login_captcha = 'https://login.yahoo.com/WSLogin/V1/get_auth_token?&login=' + yahoo_user.username + '&passwd=' + yahoo_user.password + '&oauth_consumer_key=' + yahoo_key + '&captchadata=' + captchadata + '&captchaword=' + captchaword;
    error_flag = false;
    console.log(login_captcha);
    rest.get(login_captcha).on('complete', function(data) {
        if (!error_flag) {
            yahoo_user.requestToken = data.replace('RequestToken=', '').replace('\n', '');
            //console.log(yahoo_user.requestToken);
            oauthCredentials();
        }
    }).on('error', errorCallback);
}

function readCaptchaWord() {
    captchaword = '';
    stdin.on('keypress', function(chunk, key) {
        if (!captchaword) {
            captchaword = chunk;
        }
        else captchaword += chunk;
        if (chunk == '\n') {
            stdin.removeAllListeners('keypress')
            sendCaptcha();
            return;
        }
    });
}


//exports functionality
//basic login function
exports.login = function() {
    login();
};

/**
 * Send a message
 *
 */
exports.sendMessage = function(user, message) {
    sendPm(user, messenger);
};