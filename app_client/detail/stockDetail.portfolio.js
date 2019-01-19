(function () {
    angular
        .module('marketsTodayApp')
        .controller('stockDetailPortfolioCtrl', stockDetailPortfolioCtrl);

    stockDetailPortfolioCtrl.$inject = ['$scope', '$routeParams', 'marketsTodayData'];
    function stockDetailPortfolioCtrl($scope, $routeParams, marketsTodayData) {
        let stocksymbol = $routeParams.stocksymbol;
        let localStorage = window.localStorage;

        $scope.saveToPortfolio = function () {
            let star = $('#star');
            if (!star.hasClass("added")) {
                let item = localStorage.getItem("Portfolio");
                if (item) {
                    localStorage.setItem("Portfolio", `${item},${stocksymbol}`);
                } else {
                    localStorage.setItem("Portfolio", stocksymbol);
                }
                let popup = document.getElementById("portfolioPopupSave");
                star.addClass("added");
                popup.classList.toggle("show");

                setTimeout(function () { popup.style.display = 'none'} , 3000);
            } else {
                if (localStorage.Portfolio.indexOf(",") !== -1) {
                    let re = new RegExp(`(,)?${stocksymbol}(,)?`);
                    localStorage.Portfolio = localStorage.Portfolio.replace(re, "");
                } else {
                    localStorage.Portfolio = "";
                }
                let popup = document.getElementById("portfolioPopupRemove");
                popup.classList.toggle("show");

                setTimeout(function () { popup.style.display = 'none'} , 3000);

                star.removeClass("added");
            }

            console.log(localStorage);
        }
    }
})();