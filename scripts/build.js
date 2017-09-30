'use strict';

const utils = require('./utils');

const build = async project => {
    utils.print(project, 'build started');

    const tsc = utils.spawn('tsc', ['--project', `./packages/${project}`]);
    const code = await tsc.close;

    if (code !== 0) {
        utils.setExit(code);
        utils.print(project, 'build failed');
        return false;
    }

    const copiedFiles = utils.copiedFiles.map(file => {
        return utils.copyFile(
            `./packages/${project}/${file}`,
            `./dist/${project}/${file}`
        );
    });

    const generatedFiles = Object.keys(utils.generatedFiles).map(file => {
        return utils.writeFile(
            `./dist/${project}/${file}`,
            utils.generatedFiles[file]
        );
    });

    await Promise.all([...copiedFiles, ...generatedFiles]);

    utils.print(project, 'build finished');
    return true;
};

(async () => {
    if (require.main !== module) {
        return;
    }

    try {
        const builds = utils.projects.map(project => build(project));
        await Promise.all(builds);
        console.log();
    } catch (e) {
        console.error(e);
    }
})();

module.exports = build;
