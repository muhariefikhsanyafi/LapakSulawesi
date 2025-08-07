import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: '/dash/:path*', 
};

export default async function middleware(permintaan: NextRequest) {
  return tanganiAutentikasi(permintaan);
}

function tanganiAutentikasi(permintaan: NextRequest) {
  const autentikasiBasic = permintaan.headers.get('authorization');
  const PENGGUNA_ADMIN = process.env.ADMIN_USER || 'admin';
  const KATA_SANDI_ADMIN = process.env.ADMIN_PASS || 'admin';

  if (autentikasiBasic) {
    const nilaiAutentikasi = autentikasiBasic.split(' ')[1];
    const [pengguna, kataSandi] = atob(nilaiAutentikasi).split(':');
    
    if (pengguna === PENGGUNA_ADMIN && kataSandi === KATA_SANDI_ADMIN) {
      return NextResponse.next(); 
    }
  }
  const url = permintaan.nextUrl;
  url.pathname = '/api/auth';
  return NextResponse.rewrite(url);
}
