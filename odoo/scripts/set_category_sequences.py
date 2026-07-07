# -*- coding: utf-8 -*-
"""
Set storefront category sequences (and fix Өвлийн гутал parent).

Run via odoo shell:
    docker compose run --rm -T odoo odoo shell -c /etc/odoo/odoo.conf \
        -d safety_shop --no-http < scripts/set_category_sequences.py

Or simply run:  set_sequences.cmd
"""

ROOT_ORDER = [
    "Хамгаалах хэрэгсэл",
    "Ажлын хувцас",
    "Ажлын гутал",
    "Хэвлэл, аюулгүйн тууз",
    "Гэрэл",
    "Тэмдэг тэмдгэлгээ",
    "Хэмжих багаж хэрэгсэл",
    "Анхны тусламж",
    "Бусад",
]

CHILD_ORDER = {
    "Хамгаалах хэрэгсэл": [
        "Толгойн хамгаалах хэрэгсэл",
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
    "Хэмжих багаж хэрэгсэл": ["Алкахол тандагч"],
    "Анхны тусламж": ["Анхны тусламжын хайрцаг"],
    "Бусад": ["Каскны суурь"],
}

Cat = env["safety.catalog.category"].with_context(active_test=False)  # noqa: F821
all_cats = Cat.search([])


def norm(s):
    return (s or "").strip().lower()


def find(name):
    for c in all_cats:
        if norm(c.name) == norm(name):
            return c
    return None


# 1) Re-parent "Өвлийн гутал" under "Ажлын гутал" (if still a root).
winter = find("Өвлийн гутал")
boots = find("Ажлын гутал")
if winter and boots and not winter.parent_id:
    winter.parent_id = boots.id
    print("Re-parented: Өвлийн гутал -> Ажлын гутал")

# 2) Root sequences (10, 20, 30, ...).
for i, name in enumerate(ROOT_ORDER):
    cat = find(name)
    if cat:
        cat.sequence = (i + 1) * 10
        print("root %-28s -> %s" % (name, cat.sequence))
    else:
        print("root %-28s -> NOT FOUND (skipped)" % name)

# 3) Child sequences per root.
for root_name, children in CHILD_ORDER.items():
    for i, name in enumerate(children):
        cat = find(name)
        if cat:
            cat.sequence = (i + 1) * 10
            print("  child %-34s -> %s" % (name, cat.sequence))
        else:
            print("  child %-34s -> NOT FOUND (skipped)" % name)

env.cr.commit()  # noqa: F821
print("Done. Sequences saved.")
