#!/usr/bin/bash
touch .env
echo DB_HOST=${DB_HOST} >> .env
echo DB_USER=${DB_USER} >> .env
echo DB_PASS=${DB_PASS} >> .env
echo DB_DATABASE_PROD=${DB_DATABASE_PROD} >> .env
echo "Done setup"
