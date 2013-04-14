define([ 'jquery', 'knockout-unobtrusive', 'persoonRepository', 'postbox' ], 
function($, ko, persoonRepository, postbox) {
    'use strict';

	function PersonenListViewModel(persoonId) {
		var self = this;

        this.personen = ko.observableArray();
        this.currentPersoon = ko.observable().syncWith('persoonTopic');

        /** Helper functie om parse personen te verrijken */
        this.addPersoon = function(persoon, active) {
            persoon.getNaam = function() {
                return persoon.get('voornaam') + ' ' + persoon.get('achternaam');
            };
            
            persoon.isActive = ko.observable(active);
            self.personen.push(persoon);
        };
        
        /** Actief geselecteerde persoon omwisselen */
        this.toggleActivePerson = function(newPersoon) {
            ko.utils.arrayForEach(self.personen(), function(persoon){
                if(persoon.id !== newPersoon.id) {
                    persoon.isActive(false);
                }
                if(persoon.id === newPersoon.id) {
                    persoon.isActive(true);
                    self.currentPersoon(newPersoon);
                }
            });
        };
        
        /** Toevoegen nieuw persoon aan CRM */
        this.persoonToevoegen = function() {
			var nieuwPersoon = persoonRepository.persoonInstance();
			nieuwPersoon.set('voornaam', 'Nieuw');
			nieuwPersoon.set('achternaam', 'Persoon');
			
			persoonRepository.save(nieuwPersoon);
			
			self.addPersoon(nieuwPersoon);
			self.toggleActivePerson(nieuwPersoon);
        };
        
        /* Initieel inladen van personen uit parse */ 
        if(self.personen().length === 0 ) {
            self.personen.removeAll();
            persoonRepository.findAll(function(result) {
                $.each(result, function(index, persoon) {
                    self.addPersoon(persoon, persoon.id === persoonId);
                });
            });
        }
        

        /** Bijwerken van view */
        this.update = function(persoonId) {

        };
        
	}

	return function PersonenListControl(htmlElement, options) {
		var self = this;
		
		this.viewModel = null;
		
		// initialize the data-binding
        htmlElement.find('.persoon').dataBind( { css: {active: 'isActive'}});
        htmlElement.find('li a').dataBind( { text: 'getNaam()', click: '$parent.toggleActivePerson' });
        htmlElement.find('.btn').dataBind( { click: 'persoonToevoegen' });
        
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