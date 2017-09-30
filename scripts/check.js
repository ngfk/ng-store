'use strict';

const utils = require('./utils');
const test = require('./test');
const build = require('./build');

const check = async project => {
    let success;

    success = await test(project, false);
    if (!success) {
        utils.setExit(1);
        return false;
    }

    success = await build(project);
    if (!success) {
        utils.setExit(1);
        return false;
    }

    return true;
};

(async () => {
    if (require.main !== module) {
        return;
    }

    try {
        const checks = utils.projects.map(project => check(project));
        await Promise.all(checks);
        console.log();
    } catch (e) {
        console.error(e);
        utils.setExit(1);
    }
})();

module.exports = check;
