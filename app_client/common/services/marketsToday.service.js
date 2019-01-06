(function() {
    angular
        .module('marketsTodayApp')
        .service('marketsTodayData', marketsTodayData);

    marketsTodayData.$inject = ['$http'];
    function marketsTodayData($http) {
        var queryRealTime = function (symbol) {
            return $http.get(window.env.DB_URI + '/api/rt?symbols=' + symbol)
        };
        var querySymbols = function() {
            return $http.get(window.env.DB_URI + '/api/symbols')
        };
        // var locationById = function (locationid) {
        //     return $http.get(window.env.DB_URI+ '/api/locations/' + locationid);
        // };

        return {
            queryRealTime: queryRealTime,
            querySymbols: querySymbols
        };
    }
})();
