(function() {
    function stockDetailCtrl($scope, $routeParams, $location, marketsTodayData) {
        var vm = this;

        vm.stocksymbol = $routeParams.stocksymbol;

        if (window.localStorage.getItem("Portfolio") && window.localStorage.getItem("Portfolio").includes(vm.stocksymbol)) {
            $('#' + "star").addClass("added");
        }

        vm.currentPath = $location.path();

        var allSymbols = {};
        var keySymbol = null;
        console.log(vm.stocksymbol);
        vm.components = [];

        marketsTodayData.querySymbols()
            .then((response) => {
                keySymbol = response.data.filter(i => i.symbol === vm.stocksymbol)[0];
                if (keySymbol) {
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
                        getComponents(comp.map(c => c.symbol).join(","));
                    });
                }
                getKeyStock();
            });

        getFundamentals();

        function getKeyStock() {
            marketsTodayData.queryRealTime(vm.stocksymbol)
                .then((response) => {
                    vm.keyStock = {
                        price: response.data.price,
                        change: response.data.change,
                        change_pct: response.data.change_pct,
                        market_status: response.data.market_status,
                        name: response.data.name,
                        short_name: response.data.short_name,
                        ts: response.data.ts,
                        symbol: response.data.name,
                        color: getColor(response.data)
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

        function getFundamentals() {
            vm.fundamentals = {};
            marketsTodayData.queryRealTime(vm.stocksymbol)
                .then((response) => {
                    // if (response.data.asset_type === "INDEX") {
                    //     vm.fundamentals.keys = [];
                        vm.fundamentals = Object.keys(response.data.fundamentals).map(k => {
                            return {
                                label: k.split("_").join(" "),
                                val: response.data.fundamentals[k]
                            }
                        });
                    // }
                    vm.news = response.data.news;
                    console.log(vm.news);

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

    stockDetailCtrl.$inject = ['$scope', '$routeParams', '$location', 'marketsTodayData'];
    angular
        .module('marketsTodayApp')
        .controller('stockDetailCtrl', stockDetailCtrl);
})();