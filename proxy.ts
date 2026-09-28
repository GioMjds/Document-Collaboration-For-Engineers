import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function proxy(request: NextRequest) {
  const { response, user } = await updateSession(request);
  const isLogin = request.nextUrl.pathname.startsWith('/login');

  if (!user && !isLogin) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  if (user && isLogin) {
    return NextResponse.redirect(new URL('/documents', request.url));
  }
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
