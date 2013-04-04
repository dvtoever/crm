define(['jquery'], function ($) {
    'use strict';

    function GoogleDriveService() { }
    
    GoogleDriveService.prototype = new GoogleDriveService();
    
    var gapi;
    var client;
    
    /**
     * Als deze methode wordt aangeroepen is window.gapi beschikbaar 
     */
    GoogleDriveService.prototype.init = function(onReady) {
        console.log('Initializing Google drive API');
        
        gapi = window.gapi;
        client = gapi.client;
        
        handleClientLoad(function() {
            console.log('Google drive client geladen');
            onReady();
        });
    };
    
    /**
     * Zoekt bestanden op je google drive waarin een trefwoord voorkomt
     * 
     * @param queryStr Het trefwoord waarop gezocht moet worden
     * @param onReady Callback functie die het resultaat als array argument mee krijgt
     */
    GoogleDriveService.prototype.search = function(queryStr, onReady) {
        var query = 'fullText contains \'' + queryStr + '\'';
        //var query = 'title contains \'Boerderij\'';
        console.log('Searching Google drive file for: "' + query + '"');

        var request = client.drive.files.list( { 'q' : query } );
        
        request.execute( function(response) {
            if(response.items === undefined && response.code !== 0 ) {
                console.log('Fout bij zoeken in documenten: ' + response.message);
            } else {
                onReady(response.items);
            }
        });
    };

    function handleClientLoad(onReady) {
        var config = {
            'client_id': '576698137512.apps.googleusercontent.com',
            'scope': 'https://www.googleapis.com/auth/drive',
            'immediate' : true
        };
        
        //var apiKey = 'AIzaSyBxIvaXncSc-XLua8Epgxr-gux_5o_-7VU';
        //client.setApiKey(apiKey);
        
        // popup die vraagt om toestemming naar google drive
        gapi.auth.authorize(config, function() {
            // als authorizatie is gedaan, drive client laden
            client.load('drive', 'v2', onReady);
        });
    }
    
    
    return new GoogleDriveService();
});