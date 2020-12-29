export type ServerStatus = 200 | 400 | 404 | 500;

export interface ServerMessage {
  status: ServerStatus;
  message?: string;
  running?: boolean;
  stdout?: string;
}

export type Language = 'python' | 'nodejs' | 'bash' | 'java' | 'prolog' | 'go';
export type Instruction = 'start' | 'stop' | 'stdin';

interface BaseMessage {
  projectId: string;
  instruction: Instruction
}

export interface StartMessage extends BaseMessage {
  schoolId: string;
  instruction: 'start';
  language: Language;
}

export interface StopMessage extends BaseMessage {
  instruction: 'stop';
}

export interface StdinMessage extends BaseMessage {
  stdin: string;
  instruction: 'stdin';
}

export type ClientMessage = StartMessage | StopMessage | StdinMessage;

export function isServerMessage(message: any): message is ServerMessage {
  return typeof message.status === 'number';
}

export function isClientMessage(message: any): message is ClientMessage {
  return typeof message.projectId === 'string';
}
