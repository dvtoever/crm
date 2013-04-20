define( ['jquery', 'knockout-unobtrusive', 'PersonenControl', 'crmService', 'postbox', 'stopBinding' ],
    function($, ko, PersonenControl, crmService, postbox, sb) {
        
        function HomeViewModel(persoonId, updatePersonenCB) {
            var self = this;
            this.currentPersoon = ko.observable(null);
            
            /** Eenmalig initaliseren van de CRM applicatie */
        	crmService.initApplication(function() {
        		var settings = crmService.getSettings();
        		console.log(settings);
        	});
            
        	postbox.subscribe('persoonTopic', function(newValue) {
        		console.log('Vanuit het Home Model: er is iemand anders geselecteerd: ');
                self.currentPersoon(newValue);
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

                    $('.navbar').css('display', '');
                    $('.personenWrapper').css('display', '');

                	htmlElement.find('.personenWrapper').dataBind( { stopBinding : 'true' });
                    htmlElement.find('.persoondetails').dataBind( { visible : 'currentPersoon() !== null'});
                    htmlElement.find('.persoon-naam').dataBind( { text : 'currentPersoon() !== null ? currentPersoon().getNaam() : ""' });
                    htmlElement.find('.edit').dataBind( { attr : { href : 'currentPersoon() !== null ? "#!/edit/" + currentPersoon().id : "#"'} });

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