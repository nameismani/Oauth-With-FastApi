import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    console.log(searchParams, code, error, "backend google triggered")
    if (error) {
        return NextResponse.redirect(new URL('/login?error=' + error, request.url));
    }

    if (!code) {
        return NextResponse.redirect(new URL('/login?error=no_code', request.url));
    }

    // Redirect to the frontend callback handler with the code
    return NextResponse.redirect(new URL(`/auth/callback?code=${code}`, request.url));
}