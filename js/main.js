require.config({
    baseUrl: '/js',
    //urlArgs: "bust=" + (new Date()).getTime(),
    paths: {
        'async': '/js/libs/require-async',
        'driveApi': '/js/libs/driveApi',
        'sammy': '/js/libs/sammy-latest.min',
        'knockout': '/js/libs/knockout-2.1.0',
        'knockout-unobtrusive': '/js/libs/jquery.unobtrusive-knockout',

        'parse': '/js/libs/parse-1.1.8.min',

        'googleDriveService': '/js/googleDriveService',
        'parseService': '/js/parseService',
        'persoonRepository': '/js/repository/persoonRepository',

    }
});

/**
 * Callback functie aangeroepen wanneer google API klaar is met laden
 */
window.googleLoaded = function() {
    require(['jquery', 'googleDriveService', 'persoonRepository'], function($, googleDriveService, repo) {
        'use strict';

        // google api is geladen
        googleDriveService.init(zoekKavel);

        function zoekKavel() {
            // zoek documenten met term 'kavel'
            // googleDriveService.search('kavel', function(items) {
            //     for(var i = 0; i < items.length; i++ ) {
            //         var item = items[i];
            //         var titel = item.title;
            //         
            //         console.log('Document: ' + titel );
            //     }
            // });
        }

    }); // end require
};

window.helper = function(authResult) {
    var BASE_API_PATH = 'plus/v1/';

    return {
        /**
         * Hides the sign in button and starts the post-authorization operations.
         *
         * @param {Object} authResult An Object which contains the access token and
         *   other authentication information.
         */
        onSignInCallback: function(authResult) {
            gapi.client.load('plus', 'v1', function() {
                $('#authResult').html('Auth Result:<br/>');
                for (var field in authResult) {
                    $('#authResult').append(' ' + field + ': ' + authResult[field] + '<br/>');
                }
                if (authResult['access_token']) {
                    $('#authOps').show('slow');
                    $('#gConnect').hide();
                    helper.profile();
                    helper.people();
                }
                else if (authResult['error']) {
                    // There was an error, which means the user is not signed in.
                    // As an example, you can handle by writing to the console:
                    console.log('There was an error: ' + authResult['error']);
                    $('#authResult').append('Logged out');
                    $('#authOps').hide('slow');
                    $('#gConnect').show();
                }
                console.log('authResult', authResult);
            });
        },

        /**
         * Calls the OAuth2 endpoint to disconnect the app for the user.
         */
        disconnect: function() {
            // Revoke the access token.
            $.ajax({
                type: 'GET',
                url: 'https://accounts.google.com/o/oauth2/revoke?token=' + gapi.auth.getToken().access_token,
                async: false,
                contentType: 'application/json',
                dataType: 'jsonp',
                success: function(result) {
                    console.log('revoke response: ' + result);
                    $('#authOps').hide();
                    $('#profile').empty();
                    $('#visiblePeople').empty();
                    $('#authResult').empty();
                    $('#gConnect').show();
                },
                error: function(e) {
                    console.log(e);
                }
            });
        }



    };
}();

require(['https://apis.google.com/js/client.js?onload=googleLoaded']);

/**
 * Main application.
 * 
 * Zorgt dat de home view wordt geopend
 */
require(['jquery', 'app', 'controls/personenList'],

function($, app, PersonenListControl) {

    'use strict';


    $(function() {
        console.log('Opening application...');
        window.app = app;

        app.personenControl = new PersonenListControl($('.personen-tabel'), {}); // geen personen geselecteerd

        app.run('#!/');

    });

});
