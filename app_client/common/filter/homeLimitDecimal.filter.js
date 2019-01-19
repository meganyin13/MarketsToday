angular
    .module('marketsTodayApp')
    .filter('homeLimitDecimal', homeLimitDecimal);

function homeLimitDecimal() {
    return function(str) {
        let f = parseFloat(str).toFixed(2);
        return (f !== "0.00" || "-0.00") ? "" + f : str;
    };
}