(function() {
    angular
        .module('marketsTodayApp')
        .controller('searchCtrl', searchCtrl);

    // searchCtrl.$inject = ['$timeout', '$q', '$log', 'marketsTodayData'];
    // $timeout, $q, $log, marketsTodayData
    function searchCtrl($timeout, $q, marketsTodayData) {
        console.log("search");
        var self = this;

        self.symbols        = [];
        loadAll(self.symbols);
        self.querySearch   = querySearch;

        function querySearch (query) {
            // if (!query) {
            //     return "";
            // }

            var results = query ? self.symbols.filter( createFilterFor(query) ) : self.symbols,
                deferred;
            if (self.simulateQuery) {
                deferred = $q.defer();
                $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
                return deferred.promise;
            } else {
                return results;
            }
        }

        function loadAll(symbols) {
            let symbolsAdded = "";
            marketsTodayData.querySymbols()
                .then((response) => {
                    response.data.forEach(d => {
                        symbols.push({
                            value: d.symbol.toLowerCase(),
                            display: `${d.symbol}: ${d.name}`
                        });

                        if (d.components.length !== 0) {
                            d.components.forEach(c => {
                                symbols.push({
                                    value: c.symbol.toLowerCase() + ":" + c.name.toLowerCase(),
                                    symbol: c.symbol,
                                    display: `${c.symbol}: ${c.name}`
                                })
                            })
                        }
                    });
                    console.log(symbols);
                });
        }

        function createFilterFor(query) {
            var lowercaseQuery = query.toLowerCase();

            return function filterFn(symb) {
                return (symb.value.indexOf(lowercaseQuery) >= 0);
            };

        }
    }
})();