var host = "http://49.148.197.56:818";
// import bf from "bellmanford";
var parentElement;
var lats = 0;
var longs = 0;
var slat = 0;
var slong = 0;
var evdata;
var isSetMap = false;
var physicalScreenWidth = window.screen.width;
var physicalScreenHeight = window.screen.height - 40;
var bellmanford = "";
var getcenter = true;
// NativeStorage.setItem("reference", obj, function(){ console.log('success') }, function(){ console.log('unsuccess') });
var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady(), false);
        // NativeStorage.initWithSuiteName("suitename");
    },
    onDeviceReady: function() {
        // NativeStorage.setItem("reference", obj, this.setSuccess, this.setError);
        var obj = {name: "NativeStorage", author: "GillesCallebaut"};        
        // be certain to make an unique reference String for each variable!
        // NativeStorage.setItem("reference", obj, this.setSuccess, this.setError);
        app.receivedEvent('deviceready');
    },
    setSuccess: function (obj) {
        // console.log(obj.name);
        // showAlert(obj.name);
        NativeStorage.getItem("reference", this.getSuccess, this.getError);
    },
    setError: function (error) {
        // console.log(error.code);
        if (error.exception !== "") console.log(error.exception);
    },
    getSuccess: function (obj) {
        // console.log(obj.name);
        NativeStorage.remove("reference", this.removeSuccess, this.removeError);
    },
    getError: function (error) {
        // console.log(error.code);
        if (error.exception !== "") console.log(error.exception);
    },
    removeSuccess: function() {
        // console.log("Removed");
    },
    removeError: function (error) {
        // console.log(error.code);
        if (error.exception !== "") console.log(error.exception);
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var options = { enableHighAccuracy: true, timeout: 10000, maximumAge: 10000};
        parentElement = document.getElementById(id);
        console.log('Received Event: ' + id);
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(this.onSuccess, this.onError,options);
        } else {
            console.log('User Agent is not supported');
        }
    },
    onSuccess: function(position) {
        lats = position.coords.latitude ;
        longs = position.coords.longitude ;
        console.log('Latitude: '  + position.coords.latitude      + ' \nLongitude: ' + position.coords.longitude);
    },
    onError: function(error) {
        console.log('Error navigator.geolocation = code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    },
    showAlert: function(title,message){         
        if (navigator.notification) {
            navigator.notification.alert(message, callback, title, 'OK');
        } else {
            var a = confirm(title ? (title + "\n" + message) : message);
            return a;
        }
    },
    showConform: function(title,message,callback){
        if (navigator.notification) {
            navigator.notification.confirm(message, callback, title, 'YES,NO');
        } else {
            alert(title ? (title + ": " + message) : message);
        }
    },
    addSharedData:function(itemname,value){
        //window.localStorage.getItem(itemname);
    },
    removeSharedData: function(itemname){
        //window.localStorage.removeItem("loggedIn");
    },
    getSharedDAta: function(itemname){
        // return
    },

};
// app.initialize();

