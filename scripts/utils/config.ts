const project = require('../../config/project.json');

export interface ProjectConfig {
    packages: string[];
    source: string;
    dest: string;
    copy: string[];
    generate: { [filename: string]: string };
}

export const getProjectConfig = (): ProjectConfig => {
    // Join project.json#generate array of string with newlines.
    const generate = Object.keys(project.generate).reduce(
        (acc, filename) => {
            acc[filename] = project.generate[filename].join('\n');
            return acc;
        },
        {} as any
    );

    return {
        packages: project.packages,
        source: project.source,
        dest: project.dest,
        copy: project.copy,
        generate
    };
};
