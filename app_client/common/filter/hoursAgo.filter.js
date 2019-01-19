angular
    .module('marketsTodayApp')
    .filter('hoursAgo', hoursAgo);


function hoursAgo() {
    return function (ts) {
        let d = new Date(ts);
        // console.log(d);
        let diff = Math.round((new Date() - d) / (60*60*1000));
        if (diff <= 1) {
            return "1 hour ago"
        } else if (diff >= 36) {
            diff = Math.ceil((new Date() - d) / (24*60*60*1000))
            return  diff + " days ago";
        } else {
            return diff + " hours ago";
        }

    };
}