const project = require('../../config/project.json');

export interface ProjectConfig {
    readonly scope: string;
    readonly packages: string[];
    readonly source: string;
    readonly dest: string;
    readonly copy: string[];
    readonly generate: { readonly [filename: string]: string };
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
        scope: project.scope,
        packages: project.packages,
        source: project.source,
        dest: project.dest,
        copy: project.copy,
        generate
    };
};
