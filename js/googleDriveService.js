define(['jquery'], function ($) {
    'use strict';

    function GoogleDriveService() { }
    
    GoogleDriveService.prototype = new GoogleDriveService();
    
    var gapi;
    var client;
    var ready = false;
    
    var config = {
        'client_id': '576698137512.apps.googleusercontent.com',
        'scope': ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/drive.appdata'],
        'immediate' : false
    };

    /**
	 * Als deze methode wordt aangeroepen is window.gapi beschikbaar
	 */
    GoogleDriveService.prototype.init = function(onReady) {
        console.log('Initializing Google drive API');
        
        gapi = window.gapi;
        client = gapi.client;
        ready = true;
        
        gapi.auth.checkSessionState({ client_id: config.client_id, session_state: null}, function(loggedIn) {
           console.log("Is used still signed in? " + loggedIn); 
        });
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
    
            // googleDriveService.search('kavel', function(items) {
            // for(var i = 0; i < items.length; i++ ) {
            // var item = items[i];
            // var titel = item.title;
            //         
            // console.log('Document: ' + titel );
            // }
            // });
    
    GoogleDriveService.prototype.storeApplicationData = function(fileData, storeApplicationDataCB) {
		var boundary = '-------314159265358979323846';
		var delimiter = "\r\n--" + boundary + "\r\n";
		var close_delim = "\r\n--" + boundary + "--";
		var contentType = 'application/json';

		var metadata = {
		  'title': 'crmsettings.json',
		  'mimeType': contentType,
		  'parents': [{'id': 'appdata'}]
		};
		
		var base64Data = btoa(fileData);
		
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
		
		request.execute(storeApplicationDataCB);
 	
    };
  
    GoogleDriveService.prototype.listApplicationData = function(listApplicationDataCB) {
    	  var retrievePageOfFiles = function(request, result) {
    	    request.execute(function(resp) {
    	      result = result.concat(resp.items);
    	      var nextPageToken = resp.nextPageToken;
    	      if (nextPageToken) {
    	        request = gapi.client.drive.files.list({
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

    GoogleDriveService.prototype.handleClientLoad = function(onReady, immediate) {
        var apiKey = 'AIzaSyBxIvaXncSc-XLua8Epgxr-gux_5o_-7VU';
        client.setApiKey(apiKey);
        
        config.immediate = immediate;
        
        // popup die vraagt om toestemming naar google drive
        gapi.auth.authorize(config, function() {
            // als authorizatie is gedaan, drive client laden
            client.load('drive', 'v2', onReady);
        });
    };
    
    
    return new GoogleDriveService();
});