angular
    .module('marketsTodayApp')
    .controller('dropdownCtrl', dropdownCtrl);

function dropdownCtrl($scope) {
    $scope.showDropdown = false;
    $scope.toggleDropdown = function() {
        $scope.showDropdown = !$scope.showDropdown;
    }
}