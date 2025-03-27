import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/auth';
import { app_routes } from '@/lib/constants';

export async function middleware(request: Request) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;
  const pathname = new URL(request.url).pathname;

  const session = sessionCookie ? await decrypt(sessionCookie) : null;

  console.log(session);
  const isAuthenticated = !!session?.id;

  // Define public routes
  const publicRoutes = ['/', '/auth'];

  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isAuthenticated && pathname.startsWith('/auth')) {
    // Redirect authenticated users away from auth pages
    return NextResponse.redirect(new URL(app_routes.dashboard, request.url));
  }

  if (!isAuthenticated && !isPublicRoute) {
    // Redirect unauthenticated users to login
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico|img/|currencies/|icons/).*)'
};
