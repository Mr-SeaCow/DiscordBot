/* util.js
 *
 * Summary: This module provides some generic functions used throughout
 *          the discord bot.
 * Author: Matthew Van Vleet
 * Date: 5/19/2020
 * Summary of Modifications:
 */
module.exports.g = (title, stats) => {
    return stats.find(s => s.name === title).value
}

module.exports.r = (str, val) => {
    str = String(str)
    return str.replace(val, '');
}

module.exports.capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

module.exports.decapitalize = (str) => {
    return str.charAt(0).toLowerCase() + str.slice(1)
}

module.exports.bound = (val, min, max) => {
    return val >= min && val <= max;
}

module.exports.getFormattedReportTime = () => {
    const curDate = new Date();

    let dateStr = '';

    dateStr += '[';
    dateStr += formatNumToTwoDigits(curDate.getMonth());
    dateStr += '/';
    dateStr += formatNumToTwoDigits(curDate.getDay());
    dateStr += '/';
    dateStr += formatNumToTwoDigits(curDate.getFullYear());
    dateStr += ' ';
    dateStr += formatNumToTwoDigits(curDate.getHours());
    dateStr += ':';
    dateStr += formatNumToTwoDigits(curDate.getMinutes());
    dateStr += ':';
    dateStr += formatNumToTwoDigits(curDate.getSeconds());
    dateStr += ']';

    return dateStr;

    function formatNumToTwoDigits(num) {
        return ('0' + num).slice(-2);
    }
}