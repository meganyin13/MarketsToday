(function () {

    // homeCtrl.$inject = ['$scope', 'marketsTodayData'];
    function homeCtrl($scope, marketsTodayData) {
        var vm = this;

        vm.data = {markets: homeMarkets};
        var queryString = "";
        for (var market in homeMarketsSymbols) {
            queryString += homeMarketsSymbols[market].join(',') + ','
        }
        queryString.substring(0, queryString.length-1);

        marketsTodayData.querySymbols()
            .then((response) => {
                var symbols = queryString.split(',');
                for (var m in homeMarketsSymbols) {
                    for (var s in homeMarketsSymbols[m]){
                        let key = "";
                        switch (homeMarketsSymbols[m][s]) {
                            case '.DJI':
                                key = "Dow Jones";
                                break;
                            case '.SPX':
                                key = "S&P";
                                break;
                            case ".IXIC":
                                key = "NASDAQ";
                                break;
                            case ".RUT":
                                key = "Russell";
                                break;
                        }
                        let related = [];
                        for (var j in response.data) {
                            var curr_data = response.data[j];
                            if (homeMarketsSymbols[m][s] === curr_data.symbol) {
                                homeMarketsSymbols[m][s] = curr_data;
                                homeMarkets[m].stocks[s].name = curr_data.name;
                                homeMarkets[m].stocks[s].short_name = curr_data.short_name;
                                homeMarkets[m].stocks[s].components = curr_data.components;
                                homeMarkets[m].stocks[s].related = related;
                                // break;
                            }
                            if (key && curr_data.name.includes(key)) {
                                related.push(curr_data)
                            }
                        }
                    }
                }
            });

        function getData() {
            console.log("refresh");
            marketsTodayData.queryRealTime(queryString)
                .then(function (response) {
                    // vm.message = response.data.length == 1 ? "" : "No stock data found";
                    for (let d in response.data) {
                        let curr = response.data[d];
                        let symb = curr.symbol;
                        let found = false;
                        for (let m in homeMarkets) {
                            for (let s in homeMarkets[m].stocks) {
                                if (homeMarkets[m].stocks[s].symbol === symb) {
                                    found = true;
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
                                    // if (homeMarkets[m].stocks[s].related.length != 0) {
                                        console.log(homeMarkets[m].stocks[s].related);
                                    // }
                                    if (!homeMarkets[m].time || new Date(curr.ts) > new Date(homeMarkets[m].time)) {
                                        homeMarkets[m].time = curr.ts;
                                    }
                                    break;
                                }
                            }
                            if (found) break;
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
        getData();
        // setInterval(getData, 30*1000);
    }


    angular
        .module('marketsTodayApp')
        .controller('homeCtrl', homeCtrl);
})();


