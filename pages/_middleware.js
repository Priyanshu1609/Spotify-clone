
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server'


export async function middleware(req) {
    const token = await getToken({ req, secret: process.env.JWT_SECRET });
    const pathName = req.url

    //Allow if token exist :
    if (pathName.includes('/api/auth' || token)) {
        return NextResponse.next();
    }
    //if dont have token and pathname is not for authorisation
    if (!token && pathName !== '/login') {
        return NextResponse.redirect('/login');
    }
}

