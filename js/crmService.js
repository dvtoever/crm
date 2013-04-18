define(['jquery', 'googleDriveService', 'parseService', 'persoonRepository'], function ($, googleDriveService, parseService, persoonRepository) {
    'use strict';

    function CrmService() { }
    
	/** De folder waarin alle documenten worden opgeslagen van de CRM app */
    var folderName = 'crm-documenten';

    /** De naam en initiele inhoud van het settings object */
	var SETTINGS_NAME = 'crm-settings.json';
	
	var settings = null;
    
    function initGoogleDrive(initGoogleDriveCB) {
    	var self = this;
    	console.log('Initialiseren van CRM gegevens...');
    	
    	googleDriveService.waitUntilReady(function(args) {
    		// Controleren of documenten folder bestaat en evt aanmaken
    		googleDriveService.folderExists(folderName, function(folderExistsCB) {
    			// if not exist, create folder
    			if(!folderExistsCB.items || folderExistsCB.items.length === 0) {
    				googleDriveService.createFolder(folderName, function(result) {
    					console.log('Folder ' + folderName + ' niet gevonden. Folder is aangemaakt');
    				});
    			}
    		});
    		
    		googleDriveService.getSettings(SETTINGS_NAME, function(result) {
    			console.log('crmService: getting settings');
    			if(result === null) {
    				// aanmaken settings
    				
    				var settingsData = {
						email : '',
						aclPass : Math.random().toString(36).slice(-16)
					};
    				
    				// instellen mailadres
    				console.log('Obtaining mail address...');
    				googleDriveService.getEmail(function(mail) {
    					console.log('mail address found');
    					settingsData.email = mail;

    					// Applicatie data opslaan
    					console.log('Storing settings');
    					googleDriveService.storeApplicationData(null, SETTINGS_NAME, settingsData, function(result) {
    						settings = settingsData;
    						settings.fileId = result.id;
    						
    						// Nu opnieuw opslaan nu het id bekend is
    						googleDriveService.storeApplicationData(settings.fileId, SETTINGS_NAME, settings);

    						initGoogleDriveCB();
    					});
    				});
    				
    				
    			} else {
    				settings = JSON.parse(result);
    				initGoogleDriveCB();
    			}
    		});
    	}, true);
    };
    
    function initParse(initParseCB) {
    	function onReady(callback) {
			parseService.initParse(settings.email, settings.aclPass, function() {
				// initalizatie is afgerond
				initParseCB();
			});	
		}
		
		if(settings.parseSignupComplete === undefined) {
			parseService.signup(settings.email, settings.aclPass, onReady);
			settings.parseSignupComplete = true;
			
			self.saveSettings(settings);
		} else {
			onReady();
		}
    }
    
    
    /** Moet eerst worden aangeroepen om de applicatie te initaliseren */
    CrmService.prototype.initApplication = function(initApplicationCB) {
    	var self = this;
    	
    	initGoogleDrive(function() {
    		initParse(function() {
    			// alles is geladen
    		});
    	});
    	
    };
    
    /** Opvragen van settings */
    CrmService.prototype.getSettings = function() {
    	if(settings === null) {
    		console.log('CrmService not initialized, call "initApplication()" first');
    		return;
    	}
    	
    	return settings;
    };
    
    /** Opslaan van settings */
    CrmService.prototype.saveSettings = function(settings, saveSettingsCB) {
    	if(settings !== null) {
    		googleDriveService.storeApplicationData(settings.fileId, SETTINGS_NAME, settings, saveSettingsCB);
    	} else {
    		console.log('Geen settings meegegeven');
    	}
    }
    
    
    return new CrmService();
});