angular
    .module('marketsTodayApp')
    .filter('formatTimestamp', formatTimestamp);


function formatTimestamp() {
    return function (ts) {
        if (!ts) {
            return "";
        }
        let d = new Date(ts);
        console.log(d);
        return "" + prefixZero(d.getMonth()+1) + "-" + prefixZero(d.getDate()) + " " + prefixZero(d.getHours())
            + ":" + prefixZero(d.getMinutes())+ ":" + prefixZero(d.getSeconds());
    };
}

function prefixZero(num) {
    return "" + ( (num < 10) ? '0':'' ) + num;
}

function convertDateToUTC(date) {
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
}