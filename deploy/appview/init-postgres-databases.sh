#!/bin/sh
set -eu

# Runs once, only against a brand-new Postgres data directory (the official
# postgres image only executes /docker-entrypoint-initdb.d/* on first init).
# POSTGRES_DB already creates the bsky database; ozone needs its own.
psql -v ON_ERROR_STOP=1 --username "${POSTGRES_USER}" --dbname "${POSTGRES_DB}" <<-EOSQL
    CREATE DATABASE ozone;
EOSQL
