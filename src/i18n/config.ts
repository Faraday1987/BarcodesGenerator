export const locales = ['es', 'en', 'de'] as const
export type Locale = typeof locales[number]
export const defaultLocale: Locale = 'es'