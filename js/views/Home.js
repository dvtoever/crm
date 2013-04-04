define( ['jquery', 'knockout-unobtrusive', 'persoonRepository'],
    function($, ko, persoonRepository) {
        
        function HomeViewModel(persoonId) {
            var self = this;
            
            
        }
        
        return function HomeView(htmlElement, args) {
            var self = this;
            
            this.name = 'Home';
            this.viewModel = null;
            
            this.init = function() {
                console.log('Home view init!');
                
                $.get( '/templates/home.html', function(template) {
                    htmlElement.html(template);

                    htmlElement.find('.personen-tabel .persoon').dataBind( { css: {active: 'isActive()'}});
                    htmlElement.find('.personen-tabel li a').dataBind( { text: 'getNaam()', attr: { 'href' : 'getLink()' } });

                    self.viewModel = new HomeViewModel(args !== undefined ? args.persoonId : {});
                    ko.applyBindings(self.viewModel, htmlElement[0]);
                });
            };
            
            this.refresh = function(args) {
            }
            
        };
   
   
   
});