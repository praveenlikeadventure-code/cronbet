import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import {
  type Locale,
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  countryToLocale,
  localeFromAcceptLanguage,
} from '@/lib/i18n'

export async function middleware(request: NextRequest) {
  // Skip middleware for non-page routes
  const { pathname } = request.nextUrl
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|webp|woff2?|ttf|css|js)$/)
  ) {
    return NextResponse.next()
  }

  // Guard all admin routes — only /admin/login is publicly accessible
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') {
      return NextResponse.next()
    }
    const token = await getToken({ req: request })
    if (!token) {
      const loginUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  const response = NextResponse.next()

  // If user has already set a manual preference, respect it
  const existingCookie = request.cookies.get(LOCALE_COOKIE)?.value
  if (existingCookie && SUPPORTED_LOCALES.includes(existingCookie as Locale)) {
    // Refresh the cookie TTL on every request
    response.cookies.set(LOCALE_COOKIE, existingCookie, {
      maxAge: 365 * 24 * 60 * 60,
      path: '/',
      sameSite: 'lax',
    })
    return response
  }

  // Detect locale from geo headers (Vercel, Cloudflare, or generic)
  const country =
    // Vercel
    (request as NextRequest & { geo?: { country?: string } }).geo?.country ||
    request.headers.get('x-vercel-ip-country') ||
    // Cloudflare
    request.headers.get('cf-ipcountry') ||
    // Generic reverse-proxy header
    request.headers.get('x-country-code')

  let detectedLocale: Locale | null = null

  if (country && country !== 'XX') {
    detectedLocale = (countryToLocale[country.toUpperCase()] as Locale) ?? null
  }

  // Fallback: parse Accept-Language header
  if (!detectedLocale) {
    const acceptLang = request.headers.get('accept-language')
    if (acceptLang) {
      detectedLocale = localeFromAcceptLanguage(acceptLang)
    }
  }

  const locale: Locale = detectedLocale ?? DEFAULT_LOCALE

  response.cookies.set(LOCALE_COOKIE, locale, {
    maxAge: 365 * 24 * 60 * 60,
    path: '/',
    sameSite: 'lax',
  })

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
