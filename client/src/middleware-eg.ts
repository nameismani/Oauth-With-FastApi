// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// // This function can be marked `async` if using `await` inside
// export function middleware(request: NextRequest) {
//     const token = request.cookies.get('token')?.value;
//     const isAuthPage = request.nextUrl.pathname.startsWith('/login') ||
//         request.nextUrl.pathname.startsWith('/auth/callback');

//     // If accessing a protected route without a token, redirect to login
//     if (!token && !isAuthPage && request.nextUrl.pathname !== '/') {
//         return NextResponse.redirect(new URL('/login', request.url));
//     }

//     // If accessing login page with a token, redirect to dashboard
//     if (token && isAuthPage) {
//         return NextResponse.redirect(new URL('/dashboard', request.url));
//     }

//     return NextResponse.next();
// }

// // See "Matching Paths" below to learn more
// export const config = {
//     matcher: [
//         '/dashboard/:path*',
//         '/login',
//         '/auth/callback',
//     ],
// };