export interface AnalyticsAdapter { identify(userId: string, traits?: Record<string, unknown>): void; track(event: string, properties?: Record<string, unknown>): void; screen(name: string, properties?: Record<string, unknown>): void }
export const noopAnalytics: AnalyticsAdapter = { identify(){}, track(){}, screen(){} }
