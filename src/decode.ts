import { ClientLspInitMessage, ClientMessage, Instruction, ServerMessage } from './types';
import { instructions, statuses, stripObject } from './util';
import { SupportedLanguage } from 'palcode-types';

function decodeServerMessage(messageComponents: string[]): ServerMessage | undefined {
    const statusIndex = parseInt(messageComponents[1]);
    const status = statuses[statusIndex];
    if (!status) {
        return;
    }

    const messageCode = messageComponents[2];

    let running: boolean | undefined = undefined;
    if (messageComponents[3]) {
        running = messageComponents[3] === '1';
    }

    let stdout;
    if (messageComponents[4]) {
        stdout = decodeURIComponent(messageComponents[4]);
    }

    return {
        status,
        message: messageCode,
        running,
        stdout,
    }
}

function decodeClientMessage(messageComponents: string[]): ClientMessage | undefined {
    const projectId = messageComponents[1];
    if (!projectId) {
        return;
    }

    const instructionIndex = parseInt(messageComponents[2]);
    const instruction = instructions[instructionIndex] as Instruction;
    if (!instruction) {
        return;
    }

    const language = messageComponents[3] as SupportedLanguage;
    const schoolId = messageComponents[4];

    let stdin = messageComponents[5];
    if (stdin) {
        stdin = decodeURIComponent(stdin);
    }

    return {
        projectId,
        instruction,
        language,
        schoolId,
        stdin,
    }
}

function decode(message: string): ClientMessage | ServerMessage | undefined {
    const messageComponents: string[] = message.split('/');
    const messageType = messageComponents[0] as 's' | 'c';

    if (messageType === 's') {
        return stripObject(
            decodeServerMessage(messageComponents)
        );
    }

    if (messageType === 'c') {
        return stripObject(
            decodeClientMessage(messageComponents)
        );
    }
}

export {decode};

function encodeLspInit(message: string): ClientLspInitMessage | undefined {
    if (!message.startsWith('init/')) {
        return;
    }

    const messageComponents = message.split('/');
    if (messageComponents.length !== 2) {
        return;
    }

    return {
        projectId: messageComponents[1],
        language: messageComponents[2] as SupportedLanguage,
    };
}
