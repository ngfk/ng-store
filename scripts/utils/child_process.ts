import { ChildProcess, exec as nodeExec, ExecOptions, spawn as nodeSpawn, SpawnOptions } from 'child_process';
import { promisify } from 'util';

const defaultOptions = (options: any = {}): any => {
    const env = { ...process.env, ...options.env };
    return { stdio: 'inherit', ...options, env };
};

export type Exec = Promise<{ stdout: Buffer; stderr: Buffer }>;
export const exec = (command: string, options?: ExecOptions): Exec => {
    return promisify(nodeExec)(command, defaultOptions(options));
};

export type Spawn = { process: ChildProcess; close: Promise<number> };
export const spawn = (
    command: string,
    args: string[],
    options?: SpawnOptions
): Spawn => {
    let process = nodeSpawn(command, args, defaultOptions(options));

    const close = new Promise<number>((resolve, reject) => {
        process.on('error', err => reject(err));
        process.on('close', code => resolve(code));
    });

    return { process, close };
};
