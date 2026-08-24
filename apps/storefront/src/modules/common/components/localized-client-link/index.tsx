"use client"

import Link from "next/link"
import React from "react"

/**
 * Site link. URLs are clean (no country-code prefix) — the middleware
 * rewrites them to the default region internally.
 */
const LocalizedClientLink = ({
  children,
  href,
  ...props
}: {
  children?: React.ReactNode
  href: string
  className?: string
  onClick?: () => void
  passHref?: true
  [x: string]: unknown
}) => {
  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  )
}

export default LocalizedClientLink
