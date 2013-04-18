define( ['jquery', 'knockout-unobtrusive', 'PersonenControl', 'crmService', 'postbox', 'stopBinding' ],
    function($, ko, PersonenControl, crmService, postbox, sb) {
        
        function EditViewModel(persoonId, updatePersonenCB) {
            var self = this;

            this.currentPersoon = ko.observable(null);

            if(self.currentPersoon() === null) {
                // load persoon via parse
            }


        	postbox.subscribe('persoonTopic', function(newValue) {
                currentPersoon = newValue;
        		console.log('Vanuit het Edit Model: er is iemand anders geselecteerd: ');
        		console.log(newValue.getNaam());
        		console.log(newValue.get('voornaam'));
        	});

            this.opslaan = function() {

            };

            this.annuleren = function() {
                window.location = "/#!/home";
            }

        	
        	
            this.refresh = function() {

            }
            
            self.refresh();
        }
        
        return function EditView(htmlElement, args) {
            var self = this;
            
            this.name = 'Edit';
            this.viewModel = null;
            
            this.init = function() {
                console.log('Edit view init!');
                
                $.get( '/templates/edit.html', function(template) {
                	htmlElement.html(template);

                	htmlElement.find('.personenWrapper').dataBind( { stopBinding : 'true' });
                	htmlElement.find('.annuleren').dataBind({ click : 'annuleren'} );
                    //htmlElement.find('input[placeholder="achternaam"]').dataBind( { text : '"achterBIND"'});


                    if(window.app.personenControl === undefined ) {
                        window.app.personenControl = new PersonenControl($('.personen-tabel'), {}); // geen personen geselecteerd
                    }

                    self.viewModel = new EditViewModel( );
                    ko.applyBindings(self.viewModel, htmlElement[0]);
                });
            };
            
            this.refresh = function(args) {
            	self.viewModel.refresh();
            }
        };
   
	});