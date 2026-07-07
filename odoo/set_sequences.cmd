@echo off
REM ============================================================
REM  safety_shop - set storefront category sequences
REM  Writes the merchandising order into each category's
REM  Sequence field and re-parents "Өвлийн гутал".
REM ============================================================
setlocal
chcp 65001 >nul
set "COMPOSE=docker compose -f "%~dp0docker-compose.yml""

echo === Applying category sequences ===
%COMPOSE% run --rm -T odoo odoo shell -c /etc/odoo/odoo.conf -d safety_shop --no-http < "%~dp0scripts\set_category_sequences.py"

echo === Restarting odoo ===
%COMPOSE% restart odoo

echo === Done ===
endlocal
