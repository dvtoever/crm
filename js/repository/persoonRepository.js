define(['jquery', 'parse', 'parseService'], function ($) {
    'use strict';

    // Parse object wordt op window ingeladen
    var Parse = window.Parse;
    var APPLICATION_ID = 'rRFYmrZZ58KS4bZGMeISdpmHHfXMjzF7VLvwAtTj';
    var JAVASCRIPT_KEY = '3YDomdSh9mnk6leheZf8K0j4B6cuqs2tyX07Ndof';
    Parse.initialize(APPLICATION_ID, JAVASCRIPT_KEY);


    /**
     * Default constructor
     */
    function PersoonRepository() {
    }

    var repo = new PersoonRepository();

    var Persoon = Parse.Object.extend("Persoon");
    var Document = Parse.Object.extend("Document");
    var PersoonDocumenten = Parse.Collection.extend({
        model: Document
    });


    /**
     * Opvragen van een lege persoon instance
     */
    repo.persoonInstance = function () {
        var persoon = new Persoon();

        persoon.set({
            voornaam: null,
            achternaam: null,
            functie: null,
            adres: null,
            postcode: null,
            woonplaats: null,
            telefoonnummer: null,
            geboortedatum: null,
            trefwoorden: null,
            fotoUrl: null,
            documenten: new PersoonDocumenten()
        });


        return persoon;
    };

    /**
     * Opslaan van een persoon
     */
    repo.save = function (persoon) {
        console.log('Persoon repository: save');

        if (!persoon instanceof Persoon) {
            console.log('Argument "persoon" is geen Persoon object. Gebruik "PersoonRepository.persoonInstance()"');
        } else {
            console.log('saving persoon...');
            var acl = new Parse.ACL(Parse.User.current());
            acl.setPublicReadAccess(false);
            persoon.setACL(acl);
            persoon.save(null, {
                success: function (object) {
                    console.log('opslaan success');
                },
                error: function (model, error) {
                    console.log('fout bij opslaan persoon');
                }
            });
        }
    };

    /**
     * Opvragen van alle personen
     */
    repo.findAll = function (callback) {
        console.log('Persoon repository: findAll');
        var result = null;
        var query = new Parse.Query(Persoon);
        query.find({
            success: function (results) {
                console.log("Persoonrepo: successfully retrieved " + results.length + " personen.");
                callback(results);
            },
            error: function (error) {
                console.log('Persoonrepo, fout: ' + error);
                callback(null);
            }
        });
    };


    return repo;

});
    