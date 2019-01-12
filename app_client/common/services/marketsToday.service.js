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

        // startTime should be Date() object
        var queryTimeSeries = function(symbol, startTime) {
            startTime = startTime.getFullYear() + prefixZero(startTime.getMonth() + 1) + prefixZero(startTime.getDate())
            + prefixZero(startTime.getHours()) + prefixZero(startTime.getMinutes()) + prefixZero(startTime.getSeconds());
            return $http.get(window.env.DB_URI + '/api/rt?symbols=' + symbol + "&start_time=" + startTime);
        };

        function prefixZero(num) {
            return "" + ( (num < 10) ? '0':'' ) + num;
        }

        return {
            queryRealTime: queryRealTime,
            querySymbols: querySymbols,
            queryTimeSeries: queryTimeSeries
        };
    }
})();
