# Define variables
IMAGE_NAME := deel-autocomplete-assessment

# Default command when only 'make' is executed
all: dev

# Build the Docker image
build:
	docker build -t $(IMAGE_NAME) .

# Start the application using Docker Compose in development mode
dev:
	docker-compose -f docker-compose.local.yaml up -d --build

# Start the application using Docker Compose
up:
	docker-compose up -d --build

# Stop the application using Docker Compose
down:
	docker-compose down

# Remove the Docker image
clean:
	docker rmi $(IMAGE_NAME)

# Rebuild the Docker image
rebuild: clean build

# Access container shell
shell:
	docker exec -it $(IMAGE_NAME) /bin/sh

.PHONY: build up down clean rebuild shell
