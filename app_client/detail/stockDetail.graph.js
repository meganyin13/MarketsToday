(function () {
    angular
        .module("marketsTodayApp")
        .controller('stockDetailGraphCtrl', stockDetailGraphCtrl);

    stockDetailGraphCtrl.$inject = ['$scope', '$routeParams', 'marketsTodayData'];
    function stockDetailGraphCtrl($scope, $routeParams, marketsTodayData) {
        let keySymbol = $routeParams.stocksymbol;

        $scope.updateChart = function(d) {
            d3.json(`http://api.ai4stocks.com/api/rt?symbols=${keySymbol}&start_time=20190111093000`, function (err, data) {
                console.log(data);
                data = data[keySymbol];
                let chart_data = [];
                data = data.map((d) => {
                    return {
                        date: d3.isoParse(d.ts),
                        price: d.price
                    }
                });
                    //MG.convert.date(data, 'ts');
                MG.data_graphic({
                    title: keySymbol + " Line Chart",
                    // description: "This is a simple line chart. You can remove the area portion by adding area: false to the arguments list.",
                    data: data,
                    width: screen.width - 20,
                    height: 300,
                    right: 20,
                    target: document.getElementById('chart'),
                    x_accessor: 'date',
                    y_accessor: 'price',
                    min_y: d3.min(data, function (d) {
                        return d.price;
                    }),
                    max_y: d3.max(data, function (d) {
                        return d.price;
                    }),
                });
            });
        };
        $scope.updateChart();
    }
})();
