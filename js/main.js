require.config({
    baseUrl: '/js',
    urlArgs: "bust=" + (new Date()).getTime(),
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
        googleDriveService.init();

    }); // end require
};


require(['https://apis.google.com/js/client:plus.js?onload=googleLoaded']);

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

        //app.personenControl = new PersonenListControl($('.personen-tabel'), {}); // geen personen geselecteerd

        app.run('#!/');

    });

});
