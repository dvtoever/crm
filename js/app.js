define(['jquery', 'sammy', 'googleDriveService'], function ($, sammy, googleDriveService) {
    'use strict';

    return $.sammy('.view', function () {
        this.title = null;
        this.view = null;

        // #!/
        this.get('/#!/', function(context) {
            console.log('Sammy: openen signin pagina');
            
            if(googleDriveService.isReady() && googleDriveService.isAuthorized()) {
            	console.log('Ingelogd en akkoord, ga verder naar volgende pagina');
            	openView(context, 'Home');

            } else {
            	console.log('Niet ingelogd, gebruik inlog knop');
                openView(context, 'Signin');
            }
        });
        
        this.get('/#!/home', function(context) {
            openView(context, 'Home', {});
        });
        
        this.get('/#!/signin', function(context) {
            openView(context, 'Signin');
        });
        
        this.get('/#!/edit/:persoonId', function(context) {
            openView(context, 'Edit', { persoonId: context.params.persoonId } );
        });

        // before handling each request, set the current hash on the navigation-service
        this.before(function(context) {

        });

        // catch all for unknown routes ('404')
        this.notFound = function(verb, path){
            console.log('route: not-found (verb: ' + verb + ', path: ' + path + ')');

            this.view = null;
            this.swap('<p /><p>Pagina niet gevonden</p>');
        };

        /* openView: open or refresh a view;
                     if the requested view is already open, it is refreshed; otherwise a new view is opened
           arguments:
           - context:  the Sammy.EventContext passed to the route-handler
           - viewName: the name of the view to open or refresh
           - args:     the arguments to pass on to the view
        */
        function openView(context, viewName, args) {
            // if there is a current view, it is the same as requested & it supports refresh: call refresh
            if(context.app.view && context.app.view.name === viewName && context.app.view.refresh) {
                context.app.view.refresh(args);
            }
            // (re)open the view if it exists
            else {
                require(['views/' + viewName], function (View) {
                    context.app.view = new View(context.$element(), args);
                    // if the requested view supports init: call init
                    if (context.app.view.init) {
                        context.app.view.init();
                    }

                    $('html, body').scrollTop(0);
                });
            }
            /* // in all other cases, show an error
            else {
                context.error();
            }*/
        };
    });
});