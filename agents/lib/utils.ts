
import * as fs from 'fs';
import * as path from 'path';
import { AgentMessage, AgentRole } from './types';

const LOG_DIR = path.join(process.cwd(), '.trae/agents/logs');

export class Logger {
  private role: AgentRole;

  constructor(role: AgentRole) {
    this.role = role;
  }

  log(message: string, level: 'INFO' | 'WARN' | 'ERROR' = 'INFO') {
    const timestamp = new Date().toISOString();
    const line = `[${timestamp}] [${this.role}] [${level}] ${message}\n`;
    
    // Console output
    console.log(line.trim());
    
    // File output
    try {
      fs.appendFileSync(path.join(LOG_DIR, `${this.role}.log`), line);
      fs.appendFileSync(path.join(LOG_DIR, 'system.log'), line);
    } catch (e) {
      console.error('Failed to write log', e);
    }
  }

  error(message: string) {
    this.log(message, 'ERROR');
  }
}

export class MessageBus {
  private static instance: MessageBus;
  private listeners: ((msg: AgentMessage) => void)[] = [];

  private constructor() {}

  static getInstance(): MessageBus {
    if (!MessageBus.instance) {
      MessageBus.instance = new MessageBus();
    }
    return MessageBus.instance;
  }

  publish(message: AgentMessage) {
    // In a real system, this would write to a queue/socket
    // Here we simulate by notifying local listeners (if running in same process)
    // OR writing to a shared file for IPC
    
    const msgString = JSON.stringify(message) + '\n';
    fs.appendFileSync(path.join(process.cwd(), '.trae/agents/state/bus.jsonl'), msgString);
    
    this.listeners.forEach(l => l(message));
  }

  subscribe(callback: (msg: AgentMessage) => void) {
    this.listeners.push(callback);
  }
}
