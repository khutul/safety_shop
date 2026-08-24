/**
 * Manada Safety — storefront category menu ordering.
 *
 * Odoo returns categories alphabetically; the business wants a fixed
 * merchandising order. Until sequences are maintained in Odoo, we order
 * (and re-parent) here by category name.
 */

type CatLike = { name: string; sequence?: number; count?: number; children?: CatLike[] | undefined }

// Root categories in display order.
const ROOT_ORDER = [
  "Хамгаалах хэрэгсэл",
  "Ажлын хувцас",
  "Ажлын гутал",
  "Хэвлэл, аюулгүйн тууз",
  "Гэрэл",
  "Тэмдэг тэмдгэлгээ",
  "Тэмдэг тэмдэглэгээ",
  "Хэмжих багаж хэрэгсэл",
  "Анхны тусламж",
  "Бусад",
]

// Child categories in display order, per root.
const CHILD_ORDER: Record<string, string[]> = {
  "Хамгаалах хэрэгсэл": [
    "Толгойн хамгаалах хэрэгсэл",
    "Толгой хамгаалах хэрэгсэл",
    "Нүүр хамгаалах хэрэгсэл",
    "Нүд хамгаалах хэрэгсэл",
    "Сонсгол хамгаалах хэрэгсэл",
    "Амьсгалын зам хамгаалах хэрэгсэл",
    "Гар хамгаалах хэрэгсэл",
    "Өвдөг хамгаалах хэрэгсэл",
    "Өндрийн хамгаалах хэрэгсэл",
    "Гагнуурын хамгаалах хэрэгсэл",
  ],
  "Ажлын хувцас": [
    "Өвлийн хослол",
    "Зуны хослол",
    "Цамц",
    "Өмд",
    "Куртик, бомбер",
    "Подволк",
    "Хантааз",
    "Борооны цув",
    "Конбензон",
  ],
  "Ажлын гутал": ["Өвлийн гутал", "Зуны гутал", "Усны гутал"],
  "Хэвлэл, аюулгүйн тууз": ["Зааварчилгааны дэвтэр", "Каскны наалт", "Аваарын тууз"],
  "Гэрэл": ["Духны гэрэл", "Каскны гэрэл", "Гар чийдэн"],
  "Тэмдэг тэмдгэлгээ": ["Үйлдвэр барилгын орчин", "Автозамын орчин"],
  "Тэмдэг тэмдэглэгээ": ["Үйлдвэр барилгын орчин", "Автозамын орчин"],
  "Хэмжих багаж хэрэгсэл": ["Алкахол тандагч"],
  "Анхны тусламж": ["Анхны тусламжын хайрцаг"],
  "Бусад": ["Каскны суурь"],
}

// Roots that should actually live under another root (until fixed in Odoo).
const REPARENT: Record<string, string> = {
  "Өвлийн гутал": "Ажлын гутал",
}

const norm = (s: string) => (s || "").trim().toLowerCase()

function rank(name: string, order: string[]): number {
  const i = order.findIndex((n) => norm(n) === norm(name))
  return i === -1 ? 999 : i
}

function sortByNames<T extends CatLike>(list: T[], order: string[]): T[] {
  // Odoo Sequence field first; among equal sequences fall back to the
  // hardcoded name order, then alphabetical. Once sequences are maintained
  // in Odoo (see odoo/set_sequences.cmd) they fully control the order.
  return [...list].sort((a, b) => {
    const sa = typeof a.sequence === "number" ? a.sequence : 999
    const sb = typeof b.sequence === "number" ? b.sequence : 999
    if (sa !== sb) return sa - sb
    const ra = rank(a.name, order)
    const rb = rank(b.name, order)
    if (ra !== rb) return ra - rb
    return a.name.localeCompare(b.name, "mn")
  })
}

/**
 * Order roots + children per the merchandising plan and move
 * misplaced roots (e.g. "Өвлийн гутал") under their intended parent.
 * Returns a new array; input objects are shallow-copied where modified.
 */
export function orderCategoryTree<T extends CatLike>(roots: T[]): T[] {
  let out: T[] = [...roots]

  // Re-parent
  for (const [childName, parentName] of Object.entries(REPARENT)) {
    const childIdx = out.findIndex((c) => norm(c.name) === norm(childName))
    const parent = out.find((c) => norm(c.name) === norm(parentName))
    if (childIdx !== -1 && parent) {
      const [child] = out.splice(childIdx, 1)
      ;(parent.children as T[] | undefined) = [
        ...((parent.children as T[] | undefined) ?? []),
        child,
      ]
    }
  }

  // Hide legacy/empty roots: an old category with no subcategories and no
  // products (e.g. "Толгойн хамгаалалт" left over from the first import)
  // should not clutter the menu. Real roots always have children.
  out = out.filter((c) => (c.children?.length ?? 0) > 0 || (c.count ?? 0) > 0)

  // Order children
  out = out.map((c) => {
    if (!c.children?.length) return c
    const order = CHILD_ORDER[c.name.trim()] ?? []
    return { ...c, children: sortByNames(c.children as T[], order) }
  })

  // Order roots
  return sortByNames(out, ROOT_ORDER)
}
