define( ['jquery', 'knockout-unobtrusive', 'persoonRepository', 'PersonenControl', 'googleDriveService','stopBinding'],
    function($, ko, persoonRepository, PersonenControl, googleDriveService) {
        
        function HomeViewModel(persoonId, updatePersonenCB) {
            var self = this;

            this.refresh = function() {
            	if(updatePersonenCB) {
            		updatePersonenCB();
            	}
            	
            	
            	googleDriveService.handleClientLoad(function(args) {
            		// Folder maken voor opslag documenten
            		googleDriveService.createFolder('crm-documenten', function() {
                		console.log('cb klaar');
                	});
            	}, true);
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