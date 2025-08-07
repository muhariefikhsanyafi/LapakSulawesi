import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(_: NextApiRequest, res: NextApiResponse) {
  res.setHeader('WWW-authenticate', 'Basic realm="Secure Area"')
  res.statusCode = 401
  res.end(`Sesi Anda telah berakhir. Akses ke dashboard tidak dapat dilakukan karena username atau password yang Anda masukkan tidak sesuai. Silakan periksa kembali informasi login Anda. Jika Anda terus memasukkan password yang salah, halaman login akan tetap muncul hingga Anda berhasil masuk dengan kredensial yang benar.`)
}
