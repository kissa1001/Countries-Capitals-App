angular.module('App', ['DataServices', 'Data','ngRoute','ngAnimate'])
.config(['$locationProvider','$routeProvider',
  function($locationProvider, $routeProvider) {
    $routeProvider
    .when('/', {
        templateUrl: './views/home.html',
        controller : 'HomeCtrl'
    })  
    .when('/countries', {
        templateUrl:'./views/countries.html',
        controller: 'CountriesCtrl'
    })
    .when('/countries/:countryCode', {
        templateUrl : './views/country.html',
        controller : 'CountryCtrl'
    })
    .when('/error', {
        template : '<p>Error Page Not Found</p>'
    });
}])
.controller('HomeCtrl', ['$scope','countryData', function($scope, countryData) {}])
.controller('CountriesCtrl', ['$scope','$location','$filter','countryData', '$q', function($scope, $location, $filter, countryData, $q) {
  'use strict';

  var toString = Object.prototype.toString;

  //checking to see if API call returned any data
  $q.when(countryData.countries).then(function(result){
    //checking to see if promise returns an object result
    if(toString.call(countryData.countries)=='[object Object]') {
      countryData.countries = result.geonames;
  }
  $scope.countries = countryData.countries;
});

  $scope.showDetail = function(country) {
    $location.path('/countries/'+country.countryCode);
};


$scope.predicate = 'countryName';
$scope.reverse=false;

angular.forEach($scope.countries, function (country) {
    country.areaInSqKm = parseFloat(country.areaInSqKm);
    country.population = parseFloat(country.population);
});


$scope.startsWith = function (actual, expected) {
    var lowerStr = (actual + "").toLowerCase();
    return lowerStr.indexOf(expected.toLowerCase()) === 0;
};
}])
.controller('CountryCtrl', ['$scope','$route','countryData',function($scope,$route, countryData) {

  countryData.getCountry($route.current.params.countryCode).then(function(result){
    $scope.country=result[0];
    console.log($scope.country);
});

  countryData.getCapitals($route.current.params.countryCode).then(function(result){
    $scope.capital = result;
    $scope.capitalPopulation = $scope.capital.population;
});

  countryData.getNeighbors($route.current.params.countryCode).then(function(result){
    $scope.neighbors = result.geonames;
});

  $scope.flag = $route.current.params.countryCode.toLowerCase();
  $scope.map = $route.current.params.countryCode;

}])
.run(function($rootScope, $location, $timeout) {
    $rootScope.$on('$routeChangeError', function() {
        $location.path("/error");
    });
    $rootScope.$on('$routeChangeStart', function() {
        $rootScope.isLoading = true;
    });
    $rootScope.$on('$routeChangeSuccess', function() {
      $timeout(function() {
        $rootScope.isLoading = false;
      }, 1000);
    });
});