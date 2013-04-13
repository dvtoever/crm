define(['jquery', 'knockout-unobtrusive', 'googleDriveService'],

function($, ko, googleDriveService) {

    function SigninViewModel() {
        var self = this;
        this.foutmelding = ko.observable();
        
        this.login = function() {
        	googleDriveService.waitUntilReady(function(args) {
        		console.log('Klaar met authorize!' + args);
        		if(googleDriveService.isAuthorized()) {
        			console.log('Inloggen akkoord!');

                	window.location = '/#!/home';
        		} else {
        			console.log('Inloggen mislukt');
        			this.foutmelding("Fout tijdens inloggen bij Google");
        		}
        		
        	}, false)
        }
    }

    return function SigninView(htmlElement, args) {
        var self = this;

        this.name = 'Home';
        this.viewModel = null;

        this.init = function() {
            console.log('Signin view init!');

            $.get('/templates/signin.html', function(template) {
                htmlElement.html(template);
                htmlElement.find('.loginButton').dataBind({ click: 'login'}); 

                self.viewModel = new SigninViewModel();
                ko.applyBindings(self.viewModel, htmlElement[0]);
            });
        };

        this.refresh = function(args) {};

    };



});