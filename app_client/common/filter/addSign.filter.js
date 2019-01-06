angular
    .module('marketsTodayApp')
    .filter('addSign', addSign);
// var _isNumeric = function (n) {
//     return !isNaN(parseFloat(n)) && isFinite(n);
// };

// function addRowColor(row) {
//     row.addClass('')
// }

function addSign() {
    return function (delta) {
        var numDistance, unit;
        if (delta > 0) {
            // $(this).parent.addClass('stock-up');
            return "+" + delta;

        } else if (delta === 0){
            // $(this).parent.addClass('stock-unch');
            return delta;
        } else {
            // $(this).parent.addClass('stock-down');
            return delta;
        }
    };
}