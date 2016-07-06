export type GenericStream = any
export interface DiscordSource {
  on (eventType: string): GenericStream
}