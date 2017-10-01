import { spawn } from './utils/child_process';
import { getProjectConfig, ProjectConfig } from './utils/config';

export const testProject = async (
    project: string,
    config: ProjectConfig,
    echo = true
): Promise<number> => {
    if (!echo) console.log('[test]  %s - %s', project, 'started');

    const args = [
        '--compilers',
        'ts:ts-node/register',
        `./packages/${project}/test/**/*.spec.ts`
    ];

    const options = {
        stdio: echo ? 'inherit' : 'pipe'
    };

    const test = spawn('mocha', args, options);
    const code = await test.close;

    if (code !== 0) {
        process.on('exit', () => process.exit(code));
        if (!echo) console.log('[test]  %s - %s', project, 'failed');
        return code;
    }

    if (!echo) console.log('[test]  %s - %s', project, 'finished');
    return code;
};

(async () => {
    if (require.main !== module) {
        return;
    }

    try {
        const config = getProjectConfig();
        for (let project of config.packages) {
            await testProject(project, config);
        }
    } catch (e) {
        console.error(e);
    }
})();
