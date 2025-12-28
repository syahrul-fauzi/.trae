
import * as fs from 'fs';
import * as path from 'path';

const CHANGELOG_PATH = path.join(process.cwd(), '.trae/agents/CHANGELOG_AUTO.md');
const BUS_LOG = path.join(process.cwd(), '.trae/agents/state/bus.jsonl');

export class DocGenerator {
  generate() {
    if (!fs.existsSync(BUS_LOG)) return;

    const lines = fs.readFileSync(BUS_LOG, 'utf-8').split('\n').filter(Boolean);
    let content = '# Automated Changelog\n\n';

    lines.forEach(line => {
      try {
        const msg = JSON.parse(line);
        if (msg.type === 'DEPLOY_STATUS' && msg.payload.status === 'SUCCESS') {
          const date = new Date(msg.timestamp).toISOString().split('T')[0];
          content += `## [${date}] Stage Completed: ${msg.payload.stage}\n`;
          content += `- Deployment successful by @SOLOBuilder\n\n`;
        }
        if (msg.type === 'PROGRESS' && msg.payload.status === 'STABLE') {
          content += `- Codebase verified stable by @SOLOCoder (Coverage: ${msg.payload.coverage}%)\n`;
        }
      } catch (e) {}
    });

    fs.writeFileSync(CHANGELOG_PATH, content);
  }
}
