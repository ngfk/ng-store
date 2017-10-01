import { join } from 'path';

import { spawn } from './utils/child_process';
import { getProjectConfig, ProjectConfig } from './utils/config';
import { copyFile, writeFile } from './utils/fs';

export const buildProject = async (
    project: string,
    { source, dest, copy, generate }: ProjectConfig
): Promise<number> => {
    console.log('[build] %s - %s', project, 'started');

    const tsc = spawn('tsc', ['--project', `./packages/${project}`]);
    const code = await tsc.close;

    if (code !== 0) {
        process.on('exit', () => process.exit(code));
        console.log('[build] %s - %s', project, 'failed');
        return code;
    }

    const copyTasks = copy.map(file => {
        return copyFile(join(source, project, file), join(dest, project, file));
    });

    const generateTasks = Object.keys(generate).map(file => {
        return writeFile(join(dest, project, file), generate[file]);
    });

    await Promise.all([...copyTasks, ...generateTasks]);

    console.log('[build] %s - %s', project, 'finished');
    return code;
};

(async () => {
    if (require.main !== module) {
        return;
    }

    try {
        const config = getProjectConfig();
        const builds = config.packages.map(project =>
            buildProject(project, config)
        );
        await Promise.all(builds);
        console.log();
    } catch (e) {
        console.error(e);
    }
})();
