import { buildProject } from './build';
import { testProject } from './test';
import { getProjectConfig, ProjectConfig } from './utils/config';

const check = async (project: string, config: ProjectConfig) => {
    let code: number;

    code = await testProject(project, config, false);
    if (code !== 0) return code;

    code = await buildProject(project, config);
    return code;
};

(async () => {
    if (require.main !== module) {
        return;
    }

    try {
        const config = getProjectConfig();
        const checks = config.packages.map(project => check(project, config));
        await Promise.all(checks);
        console.log();
    } catch (e) {
        console.error(e);
    }
})();
