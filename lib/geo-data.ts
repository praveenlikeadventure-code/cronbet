// Client-safe geo constants — no server-only imports here

export const COUNTRIES = [
  { code: 'IN',      name: 'India',                flag: '🇮🇳', currency: 'INR', symbol: '₹' },
  { code: 'BD',      name: 'Bangladesh',           flag: '🇧🇩', currency: 'BDT', symbol: '৳' },
  { code: 'PK',      name: 'Pakistan',             flag: '🇵🇰', currency: 'PKR', symbol: '₨' },
  { code: 'NG',      name: 'Nigeria',              flag: '🇳🇬', currency: 'NGN', symbol: '₦' },
  { code: 'KE',      name: 'Kenya',                flag: '🇰🇪', currency: 'KES', symbol: 'KSh' },
  { code: 'GH',      name: 'Ghana',                flag: '🇬🇭', currency: 'GHS', symbol: 'GH₵' },
  { code: 'UG',      name: 'Uganda',               flag: '🇺🇬', currency: 'UGX', symbol: 'USh' },
  { code: 'ZA',      name: 'South Africa',         flag: '🇿🇦', currency: 'ZAR', symbol: 'R' },
  { code: 'BR',      name: 'Brazil',               flag: '🇧🇷', currency: 'BRL', symbol: 'R$' },
  { code: 'MX',      name: 'Mexico',               flag: '🇲🇽', currency: 'MXN', symbol: '$' },
  { code: 'TZ',      name: 'Tanzania',             flag: '🇹🇿', currency: 'TZS', symbol: 'TSh' },
  { code: 'DEFAULT', name: 'Default/International', flag: '🌍', currency: 'USD', symbol: '$' },
] as const

export type CountryCode = typeof COUNTRIES[number]['code']

export const COUNTRY_FLAG: Record<string, string> = Object.fromEntries(
  COUNTRIES.map((c) => [c.code, c.flag])
)

export function getFlagEmoji(countryCode: string): string {
  return COUNTRY_FLAG[countryCode.toUpperCase()] ?? '🌍'
}
