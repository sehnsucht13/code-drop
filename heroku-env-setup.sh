#!/usr/bin/bash
touch .env
echo DB_HOST=${DB_HOST} >> .env
echo DB_USER=${DB_USER} >> .env
echo DB_PASS=${DB_PASS} >> .env
echo DB_DATABASE_PROD=${DB_DATABASE_PROD} >> .env
echo SESSION_SECRET=${SESSION_SECRET} >> .env
echo SKIP_PREFLIGHT_CHECK=true >> .env

echo AWS_REGION=${AWS_REGION} >> .env
echo AWS_KEY=${AWS_KEY} >> .env
echo AWS_SECRET=${AWS_SECRET} >> .env
echo AWS_BUCKET_NAME=${AWS_BUCKET_NAME} >> .env

echo "Done .env setup!"
