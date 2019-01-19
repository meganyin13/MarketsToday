(function () {
    angular.module('marketsTodayApp', ['ngRoute', 'ngSanitize', 'ngMaterial', 'ui.bootstrap']);

    function config($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'home/home.view.html',
                controller: 'homeCtrl',
                controllerAs: 'vm'
            })
            .when('/detail/:stocksymbol', {
                templateUrl: 'detail/stockDetail.view.html',
                controller: 'stockDetailCtrl',
                controllerAs: 'vm'
            })
            // .when('/register', {
            //     templateUrl: '/auth/register/register.view.html',
            //     controller: 'registerCtrl',
            //     controllerAs: 'vm'
            // })
            // .when('/login', {
            //     templateUrl: '/auth/login/login.view.html',
            //     controller: 'loginCtrl',
            //     controllerAs: 'vm'
            // })
            .otherwise({redirectTo: '/'});
        $locationProvider.html5Mode(true);
    }

    angular
        .module('marketsTodayApp')
        .config(['$routeProvider', '$locationProvider', config]);
})();