define( ['jquery', 'knockout-unobtrusive', 'PersonenControl', 'crmService', 'postbox', 'stopBinding' ],
    function($, ko, PersonenControl, crmService, postbox, sb) {
        
        function HomeViewModel(persoonId, updatePersonenCB) {
            var self = this;
            
            /** Eenmalig initaliseren van de CRM applicatie */
        	crmService.initApplication(function() {
        		var settings = crmService.getSettings();
        		console.log(settings);
        	});
            
        	postbox.subscribe('persoonTopic', function(newValue) {
        		console.log('Vanuit het Home Model: er is iemand anders geselecteerd: ');
        		console.log(newValue.getNaam());
        		console.log(newValue.get('voornaam'));
        	});
        	
        	
            this.refresh = function() {

            }
            
            self.refresh();
        }
        
        return function HomeView(htmlElement, args) {
            var self = this;
            
            this.name = 'Home';
            this.viewModel = null;
            
            this.init = function() {
                console.log('Home view init!');
                
                $.get( '/templates/home.html', function(template) {
                	htmlElement.html(template);

                	htmlElement.find('.personenWrapper').dataBind( { stopBinding : 'true' });
                	
                	window.app.personenControl = new PersonenControl($('.personen-tabel'), {}); // geen personen geselecteerd

                    self.viewModel = new HomeViewModel(args !== undefined ? args.persoonId : {}, window.app.personenControl.update );
                    ko.applyBindings(self.viewModel, htmlElement[0]);
                });
            };
            
            this.refresh = function(args) {
            	self.viewModel.refresh();
            }
        };
   
	});