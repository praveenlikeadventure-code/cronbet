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
 * Full country list for visibility settings and geo offers (admin panel).
 * Includes currency data for auto-fill in geo offer forms.
 */
export const ALL_COUNTRIES_LIST = [
  // Core markets
  { code: 'IN',  name: 'India',              flag: '🇮🇳', currency: 'INR', symbol: '₹' },
  { code: 'BD',  name: 'Bangladesh',         flag: '🇧🇩', currency: 'BDT', symbol: '৳' },
  { code: 'PK',  name: 'Pakistan',           flag: '🇵🇰', currency: 'PKR', symbol: '₨' },
  { code: 'NG',  name: 'Nigeria',            flag: '🇳🇬', currency: 'NGN', symbol: '₦' },
  { code: 'KE',  name: 'Kenya',              flag: '🇰🇪', currency: 'KES', symbol: 'KSh' },
  { code: 'GH',  name: 'Ghana',              flag: '🇬🇭', currency: 'GHS', symbol: 'GH₵' },
  { code: 'ZA',  name: 'South Africa',       flag: '🇿🇦', currency: 'ZAR', symbol: 'R' },
  { code: 'UG',  name: 'Uganda',             flag: '🇺🇬', currency: 'UGX', symbol: 'USh' },
  { code: 'TZ',  name: 'Tanzania',           flag: '🇹🇿', currency: 'TZS', symbol: 'TSh' },
  { code: 'SN',  name: 'Senegal',            flag: '🇸🇳', currency: 'XOF', symbol: 'CFA' },
  { code: 'BR',  name: 'Brazil',             flag: '🇧🇷', currency: 'BRL', symbol: 'R$' },
  { code: 'MX',  name: 'Mexico',             flag: '🇲🇽', currency: 'MXN', symbol: '$' },

  // Africa
  { code: 'SO',  name: 'Somalia',            flag: '🇸🇴', currency: 'USD', symbol: '$' },
  { code: 'DZ',  name: 'Algeria',            flag: '🇩🇿', currency: 'DZD', symbol: 'دج' },
  { code: 'CI',  name: 'Côte d\'Ivoire',     flag: '🇨🇮', currency: 'XOF', symbol: 'CFA' },
  { code: 'ET',  name: 'Ethiopia',           flag: '🇪🇹', currency: 'ETB', symbol: 'Br' },
  { code: 'MZ',  name: 'Mozambique',         flag: '🇲🇿', currency: 'MZN', symbol: 'MT' },
  { code: 'MG',  name: 'Madagascar',         flag: '🇲🇬', currency: 'MGA', symbol: 'Ar' },
  { code: 'CM',  name: 'Cameroon',           flag: '🇨🇲', currency: 'XAF', symbol: 'CFA' },
  { code: 'ZM',  name: 'Zambia',             flag: '🇿🇲', currency: 'ZMW', symbol: 'K' },
  { code: 'ZW',  name: 'Zimbabwe',           flag: '🇿🇼', currency: 'USD', symbol: '$' },
  { code: 'ML',  name: 'Mali',               flag: '🇲🇱', currency: 'XOF', symbol: 'CFA' },
  { code: 'BF',  name: 'Burkina Faso',       flag: '🇧🇫', currency: 'XOF', symbol: 'CFA' },
  { code: 'NE',  name: 'Niger',              flag: '🇳🇪', currency: 'XOF', symbol: 'CFA' },
  { code: 'TD',  name: 'Chad',               flag: '🇹🇩', currency: 'XAF', symbol: 'CFA' },
  { code: 'AO',  name: 'Angola',             flag: '🇦🇴', currency: 'AOA', symbol: 'Kz' },
  { code: 'RW',  name: 'Rwanda',             flag: '🇷🇼', currency: 'RWF', symbol: 'Fr' },
  { code: 'BI',  name: 'Burundi',            flag: '🇧🇮', currency: 'BIF', symbol: 'Fr' },
  { code: 'SS',  name: 'South Sudan',        flag: '🇸🇸', currency: 'SSP', symbol: '£' },
  { code: 'SD',  name: 'Sudan',              flag: '🇸🇩', currency: 'SDG', symbol: 'ج.س.' },
  { code: 'LY',  name: 'Libya',              flag: '🇱🇾', currency: 'LYD', symbol: 'LD' },
  { code: 'TN',  name: 'Tunisia',            flag: '🇹🇳', currency: 'TND', symbol: 'DT' },
  { code: 'MR',  name: 'Mauritania',         flag: '🇲🇷', currency: 'MRU', symbol: 'UM' },
  { code: 'EG',  name: 'Egypt',              flag: '🇪🇬', currency: 'EGP', symbol: '£' },
  { code: 'MA',  name: 'Morocco',            flag: '🇲🇦', currency: 'MAD', symbol: 'دم' },

  // Asia
  { code: 'UZ',  name: 'Uzbekistan',         flag: '🇺🇿', currency: 'UZS', symbol: 'so\'m' },
  { code: 'KZ',  name: 'Kazakhstan',         flag: '🇰🇿', currency: 'KZT', symbol: '₸' },
  { code: 'TM',  name: 'Turkmenistan',       flag: '🇹🇲', currency: 'TMT', symbol: 'T' },
  { code: 'KG',  name: 'Kyrgyzstan',         flag: '🇰🇬', currency: 'KGS', symbol: 'som' },
  { code: 'TJ',  name: 'Tajikistan',         flag: '🇹🇯', currency: 'TJS', symbol: 'SM' },
  { code: 'AM',  name: 'Armenia',            flag: '🇦🇲', currency: 'AMD', symbol: '֏' },
  { code: 'AZ',  name: 'Azerbaijan',         flag: '🇦🇿', currency: 'AZN', symbol: '₼' },
  { code: 'GE',  name: 'Georgia',            flag: '🇬🇪', currency: 'GEL', symbol: '₾' },
  { code: 'MM',  name: 'Myanmar',            flag: '🇲🇲', currency: 'MMK', symbol: 'K' },
  { code: 'KH',  name: 'Cambodia',           flag: '🇰🇭', currency: 'KHR', symbol: '៛' },
  { code: 'LA',  name: 'Laos',               flag: '🇱🇦', currency: 'LAK', symbol: '₭' },
  { code: 'NP',  name: 'Nepal',              flag: '🇳🇵', currency: 'NPR', symbol: '₨' },
  { code: 'LK',  name: 'Sri Lanka',          flag: '🇱🇰', currency: 'LKR', symbol: '₨' },
  { code: 'ID',  name: 'Indonesia',          flag: '🇮🇩', currency: 'IDR', symbol: 'Rp' },
  { code: 'VN',  name: 'Vietnam',            flag: '🇻🇳', currency: 'VND', symbol: '₫' },
  { code: 'PH',  name: 'Philippines',        flag: '🇵🇭', currency: 'PHP', symbol: '₱' },
  { code: 'TH',  name: 'Thailand',           flag: '🇹🇭', currency: 'THB', symbol: '฿' },
  { code: 'MY',  name: 'Malaysia',           flag: '🇲🇾', currency: 'MYR', symbol: 'RM' },
  { code: 'SG',  name: 'Singapore',          flag: '🇸🇬', currency: 'SGD', symbol: 'S$' },
  { code: 'AF',  name: 'Afghanistan',        flag: '🇦🇫', currency: 'AFN', symbol: '؋' },
  { code: 'IQ',  name: 'Iraq',               flag: '🇮🇶', currency: 'IQD', symbol: 'ع.د' },
  { code: 'SY',  name: 'Syria',              flag: '🇸🇾', currency: 'SYP', symbol: '£S' },
  { code: 'JO',  name: 'Jordan',             flag: '🇯🇴', currency: 'JOD', symbol: 'JD' },
  { code: 'LB',  name: 'Lebanon',            flag: '🇱🇧', currency: 'LBP', symbol: '£L' },
  { code: 'TR',  name: 'Turkey',             flag: '🇹🇷', currency: 'TRY', symbol: '₺' },
  { code: 'JP',  name: 'Japan',              flag: '🇯🇵', currency: 'JPY', symbol: '¥' },
  { code: 'KR',  name: 'South Korea',        flag: '🇰🇷', currency: 'KRW', symbol: '₩' },

  // Europe
  { code: 'PL',  name: 'Poland',             flag: '🇵🇱', currency: 'PLN', symbol: 'zł' },
  { code: 'RO',  name: 'Romania',            flag: '🇷🇴', currency: 'RON', symbol: 'lei' },
  { code: 'BG',  name: 'Bulgaria',           flag: '🇧🇬', currency: 'BGN', symbol: 'лв' },
  { code: 'HU',  name: 'Hungary',            flag: '🇭🇺', currency: 'HUF', symbol: 'Ft' },
  { code: 'CZ',  name: 'Czech Republic',     flag: '🇨🇿', currency: 'CZK', symbol: 'Kč' },
  { code: 'SK',  name: 'Slovakia',           flag: '🇸🇰', currency: 'EUR', symbol: '€' },
  { code: 'GR',  name: 'Greece',             flag: '🇬🇷', currency: 'EUR', symbol: '€' },
  { code: 'PT',  name: 'Portugal',           flag: '🇵🇹', currency: 'EUR', symbol: '€' },
  { code: 'NL',  name: 'Netherlands',        flag: '🇳🇱', currency: 'EUR', symbol: '€' },
  { code: 'BE',  name: 'Belgium',            flag: '🇧🇪', currency: 'EUR', symbol: '€' },
  { code: 'AT',  name: 'Austria',            flag: '🇦🇹', currency: 'EUR', symbol: '€' },
  { code: 'CH',  name: 'Switzerland',        flag: '🇨🇭', currency: 'CHF', symbol: 'Fr' },
  { code: 'SE',  name: 'Sweden',             flag: '🇸🇪', currency: 'SEK', symbol: 'kr' },
  { code: 'NO',  name: 'Norway',             flag: '🇳🇴', currency: 'NOK', symbol: 'kr' },
  { code: 'DK',  name: 'Denmark',            flag: '🇩🇰', currency: 'DKK', symbol: 'kr' },
  { code: 'FI',  name: 'Finland',            flag: '🇫🇮', currency: 'EUR', symbol: '€' },
  { code: 'IE',  name: 'Ireland',            flag: '🇮🇪', currency: 'EUR', symbol: '€' },
  { code: 'HR',  name: 'Croatia',            flag: '🇭🇷', currency: 'EUR', symbol: '€' },
  { code: 'RS',  name: 'Serbia',             flag: '🇷🇸', currency: 'RSD', symbol: 'din' },
  { code: 'BA',  name: 'Bosnia',             flag: '🇧🇦', currency: 'BAM', symbol: 'KM' },
  { code: 'AL',  name: 'Albania',            flag: '🇦🇱', currency: 'ALL', symbol: 'L' },
  { code: 'MK',  name: 'North Macedonia',    flag: '🇲🇰', currency: 'MKD', symbol: 'ден' },
  { code: 'MD',  name: 'Moldova',            flag: '🇲🇩', currency: 'MDL', symbol: 'L' },
  { code: 'BY',  name: 'Belarus',            flag: '🇧🇾', currency: 'BYN', symbol: 'Br' },
  { code: 'LV',  name: 'Latvia',             flag: '🇱🇻', currency: 'EUR', symbol: '€' },
  { code: 'LT',  name: 'Lithuania',          flag: '🇱🇹', currency: 'EUR', symbol: '€' },
  { code: 'EE',  name: 'Estonia',            flag: '🇪🇪', currency: 'EUR', symbol: '€' },
  { code: 'RU',  name: 'Russia',             flag: '🇷🇺', currency: 'RUB', symbol: '₽' },
  { code: 'UA',  name: 'Ukraine',            flag: '🇺🇦', currency: 'UAH', symbol: '₴' },
  { code: 'DE',  name: 'Germany',            flag: '🇩🇪', currency: 'EUR', symbol: '€' },
  { code: 'FR',  name: 'France',             flag: '🇫🇷', currency: 'EUR', symbol: '€' },
  { code: 'IT',  name: 'Italy',              flag: '🇮🇹', currency: 'EUR', symbol: '€' },
  { code: 'ES',  name: 'Spain',              flag: '🇪🇸', currency: 'EUR', symbol: '€' },
  { code: 'GB',  name: 'United Kingdom',     flag: '🇬🇧', currency: 'GBP', symbol: '£' },

  // Americas
  { code: 'US',  name: 'United States',      flag: '🇺🇸', currency: 'USD', symbol: '$' },
  { code: 'CA',  name: 'Canada',             flag: '🇨🇦', currency: 'CAD', symbol: 'CA$' },
  { code: 'AU',  name: 'Australia',          flag: '🇦🇺', currency: 'AUD', symbol: 'A$' },
  { code: 'CO',  name: 'Colombia',           flag: '🇨🇴', currency: 'COP', symbol: '$' },
  { code: 'PE',  name: 'Peru',               flag: '🇵🇪', currency: 'PEN', symbol: 'S/' },
  { code: 'VE',  name: 'Venezuela',          flag: '🇻🇪', currency: 'VES', symbol: 'Bs' },
  { code: 'CL',  name: 'Chile',              flag: '🇨🇱', currency: 'CLP', symbol: '$' },
  { code: 'AR',  name: 'Argentina',          flag: '🇦🇷', currency: 'ARS', symbol: '$' },
  { code: 'BO',  name: 'Bolivia',            flag: '🇧🇴', currency: 'BOB', symbol: 'Bs' },
  { code: 'PY',  name: 'Paraguay',           flag: '🇵🇾', currency: 'PYG', symbol: '₲' },
  { code: 'UY',  name: 'Uruguay',            flag: '🇺🇾', currency: 'UYU', symbol: '$' },
  { code: 'EC',  name: 'Ecuador',            flag: '🇪🇨', currency: 'USD', symbol: '$' },
  { code: 'GT',  name: 'Guatemala',          flag: '🇬🇹', currency: 'GTQ', symbol: 'Q' },
  { code: 'HN',  name: 'Honduras',           flag: '🇭🇳', currency: 'HNL', symbol: 'L' },
  { code: 'NI',  name: 'Nicaragua',          flag: '🇳🇮', currency: 'NIO', symbol: 'C$' },
  { code: 'CR',  name: 'Costa Rica',         flag: '🇨🇷', currency: 'CRC', symbol: '₡' },
  { code: 'PA',  name: 'Panama',             flag: '🇵🇦', currency: 'USD', symbol: '$' },
  { code: 'DO',  name: 'Dominican Republic', flag: '🇩🇴', currency: 'DOP', symbol: '$' },
  { code: 'JM',  name: 'Jamaica',            flag: '🇯🇲', currency: 'JMD', symbol: 'J$' },
  { code: 'TT',  name: 'Trinidad & Tobago',  flag: '🇹🇹', currency: 'TTD', symbol: '$' },
] as const

export type AllCountryCode = typeof ALL_COUNTRIES_LIST[number]['code']

/** Lookup map: country code → full metadata (from ALL_COUNTRIES_LIST) */
export const ALL_COUNTRY_META: Record<string, { name: string; flag: string; currency: string; symbol: string }> =
  Object.fromEntries(ALL_COUNTRIES_LIST.map((c) => [c.code, { name: c.name, flag: c.flag, currency: c.currency, symbol: c.symbol }]))
