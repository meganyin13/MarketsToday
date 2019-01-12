(function () {

    // homeCtrl.$inject = ['$scope', 'marketsTodayData'];
    function homeCtrl($scope, marketsTodayData) {
        var vm = this;

        vm.data = {markets: homeMarkets};
        var queryString = "";
        for (var market in homeMarketsSymbols) {
            queryString += homeMarketsSymbols[market].join(',') + ','
        }
        queryString = queryString.substring(0, queryString.length-1);

        var relatedQuery = "";
        for (var m in homeMarkets) {
            for (var s in homeMarkets[m].stocks) {
                if (homeMarkets[m].stocks[s].related) {
                    relatedQuery += homeMarkets[m].stocks[s].related + ",";
                }
            }
        }
        relatedQuery = relatedQuery.substring(0, relatedQuery.length-1);

        window.env.allSymbols = new Map();
        allSymbols = window.env.allSymbols;
        let homeStocks;

        marketsTodayData.querySymbols()
            .then((response) => {
                console.log("1")
                var symbols = queryString.split(',');
                for (var j in response.data) {
                    var curr_data = response.data[j];
                    allSymbols.set(curr_data.symbol, response.data[j]);
                    let found = false;
                    for (var m in homeMarketsSymbols) {
                        for (var s in homeMarketsSymbols[m]){
                            if (homeMarketsSymbols[m][s] === curr_data.symbol) {
                                found = true;
                                homeMarketsSymbols[m][s] = curr_data;
                                homeMarkets[m].stocks[s].name = curr_data.name;
                                homeMarkets[m].stocks[s].short_name = curr_data.short_name;
                                homeMarkets[m].stocks[s].components = curr_data.components;
                                break;
                            }
                        }
                        if (found) break;
                    }

                }
                getData();

            });

        function getData() {
            console.log("refresh");
            marketsTodayData.queryRealTime(queryString + "," + relatedQuery)
                .then(function (response) {
                    for (let m in homeMarkets) {
                        for (let s in homeMarkets[m].stocks) {
                            let rel_data = [];
                            let rel = homeMarkets[m].stocks[s].related;
                            for (let d in response.data) {
                                let curr = response.data[d];
                                let symb = curr.symbol;
                                if (homeMarkets[m].stocks[s].symbol === symb) {
                                    if (curr.change > 0) {
                                        curr.color = "stock-up";
                                    } else if (curr.change < 0) {
                                        curr.color = "stock-down";
                                    } else {
                                        curr.color = "stock-unch";
                                    }
                                    let n = homeMarkets[m].stocks[s].name;
                                    let s_n = homeMarkets[m].stocks[s].short_name;
                                    let comp = homeMarkets[m].stocks[s].components;
                                    let r = homeMarkets[m].stocks[s].related;
                                    homeMarkets[m].stocks[s] = curr;
                                    homeMarkets[m].stocks[s].name = n;
                                    homeMarkets[m].stocks[s].short_name = s_n;
                                    homeMarkets[m].stocks[s].components = comp;
                                    homeMarkets[m].stocks[s].related = r;
                                    if (!homeMarkets[m].time || new Date(curr.ts) > new Date(homeMarkets[m].time)) {
                                        homeMarkets[m].time = curr.ts;
                                    }
                                } else if (rel.includes(curr.symbol)) {
                                    if (curr.change > 0) {
                                        curr.color = "stock-up";
                                    } else if (curr.change < 0) {
                                        curr.color = "stock-down";
                                    } else {
                                        curr.color = "stock-unch";
                                    }
                                    curr.name = allSymbols.get(curr.symbol).name;
                                    curr.short_name = allSymbols.get(curr.symbol).short_name;
                                    rel_data.push(curr);

                                    // if (rel_data.length === rel.split(",").length) break;
                                }
                            }
                            homeMarkets[m].stocks[s].related = rel_data;
                        }
                    }
                    vm.data = {markets: homeMarkets}
                }, function (response) {
                    homeMarkets[market].stocks = [{
                        "symbol": "",
                        "change": 0,
                        "change_pct": 0,
                        "market_status": "",
                        "price": 0.00,
                        "ts": "",
                        "color": "stock-unch"
                    }]
                })
        }

       setInterval(getData, 30*1000);
    }


    angular
        .module('marketsTodayApp')
        .controller('homeCtrl', homeCtrl);
})();

