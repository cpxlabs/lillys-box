.PHONY: help setup install test lint format clean run validate

help:
	@echo "Ralph Development Commands"
	@echo ""
	@echo "  make setup     - Initial setup (create directories, sample data)"
	@echo "  make install   - Install Python dependencies"
	@echo "  make test      - Run tests with coverage"
	@echo "  make lint      - Run linters (ruff)"
	@echo "  make format    - Format code (black)"
	@echo "  make clean     - Clean generated files"
	@echo "  make run       - Run the process_events pipeline"
	@echo "  make validate  - Validate Ralph configuration"
	@echo ""

setup:
	@bash setup.sh

install:
	pip install --upgrade pip
	pip install -r requirements.txt

test:
	pytest

lint:
	ruff check .

format:
	black .
	ruff check --fix .

clean:
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete
	find . -type f -name "*.pyo" -delete
	find . -type f -name "*.pyd" -delete
	rm -rf .pytest_cache .coverage htmlcov
	rm -rf output/*.json output/*.csv

run:
	ralph run config.yml --pipeline process_events

validate:
	ralph validate config.yml

.DEFAULT_GOAL := help
