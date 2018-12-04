angular.module('app.controllers', ['ionic'])  
.controller('mapCtrl', function ($scope, $stateParams, $state,$ionicHistory,$rootScope,$ionicModal) {
    var lat = 7.148419523108726;
    var lng = 125.52915832519531;
    $ionicModal.fromTemplateUrl('templates/modal.html',{
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
       $scope.modal2 = modal;
    });
    var physicalScreenWidth = window.screen.width;
    var physicalScreenHeight = window.screen.height - 40;
    $('#map').css('height',physicalScreenHeight);
    $('#map').css('width',physicalScreenWidth);
    var osm = OSM();
    
    osm.create("map" , longs, lats,13);
    osm.move_position(longs,lats, 14);
    osm.addMarker(longs,lats,'itsme',"Your Here test");
    if(getcenter && longs != 0 && longs != 0){
        osm.move_position(longs,lats, 14);
        getcenter = false;
    }
    
    var start = false;
    setInterval(function(){
        if(start)
            osm.deleteMarker('itsme');
            osm.addMarker(longs,lats,"itsme","Your Here");
            if(getcenter && longs != 0 && longs != 0){
                osm.move_position(longs,lats, 14);
                getcenter = false;
            }
        start = true;
    },5000);
    //android/get/traffic
    $scope.trafficlist = null;
    $scope.$watch('trafficlist',null,true); 
    setInterval(function(){
        $scope.actionss();        
    },60000);


    osm.mapclickcallback(function(data){
        if(data.id != "undefined" || data.id != "" || data.id != null){
            for(var x = 0; x < $scope.eventList.length; x++){
                if($scope.eventList[x].ID == data.id && $scope.eventList[x].eventname != ""){
                    var details = {event_name : $scope.eventList[x].eventname ,event_date : "start: " + $scope.eventList[x].date_start + " " + $scope.eventList[x].time_start , event_end: $scope.eventList[x].date_end + " " + $scope.eventList[x].time_end,event_address :$scope.eventList[x].address};
                    $scope.edetails = details;
                    window.localStorage['map_nav_id'] = data.id;
                    $scope.modal2.show(); 
                }
            }
        }
    });
    
    $scope.mhide = function(){
        $scope.modal2.hide();
        $('[ng-app="app"]').removeClass('modal-open');     
    };
    $scope.redirect = function(){
        $scope.modal2.hide();
        $('[ng-app="app"]').removeClass('modal-open');
        if(window.localStorage['UserSession'] == 1){
            $ionicHistory.clearCache().then(function(){
                $state.go('drawer.navigate',{}, {reload: false});
            });
        }else{
            app.showAlert('Signup','Please Login first.');
        }
    };
    $scope.actionss = function(){

        $.post(host + "/android/events",function(obj){
            try{
                var jsdata = jQuery.parseJSON(JSON.stringify(obj));
                $scope.eventList = jQuery.parseJSON(jsdata).data; 
                console.log($scope.eventList);
                for(var x = 0; x < $scope.eventList.length; x++){
                    var lng = parseFloat($scope.eventList[x].lng);
                    var lat = parseFloat($scope.eventList[x].lat);
                    osm.deleteMarker($scope.eventList[x].ID);
                    osm.addMarkerStar(lng,lat,$scope.eventList[x].ID,$scope.eventList[x].eventname);
                }
            }catch (err){
                console.log("error : " + err);
            }
        });
        $.post(host + '/android/get/traffic',function(obj){
            try{
                var jsdata = jQuery.parseJSON(JSON.stringify(obj));
                // console.log(jQuery.parseJSON(jsdata).data);
                $scope.trafficlist = jQuery.parseJSON(jsdata).data;  
                for(var x = 0; x < $scope.trafficlist.length; x++){
                    // console.log($scope.trafficlist[x].rtype);
                    var lng = parseFloat($scope.trafficlist[x].lon);
                    var lat = parseFloat($scope.trafficlist[x].lat);
                    osm.deleteMarker($scope.trafficlist[x].ID + "_event");
                    osm.addMarkererr(lng,lat,$scope.trafficlist[x].ID,$scope.trafficlist[x].rtype);
                }
            }catch (err){
                console.log("error : " + err);
            }
        }); 
    };
    $scope.actionss();
    $ionicModal.fromTemplateUrl('templates/modal_report.html',{
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
       $scope.modal_report = modal;
    });

    $ionicModal.fromTemplateUrl('templates/newevent_modal.html',{
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
       $scope.modal_report_event = modal;
    });

    $ionicModal.fromTemplateUrl('templates/modal_traffic_message_new.html',{
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
       $scope.modal_traffic_message = modal;
    });

    $ionicModal.fromTemplateUrl('templates/modal_cancel_nav.html',{
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
       $scope.modal_navigation = modal;
    });
    $scope.report_new_event_Click = function(){
        $scope.modal_report_event.show();
    };
    $scope.report_new_event_HideClick = function(){
        $scope.modal_report_event.hide();
    };
    $scope.reportClick = function(){
        $scope.modal_report.show();
    };
    $scope.reportHideClick = function(){
        $scope.modal_report.hide(); 

    };
    $scope.reportTraffic = function(){
        $scope.modal_report.hide();
    };
    $scope.trafficClick = function(){
        $scope.modal_report.hide();  
        $scope.modal_traffic_message.show();
    };
    $scope.trafficHideClick = function(){
        $scope.modal_traffic_message.hide();  
    };
    $scope.trafficacceptClick = function(){
        $scope.modal_traffic_message.hide();  

        var trafstat = $('select[name="trafstat"] :selected').val();
        var froms = $('input[name="froms"]').val();
        var tos = $('input[name="tos"]').val();
        $.post(host + "/android/create/traffic" ,{froms : froms,tos:tos, uid : window.localStorage['UserSessionid'] ,  rty : trafstat, lon : longs,  lat : lats },function(data){
            console.log("success : " + data);
            osm.addMarkererr(longs,lats, window.localStorage['UserSessionid'] + "_traff" ,"Traffic " + trafstat);
        }).error(function(er){
            console.log(jQuery.parseJSON(JSON.stringify(er)));
        });
    
    };
    $scope.navyes = function(){
        $scope.modal_navigation.hide(); 
        $ionicHistory.clearCache().then(function(){
            $state.go('^', {}, {reload: true});
            $state.go('drawer.map',{}, {reload: false});                           
        });
    };
    $scope.navno = function(){
        $scope.modal_navigation.hide(); 
    };
    $scope.reportCancel = function(){
        $scope.modal_navigation.show();
    };
    $scope.submit = function(){ 
        var id = window.localStorage['UserSessionid'];
        var eventnames = $('input[name="eventname"]').val();
        var eventcontent = $('textarea#eventcontent').val();
        var eventadd = $('input[name="eventadd"]').val();
        var eventdstart = $('input[name="eventdstart"]').val();
        var evettstart = $('input[name="evettstart"]').val();
        var eventdend = $('input[name="eventdend"]').val();
        var eventend = $('input[name="eventend"]').val();

        if (eventnames != "" != "" && eventadd != "" &&  eventdstart != "" && evettstart != "" && eventdend != "" && eventend != ""){
            console.log(11);
             $.post(host + '/android/report/create/event',{uid:id,eventname:eventnames,event_content:eventcontent,address:eventadd,date_start:eventdstart,time_start:evettstart,time_end:eventend,date_end:eventdend,lat:lats,lng:longs},function(obj){
                
                var jsdata = jQuery.parseJSON(JSON.stringify(obj));
                var jsdata_result = JSON.parse(jsdata);
                console.log(jsdata_result.result);
                if(jsdata_result.result == "Good"){
                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });
                    $ionicHistory.clearCache().then(function(){
                        $state.go('^', {}, {reload: true});
                        $state.go('drawer.map',{}, {reload: true});                           
                    });
                    $state.go('drawer.map',{}, {reload: true}); 
                    window.location.reload();
                }else{
                    app.showAlert('New Event','Please Try Again');
                }
            }).error(function(err){
                console.log("err"+err);
            });                
        } else {
            app.showAlert("New","All Text Are Required!");
        }       
    };
    $scope.$on('modal.hidden', function() {
      $('#apps').removeClass('modal-open');
    });
})
.controller('navigateCtrl',  function ($scope, $stateParams, $state,$ionicHistory,$rootScope,$ionicModal) {
    $scope.clearHistory = function() {
        $ionicHistory.clearHistory();
    }
    //console.log("call");
    $scope.distance_ = 0;
    $scope.distance2_ = 0;
    $scope.$watch('$scope.distance_', function myListene() {},true);
    $scope.$watch('$scope.distance2_', function myListene2() {},true);
    $scope.$watch('$scope.distance_total', function myListene() {},true);
    $scope.$watch('$scope.distance2_total', function myListene2() {},true);
    var rdata1 = null;
    var rdata2 = null;
    var lat = 7.148419523108726;
    var lng = 125.52915832519531;
    var physicalScreenWidth = window.screen.width;
    var physicalScreenHeight = window.screen.height - 40;
    $('#map_nav').css('height',physicalScreenHeight);
    $('#map_nav').css('width',physicalScreenWidth);
    var osm = OSM();

    $.post(host + '/android/data/events' ,{id:window.localStorage['map_nav_id']},function(obj){
        try{
            var jsdata = jQuery.parseJSON(JSON.stringify(obj));
            $scope.eventList = jQuery.parseJSON(jsdata).data;
            for(var x = 0; x < $scope.eventList.length; x++){
                var lng = parseFloat($scope.eventList[x].lng);
                var lat = parseFloat($scope.eventList[x].lat);
                osm.create("map_nav" , lng, lat,12);
                osm.addMarkerStar(lng,lat,$scope.eventList[x].ID,$scope.eventList[x].eventname);
            }
            $scope.load_route1(lats,longs,lat,lng);
            $scope.load_route_alternate(lats,longs,lat,lng);
        }catch (err){
            console.log(err);
        }
    });
    var start = false;
    setInterval(function(){
        if(start)
            osm.deleteMarker('itsme');
            osm.addMarker(longs,lats,"itsme","Your Here");
        start = true;
    },1000);
    setInterval(function(){
            osm.move_position_track(longs,lats);
    },15000);

    $scope.load_route1 = function(_lat1,_lng1,_lat2,_lng2){
        $.ajax({
        dataType : "json",
        contentType: "application/json; charset=utf-8",
            type : 'POST',
            url : "http://www.mapquestapi.com/directions/v2/route?key=AVN90uNU84uG8yQWqYwBEV5tGxRfW9b0",
            data : JSON.stringify({"locations": [{"latLng": {"lat": _lat1,"lng": _lng1}},{"latLng": {"lat": _lat2, "lng": _lng2}}], "options": {"avoids": [],"avoidTimedConditions": false,"doReverseGeocode": true,"shapeFormat": "cmp","generalize": 0,"routeType": "fastest","timeType": 1,"locale": "en_US","unit": "m","enhancedNarrative": false, "drivingStyle": 2, "highwayEfficiency": 21.0,"fullShape" : true}}),
            success : function(evt){
                // console.log("success : ", evt);
                $scope.distance_ = evt.route.distance.toString();   
                var hars = ($scope.distance_  / 30).toFixed(0);
                var mins = (( (($scope.distance_  / 30).toFixed(0)) - ($scope.distance_  / 30).toFixed(2)) * 60).toFixed(0);
                mins = mins < 0 ? mins*-1:mins;
                $scope.distance_total = ( hars + ":" + mins);             
                $scope.$apply();
                var rdata = evt.route.shape.shapePoints;
                //osm.draw_route(rdata,[76, 220, 61, 1]);
                rdata1 = rdata;
            },
            error : function(evt){
                console.log("error : ", evt);
            }
        });
    };

    $scope.load_route_alternate = function(_lat1,_lng1,_lat2,_lng2){
        $.ajax({
        dataType : "json",
        contentType: "application/json; charset=utf-8",
            type : 'POST',
            url : "http://www.mapquestapi.com/directions/v2/route?key=AVN90uNU84uG8yQWqYwBEV5tGxRfW9b0",
            data : JSON.stringify({"locations": [{"latLng": {"lat": _lat1,"lng": _lng1}},{"latLng": {"lat": _lat2, "lng": _lng2}}], "options": {"avoids": [],"avoidTimedConditions": false,"doReverseGeocode": true,"shapeFormat": "cmp","generalize": 0,"routeType": "shortest","timeType": 1,"locale": "en_US","unit": "m","enhancedNarrative": false, "drivingStyle": 2, "highwayEfficiency": 21.0,"fullShape" : true}}),
            success : function(evt){
                // console.log("success : ", evt.route.distance.toString() );
                $scope.distance2_ = evt.route.distance.toString(); 
                var hars = ($scope.distance2_  / 30).toFixed(0);
                var mins = (( (($scope.distance2_  / 30).toFixed(0)) - ($scope.distance2_  / 30).toFixed(2)) * 60).toFixed(0);
                mins = mins < 0 ? mins*-1:mins;
                $scope.distance2_total = ( hars + ":" + mins);      
                $scope.$apply();
                var rdata = evt.route.shape.shapePoints;
                //osm.draw_route_2(rdata,[216, 98, 98, 1]);
                rdata2 = rdata;

            },
            error : function(evt){
                console.log("error : ", evt);
            } 
        });
    };
    var test = setInterval(function(){   
        if(rdata1 != null && rdata2 != null){                    
            osm.draw_route(rdata1,[76, 220, 61, 1]);
            osm.draw_route_2(rdata2,[17, 42, 222, 1]);

       // console.log("aw");
        window.clearInterval(test);
        }else{
            console.log("aw2x");
        }
    },15);
    // $scope.modal_report = null;
    // $scope.modal_traffic_message = null;
    $ionicModal.fromTemplateUrl('templates/modal_report.html',{
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
       $scope.modal_report = modal;
    });

    $ionicModal.fromTemplateUrl('templates/modal_traffic_message.html',{
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
       $scope.modal_traffic_message = modal;
    });

    $ionicModal.fromTemplateUrl('templates/modal_cancel_nav.html',{
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
       $scope.modal_navigation = modal;
    });
    $scope.reportClick = function(){
        $scope.modal_report.show();
    };
    $scope.reportHideClick = function(){
        $scope.modal_report.hide(); 

    };
    $scope.reportTraffic = function(){
        $scope.modal_report.hide();
    };
    $scope.trafficClick = function(){
        $scope.modal_report.hide();  
        $scope.modal_traffic_message.show();
    };
    $scope.trafficHideClick = function(){
        $scope.modal_traffic_message.hide();  
    };
    $scope.trafficacceptClick = function(){
        $scope.modal_traffic_message.hide();  

        var trafstat = $('select[name="trafstat"] :selected').val();
        $.post(host + "/android/create/traffic" ,{ uid : window.localStorage['UserSessionid'] ,  rty : trafstat, lon : longs,  lat : lats },function(data){
            console.log("success : " + data);
            osm.addMarkererr(longs,lats, window.localStorage['UserSessionid'] + "_traff" ,"Traffic " + trafstat);
        });
    
    };
    $scope.navyes = function(){
        $scope.modal_navigation.hide(); 
        $ionicHistory.clearCache().then(function(){
            $state.go('^', {}, {reload: true});
            $state.go('drawer.map',{}, {reload: false});                           
        });
    };
    $scope.navno = function(){
        $scope.modal_navigation.hide(); 
    };
    $scope.reportCancel = function(){
        $scope.modal_navigation.show();
    };
    $scope.$on('modal.hidden', function() {
      $('#apps').removeClass('modal-open');
    });
})
.controller('eventListCtrl',  function ($scope, $stateParams, $state,$ionicHistory,$rootScope,$ionicModal) {

    $scope.eventList_item = null;
    $scope.$watch('eventList_item',null,true); 
    $.post(host + '/android/get/event' ,{},function(obj){
        try{
            var jsdata = jQuery.parseJSON(JSON.stringify(obj));
            console.log(jQuery.parseJSON(jsdata).data);
            $scope.eventList_item = jQuery.parseJSON(jsdata).data;
        }catch (err){

        }
    });
    var intervals = setInterval(function(){
        $.post(host + '/android/get/event' ,{},function(obj){
            try{
                var jsdata = jQuery.parseJSON(JSON.stringify(obj));
                //console.log(jQuery.parseJSON(jsdata).data);
                $scope.eventList_item = jQuery.parseJSON(jsdata).data;
            }catch (err){

            }
        });
    },60000);


    $ionicModal.fromTemplateUrl('templates/eventdetails.html',{
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
       $scope.modal_eventlist = modal;
    });

    $scope.$watch('$scope.eventname', function eventname() {},false);
    $scope.$watch('$scope.event_content', function event_content() {},false);
    $scope.$watch('$scope.address', function address() {},false);
    $scope.$watch('$scope.date_start', function date_start() {},false);
    $scope.$watch('$scope.time_start', function time_start() {},false);
    $scope.$watch('$scope.time_end', function time_end() {},false);
    $scope.$watch('$scope.date_end', function date_end() {},false);
    $scope.viewDetails = function(id){
        $scope.eventname = "";
        $scope.event_content = "";
        $scope.address = "";
        $scope.date_start = "";
        $scope.time_start = "";
        $scope.time_end = "";
        $scope.date_end = "";
        
        for(var x = 0; x < $scope.eventList_item.length ;x++){
            if($scope.eventList_item[x].ID == id){
                // console.log($scope.eventList_item[x].eventname);
                $scope.eventname = $scope.eventList_item[x].eventname;
                $scope.event_content = $scope.eventList_item[x].event_content;
                $scope.address = $scope.eventList_item[x].address;
                $scope.date_start = $scope.eventList_item[x].date_start;
                $scope.time_start = $scope.eventList_item[x].time_start;
                $scope.time_end = $scope.eventList_item[x].time_end;
                $scope.date_end = $scope.eventList_item[x].date_end;
                $scope.modal_eventlist.show();
            }
        }
    };

    $scope.viewDetails_close = function(){
        $scope.modal_eventlist.hide();
        $ionicHistory.clearCache().then(function(){
            $state.go('drawer.eventList',{}, {reload: true});
        });
    };

})
.controller('neweventListCtrl',  function ($scope,  $stateParams, $state,$ionicHistory,$rootScope) {
    $('#newevent').on('submit',function(e){ 
        var id = window.localStorage['UserSessionid'];
        var eventnames = $('input[name="eventname"]').val();
        var eventcontent = $('textarea#eventcontent').val();
        var eventadd = $('input[name="eventadd"]').val();
        var eventdstart = $('input[name="eventdstart"]').val();
        var evettstart = $('input[name="evettstart"]').val();
        var eventdend = $('input[name="eventdend"]').val();
        var eventend = $('input[name="eventend"]').val();
        if(!isSetMap){
            app.showAlert("New","Please Set Map location first");
            return false;
        }else{
            if (eventnames != "" != "" && eventadd != "" &&  eventdstart != "" && evettstart != "" && eventdend != "" && eventend != ""){
                 $.post(host + '/android/create/event',{uid:id,eventname:eventnames,event_content:eventcontent,address:eventadd,date_start:eventdstart,time_start:evettstart,time_end:eventend,date_end:eventdend,lat:slat,lng:slong},function(obj){
                    var jsdata = jQuery.parseJSON(JSON.stringify(obj));
                    var jsdata_result = JSON.parse(jsdata);
                    if(jsdata_result.result == "Good"){
                        $ionicHistory.nextViewOptions({
                            disableBack: true
                        });
                        $ionicHistory.clearCache().then(function(){
                            $state.go('^', {}, {reload: true});
                            $state.go('drawer.eventList',{}, {reload: true});                           
                        });
                        $state.go('drawer.eventList',{}, {reload: true});
                    }else{
                        app.showAlert('New Event','Please Try Again');
                    }
                });                
            } else {
                app.showAlert("New","All Text Are Required!");
            }      
        }        
    });
})
.controller('mapsetCtrl',  function ($scope, $stateParams ,$state ,$ionicHistory,$rootScope) {
    var lat = 7.094419523108726;
    var lng = 125.59158325195312;
    var result_coor ;
    var physicalScreenWidth = window.screen.width ;
    var physicalScreenHeight = window.screen.height - 40 ;
    $('#maps').css('height',physicalScreenHeight);
    $('#maps').css('width',physicalScreenWidth);
    var osm = new OSM();
    osm.create("maps" , lng, lat,13);
    osm.getNewEventPoint(function(evt){
        result_coor = evt;  
        console.log(result_coor);
        slat = result_coor.coordinate[1];
        slong = result_coor.coordinate[0];
        osm.removeDrawMarker();
        $('#event_map').removeClass('hide');
    });
    osm.drawNewPoint();
    $('#savenewevent').on('click',function(){
        isSetMap = true;
        $state.go('drawer.nevent',{}, {reload: false});
    });
})
.controller('signup',  function ($scope, $stateParams, $state,$ionicHistory,$rootScope) {

     $('#signup').on('submit',function(e){        
        var fnames = $('input[name="sfname"]').val();
        var contacts = $('input[name="scontacts"]').val();
        var emailadd = $('input[name="semailadd"]').val();
        var unames = $('input[name="suname"]').val();
        var upasss = $('input[name="supass"]').val();
        var reupass = $('input[name="sreupass"]').val();
        console.log(upasss  + " " + reupass);
        if (fnames == "" && contacts == ""  && emailadd == ""  && unames == ""  && upasss == ""  && reupass == "" ){
            app.showAlert("Signup","All textbox are required to file");
            return;            
        } else if (upasss != reupass){
            app.showAlert("Signup","Password did'nt match");
            return;            
        } else {
            // console.log(host + '/android/signup/client');
            $.post(host + '/android/signup/client',{fname:fnames,contact:contacts,email:emailadd,usrname:unames,upass:upasss},function(obj){     
                var jsdata = jQuery.parseJSON(JSON.stringify(obj));
                var jsdata_result = JSON.parse(jsdata);
                // console.log(jsdata_result);
                if(jsdata_result.result == "Good"){
                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });
                    $ionicHistory.clearCache().then(function(){
                        $state.go('drawer.login');
                    });
                }else{
                    app.showAlert('Signup','Please Try Again');
                }
            });
        }
     });
})
.controller('login', function ($scope, $stateParams, $state,$ionicHistory,$rootScope) {
    console.log("login");
    $scope.testerr = "";
    var result = "";

    $scope.$watch('testerr', function myListenerFunction() {
    
    });
    $('#loginform').on('submit',function(e){
        $scope.testerr = "Wait....";
        var uname = $('input[name="uname"]').val();
        var upass = $('input[name="upass"]').val();
        $('#loading').removeClass("hide");
        $('#login-button').attr('disabled','disabled');
        if(uname != "" && upass != ""){
            $scope.testerr = "post";            
            $.post(host + '/android/signin/client',{txtuser:uname,txtpss:upass},function(obj){
                //app.showAlert('Login',obj.toString());
                $scope.testerr = "Welcome";
                $scope.$apply();
                if(obj == "invalid"){
                    app.showAlert('Login','Please Try Again');
                    return;
                }
                try {
                    var jsdata = jQuery.parseJSON(JSON.stringify(obj));
                    var jsdata_result = JSON.parse(jsdata).result;
                    //console.log(jsdata_result);
                    if(jsdata_result.status == "1" && jsdata_result.utype == "client"){                        
                    var jsdata_resultp = JSON.parse(JSON.stringify(jsdata_result.data_profile))[0];
                        // app.showAlert('Login','Welcome ');
                        window.localStorage['UserSessionName'] = jsdata_resultp.fullname;
                        window.localStorage['UserSession'] = 1;
                        window.localStorage['UserSessionid'] = jsdata_resultp.ID;
                        $rootScope.uname = jsdata_resultp.fullname;
                        $rootScope.uauthen = 1;
                        $('#login-button').removeAttr('disabled');
                        $('#loading').addClass("hide");
                        $ionicHistory.nextViewOptions({
                            disableBack: true
                        });
                        // $state.go('drawer.map');
                        $ionicHistory.clearCache().then(function(){
                        $state.go('^', {}, {reload: true});
                        $state.go('drawer.map', {}, {reload: true});
                        });
                        // window.location.reload();
                    }else {
                        window.localStorage['UserSession'] = 0;
                        app.showAlert("Login","Username/Password is not valid");
                        $('#login-button').removeAttr('disabled');
                    }
                }catch(err){
                    return false;
                }

            }).error(function(obj){
                app.showAlert("Login","Username/Password is not valid");
                $('#login-button').removeAttr('disabled');
            });
        }
        return false;
    });
})
.controller('drawerCtrl', function ($scope, $stateParams,$state,$ionicHistory,$rootScope) {
    console.log("drawer");
    var name = "" ;
    var ulogin = 0;
    if(typeof(window.localStorage['UserSessionName']) != 'undefined' ){
        name = window.localStorage['UserSessionName'];
        ulogin = window.localStorage['UserSession'];
    }
    $rootScope.uname = name;
    $rootScope.uauthen = ulogin;

    $scope.logout = function(){
        $rootScope.uname = "";
        $rootScope.uauthen = 0;
        window.localStorage.clear();
        if($state.current){
            window.location.reload();
        }else{
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            $state.go('drawer.map');
        }
    };
}).run(function($rootScope) {
    $rootScope.uname = "";    
    $rootScope.uauthen = "";
});

// var xhttp = new XMLHttpRequest();
// xhttp.onreadystatechange = function() {
//     if (this.readyState == 4 && this.status == 200) { 
//        //var xmlDoc = this.responseXML;
//        var parser = new DOMParser();
//        var xmlDoc = parser.parseFromString(this.responseText,"text/xml");

//        console.log(xmlDoc.getElementsByTagName("node").length);
//     }
// };
// xhttp.open("GET", "/js/data/map.osm", true);
// xhttp.send();
