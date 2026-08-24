# Manada Safety — тест/production серверт гаргах заавар

Ubuntu 22.04/24.04 сервер дээр Docker-той гэж үзэв.

## 0. Серверийн бэлтгэл (нэг удаа)

```bash
sudo apt update && sudo apt install -y docker.io docker-compose-v2 nginx certbot python3-certbot-nginx git
sudo usermod -aG docker $USER   # дараа нь дахин нэвтэрнэ
```

## 1. Төслөө серверт тавих

```bash
sudo mkdir -p /opt/safety_shop && sudo chown $USER /opt/safety_shop
cd /opt/safety_shop
git clone <repo-url> .          # эсвэл scp/rsync-ээр хуулна
```

## 2. Нууц тохиргоо

```bash
cd /opt/safety_shop
cat > deploy/.env <<'EOF'
DB_PASSWORD=УРТ_САНАМСАРГҮЙ_НУУЦ_ҮГ
SITE_URL=http://103.50.206.188        # дараа нь https://manada.mn
ALLOW_INDEXING=false                  # manada.mn дээр гарахдаа true болгоно
# Порт давхацвал эдгээрийг өөрчилнө (nginx conf-оо мөн тааруулна):
#ODOO_PORT=18079
#ODOO_WS_PORT=18089
#STOREFRONT_PORT=13001
EOF
```

Мөн `odoo/config/odoo.conf` дотор `admin_passwd` (master password)-ыг
хүчтэй нууц үгээр солино — үгүй бол хэн ч DB үүсгэж/устгаж чадна.

## 3. Асаах

```bash
cd /opt/safety_shop
docker compose -f deploy/docker-compose.prod.yml --env-file deploy/.env up -d --build
```

## 4. Өгөгдөл нүүлгэх (локал -> сервер)

Локал (Windows) дээр:

```powershell
cd D:\safety_shop\odoo
docker compose exec db pg_dump -U odoo -Fc safety_shop > safety_shop.dump
docker compose cp odoo:/var/lib/odoo/filestore/safety_shop ./filestore_backup
```

Хоёр файлаа серверт хуулаад (scp/WinSCP):

```bash
cd /opt/safety_shop
docker compose -f deploy/docker-compose.prod.yml exec -T db createdb -U odoo safety_shop
cat safety_shop.dump | docker compose -f deploy/docker-compose.prod.yml exec -T db pg_restore -U odoo -d safety_shop
docker compose -f deploy/docker-compose.prod.yml cp ./filestore_backup odoo:/var/lib/odoo/filestore/safety_shop
docker compose -f deploy/docker-compose.prod.yml restart odoo
```

## 5. Nginx

```bash
sudo cp deploy/nginx-manada.conf /etc/nginx/sites-available/manada.conf
# server_name-ийг тест хаягаараа солино
sudo ln -s /etc/nginx/sites-available/manada.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

Тест: `http://<server-ip>/` — сайт, `http://<server-ip>/api/v1/brands` — API.

## 6. Домайн холбох өдөр (батлагдсаны дараа)

1. DNS: manada.mn болон www-гийн **A бичлэг** -> серверийн IP
2. `sudo certbot --nginx -d manada.mn -d www.manada.mn` (HTTPS)
3. `deploy/.env`: `SITE_URL=https://manada.mn`, `ALLOW_INDEXING=true`
4. `docker compose -f deploy/docker-compose.prod.yml --env-file deploy/.env up -d --build storefront`
5. Google Search Console-д домайн бүртгэж `https://manada.mn/sitemap.xml` илгээнэ

## Шинэ хувилбар гаргах (дараа бүр)

```bash
cd /opt/safety_shop && git pull
docker compose -f deploy/docker-compose.prod.yml --env-file deploy/.env up -d --build storefront
# Odoo addon өөрчлөгдсөн бол:
docker compose -f deploy/docker-compose.prod.yml restart odoo   # controller-only
# эсвэл модуль upgrade:
docker compose -f deploy/docker-compose.prod.yml run --rm odoo odoo -c /etc/odoo/odoo.conf -d safety_shop -u safety_catalog --stop-after-init
```
