angular
    .module('marketsTodayApp')
    .filter('addSign', addSign);

function addSign() {
    return function (delta) {
        if (delta > 0) {
            return "+" + delta;

        } else if (delta === 0){
            return delta;
        } else {
            return delta;
        }
    };
}