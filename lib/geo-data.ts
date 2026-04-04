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

/**
 * Full country list for visibility settings (admin panel).
 * Superset of COUNTRIES — includes regions without geo-specific offers.
 */
export const ALL_COUNTRIES_LIST = [
  { code: 'IN', name: 'India',          flag: '🇮🇳' },
  { code: 'BD', name: 'Bangladesh',     flag: '🇧🇩' },
  { code: 'PK', name: 'Pakistan',       flag: '🇵🇰' },
  { code: 'NG', name: 'Nigeria',        flag: '🇳🇬' },
  { code: 'KE', name: 'Kenya',          flag: '🇰🇪' },
  { code: 'GH', name: 'Ghana',          flag: '🇬🇭' },
  { code: 'ZA', name: 'South Africa',   flag: '🇿🇦' },
  { code: 'UG', name: 'Uganda',         flag: '🇺🇬' },
  { code: 'TZ', name: 'Tanzania',       flag: '🇹🇿' },
  { code: 'SN', name: 'Senegal',        flag: '🇸🇳' },
  { code: 'ET', name: 'Ethiopia',       flag: '🇪🇹' },
  { code: 'BR', name: 'Brazil',         flag: '🇧🇷' },
  { code: 'MX', name: 'Mexico',         flag: '🇲🇽' },
  { code: 'CO', name: 'Colombia',       flag: '🇨🇴' },
  { code: 'AR', name: 'Argentina',      flag: '🇦🇷' },
  { code: 'US', name: 'United States',  flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'DE', name: 'Germany',        flag: '🇩🇪' },
  { code: 'FR', name: 'France',         flag: '🇫🇷' },
  { code: 'IT', name: 'Italy',          flag: '🇮🇹' },
  { code: 'ES', name: 'Spain',          flag: '🇪🇸' },
  { code: 'AU', name: 'Australia',      flag: '🇦🇺' },
  { code: 'CA', name: 'Canada',         flag: '🇨🇦' },
  { code: 'RU', name: 'Russia',         flag: '🇷🇺' },
  { code: 'UA', name: 'Ukraine',        flag: '🇺🇦' },
  { code: 'TR', name: 'Turkey',         flag: '🇹🇷' },
  { code: 'EG', name: 'Egypt',          flag: '🇪🇬' },
  { code: 'MA', name: 'Morocco',        flag: '🇲🇦' },
  { code: 'TN', name: 'Tunisia',        flag: '🇹🇳' },
  { code: 'ID', name: 'Indonesia',      flag: '🇮🇩' },
  { code: 'PH', name: 'Philippines',    flag: '🇵🇭' },
  { code: 'VN', name: 'Vietnam',        flag: '🇻🇳' },
  { code: 'TH', name: 'Thailand',       flag: '🇹🇭' },
  { code: 'JP', name: 'Japan',          flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea',    flag: '🇰🇷' },
  { code: 'NL', name: 'Netherlands',    flag: '🇳🇱' },
  { code: 'PT', name: 'Portugal',       flag: '🇵🇹' },
  { code: 'PL', name: 'Poland',         flag: '🇵🇱' },
  { code: 'SE', name: 'Sweden',         flag: '🇸🇪' },
  { code: 'NO', name: 'Norway',         flag: '🇳🇴' },
] as const
