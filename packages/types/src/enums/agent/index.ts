export const modelVendorValues = ['openai', 'anthropic', 'gemini'] as const;

export enum ModelVendor {
  OPENAI = 'openai',
  ANTHROPIC = 'anthropic',
  GEMINI = 'gemini',
}

// OPENAI
export enum OpenAiAgentModel {
  /** Reasoning model: o4-mini */
  O4_MINI = 'o4-mini',
  /** Reasoning model: o3 */
  O3 = 'o3',
  /** Reasoning model: o3-mini */
  O3_MINI = 'o3-mini',
  /** Reasoning model: o1 */
  O1 = 'o1',
  /** Reasoning model: o1-mini */
  O1_MINI = 'o1-mini',
  /** Reasoning model: o1-pro */
  O1_PRO = 'o1-pro',
  /** Flagship chat model: gpt-4.1 */
  GPT_4_1 = 'gpt-4.1',
  /** Flagship chat model: gpt-4o */
  GPT_4O = 'gpt-4o',
  /** Cost-optimized model: gpt-4.1-mini */
  GPT_4_1_MINI = 'gpt-4.1-mini',
  /** Cost-optimized model: gpt-4.1-nano */
  GPT_4_1_NANO = 'gpt-4.1-nano',
  /** Cost-optimized model: gpt-4o-mini */
  GPT_4O_MINI = 'gpt-4o-mini',
}

export const openAiAgentModelValues = [
  'o4-mini',
  'o3',
  'o3-mini',
  'o1',
  'o1-mini',
  'o1-pro',
  'gpt-4.1',
  'gpt-4o',
  'gpt-4.1-mini',
  'gpt-4.1-nano',
  'gpt-4o-mini',
] as const;

// ANTHROPIC
export const anthropicAgentModelValues = [
  'claude-opus-4-20250514',
  'claude-sonnet-4-20250514',
  'claude-3-7-sonnet-20250219',
  'claude-3-5-sonnet-20241022',
  'claude-3-5-haiku-20241022',
  'claude-3-opus-20240229',
  'claude-3-sonnet-20240229',
  'claude-3-haiku-20240307',
] as const;

export enum AnthropicAgentModel {
  /** Claude Opus 4: Our most capable model. Best for complex reasoning, advanced problem solving, and tasks requiring the highest intelligence and accuracy. (Mar 2025, 200K context, 32K output) */
  CLAUDE_OPUS_4_20250514 = 'claude-opus-4-20250514',
  /** Claude Sonnet 4: High-performance, balanced model. Ideal for production workloads needing strong intelligence, speed, and cost efficiency. (Mar 2025, 200K context, 64K output) */
  CLAUDE_SONNET_4_20250514 = 'claude-sonnet-4-20250514',
  /** Claude Sonnet 3.7: High-performance model with early extended thinking. Good for tasks needing extended context and reasoning, but with lower cost than Opus. (Nov 2024, 200K context, 64K output) */
  CLAUDE_3_7_SONNET_20250219 = 'claude-3-7-sonnet-20250219',
  /** Claude Sonnet 3.5 v2: Upgraded version of Sonnet 3.5. Great for general-purpose tasks, chatbots, and assistants with high accuracy and speed. (Apr 2024, 200K context, 8192 output) */
  CLAUDE_3_5_SONNET_20241022 = 'claude-3-5-sonnet-20241022',
  /** Claude Haiku 3.5: Fastest model. Best for near-instant responses, lightweight tasks, and high-throughput applications. (July 2024, 200K context, 8192 output) */
  CLAUDE_3_5_HAIKU_20241022 = 'claude-3-5-haiku-20241022',
  /** Claude Opus 3: Powerful model for complex tasks (Aug 2023, 200K context, 4096 output) */
  CLAUDE_3_OPUS_20240229 = 'claude-3-opus-20240229',
  /** Claude Sonnet 3: High-performance model (Feb 2024, 200K context, 4096 output) */
  CLAUDE_3_SONNET_20240229 = 'claude-3-sonnet-20240229',
  /** Claude Haiku 3: Fast and compact model (Mar 2024, 200K context, 4096 output) */
  CLAUDE_3_HAIKU_20240307 = 'claude-3-haiku-20240307',
}

// GEMINI
export const geminiAgentModelValues = [
  'gemini-2.5-flash-preview-05-20',
  'gemini-2.5-pro-preview-05-06',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
  'gemini-1.5-flash',
  'gemini-1.5-flash-8b',
  'gemini-1.5-pro',
] as const;

export enum GeminiAgentModel {
  /** Adaptive thinking, cost efficiency */
  GEMINI_2_5_FLASH_PREVIEW_05_20 = 'gemini-2.5-flash-preview-05-20',
  /** Enhanced thinking and reasoning, multimodal understanding, advanced coding, and more */
  GEMINI_2_5_PRO_PREVIEW_05_06 = 'gemini-2.5-pro-preview-05-06',
  /** Next generation features, speed, thinking, and realtime streaming. */
  GEMINI_2_0_FLASH = 'gemini-2.0-flash',
  /** Cost efficiency and low latency */
  GEMINI_2_0_FLASH_LITE = 'gemini-2.0-flash-lite',
  /** Fast and versatile performance across a diverse variety of tasks */
  GEMINI_1_5_FLASH = 'gemini-1.5-flash',
  /** High volume and lower intelligence tasks */
  GEMINI_1_5_FLASH_8B = 'gemini-1.5-flash-8b',
  /** Complex reasoning tasks requiring more intelligence */
  GEMINI_1_5_PRO = 'gemini-1.5-pro',
}
