(function () {

    // homeCtrl.$inject = ['$scope', 'marketsTodayData'];
    function homeCtrl($scope, $uibModal, marketsTodayData) {
        var vm = this;

        let homePortfolio = [];

        vm.data = {
            markets: homeMarkets,
            portfolio: homePortfolio,
            portfolioTime: null
        };

        let portfolioSymbols = window.localStorage.getItem("Portfolio");
        if (portfolioSymbols) {
            homePortfolio = portfolioSymbols.split(",").map(p => {
                return {
                    symbol: p,
                    color: null,
                    price: null,
                    change: null,
                    change_pct: null,
                    name: null,
                    short_name: null,
                    ts: null
                }
            });
            renderPortfolio();
            setInterval(renderPortfolio, 30*1000);
        }

        var queryString = "";
        for (var market in homeMarketsSymbols) {
            queryString += homeMarketsSymbols[market].join(',') + ','
        }
        queryString = queryString.substring(0, queryString.length-1);

        var relatedQuery = "";
        if (typeof homeMarkets["North America"].stocks[0].related_symbols === 'string') {
            for (var m in homeMarkets) {
                for (var s in homeMarkets[m].stocks) {
                    if (homeMarkets[m].stocks[s].related_symbols) {
                        relatedQuery += homeMarkets[m].stocks[s].related_symbols + ",";
                    }
                }
            }

        } else {
            for (var m in homeMarkets) {
                for (var s in homeMarkets[m].stocks) {
                    if (homeMarkets[m].stocks[s].related_symbols) {
                        homeMarkets[m].stocks[s].related_symbols.forEach(r => relatedQuery += r.symbol + ",");
                    }
                }
            }
        }
        relatedQuery = relatedQuery.substring(0, relatedQuery.length-1);



        window.env.allSymbols = new Map();
        allSymbols = window.env.allSymbols;
        let homeStocks = {};

        marketsTodayData.querySymbols()
            .then((response) => {
                for (var j in response.data) {
                    var curr_data = response.data[j];
                    allSymbols.set(curr_data.symbol, response.data[j]);
                    let found = false;
                    for (var m in homeMarketsSymbols) {
                        for (var s in homeMarketsSymbols[m]){
                            if (homeMarketsSymbols[m][s] === curr_data.symbol) {
                                found = true;
                                homeStocks[curr_data.symbol] = homeMarkets[m].stocks[s];
                                homeMarkets[m].stocks[s].market = homeMarkets[m];
                                homeMarkets[m].stocks[s].name = curr_data.name;
                                homeMarkets[m].stocks[s].short_name = curr_data.short_name;
                                homeMarkets[m].stocks[s].components = curr_data.components;
                                break;
                            } else if (homeMarkets[m].stocks[s].related_symbols.includes(curr_data.symbol)) {
                                found = true;
                                let new_rel = {};
                                new_rel.name = curr_data.name;
                                new_rel.short_name = curr_data.short_name;
                                new_rel.symbol = curr_data.symbol;
                                homeStocks[curr_data.symbol] = new_rel;

                                if(!homeMarkets[m].stocks[s].related) {
                                    homeMarkets[m].stocks[s].related = [];
                                }
                                homeStocks[curr_data.symbol] = new_rel;
                                homeMarkets[m].stocks[s].related.push(new_rel);

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
                    for (let d in response.data) {
                        let curr = response.data[d];
                        let stock = homeStocks[curr.symbol];
                        stock.price = curr.price;
                        stock.change = curr.change;
                        stock.change_pct = curr.change_pct;
                        stock.color = getColor(curr);
                        stock.ts = curr.ts;
                        stock.market_status = curr.market_status;
                        let market = stock.market;
                        if (market && (!market.time || new Date(curr.ts) > new Date(market.time))) {
                            market.time = curr.ts;
                        }
                    }
                    // for (let m in homeMarkets) {
                    //     for (let s in homeMarkets[m].stocks) {
                    //         let rel_data = [];
                    //         let rel = homeMarkets[m].stocks[s].related;
                    //         if (!(typeof rel === 'string')) {
                    //             let a = "";
                    //             rel.forEach(d => { a += ","+d.symbol; });
                    //             rel = a.substring(1, a.length);
                    //         }
                    //         for (let d in response.data) {
                    //             let curr = response.data[d];
                    //             let symb = curr.symbol;
                    //             if (homeMarkets[m].stocks[s].symbol === symb) {
                    //                 if (curr.change > 0) {
                    //                     curr.color = "stock-up";
                    //                 } else if (curr.change < 0) {
                    //                     curr.color = "stock-down";
                    //                 } else {
                    //                     curr.color = "stock-unch";
                    //                 }
                    //                 let n = homeMarkets[m].stocks[s].name;
                    //                 let s_n = homeMarkets[m].stocks[s].short_name;
                    //                 let comp = homeMarkets[m].stocks[s].components;
                    //                 let r = homeMarkets[m].stocks[s].related;
                    //                 homeMarkets[m].stocks[s] = curr;
                    //                 homeMarkets[m].stocks[s].name = n;
                    //                 homeMarkets[m].stocks[s].short_name = s_n;
                    //                 homeMarkets[m].stocks[s].components = comp;
                    //                 homeMarkets[m].stocks[s].related = r;
                    //                 if (!homeMarkets[m].time || new Date(curr.ts) > new Date(homeMarkets[m].time)) {
                    //                     homeMarkets[m].time = curr.ts;
                    //                 }
                    //             } else if (rel.includes(curr.symbol)) {
                    //                 if (curr.change > 0) {
                    //                     curr.color = "stock-up";
                    //                 } else if (curr.change < 0) {
                    //                     curr.color = "stock-down";
                    //                 } else {
                    //                     curr.color = "stock-unch";
                    //                 }
                    //                 curr.name = allSymbols.get(curr.symbol).name;
                    //                 curr.short_name = allSymbols.get(curr.symbol).short_name;
                    //                 rel_data.push(curr);
                    //
                    //                 // if (rel_data.length === rel.split(",").length) break;
                    //             }
                    //         }
                    //         homeMarkets[m].stocks[s].related = rel_data;
                    //     }
                    // }
                    vm.data.markets = homeMarkets
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

        function getColor(row) {
            if (row.change > 0) {
                return "stock-up";
            } else if (row.change < 0) {
                return "stock-down";
            } else {
                return "stock-unch";
            }
        }

        function renderPortfolio() {
            marketsTodayData.queryRealTime(portfolioSymbols)
                .then((response) => {
                    if (response.data.length) {
                        homePortfolio = [];
                        response.data.forEach(d => {
                            if (vm.data.portfolioTime && new Date(d.ts) > new Date(vm.data.portfolioTime)) {
                                vm.data.portfolioTime = d.ts;
                                console.log("map");
                            } else if (!vm.data.portfolioTime) {
                                vm.data.portfolioTime = d.ts;
                            }
                            homePortfolio.push({
                                price: d.price,
                                name: d.name,
                                change: d.change,
                                symbol: d.symbol,
                                change_pct: d.change_pct,
                                short_name: d.short_name,
                                color: getColor(d)
                            })

                        });
                        vm.data.portfolio = homePortfolio;
                    }
                    else {
                        let temp = [];
                        response.data.color = getColor(response.data);
                        temp.push(response.data);
                        vm.data.portfolio = temp;
                        vm.data.portfolioTime = response.data.ts;
                    }
                })
        }

        // vm.popupReviewForm = function () {
        //     var modalInstance = $uibModal.open({
        //         templateUrl: '/portfolioModal/portfolioModal.view.html',
        //         controller: 'portfolioModalCtrl as vm',
        //         // resolve : {
        //         //     portfolioData : function () {
        //         //         return {
        //         //             portfolio: vm.data.portfolio
        //         //         };
        //         //     }
        //         // }
        //     });
        //
        //     modalInstance.result.then(function (response) {
        //         vm.data.location.reviews.push(response.data);
        //     });
        // };
    }


    angular
        .module('marketsTodayApp')
        .controller('homeCtrl', homeCtrl);
})();

