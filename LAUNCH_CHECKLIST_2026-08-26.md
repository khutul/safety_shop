# manada.mn — Нийтэд гаргахын өмнөх шалгалт (2026-08-26)

Шалгасан: live сайт (robots, sitemap, QPay, захиалгын урсгал), Odoo аюулгүй
байдал, nginx/compose тохиргоо, git түүх, серверийн төлөв.

## 🔴 КРИТИК — гаргахын өмнө ЗААВАЛ засах

### 1. Odoo master password алдагдсан + DB менежер нийтэд нээлттэй
- `https://manada.mn/web/database/manager` хуудас **нийтэд нээлттэй** —
  Backup / Delete / Restore товчнууд харагдаж байна.
- Одоогийн master password нь өмнө нь `odoo.conf`-той хамт **git-д commit
  хийгдэж GitHub-д гарсан** (commit `adabc23`). Одоо файл нь untracked ч түүхэнд үлдсэн.
- Хоёр нөхцөл нийлэхээр repo харсан хэн бүхэн өгөгдлийн санг устгаж/хуулж чадна.

**Засвар:** Сервер дээр `odoo/config/odoo.conf`:
`admin_passwd = <ШИНЭ урт санамсаргүй нууц>` (өмнөхийг дахин бүү ашигла!),
`list_db = False`. Nginx-д `/web/database` deny блок (энэ commit-д орсон —
серверийн идэвхтэй conf-д нэмж reload хийх).

### 2. Odoo админ HTTP-ээр нийтэд нээлттэй (103.50.206.188:8091)
Админы нэвтрэх нэр/нууц үг шифрлэгдээгүй HTTP-ээр дамжиж байна.

**Засвар:** Repo-гийн prod compose нь портыг `127.0.0.1`-д хязгаарладаг —
`git pull` + `up -d odoo` хийхэд гаднаас хандалт хаагдана. Админ хэсгээ
цаашид `https://manada.mn/odoo`-оор ашиглана (nginx conf-д оффисын IP
allowlist идэвхжүүлбэл бүр сайн).

### 3. robots.txt бүх индексжилтийг хориглосон хэвээр
`User-Agent: * / Disallow: /` — Google сайтыг индексжүүлэхгүй.

**Засвар:** Гаргах өдөр `deploy/.env`-д `ALLOW_INDEXING=true` +
`SITE_URL=https://manada.mn` тавьж storefront-ыг rebuild. Дараа нь Google
Search Console-д бүртгэж sitemap илгээх.

### 4. Сүүлийн код сервер дээр гараагүй
`manada.mn/account` хуудас хуучин Medusa "Sign in" хуудсыг харуулж байна —
redirect-той шинэ middleware (болон картын шинэ дизайн) deploy болоогүйн шинж.

**Засвар:** `git checkout -B main origin/main` + storefront rebuild
(доорх командууд).

### 5. Серверийн диск 87.5% дүүрсэн (97.87GB)
Дүүрвэл PostgreSQL/Odoo зогсоно. `docker system prune -a`, хуучин image,
apt cache, хуучин dump-уудыг цэвэрлэх. Зорилго: <70%.

## 🟠 ЧУХАЛ — эхний долоо хоногт

### 6. Rate limiter ажиллахгүй тохиргоо (proxy_mode)
`proxy_mode = False` тул Odoo бүх зочныг nginx-ийн IP гэж хардаг —
захиалгын хязгаар «нэг IP-д минутад 5» гэсэн нь **нийт сайтад минутад 5
захиалга** болж, ачаалалтай үед жинхэнэ худалдан авагчдыг блоклоно.
Мөн `workers = 0` (dev горим) — нэг процесс.

**Засвар:** серверийн odoo.conf: `proxy_mode = True`, `workers = 2` + restart.

### 7. Автомат нөөцлөлт алга
Гараар хийсэн dump-ууд бий ч cron байхгүй. Өдөр бүр `pg_dump` + filestore-ыг
өөр байршилд (өөр сервер/объект storage) хадгалах cron тавих.

### 8. Sitemap-ын ангиллын линкүүд хоосон хуудас руу заадаг
Идэвхтэй ангилалуудад `slug` хоосон тул sitemap нь зөвхөн legacy (0 бараатай)
ангиллын slug-уудыг (`head-protection` г.м.) ашиглаж байна — эдгээр нь хоосон
listing нээдэг. Odoo дээр идэвхтэй ангилал бүрт slug өгч, legacy 8 бичлэгийг
архивлах (өмнөх зөвлөмж).

### 9. Үйлдлийн систем
41 update хүлээгдэж байна (3 нь security), system restart шаардлагатай.
Оффисын цагаар: `apt update && apt upgrade`, дараа нь reboot.

## 🟢 Хэвийн ажиллаж байгаа

QPay холболт идэвхтэй (`enabled: true`) · HTTPS manada.mn ✓ · Sitemap 100+
хуудастай, өдөр бүр шинэчлэгддэг ✓ · Захиалга үүсгэх, утсаар шалгах урсгал ✓ ·
Захиалгын rate limit (proxy_mode зассаны дараа) ✓ · Compose портууд
localhost-д хязгаарлагдсан ✓ · Алдааны мэдээлэл клиентэд задардаг асуудал
зассан ✓ · CORS чангалсан ✓ · Эвдэрхий Medusa route-ууд redirect-тэй ✓
(deploy хүлээж байна)

## Серверийн командууд (дарааллаар)

```bash
cd /opt/safety_shop

# 1. Шинэ код татах
git fetch origin && git checkout -B main origin/main

# 2. Odoo config чангалах
nano odoo/config/odoo.conf
#    admin_passwd = ШИНЭ_УРТ_НУУЦ_ҮГ      ← заавал шинэ!
#    list_db = False
#    proxy_mode = True
#    workers = 2

# 3. Идэвхтэй nginx conf-д DB менежерийн блок нэмэх
sudo nano /etc/nginx/sites-enabled/<manada-conf-файл>
#    location ~ ^/web/database { deny all; }   ← server блок дотор, /web-ээс ӨМНӨ
sudo nginx -t && sudo systemctl reload nginx

# 4. Контейнеруудыг шинэчлэх (odoo порт 127.0.0.1 болж гаднаас хаагдана)
docker compose -f deploy/docker-compose.prod.yml --env-file deploy/.env up -d --build storefront
docker compose -f deploy/docker-compose.prod.yml --env-file deploy/.env up -d odoo

# 5. Шалгах
curl -s https://manada.mn/web/database/manager | head -3   # 403 байх ёстой
curl -s https://manada.mn/account -o /dev/null -w "%{http_code} %{redirect_url}\n"  # 307 → /

# 6. Диск цэвэрлэх
docker system prune -af
sudo apt clean && sudo apt update && sudo apt upgrade -y
df -h /

# 7. Гаргах өдөр (индексжилт нээх)
#    deploy/.env: ALLOW_INDEXING=true
#    docker compose ... up -d --build storefront
#    Google Search Console → sitemap.xml илгээх
```
