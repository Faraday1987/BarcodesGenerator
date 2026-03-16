import { messages } from './messages'
import type { Locale } from './config'

export function t(lang: Locale) {
  return messages[lang]
}