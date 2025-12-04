var app = angular.module("LifeProgApp", []);


app.controller('LifeProgAppController', ['$scope', function ($scope) {
    $scope.user = {};  // object to store form data
    $scope.users = []; // array to store submitted users

    $scope.saveRegistration = function () {
        if ($scope.regForm.$valid) {
            $scope.users.push(angular.copy($scope.user));
            $scope.user = {};           // reset form model
            $scope.regForm.$setPristine();  // reset form state
            $scope.regForm.$setUntouched();
            alert('Registration saved successfully!');
        } else {
            alert('Please complete all required fields.');
        }
    };
}]);

