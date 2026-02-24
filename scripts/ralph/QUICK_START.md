# Quick Start Guide - Ralph with Dev Containers

## Step 1: Open in Dev Container

1. **Open VSCode** in the project root (`/home/az1nn/projetos/pet-care-game`)

2. **Install Dev Containers Extension** (if not already installed):
   - Press `Ctrl+Shift+X`
   - Search for "Dev Containers"
   - Install the official Microsoft extension

3. **Reopen in Container**:
   - Press `Ctrl+Shift+P` (or `F1`)
   - Type: `Dev Containers: Reopen in Container`
   - Select it and wait for the container to build

   This will:
   - Build a Python 3.11 container
   - Install Ralph and all dependencies
   - Set up VSCode extensions (Python, Black, Ruff)
   - Mount your workspace

## Step 2: Initial Setup

Once inside the container:

```bash
# Navigate to Ralph directory
cd scripts/ralph

# Run setup script
make setup
# or
bash setup.sh
```

This creates:
- Data directories (`data/`, `output/`)
- Sample data files
- Environment configuration

## Step 3: Verify Installation

```bash
# Check Ralph installation
ralph --version

# Validate configuration
make validate
# or
ralph validate config.yml
```

## Step 4: Run Your First Pipeline

```bash
# Run the sample pipeline
make run
# or
ralph run config.yml --pipeline process_events

# Check the output
cat output/processed_events.json
```

## Step 5: Development Workflow

### Running Tests
```bash
make test
```

### Code Formatting
```bash
make format
```

### Linting
```bash
make lint
```

### Adding New Pipelines

1. Edit `config.yml` to add your pipeline definition
2. Create custom logic in `pipelines/` if needed
3. Test: `ralph run config.yml --pipeline your_pipeline_name`

## Common Tasks

### Process Game Events
```bash
# Single run
ralph run config.yml --pipeline process_events

# With debug logging
ralph run config.yml --pipeline process_events --log-level DEBUG

# Dry run (validate without executing)
ralph run config.yml --dry-run
```

### Schedule Automated Tasks
```bash
# Start Ralph loops (scheduled tasks)
ralph loops start config.yml

# Check status
ralph loops status

# Stop loops
ralph loops stop
```

### Work with Data

```bash
# Add new event data
echo '{"user_id": "user789", "event_type": "pet_feed", "timestamp": "2025-02-24T12:00:00Z"}' >> data/events/new_data.json

# Run pipeline
make run

# View results
cat output/processed_events.json | jq .
```

## Useful VSCode Shortcuts (in Container)

- `Ctrl+Shift+P` - Command palette
- `Ctrl+`` - Toggle terminal
- `Ctrl+Shift+E` - Explorer sidebar
- `F5` - Start debugging Python script

## Troubleshooting

### Container won't start
```bash
# Rebuild the container
Ctrl+Shift+P → "Dev Containers: Rebuild Container"
```

### Ralph command not found
```bash
# Reinstall dependencies
cd scripts/ralph
pip install -r requirements.txt
```

### Permission errors
```bash
# Fix permissions
chmod -R 755 data output
```

### Python module not found
```bash
# Make sure you're in the right directory
cd /workspace/scripts/ralph

# Or add to PYTHONPATH
export PYTHONPATH=/workspace/scripts/ralph:$PYTHONPATH
```

## Next Steps

1. Read the full [README.md](README.md)
2. Explore [config.yml](config.yml) to understand pipeline configuration
3. Check out [pipelines/game_analytics.py](pipelines/game_analytics.py) for custom logic examples
4. Write your own pipelines for your game data

## Resources

- Ralph Docs: https://docs.getralph.com/
- Dev Containers: https://code.visualstudio.com/docs/devcontainers/containers
- Project README: [README.md](README.md)
