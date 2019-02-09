@echo off
echo Downloading Postgres...
echo.
curl https://get.enterprisedb.com/postgresql/postgresql-10.6-1-windows-x64.exe -o postgres.exe

echo Launching Postgres Installer...
echo.
start /wait postgres.exe
echo Postgres installation finished, cleaning up...
echo.
del postgres.exe
echo Postgres setup...
echo.
echo Recomended settings:
echo.
echo Server: localhost
echo Database: postgres
echo Port: 5432
echo Username: postgres
echo Password: -your pick-
echo.
:: Runs a modified version for easier setup.
echo Copyright (c) 2012-2018, EnterpriseDB Corporation.  All rights reserved

echo PostgreSQL server psql runner script for Windows

SET server=localhost
SET /P server="Server [%server%]: "

SET database=postgres
SET /P database="Database [%database%]: "

SET port=5432
SET /P port="Port [%port%]: "

SET username=postgres
SET /P username="Username [%username%]: "

for /f "delims=" %%a in ('chcp ^|find /c "932"') do @ SET CLIENTENCODING_JP=%%a
if "%CLIENTENCODING_JP%"=="1" SET PGCLIENTENCODING=SJIS
if "%CLIENTENCODING_JP%"=="1" SET /P PGCLIENTENCODING="Client Encoding [%PGCLIENTENCODING%]: "
echo.

:: Run PSQL queries and populate it.
call "C:\Program Files\PostgreSQL\10\bin\psql.exe" -h %server% -U %username% -d %database% -p %port% -c "CREATE DATABASE gthubweb"
call "C:\Program Files\PostgreSQL\10\bin\psql.exe" -h %server% -U %username% -d %database% -p %port% -a -f test_data.sql
echo.
echo Setup done!
pause