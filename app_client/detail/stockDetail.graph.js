(function () {
    angular
        .module("marketsTodayApp")
        .controller('stockDetailGraphCtrl', stockDetailGraphCtrl);

    stockDetailGraphCtrl.$inject = ['$scope', '$routeParams', 'marketsTodayData'];
    function stockDetailGraphCtrl($scope, $routeParams, marketsTodayData) {
        let keySymbol = $routeParams.stocksymbol;
        var globals = {};

        var split_by_params = {
            title: keySymbol + " Line Chart",
            data: null,
            width: screen.width - 20,
            height: 300,
            right: 20,
            target: document.getElementById('chart'),
            x_accessor: 'date',
            y_accessor: 'Price',
            yax_format: d3.format("5d"),
            transition_on_update: false
        };



        $scope.getInitialData = function() {
            let date = new Date('2019-01-13T13:00:00');
            let start_time = "093000";
            let end_time = addZeros(date.getHours()) + ":" + addZeros(date.getMinutes()) + ":" + addZeros(date.getSeconds());
            let closing_time = "16:00:00";
            date.setDate(date.getDate() - 1); // should i really go back to prev. day?

            if (date.getDay() === 0) {
                date.setDate(d.getDate() - 2)
            } else if (date.getDay() === 6) {
                date.setDate(date.getDate() - 1);
            }

            if (Date.parse(`01/01/2019 ${end_time}`) > Date.parse(`01/01/2019 ${closing_time}`)) {
                end_time = closing_time;
            }
            end_time = end_time.split(":").join("");

            let start_dateString = date.getFullYear() + addZeros(date.getMonth()+1) + addZeros(date.getDate()) + start_time;
            let end_dateString = date.getFullYear() + addZeros(date.getMonth()+1) + addZeros(date.getDate()) + end_time;
                //addZeros(date.getHours()) + addZeros(date.getMinutes()) + addZeros(date.getSeconds());

            // 20190112093000
            d3.json(`http://api.ai4stocks.com/api/rt?symbols=${keySymbol}&start_time=${start_dateString}&end_time=${end_dateString}&interval=1M`, function (err, data) {
                console.log(data);
                // data = data[0].records;
                data = data[keySymbol];
                data = data.map((d) => {
                    return {
                        date: d3.isoParse(d.ts),
                        Price: d.price,
                        Change: d.change,
                        "Change Percent": d.change_pct
                    }
                });
                split_by_params.data = data;
                split_by_params.min_Price = d3.min(data, function(d) { return d.Price });
                split_by_params.max_Price = d3.max(data, function(d) { return d.Price });
                split_by_params.min_Change = d3.min(data, function(d) { return d.Change });
                split_by_params.max_Change = d3.max(data, function(d) { return d.Change });
                split_by_params["min_Change Percent"] = d3.min(data, function(d) { return d["Change Percent"] });
                split_by_params["max_Change Percent"] = d3.max(data, function(d) { return d["Change Percent"] });
                split_by_params.min_y = split_by_params.min_Price;
                split_by_params.max_y = split_by_params.max_Price;

                // split_by_params.yax_format = d3.format('2p');

                MG.data_graphic(split_by_params);
            });
        };

        addZeros = function(num) {
            return (num < 10) ? "0" + num : "" + num;
        };

        $scope.changeContent = function(s) {
            split_by_params.y_accessor = s;
            split_by_params.max_y = split_by_params[`max_${s}`];
            split_by_params.min_y = split_by_params[`min_${s}`];

            // change button state
            $('#' + s.split(" ").join("")).addClass('active').siblings().removeClass('active');

            // update data
            delete split_by_params.xax_format;
            MG.data_graphic(split_by_params);
        };

        $scope.changeTimeInterval = function(interval) {
            $('#' + interval).addClass('active').siblings().removeClass('active');
            let date = new Date();

            let month_re = new RegExp("(1|2|3|6)m");
            let year_re = new RegExp("(1|5)y");

            let data_interval = null;
            let data_type = null;

            if (interval === "1d") {
                date.setDate(date.getDate() - 1);

                if (date.getDay() === 0) {
                    date.setDate(d.getDate() - 2)
                } else if (date.getDay() === 6) {
                    date.setDate(date.getDate() - 1);
                }
                data_interval = "1H";
                data_type = "rt";
            } else if (month_re.test(interval)) {
                date.setMonth(date.getMonth() - parseInt(interval.charAt(0)));
                data_interval = "1D";
                data_type = "ts";
            } else if (interval === "ytd") {
                date.setMonth(0);
                date.setDate(1);
                date.setHours(0);
                date.setMinutes(0);
                data_type = "ts";
            } else if (year_re.test(interval)) {
                date.setFullYear(date.getFullYear() - parseInt(interval.charAt(0)));
                data_interval = "1D";
                data_type = "ts";
            } else if (interval === "all") {
                date = null;
                data_interval = "1M";
                data_type = "ts";
            }

            let dateString = "";
            if (date !== null) {
                dateString = "&start_time=" + date.getFullYear() + addZeros(date.getMonth()+1) + addZeros(date.getDate()) +
                    addZeros(date.getHours()) + addZeros(date.getMinutes()) + addZeros(date.getSeconds());
            }


            d3.json(`http://api.ai4stocks.com/api/${data_type}?symbols=${keySymbol}${dateString}&interval=${data_interval}`, function (err, data) {
                if (data_type === "rt") {
                    data = data[keySymbol];
                    data = data.map((d) => {
                        return {
                            date: d3.isoParse(d.ts),
                            Price: d.price,
                            Change: d.change,
                            "Change Percent": d.change_pct
                        }
                    });
                    split_by_params.min_Price = d3.min(data, function(d) { return d.Price });
                    split_by_params.max_Price = d3.max(data, function(d) { return d.Price });
                    split_by_params.min_Change = d3.min(data, function(d) { return d.Change });
                    split_by_params.max_Change = d3.max(data, function(d) { return d.Change });
                    split_by_params["min_Change Percent"] = d3.min(data, function(d) { return d["Change Percent"] });
                    split_by_params["max_Change Percent"] = d3.max(data, function(d) { return d["Change Percent"] });
                    split_by_params.min_y = split_by_params.min_Price;
                    split_by_params.max_y = split_by_params.max_Price;
                } else {
                    data = data[0].records;
                    data = data.map((d) => {
                        return {
                            date: d3.isoParse(d.ts),
                            Price: d.close
                        }
                    });
                    split_by_params.min_Price = d3.min(data, function(d) { return d.Price });
                    split_by_params.max_Price = d3.max(data, function(d) { return d.Price });
                    split_by_params.min_y = split_by_params.min_Price;
                    split_by_params.max_y = split_by_params.max_Price;
                }

                split_by_params.data = data;
                MG.data_graphic(split_by_params);

            });
        };

        $scope.getInitialData();
    }
})();
