import { ServerStatus } from './types';

export const statuses: ServerStatus[] = [200, 400, 404, 500];
export const instructions = ['start', 'stop', 'stdin'];

export function stripObject<T = any>(object: T): T {
    for (const key of Object.keys(object)) {
        // @ts-ignore
        const value = object[key];
        if (value == null) {
            // @ts-ignore
            delete object[key];
        }
    }

    return object;
}
