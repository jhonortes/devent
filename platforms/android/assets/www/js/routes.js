angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider 

  .state('drawer.map', {
    url: '/mainmap',
    views: {
      'side': {
        templateUrl: 'templates/map.html',
        controller: 'mapCtrl'
      }
    },
    data: { preload: true }
  })

  .state('drawer.eventList', {
    url: '/eventlist',
    views: {
      'side': {
        templateUrl: 'templates/eventList.html',
        controller: 'eventListCtrl'
      }
    }
  })

  .state('drawer.nevent', {
    url: '/newevent',
    views: {
      'side': {
        templateUrl: 'templates/newevent.html',
        controller: 'neweventListCtrl'
      }
    }
  })
  .state('drawer.setmap', {
    url: '/mapset',
    views: {
      'side': {
        templateUrl: 'templates/mapset.html',
        controller: 'mapsetCtrl'
      }
    }
  })

  .state('drawer.login', {
    url: '/login',
    views: {
      'side': {
        templateUrl: 'templates/login.html',
        controller: 'login'
      }
    }
  })

  .state('drawer.signup', {
    url: '/signup',
    views: {
      'side': {
        templateUrl: 'templates/signup.html',
        controller: 'signup'
      }
    }
  })

  .state('drawer.navigate', {
    url: '/navigate',
    views: {
      'side': {
        templateUrl: 'templates/map_navigate.html',
        controller: 'navigateCtrl'
      }
    }
  })

  .state('drawer', {
    url: '/side',
    templateUrl: 'templates/drawer.html',
    controller: 'drawerCtrl'
  });

$urlRouterProvider.otherwise('/side/mainmap')

});