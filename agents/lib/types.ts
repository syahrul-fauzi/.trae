
export type AgentRole = 'SOLOCoder' | 'SOLOBuilder' | 'Monitor';

export interface AgentMessage {
  from: AgentRole;
  to: AgentRole | 'ALL';
  type: 'PROGRESS' | 'ERROR' | 'BLOCKER' | 'DEPLOY_REQUEST' | 'DEPLOY_STATUS' | 'HEALTH_CHECK';
  payload: any;
  timestamp: number;
}

export interface SystemState {
  stage: 'DEVELOPMENT' | 'TESTING' | 'CANARY' | 'PRODUCTION';
  health: 'HEALTHY' | 'DEGRADED' | 'CRITICAL';
  activeBlockers: string[];
  deployStatus: {
    canary: boolean;
    production: boolean;
    version: string;
  };
}
