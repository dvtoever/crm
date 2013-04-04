/*
* Google drive Example using RequireJS Async plugin
*/

//
// Google drive loads many JS files asynchronously, so listening just to the first script load
// isn't enough to check if it is ready to be used, another problem is that the regular gmaps script 
// uses document.write, so we need to pass a `callback` parameter to make it not use `document.write` 
// and wait for the callback call.
// <http://code.google.com/apis/maps/documentation/javascript/basics.html#Async>
//
require(['async!https://apis.google.com/js/client.js'], function(){

    console.log('async load of google drive api');

    return window.gapi;

});