'use strict';

const utils = require('./utils');

const test = async (project, echo = true) => {
    if (!echo) utils.print(project, 'test started');

    const args = [
        '--compilers',
        'ts:ts-node/register',
        `./packages/${project}/test/**/*.spec.ts`
    ];

    const options = {
        stdio: echo ? 'inherit' : 'pipe'
    };

    const test = utils.spawn('mocha', args, options);
    const code = await test.close;

    if (code !== 0) {
        utils.setExit(code);

        if (!echo) utils.print(project, 'test failed');
        return false;
    }

    if (!echo) utils.print(project, 'test finished');
    return true;
};

(async () => {
    if (require.main !== module) {
        return;
    }

    try {
        for (let project of utils.projects) {
            await test(project);
        }
    } catch (e) {
        console.error(e);
        utils.setExit(1);
    }
})();

module.exports = test;
