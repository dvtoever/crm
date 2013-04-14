require.config({
    baseUrl: '/js',
//    urlArgs: "bust=" + (new Date()).getTime(),
    paths: {
        'async': 				'/js/libs/require-async',
        'driveApi': 			'/js/libs/driveApi',
        'sammy': 				'/js/libs/sammy-latest.min',
        'knockout': 			'/js/libs/knockout-2.1.0',
        'postbox' :				'/js/libs/knockout-postbox.min',
        'knockout-unobtrusive': '/js/libs/jquery.unobtrusive-knockout',

        'stopBinding' : 		'/js/customBinding/stopBinding',
        'parse': 				'/js/libs/parse-1.1.8.min',

        'googleDriveService':	'/js/googleDriveService',
        'crmService': 			'/js/crmService',
        'PersonenControl' :		'/js/controls/PersonenList',
        
        'parseService': 		'/js/parseService',
        'persoonRepository': 	'/js/repository/persoonRepository',

    }
});

/**
 * Callback functie aangeroepen wanneer google API klaar is met laden
 */
window.googleLoaded = function() {
    require(['jquery', 'googleDriveService'], function($, googleDriveService) {
        'use strict';

    }); // end require
};


require(['https://apis.google.com/js/client:plus.js?onload=googleLoaded']);

/**
 * Main application.
 * 
 * Zorgt dat de home view wordt geopend
 */
require(['jquery', 'app'],

function($, app) {

    'use strict';


    $(function() {
        console.log('Opening application...');
        window.app = app;

        app.run('#!/');

    });

});
