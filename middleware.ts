import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Domaine principal du SaaS (ex: votresaas.com)
const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // Retirer le port en développement
  const host = hostname.replace(/:\d+$/, '');

  // Domaine principal → pas de rewrite
  if (host === ROOT_DOMAIN || host === `www.${ROOT_DOMAIN}` || host === 'localhost') {
    return NextResponse.next();
  }

  // Détecter un sous-domaine
  // Ex: mon-site.votresaas.com → subdomain = "mon-site"
  const isSubdomain = host.endsWith(`.${ROOT_DOMAIN}`) && host !== ROOT_DOMAIN;

  if (isSubdomain) {
    const subdomain = host.replace(`.${ROOT_DOMAIN}`, '');

    // Éviter les sous-domaines réservés
    const reserved = ['www', 'app', 'admin', 'api', 'dashboard'];
    if (reserved.includes(subdomain)) {
      return NextResponse.next();
    }

    // Rewrite interne vers /sites/[subdomain]/...
    const pathname = url.pathname;
    url.pathname = `/sites/${subdomain}${pathname === '/' ? '' : pathname}`;

    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
