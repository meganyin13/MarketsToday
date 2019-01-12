(function() {


    function stockDetailCtrl($routeParams, $location, marketsTodayData) {
        var vm = this;
        vm.stocksymbol = $routeParams.stocksymbol;

        vm.currentPath = $location.path();

        var allSymbols = {};
        var keySymbol = null;
        console.log(vm.stocksymbol);
        vm.components = [];

        marketsTodayData.querySymbols()
            .then((response) => {
                keySymbol = response.data.filter(i => i.symbol === vm.stocksymbol)[0];
                const comp = response.data.filter(i => i.symbol === vm.stocksymbol)[0].components;
                comp.forEach(c => {
                    allSymbols[c.symbol] = {
                        symbol: c.symbol,
                        name: c.name,
                        change: null,
                        change_pct: null,
                        market_status: null,
                        price: null,
                        ts: null
                    };
                    vm.components.push(allSymbols[c.symbol]);
                });
                getKeyStock();
                getComponents(comp.map(c => c.symbol).join(","));
            });

        function getKeyStock() {
            marketsTodayData.queryRealTime(vm.stocksymbol)
                .then((response) => {
                    vm.keyStock = {
                        price: response.data[0].price,
                        change: response.data[0].change,
                        change_pct: response.data[0].change_pct,
                        market_status: response.data[0].market_status,
                        name: keySymbol.name,
                        ts: response.data[0].ts,
                        symbol: keySymbol.symbol,
                        color: getColor(response.data[0])
                    };
                });
        }

        function getComponents(query) {
            marketsTodayData.queryRealTime(query)
                .then((response) => {
                    for (var d in response.data) {
                        var symbol = allSymbols[response.data[d].symbol];
                        symbol.price = response.data[d].price;
                        symbol.change = response.data[d].change;
                        if (symbol.change > 0) {
                            symbol.color = "stock-up";
                        } else if (symbol.change < 0) {
                            symbol.color = "stock-down";
                        } else {
                            symbol.color = "stock-unch";
                        }
                        symbol.change_pct = response.data[d].change_pct;
                        symbol.market_status =response.data[d].market_status;
                        symbol.ts = response.data[d].ts;
                    }
                })
        }

        function getColor(row) {
            if (row.change > 0) {
                return "stock-up";
            } else if (row.change < 0) {
                return "stock-down";
            } else {
                return "stock-unch";
            }
        }
    }

    stockDetailCtrl.$inject = ['$routeParams', '$location', 'marketsTodayData'];
    angular
        .module('marketsTodayApp')
        .controller('stockDetailCtrl', stockDetailCtrl);
})();