@echo off
REM ============================================================
REM  safety_shop - one-command module upgrade
REM  Usage (from anywhere):
REM     update                  -> upgrades safety_catalog
REM     update safety_catalog   -> upgrades the given module
REM     update all              -> upgrades every installed module
REM ============================================================
setlocal
set "MODULE=%~1"
if "%MODULE%"=="" set "MODULE=safety_catalog"

set "COMPOSE=docker compose -f "%~dp0docker-compose.yml""

echo === [1/3] Stopping odoo ===
%COMPOSE% stop odoo

echo === [2/3] Upgrading module: %MODULE% ===
%COMPOSE% run --rm odoo odoo -c /etc/odoo/odoo.conf -d safety_shop -u %MODULE% --stop-after-init

echo === [3/3] Starting odoo ===
%COMPOSE% up -d

echo === Done. Open http://localhost:8079/odoo ===
endlocal
