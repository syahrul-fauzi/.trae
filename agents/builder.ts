
import { AgentRole, AgentMessage, SystemState } from './lib/types';
import { Logger, MessageBus } from './lib/utils';
import * as fs from 'fs';
import * as path from 'path';

const ROLE: AgentRole = 'SOLOBuilder';
const logger = new Logger(ROLE);
const bus = MessageBus.getInstance();

const STATE_FILE = path.join(process.cwd(), '.trae/agents/state/system_state.json');

export class SOLOBuilder {
  private state: SystemState = {
    stage: 'DEVELOPMENT',
    health: 'HEALTHY',
    activeBlockers: [],
    deployStatus: { canary: false, production: false, version: '1.0.0' }
  };

  async start() {
    logger.log('Agent started. Waiting for stable code...');
    this.loadState();

    // In a real multi-process setup, we'd listen to the file/bus
    // Here we simulate checking the bus file or just waiting for events if in same process
    // For this demo, we'll poll the bus file or implement a listener if Hub connects us
  }

  handleMessage(msg: AgentMessage) {
    if (msg.to !== ROLE && msg.to !== 'ALL') return;

    if (msg.type === 'PROGRESS' && msg.payload.status === 'STABLE') {
      this.initiateDeploymentPipeline();
    }
  }

  async initiateDeploymentPipeline() {
    if (this.state.stage === 'DEVELOPMENT') {
      logger.log('Code stable. Starting Deployment Pipeline...');
      
      await this.runStage('TESTING', async () => {
        logger.log('Deploying to Test Environment...');
        // Simulate deploy delay
        await new Promise(r => setTimeout(r, 2000));
        return true;
      });

      await this.runStage('CANARY', async () => {
        logger.log('Deploying Canary (10% traffic)...');
        await new Promise(r => setTimeout(r, 2000));
        this.state.deployStatus.canary = true;
        return true;
      });

      await this.runStage('PRODUCTION', async () => {
        logger.log('Canary healthy. Rolling out to Production...');
        await new Promise(r => setTimeout(r, 2000));
        this.state.deployStatus.production = true;
        return true;
      });
    }
  }

  async runStage(stage: SystemState['stage'], action: () => Promise<boolean>) {
    this.state.stage = stage;
    this.saveState();
    
    try {
      const success = await action();
      if (success) {
        logger.log(`Stage ${stage} completed successfully.`);
        bus.publish({
          from: ROLE,
          to: 'ALL',
          type: 'DEPLOY_STATUS',
          payload: { stage, status: 'SUCCESS' },
          timestamp: Date.now()
        });
      }
    } catch (e) {
      logger.error(`Stage ${stage} failed.`);
      this.state.health = 'CRITICAL';
      this.saveState();
    }
  }

  loadState() {
    try {
      if (fs.existsSync(STATE_FILE)) {
        this.state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));
      }
    } catch (e) { /* ignore */ }
  }

  saveState() {
    fs.writeFileSync(STATE_FILE, JSON.stringify(this.state, null, 2));
  }
}

if (require.main === module) {
  new SOLOBuilder().start();
}
