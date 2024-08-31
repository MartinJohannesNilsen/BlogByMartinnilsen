# MongoDB Database

This blog's database is deployed as a containerized MongoDB instance.

To start the Docker service, which includes the database and a simple web user interface, follow these steps:

```bash
# Load environment variables from the .env file
export $(grep -v '^#' .env | xargs)

# Start the Docker Compose services
docker compose -f "data/db/docker-compose.yml" up -d
```

Run these commands from the project's root directory as the working directory.
