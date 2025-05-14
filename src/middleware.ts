import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabaseClient } from "./lib/supabase/server";

export async function middleware(request: NextRequest) {
    const response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = await createServerSupabaseClient();

    const {
        data: { session },
    } = await supabase.auth.getSession()

    // Protected routes pattern
    const isProtectedRoute = request.nextUrl.pathname.startsWith('/profile')
    const isAuthRoute = request.nextUrl.pathname.startsWith('/auth')

    if (isProtectedRoute && !session) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    if (isAuthRoute && session) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return response;
}

export const config = {
    matcher: [
    "/api/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}