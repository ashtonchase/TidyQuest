#!/bin/bash
# TidyQuest Restore Script
# Restores from a backup file

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKUP_DIR="${SCRIPT_DIR}/backups"
DATA_DIR="${SCRIPT_DIR}/data"

# Check if backup directory exists
if [ ! -d "${BACKUP_DIR}" ]; then
    echo "✗ Backup directory not found: ${BACKUP_DIR}"
    exit 1
fi

# List available backups
echo "Available backups:"
ls -lh "${BACKUP_DIR}"/*.tar.gz 2>/dev/null | awk '{print NR": "$9" ("$5")"}'

if [ $? -ne 0 ]; then
    echo "✗ No backup files found in ${BACKUP_DIR}"
    exit 1
fi

# Prompt for backup selection
echo ""
read -p "Enter backup number to restore: " BACKUP_NUM

# Get selected backup file
BACKUP_FILE=$(ls -1 "${BACKUP_DIR}"/*.tar.gz | sed -n "${BACKUP_NUM}p")

if [ -z "${BACKUP_FILE}" ]; then
    echo "✗ Invalid selection"
    exit 1
fi

echo ""
echo "Selected: ${BACKUP_FILE}"
echo ""

# Stop container
echo "Stopping container..."
podman stop tidyquest

# Restore backup
echo "Restoring backup..."
cd "${SCRIPT_DIR}"

# Remove current data and extract backup
rm -rf "${DATA_DIR}"/*
tar -xzf "${BACKUP_FILE}"

echo "✓ Restore complete!"
echo ""
echo "Starting container..."
podman start tidyquest

echo "Done! Container restarted at $(date)"
