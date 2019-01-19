(function () {
    angular
        .module('marketsTodayApp')
        .directive('headingGeneric', headingGeneric);
    function headingGeneric () {
        return {
            restrict: 'EA',
            templateUrl: '/common/directive/headingGeneric/headingGeneric.template.html'
        };
    }
})();