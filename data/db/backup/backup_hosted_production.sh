#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Create a directory with the current date
BACKUP_DIR="data/hosted_production/$(date +'%Y%m%d')"
mkdir -p "$BACKUP_DIR"

# Using Basic Authorization, where "<username>:<password>" is base64-encoded
BASIC_TOKEN=$(echo -n "$MONGOEXPRESS_LOGIN_USERNAME:$MONGOEXPRESS_LOGIN_PASSWORD" | base64)

# Backup "posts.json", "administrative.json", and "notifications.json" from the data-production database using cURL
curl -H "accept: application/json" -H "Authorization: Basic $BASIC_TOKEN" -o $BACKUP_DIR/posts.json -X "GET" "https://db.mjntech.dev/db/data-production/expArr/posts"
curl -H "accept: application/json" -H "Authorization: Basic $BASIC_TOKEN" -o $BACKUP_DIR/administrative.json -X "GET" "https://db.mjntech.dev/db/data-production/expArr/administrative"
curl -H "accept: application/json" -H "Authorization: Basic $BASIC_TOKEN" -o $BACKUP_DIR/notifications.json -X "GET" "https://db.mjntech.dev/db/data-production/expArr/notifications"

# Print a message
echo "Files downloaded to $BACKUP_DIR"

