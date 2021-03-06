// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ionic-datepicker'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    //Setup the background tasks
    cordova.plugins.backgroundMode.setDefaults({ text:'Running group update checking task'});
    //Enable background
    cordova.plugins.backgroundMode.enable();


    // Called when background mode has been activated
cordova.plugins.backgroundMode.onactivate = function () {
    setTimeout(function () {
        // Modify the currently displayed notification
        cordova.plugins.backgroundMode.configure({
            text:'Running in background for more than 5s now.'
        });
    }, 5000);
}

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  $ionicConfigProvider.tabs.position("bottom");
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  .state('changeLog', {
    url: '/changeLog',
        templateUrl: 'templates/tab-changeLog.html',
        controller: 'ChangeLog'
  })

  .state('donate', {
    url: '/donate',
        templateUrl: 'templates/tab-donate.html',
        controller: 'Credits'
  })

  .state('aboutAlpha', {
    url: '/aboutAlpha',
        templateUrl: 'templates/tab-aboutalpha.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.daily', {
    url: '/daily',
    views: {
      'tab-daily': {
        templateUrl: 'templates/tab-daily.html',
        controller: 'DailyCtrl'
      }
    }
  })

  .state('tab.groups', {
      url: '/groups',
      views: {
        'tab-groups': {
          templateUrl: 'templates/tab-groups.html',
          controller: 'GroupsCtrl'
        }
      }
    })

  .state('tab.monthly', {
    url: '/monthly',
    views: {
      'tab-monthly': {
        templateUrl: 'templates/tab-monthly.html',
        controller: 'MonthlyCtrl'
      }
    }
  })

  .state('tab.settings', {
    url: '/settings',
    views: {
      'tab-settings': {
        templateUrl: 'templates/tab-settings.html',
        controller: 'SettingsCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/daily');

});
