import { createReadStream, createWriteStream, writeFile as nodeWriteFile } from 'fs';
import { promisify } from 'util';

export const writeFile = (target: string, data: string): Promise<void> => {
    return promisify(nodeWriteFile)(target, data);
};

export const copyFile = (source: string, target: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const rd = createReadStream(source);
        const wr = createWriteStream(target);

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
