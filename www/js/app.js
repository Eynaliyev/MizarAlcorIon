// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var app = angular.module('starter', ['ionic', 'firebase'
                          , 'starter.controllers'
                          , 'starter.services'
                          , 'starter.directives'
                          , 'monospaced.elastic'
                          , 'ionic.contrib.ui.mizar-alcorCards2'
              ])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
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

.constant('FURL', 'https://mizaralcor.firebaseio.com/')

.config(function ($provide, $ionicConfigProvider, $compileProvider) {
  $ionicConfigProvider.tabs.position('bottom');
  // $ionicConfigProvider.scrolling.jsScrolling(false);
  // $translateProvider.useStaticFilesLoader({
  //     prefix: 'l10n/',
  //     suffix: '.json'
  //   });
  // $translateProvider.preferredLanguage("en");
  // $translateProvider.fallbackLanguage("en");
  $ionicConfigProvider.scrolling.jsScrolling(false);
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|cdvfile|file|filesystem|blob):|data:image\//);
  $ionicConfigProvider.backButton.text(null).icon('ion-arrow-left-c color-coral');
})
.config(function($stateProvider, $urlRouterProvider) {


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

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'AuthCtrl as auth'
  })

  .state('profile', {
    url: '/profile',
    views: {
      'profile': {
        templateUrl: 'templates/profile.html',
        controller: 'ProfileCtrl as prof',
        resolve: {
          auth: function($state, Auth) {
            return Auth.requireAuth().catch(function() {
              $state.go('login');
            });
          },

          profile: function(Auth) {
            return Auth.requireAuth().then(function(auth) {
              return Auth.getProfile(auth.uid).$loaded();
            });
          },

          about: function(Auth) {
            return Auth.requireAuth()
            .then(function(auth) {
              return Auth.getAbout(auth.facebook.accessToken);
            })
            .then(function(object) {
              return object.data.bio;
            });
          },
          images: function(Auth) {
            return Auth.requireAuth()
            .then(function(auth) {
              return Auth.getImages(auth.facebook.accessToken);
            })
            .then(function(object) {
              return object.data.data;
            });            
          },

        }       
      }
    }
  })
  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })

    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
