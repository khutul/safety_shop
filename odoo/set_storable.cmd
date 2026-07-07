@echo off
REM ============================================================
REM  safety_shop - mark all products as inventory-tracked
REM  (Track Inventory / storable) in one go.
REM ============================================================
setlocal
chcp 65001 >nul
set "COMPOSE=docker compose -f "%~dp0docker-compose.yml""

echo === Marking products as storable ===
%COMPOSE% run --rm -T odoo odoo shell -c /etc/odoo/odoo.conf -d safety_shop --no-http < "%~dp0scripts\set_products_storable.py"

echo === Done ===
endlocal
