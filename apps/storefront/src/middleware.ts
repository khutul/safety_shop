import { NextRequest, NextResponse } from "next/server"

const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || "mn"
const KNOWN = new Set([DEFAULT_REGION, "mn", "en"])

/**
 * Clean URLs: the country code never appears in the address bar.
 * - "/mn/..."  -> redirect to "/..." (strip the code)
 * - "/..."     -> internally rewrite to "/mn/..." so the
 *                 app/[countryCode] routes keep working unchanged.
 */
export async function middleware(request: NextRequest) {
  const { pathname, search, origin } = request.nextUrl
  if (pathname.includes(".")) return NextResponse.next()

  const first = pathname.split("/")[1]?.toLowerCase()

  // Old-style URL with the code — send the visitor to the clean URL.
  if (first && KNOWN.has(first)) {
    const rest = pathname.slice(first.length + 1) || "/"
    return NextResponse.redirect(`${origin}${rest}${search}`, 308)
  }

  // Clean URL — serve the default-region routes invisibly.
  const rewritePath = pathname === "/" ? "" : pathname
  return NextResponse.rewrite(
    `${origin}/${DEFAULT_REGION}${rewritePath}${search}`
  )
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|assets|png|svg|jpg|jpeg|gif|webp).*)",
  ],
}
