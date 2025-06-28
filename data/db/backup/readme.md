# MongoDB Database Backup

## Run Script Directly

### Prerequsite

Before running the backup script, ensure that the environment variables for basic authentication is set in your terminal. You can do this by loading the variables from the `.env` file:

```bash
# Load environment variables from the .env file
export $(grep -v '^#' .env | xargs)
```

This must be run from the directory of the `.env` file (project root).

### Hosted Production

To back up the hosted production database, execute the following command:

```bash
bash backup_hosted_production.sh
```

### Local Staging

To back up the local staging database, use this command:

```bash
bash backup_local_staging.sh
```

## Run Daily CRON Job

If you want to run a daily CRON job, backing up at midnight, run the following Docker Compose service:

```bash
# Load environment variables from the .env file
export $(grep -v '^#' .env | xargs)

# Start the Docker Compose services
docker compose -f "data/db/backup/docker-compose.yml" up -d
```

For convenience, it’s recommended to run these commands from the project root. However, you can execute the Docker Compose file from any directory, as long as you specify the correct path to the file (the default is `./docker-compose.yml`, applied if skipping flag).
