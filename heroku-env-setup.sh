#!/usr/bin/bash
touch .env
echo DB_HOST=${DB_HOST} >> .env
echo DB_USER=${DB_USER} >> .env
echo DB_PASS=${DB_PASS} >> .env
echo DB_DATABASE_PROD=${DB_DATABASE_PROD} >> .env
echo SESSION_SECRET=${SESSION_SECRET} >> .env
echo SKIP_PREFLIGHT_CHECK=true >> .env
cat .env

echo "Done .env setup!"
