(function() {
    angular
        .module('marketsTodayApp')
        .constant('allSymbols', allSymbols);


        var allSymbols = new Map();

        marketsTodayData.querySymbols()
            .then((response) => {
                for (var j in response.data) {
                    allSymbols.set(curr_data.symbol, response.data[j]);
                }
            });


})();