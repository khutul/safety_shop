# -*- coding: utf-8 -*-
"""Бүх брэндийн логоны эргэн тойрны цагаан/тунгалаг хоосон зайг автоматаар тайрна."""
import base64
import io

from PIL import Image, ImageChops

def trim(im, tol=12, pad=10):
    if im.mode != "RGBA":
        im = im.convert("RGBA")
    bg = Image.new("RGBA", im.size, (255, 255, 255, 255))
    comp = Image.alpha_composite(bg, im).convert("RGB")
    white = Image.new("RGB", comp.size, (255, 255, 255))
    diff = ImageChops.difference(comp, white).convert("L")
    diff = diff.point(lambda p: 255 if p > tol else 0)
    bbox = diff.getbbox()
    if not bbox:
        return None
    l, t, r, b = bbox
    l = max(0, l - pad); t = max(0, t - pad)
    r = min(im.width, r + pad); b = min(im.height, b + pad)
    if (r - l) >= im.width - 4 and (b - t) >= im.height - 4:
        return None  # тайрах зүйл алга
    return im.crop((l, t, r, b))

brands = env["safety.catalog.brand"].search([("logo", "!=", False)])
done, skipped = 0, 0
for br in brands:
    try:
        raw = base64.b64decode(br.logo)
        im = Image.open(io.BytesIO(raw))
        out = trim(im)
        if out is None:
            skipped += 1
            print("OK (tairalt shaardlagagui):", br.name, im.size)
            continue
        buf = io.BytesIO()
        out.save(buf, format="PNG")
        br.logo = base64.b64encode(buf.getvalue())
        done += 1
        print("Tairav:", br.name, im.size, "->", out.size)
    except Exception as e:  # noqa: BLE001
        print("ALDAA:", br.name, repr(e))

env.cr.commit()
print("=" * 40)
print("Tairsan:", done, "| Hevendee:", skipped)
