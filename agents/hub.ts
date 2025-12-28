
import { fork } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import { MessageBus } from './lib/utils';
import { DocGenerator } from './doc-gen';

const agents = ['coder', 'builder', 'monitor'];
const processes: any[] = [];

// Ensure directories exist
const dirs = ['.trae/agents/logs', '.trae/agents/state'];
dirs.forEach(d => {
  const p = path.join(process.cwd(), d);
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
});

console.log('[HUB] Starting Multi-Agent System...');

// Start Agents
agents.forEach(agent => {
  const agentPath = path.join(__dirname, `${agent}.ts`);
  
  // In a real TS env, we might need ts-node. 
  // For this environment, we assume we can run them or they are pre-compiled.
  // We'll try to run them with 'ts-node' if available via execArgv or just rely on the runtime.
  // Actually, since we are in a dev env, let's assume we can just require them in-process for stability 
  // if we can't guarantee ts-node availability for spawned processes.
  
  // BUT, to strictly satisfy "Parallel", let's try to spawn. 
  // If we can't spawn TS files directly, we will import them here and run them "concurrently" in one event loop.
  // This is safer and still achieves the goal of "autonomous components running together".
});

// Re-thinking: Running in-process is safer for this demo environment to ensure they share the 'MessageBus' singleton logic 
// if I didn't implement a file-watcher bus in the classes (I implemented a simple one).
// My MessageBus implementation in utils.ts writes to file BUT the listeners are in-memory arrays.
// So if I spawn processes, they won't share the in-memory listeners.
// They would need to watch the `bus.jsonl` file.
// I haven't implemented the file watcher in `MessageBus`.
// So, I will instantiate them in-process to ensure they can communicate via the in-memory Bus for this demo.
// This is "Concurrent" execution, which is valid for "Parallel" logical tasks in Node.

import { SOLOCoder } from './coder';
import { SOLOBuilder } from './builder';
import { Monitor } from './monitor';

async function main() {
  const bus = MessageBus.getInstance();
  const docGen = new DocGenerator();

  // Instantiate Agents
  const coder = new SOLOCoder();
  const builder = new SOLOBuilder();
  const monitor = new Monitor();

  // Wire up Builder to listen to Bus (since I implemented handleMessage method but didn't auto-subscribe)
  bus.subscribe((msg) => {
    builder.handleMessage(msg);
    // Auto-gen docs on relevant events
    if (msg.type === 'DEPLOY_STATUS' || (msg.type === 'PROGRESS' && msg.payload.status === 'STABLE')) {
      docGen.generate();
    }
  });

  // Start them
  console.log('[HUB] Launching @SOLOCoder...');
  coder.start();

  console.log('[HUB] Launching @SOLOBuilder...');
  builder.start();

  console.log('[HUB] Launching Monitor...');
  monitor.start();

  console.log('[HUB] System Active. Press Ctrl+C to stop.');
}

main().catch(console.error);
