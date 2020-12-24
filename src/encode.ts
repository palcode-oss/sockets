import { ClientMessage, isClientMessage, isServerMessage, ServerMessage } from './types';
import { instructions, statuses } from './util';

function encodeServerMessage(message: ServerMessage): string {
    const status = statuses.indexOf(message.status);
    const messageCode = message.message || '';

    let running = '';
    if (message.running != null) {
        running = message.running ? '1' : '0';
    }

    const stdout = encodeURIComponent(message.stdout || '');

    return `s/${status}/${messageCode}/${running}/${stdout}`;
}

function encodeClientMessage(message: ClientMessage): string {
    const projectId = message.projectId;
    const instruction = instructions.indexOf(message.instruction);

    if (message.instruction === 'start') {
        // compressing this would require hard-coding languages, and it's not a huge overhead
        const language = message.language;
        const schoolId = message.schoolId;

        return `c/${projectId}/${instruction}/${language}/${schoolId}/`;
    }

    if (message.instruction === 'stop') {
        return `c/${projectId}/${instruction}///`;
    }

    if (message.instruction === 'stdin') {
        const stdin = encodeURIComponent(message.stdin || '');
        return `c/${projectId}/${instruction}///${stdin}`;
    }

    return '';
}

function encode(message: ClientMessage): string;
function encode(message: ServerMessage): string;
function encode(message: any): string {
    if (isServerMessage(message)) {
        return encodeServerMessage(message);
    }

    if (isClientMessage(message)) {
        return encodeClientMessage(message);
    }

    return '';
}

export {encode};
