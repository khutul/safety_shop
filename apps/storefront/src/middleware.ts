import { NextRequest, NextResponse } from "next/server"

const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || "mn"
const KNOWN = new Set([DEFAULT_REGION, "mn", "en"])

export async function middleware(request: NextRequest) {
  const { pathname, search, origin } = request.nextUrl
  if (pathname.includes(".")) return NextResponse.next()
  const first = pathname.split("/")[1]?.toLowerCase()
  if (first && KNOWN.has(first)) return NextResponse.next()
  const redirectPath = pathname === "/" ? "" : pathname
  return NextResponse.redirect(`${origin}/${DEFAULT_REGION}${redirectPath}${search}`, 307)
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|assets|png|svg|jpg|jpeg|gif|webp).*)",
  ],
}
