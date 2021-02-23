#!/usr/bin/bash
touch .env
echo DB_HOST=${DB_HOST}
echo DB_USER=${DB_USER}
echo DB_PASS=${DB_PASS}
echo DB_DATABASE_PROD=${DB_DATABASE_PROD}
echo "Done setup"
