
import { AgentRole } from './lib/types';
import { Logger } from './lib/utils';
import * as fs from 'fs';
import * as path from 'path';

const ROLE: AgentRole = 'Monitor';
const logger = new Logger(ROLE);

export class Monitor {
  start() {
    logger.log('System Monitor started.');
    
    setInterval(() => {
      this.checkHealth();
    }, 5000);
  }

  checkHealth() {
    // Check logs for errors
    const logDir = path.join(process.cwd(), '.trae/agents/logs');
    const systemLog = path.join(logDir, 'system.log');
    
    if (fs.existsSync(systemLog)) {
      const logs = fs.readFileSync(systemLog, 'utf-8').split('\n');
      const recentLogs = logs.slice(-10);
      
      const errors = recentLogs.filter(l => l.includes('[ERROR]'));
      if (errors.length > 0) {
        logger.log(`Detected ${errors.length} recent errors. Alerting admins...`, 'WARN');
        // In real system: send slack/email
      }
    }
    
    // Check state file
    const stateFile = path.join(process.cwd(), '.trae/agents/state/system_state.json');
    if (fs.existsSync(stateFile)) {
      const state = JSON.parse(fs.readFileSync(stateFile, 'utf-8'));
      if (state.health !== 'HEALTHY') {
        logger.log(`System health is ${state.health}`, 'WARN');
      }
    }
  }
}

if (require.main === module) {
  new Monitor().start();
}
