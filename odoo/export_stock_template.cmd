@echo off
REM ============================================================
REM  safety_shop - export stock template CSV
REM  Creates addons\stock_template.csv listing every product
REM  variant. Fill the "qty" column in Excel, save as CSV UTF-8,
REM  then run import_stock.cmd.
REM ============================================================
setlocal
chcp 65001 >nul
set "COMPOSE=docker compose -f "%~dp0docker-compose.yml""

echo === Exporting stock template ===
%COMPOSE% run --rm -T odoo odoo shell -c /etc/odoo/odoo.conf -d safety_shop --no-http < "%~dp0scripts\export_stock_template.py"

echo === Done: addons\stock_template.csv ===
endlocal
