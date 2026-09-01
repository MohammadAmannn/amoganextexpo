export interface ObservabilityAdapter { captureError(error: unknown, context?: Record<string, unknown>): void; event(name: string, data?: Record<string, unknown>): void }
export const consoleObservability: ObservabilityAdapter = { captureError(error, context){ console.error(error, context) }, event(name, data){ if (process.env.NODE_ENV !== 'production') console.info(name, data) } }
