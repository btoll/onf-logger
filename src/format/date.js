'use strict';

let displayDateTpl = '[{getDateString} {getTimeString}]',
    // Set some sensible defaults.
    dateTpl = '{Y}-{m}-{d}',
    timeTpl = '{H}:{i}:{s}.{ms}';

const base = require('./base'),
    tokenRe = /{([a-zA-Z]+)}/g,
    // Will call methods on JavaScript's Date object.
    formatDateString = tpl => d => tpl.replace(tokenRe, (a, $1) => d[dateObjectMethods[$1]]()),
    // Glues the sub-templates together.
    getDisplayDateString = () => {
        const d = new Date();
        return displayDateTpl.replace(tokenRe, (a, $1) => tpls[$1](d));
    },
    // TODO: Closure is bad here!
    tpls = {
        getDateString: formatDateString(dateTpl),
        getTimeString: formatDateString(timeTpl)
    },
    dateObjectMethods = {
        d: 'getDate',
        H: 'getHours',
        i: 'getMinutes',
        m: 'getMonth',
        s: 'getSeconds',
        ms: 'getMilliseconds',
        Y: 'getFullYear'
    };

module.exports = Object.setPrototypeOf({
    prelog: methodName => {
        return `${base.colorize(methodName, getDisplayDateString())} ${base.prelog(methodName)}`;
    },
    setDateTpl: tpl => dateTpl = tpl,
    setTimeTpl: tpl => timeTpl = tpl,
    setDisplayDateTpl: tpl => displayDateTpl = tpl
}, base);

