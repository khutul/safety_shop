import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

// GET /api/image?n=1  →  зурагны файл буцаана
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const n = parseInt(searchParams.get("n") || "1")

  // picture фолдероос файлуудын жагсаалт авах
  const pictureDir = path.join(process.cwd(), "..", "..", "picture")

  let files: string[] = []
  try {
    files = fs
      .readdirSync(pictureDir)
      .filter((f) => f.toLowerCase().endsWith(".jfif"))
      .sort()
  } catch {
    // Fallback: public/products
    const altDir = path.join(process.cwd(), "public", "products")
    try {
      files = fs
        .readdirSync(altDir)
        .filter((f) => f.toLowerCase().endsWith(".jpg"))
        .sort()
    } catch {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 })
    }
    if (n < 1 || n > files.length) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    const filePath = path.join(altDir, files[n - 1])
    const data = fs.readFileSync(filePath)
    return new NextResponse(data as any, {
      headers: { "Content-Type": "image/jpeg" },
    })
  }

  if (n < 1 || n > files.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const filePath = path.join(pictureDir, files[n - 1])
  try {
    const data = fs.readFileSync(filePath)
    return new NextResponse(data as any, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=86400",
      },
    })
  } catch {
    return NextResponse.json({ error: "File read error" }, { status: 500 })
  }
}

// Файлуудын жагсаалт авах
export async function POST() {
  const pictureDir = path.join(process.cwd(), "..", "..", "picture")
  try {
    const files = fs
      .readdirSync(pictureDir)
      .filter((f) => f.toLowerCase().endsWith(".jfif"))
      .sort()
    return NextResponse.json({ count: files.length, files })
  } catch {
    return NextResponse.json({ error: "Folder not found" }, { status: 404 })
  }
}
