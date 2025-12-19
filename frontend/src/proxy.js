import { NextResponse } from 'next/server';

export default function proxy(request) {
    const token = request.cookies.get('token')?.value || request.cookies.get('access_token')?.value;

    // Redirect to login if no token and trying to access dashboard or print routes
    if (!token && (request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/print'))) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/print/:path*'],
};
