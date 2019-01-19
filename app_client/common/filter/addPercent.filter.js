angular
    .module('marketsTodayApp')
    .filter('addPercent', addPercent);

function addPercent() {
    return function(str) {
        return str + "%"
    };
}