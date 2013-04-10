define( ['jquery', 'knockout-unobtrusive', 'persoonRepository', 'PersonenControl', 'googleDriveService','stopBinding'],
    function($, ko, persoonRepository, PersonenControl, googleDriveService) {
        
        function HomeViewModel(persoonId, updatePersonenCB) {
            var self = this;
            
        	this.folderName = 'crm-documenten';
        	this.applicationData = {
        			parseToken: 'myToken',
        			parseUser: 'myUser'
        	}
        	
            this.refresh = function() {
	        	if(updatePersonenCB) {
	        		updatePersonenCB();
	        	}


	        	
	        	googleDriveService.handleClientLoad(function(args) {
            		
	        		// Controleren of documenten folder bestaat en evt aanmaken
	        		googleDriveService.folderExists(self.folderName, function(folderExistsCB) {
            			
            			// if not exist, create folder
            			if(!folderExistsCB.items || folderExistsCB.items.length === 0) {
            				googleDriveService.createFolder(self.folderName, function(result) {
            					console.log('Folder ' + self.folderName + ' niet gevonden. Folder is aangemaakt');
            				});
            			}
            		});
	        		
	        		// Applicatie data opslaan
	        		googleDriveService.storeApplicationData({fileName: 'crm-settings.json', some: 'jsonthingy'}, function(result) {
	        			console.log('Callback van store application data');
	        			console.log(result);
	        		});
	        		
	        		googleDriveService.listApplicationData(function(result) {
	        			console.log('Callback van list app data');
	        			console.log(result);
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