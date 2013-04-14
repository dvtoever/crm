define(['jquery', 'parse'], function ($) {
    'use strict';

    // Parse object wordt op window ingeladen
    var Parse = window.Parse;
    var APPLICATION_ID = 'rRFYmrZZ58KS4bZGMeISdpmHHfXMjzF7VLvwAtTj';
    var JAVASCRIPT_KEY = '3YDomdSh9mnk6leheZf8K0j4B6cuqs2tyX07Ndof';

    var user = null;
    
    /**
     * Default constructor
     */
    function ParseService() { }
    
    ParseService.prototype = new ParseService();
    
    /**
     * Aanmelden bij parse. Is per gebruiker slechts 1 maal nodig
     */
    ParseService.prototype.signup = function(username, pass, signupCB) {
    	var user = new Parse.User();
    	user.set('username', 'crm-' + username);
    	user.set('password', pass);
    	
    	user.signUp(null, {
    		success: function(user) {
    			console.log('signup success');
    			signupCB();
    		},
    		error: function(user, error) {
    			console.log('Fout bij signup parse' + error.code + ' ' + error.message)
    			signupCB();
    		}
    	});
    };
    
    
    /**
     * Initialiseren in inloggen bij parse
     */
    ParseService.prototype.initParse = function(user, pass, initParseCB) {
        console.log('Running parse service init');
        Parse.initialize(APPLICATION_ID, JAVASCRIPT_KEY);
        
        var user = 'crm-' + user;
        
        console.log("trying to log in to parse.com : " + user + " - " + pass);
        Parse.User.logIn(user, pass, {
        	success: function(userResult) {
        		user = userResult;
        		console.log('Ingelogd op parse');
        		initParseCB();
        	},
        	error: function(userResult, error) {
        		console.log('Fout bij inloggen op parse.com');
        		initParseCB();
        	}
        });
    };
    

    
    
    return new ParseService();
    
});
    