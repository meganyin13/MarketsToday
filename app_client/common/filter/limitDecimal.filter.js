angular
    .module('marketsTodayApp')
    .filter('limitDecimal', limitDecimal);

function limitDecimal() {
    return function(str) {
        if (str.indexOf("-") === -1 || str.indexOf("-") === 0)  {
            return parseFloat(str).toFixed(2);
        } else {
            return str;
        }
    };
}