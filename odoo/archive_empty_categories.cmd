@echo off
REM ============================================================
REM  safety_shop - archive legacy empty root categories
REM  Root categories with no subcategories and no products are
REM  archived (active=False) so they disappear from the menu.
REM ============================================================
setlocal
chcp 65001 >nul
set "COMPOSE=docker compose -f "%~dp0docker-compose.yml""

echo === Archiving empty root categories ===
%COMPOSE% run --rm -T odoo odoo shell -c /etc/odoo/odoo.conf -d safety_shop --no-http < "%~dp0scripts\archive_empty_categories.py"

echo === Restarting odoo ===
%COMPOSE% restart odoo

echo === Done ===
endlocal
