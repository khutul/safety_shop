# -*- coding: utf-8 -*-
"""Бүх хэрэглэгч, харилцагчийн хэлийг Монгол (mn_MN) болгоно.
Урьдчилсан нөхцөл: Settings > Translations > Languages дээр mn_MN идэвхжсэн байх."""

lang = env["res.lang"].search([("code", "=", "mn_MN"), ("active", "=", True)], limit=1)
if not lang:
    print("mn_MN hel idevhjeegui baina! Ehleed Settings > Translations > Languages")
    print("tsesend Mongol helig Activate hiigeed daraa ni ene skriptiig ajilluulna uu.")
else:
    # Бүх хэрэглэгч (шинэ хэрэглэгчийн загвар template-ийг оролцуулаад —
    # ингэснээр цаашид үүсэх хэрэглэгчид ч монголоор эхэлнэ)
    users = env["res.users"].with_context(active_test=False).search([])
    users.write({"lang": "mn_MN"})
    print("Hereglegchid:", len(users), "-> mn_MN")

    # Бүх харилцагч (нэхэмжлэх, имэйл монголоор хэвлэгдэнэ)
    partners = env["res.partner"].search([])
    partners.write({"lang": "mn_MN"})
    print("Hariltsagchid:", len(partners), "-> mn_MN")

    env.cr.commit()
    print("Duuslaa — browser-oo refresh hiihed tses mongoloor garna.")
