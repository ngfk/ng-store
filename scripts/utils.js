'use strict';

const { promisify } = require('util');
const { exec, spawn } = require('child_process');
const { writeFile, createReadStream, createWriteStream } = require('fs');

const defaultOptions = (options = {}) => {
    const env = Object.assign({}, process.env, options.env);
    return Object.assign({ stdio: 'inherit' }, options, { env });
};

exports.exec = (cmd, options) => {
    return promisify(exec)(cmd, defaultOptions(options));
};

exports.spawn = (command, args, options) => {
    let process = spawn(command, args, defaultOptions(options));

    process.close = new Promise((resolve, reject) => {
        process.on('error', err => reject(err));
        process.on('close', code => resolve(code));
    });

    return process;
};

exports.print = (project, ...args) => {
    console.log(' [%s] %s', project, (args || []).join(' '));
};

exports.writeFile = (target, data) => {
    return promisify(writeFile)(target, data);
};

exports.copyFile = (source, target) => {
    return new Promise((resolve, reject) => {
        const rd = createReadStream(source);
        const wr = createWriteStream(target);

        const rejectCleanup = err => {
            rd.destroy();
            wr.end();
            reject(err);
        };

        rd.on('error', rejectCleanup);
        wr.on('error', rejectCleanup);

        wr.on('finish', resolve);
        rd.pipe(wr);
    });
};

exports.setExit = code => {
    process.on('exit', () => process.exit(code));
};

exports.projects = ['store'];
exports.copiedFiles = ['package.json', 'README.md'];
exports.generatedFiles = {
    'index.d.ts': `export * from './dist';\n\n`
};
