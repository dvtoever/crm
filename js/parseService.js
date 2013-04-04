define(['jquery', 'parse'], function ($) {
    'use strict';

    // Parse object wordt op window ingeladen
    var Parse = window.Parse;
    
    var APPLICATION_ID = 'rRFYmrZZ58KS4bZGMeISdpmHHfXMjzF7VLvwAtTj';
    var JAVASCRIPT_KEY = '3YDomdSh9mnk6leheZf8K0j4B6cuqs2tyX07Ndof';
    
    /**
     * Default constructor
     */
    function ParseService() { }
    
    var parseService = new ParseService();
    
    /**
     * Opzetten van Parse
     *
     */
    parseService.init = function() {
        console.log('Running parse service init');
        
        Parse.initialize(APPLICATION_ID, JAVASCRIPT_KEY);
        
        var TestObject = Parse.Object.extend("TestObject");
        var testObject = new TestObject();
        
          testObject.save({foo: "bar"}, {
          success: function(object) {
            $(".success").show();
          },
          error: function(model, error) {
            $(".error").show();
          }
        });
    };
    
        
    

    
    return parseService;
    
});
    