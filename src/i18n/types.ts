// src/i18n/types.ts
import { messages } from './messages'
import type { Locale } from './config'

export type Messages = typeof messages
export type MessageKeys<L extends Locale> = keyof Messages[L]