export async function isValidPassword(
  password: string,
  hashedPassword: string
) {
  const arrayBuffer = await crypto.subtle.digest(
    "SHA-512", // 👈 هاد الـ Argument الأول هو اللي كان ناقص!
    new TextEncoder().encode(password)
  )

  const Buffer = require("buffer").Buffer
  const hashedInput = Buffer.from(arrayBuffer).toString("hex")

  return hashedInput === hashedPassword
}