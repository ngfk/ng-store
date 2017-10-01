import { join } from 'path';

import { getProjectConfig, ProjectConfig } from './utils/config';
import { link, loadPackageJson, makeDir } from './utils/fs';

const doLink = async (
    project: string,
    packages: string[],
    dependency: string,
    config: ProjectConfig
) => {
    const targetProject = dependency.slice(config.scope.length + 2);
    const dir = join(
        config.source,
        project,
        'node_modules',
        '@' + config.scope
    );
    await makeDir(dir);

    try {
        await link(
            join(process.cwd(), config.source, targetProject),
            join(dir, targetProject)
        );
        console.log('[bootstrap] %s, %s %s', project, 'linked', dependency);
    } catch (err) {
        if (err.code === 'EEXIST') {
            console.log(
                '[bootstrap] %s, %s %s',
                project,
                'already linked',
                dependency
            );
        } else {
            throw err;
        }
    }
};

const bootstrap = async (project: string, config: ProjectConfig) => {
    const packages = config.packages.map(p => `@${config.scope}/${p}`);
    const packageJson = await loadPackageJson(project, config);

    const deps = [
        ...Object.keys(packageJson.dependencies || {}),
        ...Object.keys(packageJson.peerDependencies || {})
    ].filter(dep => packages.indexOf(dep) >= 0);

    if (!deps.length) {
        console.log('[bootstrap] %s, %s', project, 'no action required');
        return;
    }

    const linkTasks = deps.map(dep => doLink(project, packages, dep, config));
    await Promise.all(linkTasks);

    console.log('[bootstrap] %s, %s', project, 'finished');
};

(async () => {
    if (require.main !== module) {
        return;
    }

    try {
        console.log('Started bootstrapping');
        const config = getProjectConfig();
        const tasks = config.packages.map(project =>
            bootstrap(project, config)
        );
        await Promise.all(tasks);
        console.log();
    } catch (e) {
        console.error(e);
    }
})();
