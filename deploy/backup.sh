#!/usr/bin/env bash
# ============================================================
# safety_shop — өдөр тутмын нөөцлөлт (DB + filestore)
#
# Гараар ажиллуулах:   bash /opt/safety_shop/deploy/backup.sh
# Автомат (өдөр бүр 02:00): crontab -e дээр нэмнэ:
#   0 2 * * * bash /opt/safety_shop/deploy/backup.sh >> /opt/backups/safety_shop/backup.log 2>&1
#
# Сэргээх заавар нь deploy/README.md-ийн "Өгөгдөл нүүлгэх" хэсэгтэй ижил:
#   pg_restore-оор dump-ыг, tar-аар filestore-ыг буцаана.
# ============================================================
set -euo pipefail

REPO=/opt/safety_shop
BACKUP_DIR=/opt/backups/safety_shop
STAMP=$(date +%F_%H%M)
KEEP=7   # сүүлийн 7 хувийг үлдээнэ

COMPOSE="docker compose -f $REPO/deploy/docker-compose.prod.yml --env-file $REPO/deploy/.env"

mkdir -p "$BACKUP_DIR"
cd "$REPO"

# 1) Өгөгдлийн сан (шахсан custom format — pg_restore-оор сэргээнэ)
$COMPOSE exec -T db pg_dump -U odoo -Fc safety_shop > "$BACKUP_DIR/db_$STAMP.dump"

# 2) Filestore (барааны зураг, хавсралтууд)
$COMPOSE exec -T odoo tar -czf - -C /var/lib/odoo/filestore safety_shop \
  > "$BACKUP_DIR/filestore_$STAMP.tgz"

# 3) Хуучин хувилбаруудыг цэвэрлэх (сүүлийн $KEEP-ийг үлдээнэ)
ls -1t "$BACKUP_DIR"/db_*.dump      2>/dev/null | tail -n +$((KEEP+1)) | xargs -r rm -f
ls -1t "$BACKUP_DIR"/filestore_*.tgz 2>/dev/null | tail -n +$((KEEP+1)) | xargs -r rm -f

echo "[$(date '+%F %T')] Backup OK -> $BACKUP_DIR"
ls -lh "$BACKUP_DIR" | tail -n 5
