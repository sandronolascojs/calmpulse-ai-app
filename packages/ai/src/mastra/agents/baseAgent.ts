import type { Agent, AgentConfig } from '@mastra/core/agent';

export class BaseAgent {
  private readonly agent: Agent;
  private readonly config: AgentConfig;

  constructor(config: AgentConfig, agent: Agent) {
    this.config = config;
    this.agent = agent;
  }

  getConfig() {
    return this.config;
  }

  getAgent() {
    return this.agent;
  }
}
