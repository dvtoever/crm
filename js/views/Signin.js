define(['jquery', 'knockout-unobtrusive'],

function($, ko) {

    function SigninViewModel() {
        var self = this;

        
        
        
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