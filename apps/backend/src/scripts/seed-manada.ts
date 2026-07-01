/**
 * Manada Safety — Seed Script
 * Ажиллуулах: npx tsx src/scripts/seed-manada.ts
 *
 * Ангилал болон бараануудыг Medusa Admin API-аар оруулна.
 * Backend localhost:9000 дээр ажиллаж байх ёстой.
 */

const BASE_URL = "http://localhost:9000"
const ADMIN_EMAIL = "admin@manadasafety.mn"
const ADMIN_PASSWORD = "Admin1234!"

// ─── Бүтээгдэхүүний ангилалууд ───────────────────────────────────────────────
const CATEGORIES = [
  {
    name: "Ажлын хувцас",
    handle: "ajliin-huvtsas",
    description: "Зуны, өвлийн ажлын хувцас, комбинзон, хантааз",
  },
  {
    name: "Ажлын гутал",
    handle: "ajliin-gutal",
    description: "Зуны, өвлийн ажлын хамгаалалтын гутал",
  },
  {
    name: "Толгой хамгаалах",
    handle: "tolgoi-hamgaalah",
    description: "Каск, малгай, гагнуурын баг, нүүрний хаалт",
  },
  {
    name: "Бээлий",
    handle: "beelii",
    description: "Ажлын бээлий — арьсан, хиймийн, гагнуурын",
  },
  {
    name: "Нүд хамгаалах",
    handle: "nud-hamgaalah",
    description: "Хамгаалалтын нүдний шил, битүү шил",
  },
  {
    name: "Амьсгал хамгаалах",
    handle: "amsgal-hamgaalah",
    description: "Амны хаалт, хорт утааны баг, шүүлтүүр",
  },
]

// ─── Бараануудын жагсаалт (PDF каталогоос) ──────────────────────────────────
const PRODUCTS = [
  // ── Ажлын гутал ──
  {
    title: "Ажлын гутал M-8565",
    handle: "safetoe-m8565",
    brand: "Safetoe",
    code: "M-8565",
    pn: "10234567",
    category_handle: "ajliin-gutal",
    description:
      "CE ISO 20345:2022 стандарт хангасан хамгаалалтын гутал. Нэгдүгээр зэрэглэлийн үхрийн арьс. Kompozit хамгаалалтын тавхай.",
    thumbnail:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    price: 190000,
    original_price: 240000,
    quantity: 50,
    sizes: ["38", "39", "40", "41", "42", "43", "44"],
  },
  {
    title: "Bestboy Зуны гутал",
    handle: "bestboy-summer-boot",
    brand: "Safetoe",
    code: "BESTBOY",
    pn: "BB-001",
    category_handle: "ajliin-gutal",
    description: "Зуны ажлын хөнгөн гутал. Эвтэйхэн, тав тухтай.",
    thumbnail:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    price: 120000,
    original_price: null,
    quantity: 35,
    sizes: ["37", "38", "39", "40", "41", "42", "43", "44"],
  },
  {
    title: "ALTAR S3 Ажлын гутал",
    handle: "altar-s3-boot",
    brand: "Safety Jogger",
    code: "ALTAR-S3",
    pn: "SJ-ALTAR",
    category_handle: "ajliin-gutal",
    description:
      "S3 ангиллын хамгаалалтын гутал. Усны эсрэг, хадаасны хамгаалалттай.",
    thumbnail:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    price: 240000,
    original_price: null,
    quantity: 20,
    sizes: ["38", "39", "40"],
  },

  // ── Ажлын хувцас ──
  {
    title: "Зуны ажлын хослол (Код 2-001)",
    handle: "summer-workwear-2001",
    brand: "Manada",
    code: "2-001",
    pn: "MW-2001",
    category_handle: "ajliin-huvtsas",
    description:
      "Нимгэн даавуун зуны ажлын хослол. Тохиромжтой, бат бэх материал.",
    thumbnail:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80",
    price: 100000,
    original_price: null,
    quantity: 30,
    sizes: ["M", "L", "XL", "XXL", "3XL"],
  },
  {
    title: "Зуны ажлын хослол (Код 2-003)",
    handle: "summer-workwear-2003",
    brand: "Manada",
    code: "2-003",
    pn: "MW-2003",
    category_handle: "ajliin-huvtsas",
    description: "Зуны хөнгөн даавуун ажлын хослол. Цацруулагчтай.",
    thumbnail:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80",
    price: 85000,
    original_price: null,
    quantity: 40,
    sizes: ["46", "48", "50", "52", "54", "56"],
  },
  {
    title: "Цацруулагчтай ажлын хантааз",
    handle: "reflective-vest",
    brand: "Manada",
    code: "VEST-R01",
    pn: "MV-001",
    category_handle: "ajliin-huvtsas",
    description: "Цацруулагчтай нимгэн хантааз. ХАБЭА шаардлага хангасан.",
    thumbnail:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80",
    price: 11000,
    original_price: null,
    quantity: 100,
    sizes: ["L", "XL", "2XL", "3XL"],
  },

  // ── Толгой хамгаалах ──
  {
    title: "MSA GUARD-500 Каск",
    handle: "msa-guard-500",
    brand: "MSA",
    code: "GUARD-500",
    pn: "MSA-G500",
    category_handle: "tolgoi-hamgaalah",
    description:
      "MSA GUARD-500 хамгаалалтын каск. Хаялагатай, нүхтэй загвар. Хөнгөн, тав тухтай.",
    thumbnail:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80",
    price: 30000,
    original_price: null,
    quantity: 60,
    sizes: ["Нэг хэмжээ"],
  },
  {
    title: "MSA Уурхайн бөөрөнхий каск",
    handle: "msa-mining-helmet",
    brand: "MSA",
    code: "MSA-MINE",
    pn: "MSA-MH01",
    category_handle: "tolgoi-hamgaalah",
    description: "Уурхайн ажилд зориулсан тусгай каск. Ламп холбогчтой.",
    thumbnail:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80",
    price: 50000,
    original_price: null,
    quantity: 25,
    sizes: ["Нэг хэмжээ"],
  },
  {
    title: "Гагнуурын баг Хамелеон",
    handle: "welding-helmet-chameleon",
    brand: "Manada",
    code: "WH-CHAM",
    pn: "WH-001",
    category_handle: "tolgoi-hamgaalah",
    description:
      "Автомат харлах линзтэй гагнуурын баг. Хамелеон технологи — гэрлийн хурдаар харлана.",
    thumbnail:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80",
    price: 55000,
    original_price: null,
    quantity: 15,
    sizes: ["Нэг хэмжээ"],
  },

  // ── Бээлий ──
  {
    title: "Safeyear Хамгаалах бээлий (арьс)",
    handle: "safeyear-leather-glove",
    brand: "Safeyear",
    code: "SY-G03",
    pn: "SYG-003",
    category_handle: "beelii",
    description:
      "Арьсан хамгаалах бээлий. Тасалдалтын эсрэг хамгаалалт. CE стандарт.",
    thumbnail:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    price: 48000,
    original_price: null,
    quantity: 80,
    sizes: ["S", "M", "L", "XL"],
  },
  {
    title: "Хиймийн бээлий (стандарт)",
    handle: "synthetic-glove-std",
    brand: "Manada",
    code: "SG-STD",
    pn: "MG-001",
    category_handle: "beelii",
    description: "Энгийн хиймийн бээлий. Ажлын зориулалтай, хямд үнэтэй.",
    thumbnail:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    price: 7000,
    original_price: null,
    quantity: 200,
    sizes: ["Нэг хэмжээ"],
  },
  {
    title: "Галын бээлий",
    handle: "fire-glove",
    brand: "Manada",
    code: "FG-001",
    pn: "MFG-001",
    category_handle: "beelii",
    description:
      "Өндөр дулааны эсрэг хамгаалах бээлий. Гагнуур болон өндөр температурт тохиромжтой.",
    thumbnail:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    price: 10000,
    original_price: null,
    quantity: 50,
    sizes: ["Нэг хэмжээ"],
  },

  // ── Нүд хамгаалах ──
  {
    title: "Safeyear Хамгаалалтын шил (тунгалаг)",
    handle: "safeyear-clear-glasses",
    brand: "Safeyear",
    code: "SY-E01-C",
    pn: "SYE-001",
    category_handle: "nud-hamgaalah",
    description:
      "Тунгалаг хамгаалалтын нүдний шил. CE стандарт. Scratch resistant.",
    thumbnail:
      "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&q=80",
    price: 25000,
    original_price: null,
    quantity: 100,
    sizes: ["Нэг хэмжээ"],
  },
  {
    title: "Safeyear Хамгаалалтын шил (хар)",
    handle: "safeyear-dark-glasses",
    brand: "Safeyear",
    code: "SY-E01-D",
    pn: "SYE-002",
    category_handle: "nud-hamgaalah",
    description:
      "Хар линзтэй хамгаалалтын нүдний шил. Гадаа ажилд тохиромжтой.",
    thumbnail:
      "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&q=80",
    price: 25000,
    original_price: null,
    quantity: 80,
    sizes: ["Нэг хэмжээ"],
  },

  // ── Амьсгал хамгаалах ──
  {
    title: "3M 6200 Амьсгалын хагас баг",
    handle: "3m-6200-respirator",
    brand: "3M",
    code: "3M-6200",
    pn: "6200M",
    category_handle: "amsgal-hamgaalah",
    description:
      "3M-ийн хагас нүүрний амьсгалын хамгаалагч. Сольж болох шүүлтүүртэй. Химийн утаа, тоосноос хамгаална.",
    thumbnail:
      "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=600&q=80",
    price: 45000,
    original_price: null,
    quantity: 40,
    sizes: ["S/M", "M/L"],
  },
  {
    title: "Нэг удаагийн амны хаалт (FFP2)",
    handle: "ffp2-disposable-mask",
    brand: "Manada",
    code: "FFP2-001",
    pn: "MFFP2",
    category_handle: "amsgal-hamgaalah",
    description:
      "FFP2 ангиллын нэг удаагийн амны хаалт. 94% тоосны шүүлтүүртэй.",
    thumbnail:
      "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=600&q=80",
    price: 2000,
    original_price: null,
    quantity: 500,
    sizes: ["Нэг хэмжээ"],
  },
]

// ─── Helper functions ────────────────────────────────────────────────────────
async function apiCall(
  path: string,
  method: string,
  body?: object,
  token?: string
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }
  if (token) headers["Authorization"] = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`API Error ${res.status} on ${method} ${path}: ${err}`)
  }
  return res.json()
}

// ─── Main seed function ──────────────────────────────────────────────────────
async function seed() {
  console.log("🚀 Manada Safety seed эхэллээ...\n")

  // 1. Admin token авах
  console.log("🔑 Admin-д нэвтэрч байна...")
  let token: string
  try {
    const authRes = await apiCall("/auth/user/emailpass", "POST", {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    })
    token = authRes.token
    console.log("✅ Нэвтрэлт амжилттай\n")
  } catch (e) {
    console.error("❌ Нэвтрэлт амжилтгүй:", e)
    console.log("👉 Эхлээд: npx medusa user -e admin@manadasafety.mn -p Admin1234!")
    process.exit(1)
  }

  // 2. Store-д MNT currency нэмэх
  console.log("💰 Store currency шалгаж байна...")
  let currencyCode = "eur" // default — store-д EUR байна
  try {
    const storeRes = await apiCall("/admin/stores", "GET", undefined, token)
    const store = storeRes.stores?.[0] || storeRes.store
    if (store) {
      const existing: any[] = store.supported_currencies || []
      const existingCodes = existing.map((c: any) =>
        typeof c === "string" ? c : c.currency_code
      )
      currencyCode = store.default_currency_code || existingCodes[0] || "eur"

      if (!existingCodes.includes("mnt")) {
        // MNT нэмэх — одоогийн default-г хадгалах
        const defaultCode = store.default_currency_code || existingCodes[0]
        await apiCall(`/admin/stores/${store.id}`, "POST", {
          supported_currencies: [
            ...existing.map((c: any) => ({
              currency_code: typeof c === "string" ? c : c.currency_code,
              is_default: (typeof c === "string" ? c : c.currency_code) === defaultCode,
            })),
            { currency_code: "mnt", is_default: false },
          ],
        }, token)
        console.log(`✅ MNT нэмэгдлээ (default: ${defaultCode})\n`)
      } else {
        console.log(`⏭️  MNT байна (default: ${currencyCode})\n`)
        currencyCode = "mnt"
      }
    }
  } catch (e: any) {
    console.warn(`⚠️  Currency алдаа (${currencyCode} ашиглана):`, e.message.slice(0, 80))
  }

  // 3. Region авах (Admin API ашиглана)
  console.log("🌍 Region авж байна...")
  let regionId: string

  try {
    const adminRegions = await apiCall("/admin/regions", "GET", undefined, token)
    const regions = adminRegions.regions || []

    if (regions.length === 0) {
      console.error("❌ Region байхгүй. Admin panel > Settings > Regions дээр нэмнэ үү.")
      process.exit(1)
    }

    const mongoliaRegion = regions.find(
      (r: any) => r.name?.toLowerCase().includes("mongol")
    )
    const chosen = mongoliaRegion || regions[0]
    regionId = chosen.id
    currencyCode = chosen.currency_code || currencyCode
    console.log(`✅ Region: ${chosen.name} (${currencyCode})\n`)
  } catch (e: any) {
    console.error("❌ Region алдаа:", e.message)
    process.exit(1)
  }

  // 4. Sales channel авах
  console.log("📦 Sales channel авж байна...")
  const { sales_channels } = await apiCall(
    "/admin/sales-channels",
    "GET",
    undefined,
    token
  )
  const salesChannel = sales_channels[0]
  console.log(`✅ Sales channel: ${salesChannel.name}\n`)

  // 4. Ангилал үүсгэх
  console.log("📂 Ангилалууд үүсгэж байна...")
  const categoryMap: Record<string, string> = {}

  for (const cat of CATEGORIES) {
    try {
      // Байгаа эсэхийг шалгах
      const existing = await apiCall(
        `/admin/product-categories?handle=${cat.handle}`,
        "GET",
        undefined,
        token
      )

      if (existing.product_categories?.length > 0) {
        const existingCat = existing.product_categories[0]
        categoryMap[cat.handle] = existingCat.id
        console.log(`  ⏭️  Ангилал байна: ${cat.name}`)
        continue
      }

      const res = await apiCall(
        "/admin/product-categories",
        "POST",
        {
          name: cat.name,
          handle: cat.handle,
          description: cat.description,
          is_active: true,
          is_internal: false,
        },
        token
      )
      categoryMap[cat.handle] = res.product_category.id
      console.log(`  ✅ Үүслээ: ${cat.name}`)
    } catch (e: any) {
      console.error(`  ❌ Алдаа (${cat.name}):`, e.message)
    }
  }
  console.log()

  // 5. Бараанууд үүсгэх
  console.log("🛍️  Бараанууд үүсгэж байна...")

  for (const product of PRODUCTS) {
    try {
      // Байгаа эсэхийг шалгах
      const existing = await apiCall(
        `/admin/products?handle=${product.handle}`,
        "GET",
        undefined,
        token
      )

      if (existing.products?.length > 0) {
        console.log(`  ⏭️  Бараа байна: ${product.title}`)
        continue
      }

      const categoryId = categoryMap[product.category_handle]

      // Variant-уудыг бэлдэх (dynamic currency)
      const variants = product.sizes.map((size) => ({
        title: size,
        sku: `${product.code}-${size.replace(/\s/g, "")}`,
        manage_inventory: true,
        prices: [
          {
            currency_code: currencyCode,
            // MNT бол ₮, USD бол центээр (×100)
            amount: currencyCode === "mnt" ? product.price : Math.round(product.price / 3400),
          },
        ],
        options: { "Хэмжээ": size },
      }))

      const body: any = {
        title: product.title,
        handle: product.handle,
        description: product.description,
        status: "published",
        thumbnail: product.thumbnail,
        images: [{ url: product.thumbnail }],
        options: [{ title: "Хэмжээ", values: product.sizes }],
        variants,
        sales_channels: [{ id: salesChannel.id }],
        metadata: {
          brand: product.brand,
          code: product.code,
          pn: product.pn,
          original_price: product.original_price,
        },
      }

      if (categoryId) {
        body.categories = [{ id: categoryId }]
      }

      await apiCall("/admin/products", "POST", body, token)
      console.log(`  ✅ Үүслээ: ${product.title} (${product.brand})`)

      // Бага зэрэг хүлээх (rate limiting-ийг зайлсхийх)
      await new Promise((r) => setTimeout(r, 200))
    } catch (e: any) {
      console.error(`  ❌ Алдаа (${product.title}):`, e.message)
    }
  }

  console.log("\n✨ Seed дууслаа!")
  console.log("📱 Admin panel: localhost:9000/app")
  console.log("🌐 Storefront: localhost:8001/mn")
  console.log("\nДараагийн алхам:")
  console.log("  1. Admin panel > Products > зураг нэм/солих")
  console.log("  2. Admin panel > Inventory > тоо шалгах")
  console.log("  3. Storefront дээр бараануудыг шалгах")
}

seed().catch(console.error)
