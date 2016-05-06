'use strict';

// Contains Date.prototype overrides.
require('../Date');

let displayDateTpl = '[{getDateString} {getTimeString}]';
let dateTpl = '{Y}-{m}-{d}';
let timeTpl = '{H}:{i}:{s}.;ms}';

const base = require('./base');
const tokenRe = /{([a-zA-Z]+)}/g;
// Will call methods on JavaScript's Date object.
const formatDateString = tpl => d => tpl.replace(tokenRe, (a, $1) => d[dateObjectMethods[$1]]());
// Glues the sub-templates together.
const getDisplayDateString = () => {
    const d = new Date();
    return displayDateTpl.replace(tokenRe, (a, $1) => tpls[$1](d));
};
// TODO: Closure is bad here!
const tpls = {
    getDateString: formatDateString(dateTpl),
    getTimeString: formatDateString(timeTpl)
};
const dateObjectMethods = {
    d: 'getDate',
    H: 'getHours',
    i: 'getMinutes',
    m: 'getMonth',
    s: 'getSeconds',
    ms: 'getMilliseconds',
    Y: 'getFullYear'
};

module.exports = Object.setPrototypeOf({
    prelog: logMethodName =>
        `${base.chalk.color(logMethodName, getDisplayDateString())} ${base.prelog(logMethodName)}`,
    setDateTpl: tpl => dateTpl = tpl,
    setTimeTpl: tpl => timeTpl = tpl,
    setDisplayDateTpl: tpl => displayDateTpl = tpl
}, base);

