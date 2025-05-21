import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // // const token = request.cookies.get('auth_token')
  // const token =  localStorage.getItem('token')
  // const isAuthPage = request.nextUrl.pathname.startsWith('/auth/login')

  // // If no token and not on auth page, redirect to login
  // if (!token && !isAuthPage) {
  //   return NextResponse.redirect(new URL('/auth/login', request.url))
  // }

  // // If has token and on auth page, redirect to dashboard
  // if (token && isAuthPage) {
  //   return NextResponse.redirect(new URL('/dashboard/employees', request.url))
  // }

  // // If has token and not on auth page, validate session
  // if (token && !isAuthPage) {
  //   try {
  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/auth/validate`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token.value}`,
  //           Cookie: request.headers.get('cookie') || '',
  //         },
  //         credentials: 'include',
  //       }
  //     )

  //     if (!response.ok) {
  //       const redirectRes = NextResponse.redirect(new URL('/auth/login', request.url))
  //       redirectRes.cookies.delete('auth_token')
  //       redirectRes.cookies.delete('user_data')
  //       return redirectRes
  //     }
  //   } catch (error) {
  //     const redirectRes = NextResponse.redirect(new URL('/auth/login', request.url))
  //     redirectRes.cookies.delete('auth_token')
  //     redirectRes.cookies.delete('user_data')
  //     return redirectRes
  //   }
  // }

  // return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/login'],
}
