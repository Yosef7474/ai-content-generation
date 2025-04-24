import { type NextRequest } from 'next/server'
import { updateSession } from './util/supabase/middleware'


export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - signup (signup page)
     * - home page (/)
     * - image files (svg, png, jpg, jpeg, gif, webp)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|signup|/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}