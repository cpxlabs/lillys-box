# Ralph Loops - Pet Care Game Data Processing

This directory contains Ralph configurations for processing game data, analytics, and automated tasks.

## Setup

### Using Dev Containers (Recommended)

1. Open the project in VSCode
2. Install the "Dev Containers" extension if not already installed
3. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac) and select "Dev Containers: Reopen in Container"
4. Wait for the container to build and start
5. The environment will be ready with Ralph and all dependencies installed

### Manual Setup

If not using Dev Containers:

```bash
cd scripts/ralph
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## Configuration

1. Copy `.env.example` to `.env` and configure your settings:
   ```bash
   cp .env.example .env
   ```

2. Edit `config.yml` to configure your data pipelines

## Usage

### Running Ralph CLI

```bash
# Check Ralph installation
ralph --version

# Validate configuration
ralph validate config.yml

# Run a specific pipeline
ralph run config.yml --pipeline process_events

# Start Ralph loops (scheduled tasks)
ralph loops start config.yml
```

### Creating Data Directories

```bash
mkdir -p data/events data/users output
```

### Example: Processing Game Events

Create a sample data file:

```bash
echo '{"user_id": "123", "event_type": "pet_interaction", "duration": 45}' > data/events/sample.json
```

Run the pipeline:

```bash
ralph run config.yml --pipeline process_events
```

## Directory Structure

```
ralph/
├── config.yml          # Main Ralph configuration
├── requirements.txt    # Python dependencies
├── .env.example       # Environment variables template
├── .env               # Your local environment (gitignored)
├── data/              # Input data directory
│   ├── events/       # Game events data
│   └── users/        # User data
├── output/           # Processed data output
└── pipelines/        # Custom pipeline scripts (optional)
```

## Development

### Adding New Pipelines

1. Edit `config.yml` and add a new pipeline definition
2. Create any custom transformation scripts in `pipelines/`
3. Test your pipeline: `ralph run config.yml --pipeline your_pipeline_name`

### Testing

```bash
pytest
```

### Code Formatting

```bash
black .
ruff check .
```

## Useful Commands

```bash
# List all available pipelines
ralph list config.yml

# Dry run (validate without executing)
ralph run config.yml --dry-run

# Run with verbose logging
ralph run config.yml --log-level DEBUG

# Stop running loops
ralph loops stop

# Check loop status
ralph loops status
```

## Integration with Game

The Ralph pipelines can process:
- Player interaction data
- Pet care statistics
- In-game economy metrics
- User behavior analytics
- A/B test results

## Troubleshooting

### Container Issues

If the Dev Container fails to build:
1. Check Docker is running
2. Rebuild container: `Ctrl+Shift+P` → "Dev Containers: Rebuild Container"

### Ralph Installation Issues

If Ralph fails to install:
```bash
pip install --upgrade pip setuptools wheel
pip install -r requirements.txt
```

### Permission Issues

On Linux/Mac, you may need to adjust permissions:
```bash
chmod -R 755 data output
```

## Resources

- [Ralph Documentation](https://docs.getralph.com/)
- [Ralph Loops Guide](https://docs.getralph.com/loops)
- [Configuration Reference](https://docs.getralph.com/config)
