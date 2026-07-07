@echo off
REM ============================================================
REM  safety_shop - import stock quantities
REM  Reads addons\stock_template.csv (qty column) and applies
REM  the counted quantities as inventory adjustments.
REM ============================================================
setlocal
chcp 65001 >nul
set "COMPOSE=docker compose -f "%~dp0docker-compose.yml""

echo === Importing stock quantities ===
%COMPOSE% run --rm -T odoo odoo shell -c /etc/odoo/odoo.conf -d safety_shop --no-http < "%~dp0scripts\import_stock.py"

echo === Done ===
endlocal
