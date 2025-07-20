import { openai } from '@ai-sdk/openai';
import type { Mastra } from '@mastra/core';
import { Agent, type AgentConfig } from '@mastra/core/agent';
import { RuntimeContext } from '@mastra/core/runtime-context';
import { BaseAgent } from './baseAgent';

export type ExampleContext = {
  example: string;
};

const initializeExampleAgentConfig = () => {
  return {
    name: 'Example Agent',
    description: 'You are an agent responsible for generating example content.',
    instructions: ({ runtimeContext }: { runtimeContext: RuntimeContext<ExampleContext> }) => {
      const example = runtimeContext.get('example');
      return `You are an agent responsible for generating example content.
      The example is: ${example}`;
    },
    model: openai('gpt-4o-mini'),
  } as AgentConfig;
};

export class ExampleAgent extends BaseAgent {
  constructor({
    mastra,
  }: {
    mastra?: Mastra;
  } = {}) {
    super(
      initializeExampleAgentConfig(),
      new Agent({
        ...initializeExampleAgentConfig(),
        mastra,
      }),
    );
  }

  async generateExample(context: ExampleContext) {
    const agent = this.getAgent();

    const runtime = new RuntimeContext<ExampleContext>();
    runtime.set('example', context.example);

    const result = await agent.generate([], {
      runtimeContext: runtime,
      temperature: 0.7,
      telemetry: {
        isEnabled: true,
        functionId: 'example-agent-generateExample',
      },
    });

    return result.text;
  }
}
