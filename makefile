# this makefile uses npm because it's available on node-based environments
# it prevents additional installations, such as yarn or pnpm
# this is optimal for CI/CD pipelines and docker containers

# Default command when only 'make' is executed
all: install

# Install dependencies
install:
	echo "Installing dependencies..."
	npm install

# Start development server
dev: install
	echo "Starting development server..."
	npm run dev

# Build project for production
build:
	echo "Building project for production..."
	npm run build

# Serve production build
serve:
	echo "Serving production build..."
	npm run serve

# Run tests
test:
	echo "Running tests..."
	npm run test

# Clean build directory
clean:
	echo "Cleaning build directory..."
	rm -rf dist

# Phony commands
.PHONY: install dev build serve test clean
