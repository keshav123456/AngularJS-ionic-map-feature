
podmap.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider)
{
  $stateProvider

  .state('home', {
    url: '/home',
    views: {
      '': {
        templateUrl: 'templates/home.html'
      }
    }
  })

  $urlRouterProvider.otherwise('/home')
}])

  


