# MongoDB Database

This blog's database is deployed as a containerized MongoDB instance.

## Service Overview

* `mongodb`: Database accessible on port `27017`. This port is exposed, but can also be accessed by targeting the host `mongodb` if inside the Docker network.
* `mongodb-express`: A web-based MongoDB admin interface accessible on port `8081`. This service allows you to manage your MongoDB databases, altering data directly or through importing/exporting backups.

## Run Services

To start the Docker services, which includes the database and a simple web user interface, follow these steps:

```bash
# Load environment variables from the .env file
export $(grep -v '^#' .env | xargs)

# Start the Docker Compose services
docker compose -f "data/db/docker-compose.yml" up -d
```

The easiest is to run the commands above from the project root. That being said, one can run the compose file from anywhere as long as the `-f` points to the correct file, where default is `./docker-compose.yml`.

