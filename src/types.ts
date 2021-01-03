import { SupportedLanguage } from 'palcode-types';

export type ServerStatus = 200 | 400 | 404 | 500;

export interface ServerMessage {
  status: ServerStatus;
  message?: string;
  running?: boolean;
  stdout?: string;
}

export type Instruction = 'start' | 'stop' | 'stdin';

interface BaseMessage {
  projectId: string;
  instruction: Instruction
}

export interface StartMessage extends BaseMessage {
  schoolId: string;
  instruction: 'start';
  language: SupportedLanguage;
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

export interface ClientLspInitMessage {
  projectId: string;
  schoolId: string;
  language: SupportedLanguage;
}
