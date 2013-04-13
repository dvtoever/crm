define( ['jquery', 'knockout-unobtrusive', 'persoonRepository', 'PersonenControl', 'crmService','stopBinding'],
    function($, ko, persoonRepository, PersonenControl, crmService) {
        
        function HomeViewModel(persoonId, updatePersonenCB) {
            var self = this;
            
            /** Eenmalig initaliseren van de CRM applicatie */
        	crmService.initApplication(function() {
        		var settings = crmService.getSettings();
        		console.log(settings);
        	});
            
            this.refresh = function() {
	        	if(updatePersonenCB) {
	        		updatePersonenCB();
	        	}
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