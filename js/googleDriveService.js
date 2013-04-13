define(['jquery'], function ($) {
    'use strict';

    function GoogleDriveService() { }
    
    GoogleDriveService.prototype = new GoogleDriveService();
    
    var SETTINGS_URL = 'settings_url';
    
    var gapi;
    var client;
    var ready = false;
    
    var config = {
        'client_id': '576698137512.apps.googleusercontent.com',
        'scope': ['https://www.googleapis.com/auth/drive', 
                  'https://www.googleapis.com/auth/drive.appdata',
                  'https://www.googleapis.com/auth/userinfo.email'],
        'immediate' : false
    };

    /**
	 * Als deze methode wordt aangeroepen is window.gapi beschikbaar
	 */
    GoogleDriveService.prototype.init = function(onReady, immediate) {
        console.log('Initializing Google drive API');
        
        gapi = window.gapi;
        client = gapi.client;
        if(immediate) config.immediate = true;
        
		// popup die vraagt om toestemming naar google drive
		gapi.auth.authorize(config, function() {
			// als authorizatie is gedaan, drive client laden
			client.load('drive', 'v2', function() {
				ready = true;
				if(onReady) onReady();
			});
		});
    };
    

    GoogleDriveService.prototype.waitUntilReady = function(onReady, immediate) {
    	if(!ready) {
    		this.init(function() {
    			var apiKey = 'AIzaSyBxIvaXncSc-XLua8Epgxr-gux_5o_-7VU';
        		client.setApiKey(apiKey);
        		if(onReady) onReady();
    		}, immediate);
    	} else {
    		if(onReady) onReady();
    	}
    };
    
    GoogleDriveService.prototype.getEmail = function(getEmailCB) {
    	this.getByUrl('https://www.googleapis.com/userinfo/email?alt=json', function(resultStr) {
    		var result = JSON.parse(resultStr);
    		if(result && result.data) {
    			getEmailCB(result.data.email)
    		}
    	})
    };
    
    GoogleDriveService.prototype.isReady = function() {
        return gapi !== undefined;
    };
    
    GoogleDriveService.prototype.isAuthorized = function() {
        return gapi.auth.getToken() !== null;
    };
    
    /**
	 * Zoekt bestanden op je google drive waarin een trefwoord voorkomt
	 * 
	 * @param queryStr
	 *            Het trefwoord waarop gezocht moet worden
	 * @param onReady
	 *            Callback functie die het resultaat als array argument mee
	 *            krijgt
	 */
    GoogleDriveService.prototype.search = function(queryStr, onReady) {
        var query = 'fullText contains \'' + queryStr + '\'';
        // var query = 'title contains \'Boerderij\'';
        console.log('Searching Google drive file for: "' + query + '"');

        var request = client.drive.files.list( { 'q' : query } );
        
        request.execute( function(response) {
            if(response.items === undefined && response.code !== 0 ) {
                console.log('Fout bij zoeken in documenten: ' + response.message);
            } else {
                onReady(response.items);
            }
        });
    };
    
    GoogleDriveService.prototype.folderExists = function(folderName, folderExistsCB) {
        console.log('Check if folder exists: "' + folderName + '"');

        var query = 'mimeType="application/vnd.google-apps.folder" and trashed=false and title = "' + folderName + '"'; 
        var request = client.drive.files.list( { 'q' : query } );
        
        request.execute( function(response) {
            if(response.result.items === undefined || response.result.items.length === 0 ) {
                console.log('Folder niet gevonden');
            } else {
            	console.log('Folder gevonden')
            }
            folderExistsCB(response.result);
        });
    };
    
    GoogleDriveService.prototype.createFolder = function(folderName, createFolderCB) {
    	console.log('Creating folder on Google drive: ' + folderName);
    	
    	var request = client.request( {
    		'path' : '/drive/v2/files/',
    		'method' : 'POST',
    		'headers': {
    	           'Content-Type': 'application/json',
    	           'Authorization': 'Bearer ' + gapi.auth.getToken().access_token,             
    	       },
    	       'body':{
    	           "title" : folderName,
    	           "mimeType" : "application/vnd.google-apps.folder",
    	           "parents" : [ {'id' : 'root' }]
    	       }
    	});
    	
    	request.execute(function(response) {
    		console.log('Folder creation response: ');
    		console.log( response);
    		createFolderCB(response);
    	});
    };
    
    GoogleDriveService.prototype.getByUrl = function(downloadUrl, getByUrlCB) {
    	if(downloadUrl !== null) {
	 	    var accessToken = gapi.auth.getToken().access_token;
		    var xhr = new XMLHttpRequest();
		    xhr.open('GET', downloadUrl);
		    xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
		    xhr.onload = function() {
		    	if(xhr.status == 200) {
		    		getByUrlCB(xhr.responseText);
		    	} else {
		    		getByUrlCB(null);
		    	}
		    };
		    xhr.onerror = function() {
		    	getByUrlCB(null);
		    };
		    xhr.send();
    	} else {
    		getByUrlCB(null);
    	}
    };
    
    GoogleDriveService.prototype.storeApplicationData = function(fileName, fileData, storeApplicationDataCB) {
		var boundary = '-------314159265358979323846';
		var delimiter = "\r\n--" + boundary + "\r\n";
		var close_delim = "\r\n--" + boundary + "--";
		var contentType = 'application/json';

		var metadata = {
		  'title': fileName,
		  'mimeType': contentType,
		  'parents': [{'id': 'appdata'}]
		};
		
		var base64Data = btoa(JSON.stringify(fileData));
		
		var multipartRequestBody =
		    delimiter +
		    'Content-Type: application/json\r\n\r\n' +
		    JSON.stringify(metadata) +
		    delimiter +
		    'Content-Type: ' + contentType + '\r\n' +
		    'Content-Transfer-Encoding: base64\r\n' +
		    '\r\n' +
		    base64Data +
		    close_delim;
		
		var request = client.request({
		    'path': '/upload/drive/v2/files',
		    'method': 'POST',
		    'params': {'uploadType': 'multipart'},
		    'headers': {
		      'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
		    },
		    'body': multipartRequestBody
	    });
		
		request.execute(function(result) {
			if(result.downloadUrl) {
				window.localStorage.setItem(SETTINGS_URL, result.downloadUrl);
			}
			if(storeApplicationDataCB) storeApplicationDataCB(result);
		});
 	
    };
  
    GoogleDriveService.prototype.listApplicationData = function(listApplicationDataCB) {
    	  var retrievePageOfFiles = function(request, result) {
    	    request.execute(function(resp) {
    	      result = result.concat(resp.items);
    	      var nextPageToken = resp.nextPageToken;
    	      if (nextPageToken) {
    	        request = client.drive.files.list({
    	          'pageToken': nextPageToken
    	        });
    	        retrievePageOfFiles(request, result);
    	      } else {
    	    	  listApplicationDataCB(result);
    	      }
    	    });
    	  }
    	  
    	  var initialRequest = client.drive.files.list({
    	    'q': '\'appdata\' in parents'
    	  });
    	  
    	  retrievePageOfFiles(initialRequest, []);
    };
    
    /**
     * Opvragen van CRM settings.
     * 
     * @return json settings object, of null als er niks werd gevonden
     */
    GoogleDriveService.prototype.getSettings = function(settingsName, getSettingsCB) {
    	// controleer of settings url in localstorage staat
    	var settingsUrl = window.localStorage.getItem(SETTINGS_URL);
    	var gevonden = false;
    	
    	if(settingsUrl !== null ) {
    		this.getByUrl(settingsUrl, function(result) {
    			if(result) {
    				// gevonden we kunnen stoppen
    				getSettingsCB(result);
    			} else {
    				// ondanks dat er een localstorage key was, niks gevonden
    				window.localStorage.removeItem(SETTINGS_URL);
    				
    				zoekSettings(this, settingsName, getSettingsCB);
    			}
    		});
    	} else {
    		zoekSettings(this, settingsName, getSettingsCB);
    	}
    	
    };
    
    function zoekSettings(context, settingsName, getSettingsCB) {
    	var downloadUrl = null;
    	
    	// zoek file via search api call
		context.listApplicationData(function(result) {
			if(result && result[0] !== undefined ) {
				for(var i = 0; i < result.length; i++) {
					if(result[i].originalFilename === settingsName) {
						downloadUrl = result[i].downloadUrl
						
					}
    			}
			}
			
			if(downloadUrl !== null) {
				// gevonden, nu opvragen en teruggeven
				window.localStorage.setItem(SETTINGS_URL, downloadUrl);
				context.getByUrl(downloadUrl, function(fileContent) {
					getSettingsCB(fileContent);
				});
			} else {
				// niks gevonden
				getSettingsCB(null);
			}
		});
    }
    
    return new GoogleDriveService();
});