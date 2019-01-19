(function () {
    angular
        .module('marketsTodayApp')
        .controller('portfolioModalCtrl', portfolioModalCtrl);

    portfolioModalCtrl.$inject = ['$uibModalInstance', 'marketsTodayData'];

    function portfolioModalCtrl($uibModalInstance, marketsTodayData) {
        var vm = this;
        // vm.portfolioData = portfolioData;
        vm.modal = {
            close : function(result) {
                $uibModalInstance.close(result);
            },
            cancel : function () {
                $uibModalInstance.dismiss('cancel');
            }
        };
    }
})();