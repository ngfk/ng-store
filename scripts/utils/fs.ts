import * as fs from 'fs';
import { join } from 'path';
import { promisify } from 'util';

import { getProjectConfig, ProjectConfig } from './config';

const mkdirp = require('mkdirp');
const rimraf = require('rimraf');

export const removeDir = (path: string): Promise<void> => {
    return promisify(rimraf)(path);
};

export const makeDir = (path: string): Promise<void> => {
    return promisify(mkdirp)(path);
};

export const link = (target: string, path: string): Promise<void> => {
    return promisify(fs.link)(target, path);
};

export const writeFile = (target: string, data: string): Promise<void> => {
    return promisify(fs.writeFile)(target, data);
};

export const copyFile = (source: string, target: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const rd = fs.createReadStream(source);
        const wr = fs.createWriteStream(target);

        const rejectCleanup = (err: any) => {
            rd.destroy();
            wr.end();
            reject(err);
        };

        rd.on('error', rejectCleanup);
        wr.on('error', rejectCleanup);

        wr.on('finish', () => resolve());
        rd.pipe(wr);
    });
};

export const loadPackageJson = (
    project: string,
    config?: ProjectConfig
): Promise<any> => {
    const { source } = config || getProjectConfig();
    const location = join('..', '..', source, project, 'package.json');
    return import(location);
};
