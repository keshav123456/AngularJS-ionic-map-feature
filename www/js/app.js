// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
podmap = angular.module('starter', ['ionic', 'firebase'])


podmap.run(initializeIonic)
initializeIonic.$inject = ['$ionicPlatform','$ionicHistory','$ionicLoading']
function initializeIonic($ionicPlatform,$ionicHistory,$ionicLoading) {
  

 $ionicPlatform.onHardwareBackButton(function() {$ionicHistory.goBack()});
  $ionicPlatform.ready(function() {
      
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true)

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true)
    }
    if(window.StatusBar) {
      StatusBar.styleDefault()
    }
  });

  $ionicPlatform.registerBackButtonAction(function (event) {
      $ionicHistory.goBack();
  });
}


podmap.factory("Items", function($firebaseArray) {
   var itemsRef = new Firebase("https://items-36168.firebaseio.com/");
    return $firebaseArray(itemsRef);
   })

