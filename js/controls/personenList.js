define([ 'jquery', 'knockout-unobtrusive', 'persoonRepository' ], function($, ko, persoonRepository) {
    'use strict';

	function PersonenListViewModel(persoonId) {
		var self = this;

        this.personen = ko.observableArray();
        this.currentPersoonId = persoonId;
        
        this.addPersoon = function(persoon, active) {
            persoon.getNaam = function() {
                return persoon.get('voornaam') + ' ' + persoon.get('achternaam');
            };
            
            persoon.getLink = function() {
                return "#!/persoon/" + persoon.id;
            };
            
            persoon.isActive = ko.observable(active);
            
            self.personen.push(persoon);
        };
        
        this.toggleActivePerson = function(currentId, newId) {
            
            ko.utils.arrayForEach(self.personen(), function(persoon){
                
                if(persoon.id === currentId) {
                    persoon.isActive(false);
                }
                
                if(persoon.id === newId) {
                    persoon.isActive(true);
                }
            });
        };
        
        this.update = function(persoonId) {
            // inladen van personen via callback
            if(persoonId !== self.currentPersoonId) {
                self.toggleActivePerson(self.currentPersoonId, persoonId); 
                self.currentPersoonId = persoonId;
            }
            
            if(self.personen().length === 0 ) {
                self.personen.removeAll();
                persoonRepository.findAll(function(result) {
                    $.each(result, function(index, persoon) {
                        self.addPersoon(persoon, persoon.id === persoonId);
                    });
                });
            }
        };
        
	}

	return function PersonenListControl(htmlElement, options) {
		var self = this;
		
		this.viewModel = null;
		
		// initialize the data-binding
        htmlElement.find('.persoon').dataBind( { css: {active: 'isActive'}});
        htmlElement.find('li a').dataBind( { text: 'getNaam()', attr: { 'href' : 'getLink()' } });

		// initialize the view-model
		this.viewModel = new PersonenListViewModel(options.persoonId);

		// apply the data-binding
	     // apply the data-bindings
        $.each(htmlElement, function (index, element) {
            ko.applyBindings(self.viewModel, element);
        });
        
        this.update = function(persoonId) {
            self.viewModel.update(persoonId);
        }
	};

});