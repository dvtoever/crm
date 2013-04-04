define(['jquery', 'parse'], function ($) {
    'use strict';

    // Parse object wordt op window ingeladen
    var Parse = window.Parse;
    var APPLICATION_ID = 'rRFYmrZZ58KS4bZGMeISdpmHHfXMjzF7VLvwAtTj';
    var JAVASCRIPT_KEY = '3YDomdSh9mnk6leheZf8K0j4B6cuqs2tyX07Ndof';
    
    Parse.initialize(APPLICATION_ID, JAVASCRIPT_KEY);
    
    /**
     * Default constructor
     */
    function PersoonRepository() { }
    
    var repo = new PersoonRepository();
    
    var Persoon = Parse.Object.extend("Persoon");

    /**
     * Opvragen van een lege persoon instance
     */
    repo.persoonInstance = function() {
      var persoon = new Persoon();
      
      persoon.set( {
        voornaam:       null,
        achternaam:     null,
        functie:        null,
        adres:          null,
        trefwoorden:    null
        
      });
      
      
      return persoon;
    };
    
    /**
     * Opslaan van een persoon
     */
    repo.save = function(persoon) {
        console.log('Persoon repository: save');
        
        if(!persoon instanceof Persoon) {
            console.log('Argument "persoon" is geen Persoon object. Gebruik "PersoonRepository.persoonInstance()"');
        } else {
            console.log('saving persoon...');
            
            persoon.save(null, {
                success: function(object) {
                    console.log('opslaan success');
                },
                error: function(model, error) {
                    console.log('fout bij opslaan persoon');
                }
            });
        }
    };
    
    /**
     * Opvragen van alle personen
     */
    repo.findAll = function(callback) {
        console.log('Persoon repository: findAll');
        var result = null;
        var query = new Parse.Query(Persoon);
        query.find({
            success: function(results) {
                console.log("Persoonrepo: successfully retrieved " + results.length + " personen.");
                callback(results);
            },
            error: function(error) {
                console.log('Persoonrepo, fout: ' + error);
                callback(null);
            }
        });
    };
        
    
    return repo;
    
});
    