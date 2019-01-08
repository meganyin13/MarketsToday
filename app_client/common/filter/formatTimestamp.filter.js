angular
    .module('marketsTodayApp')
    .filter('formatTimestamp', formatTimestamp);


function formatTimestamp() {
    return function (ts) {
        let d = convertDateToUTC(new Date(ts));
        return "" + prefixZero(d.getMonth()+1) + "-" + prefixZero(d.getDate()) + " " + prefixZero(d.getHours())
            + ":" + prefixZero(d.getMinutes())+ ":" + prefixZero(d.getSeconds());
    };
}

// function formatTimestamp() {
//     return function (ts) {
//         let d = new Date(ts);
//         return "Updated " + (new Date() - d) +  " seconds ago";
//     };
// }

function prefixZero(num) {
    return "" + ( (num < 10) ? '0':'' ) + num;
}

function convertDateToUTC(date) {
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
}