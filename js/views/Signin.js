define(['jquery', 'knockout-unobtrusive', 'googleDriveService'],

function($, ko, googleDriveService) {

    function SigninViewModel() {
        var self = this;

        if(googleDriveService.isReady() && googleDriveService.isAuthorized()) {
        	console.log('Ingelogd en akkoord, ga verder naar volgende pagina');
        } else {
        	console.log('Niet ingelogd, gebruik inlog knop');
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