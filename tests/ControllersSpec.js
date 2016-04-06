describe('App', function () {

  var controller = null;
  $scope = null;

  beforeEach(function () {
    module('App');
  });

  beforeEach(inject(function ($controller, $rootScope) {
    $scope = $rootScope.$new();
    controller = $controller('CountriesCtrl', {
      $scope: $scope
    });
  }));

  it('initial predicate value should equal country name', function () {
    expect($scope.predicate).toEqual("countryName");
  });

});