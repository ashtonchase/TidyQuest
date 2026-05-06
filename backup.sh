#!/bin/bash
# TidyQuest Backup Script
# Creates a timestamped backup of the database and avatars

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKUP_DIR="${SCRIPT_DIR}/backups"
DATA_DIR="${SCRIPT_DIR}/data"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BACKUP_FILE="tidyquest-backup-${TIMESTAMP}.tar.gz"

# Create backup directory if it doesn't exist
mkdir -p "${BACKUP_DIR}"

echo "Starting backup at $(date)..."

# Stop container
echo "Stopping container..."
podman stop tidyquest

# Create backup archive
echo "Creating backup archive..."
cd "${SCRIPT_DIR}"
tar -czf "${BACKUP_DIR}/${BACKUP_FILE}" data/

# Restart container
echo "Restarting container..."
podman start tidyquest

# Verify backup exists and has content
if [ -f "${BACKUP_DIR}/${BACKUP_FILE}" ] && [ -s "${BACKUP_DIR}/${BACKUP_FILE}" ]; then
    echo "✓ Backup created successfully: ${BACKUP_DIR}/${BACKUP_FILE}"
    echo "  Size: $(du -h "${BACKUP_DIR}/${BACKUP_FILE}" | cut -f1)"
    echo "  Created: $(date -d "@$(stat -c %Y "${BACKUP_DIR}/${BACKUP_FILE}")" '+%Y-%m-%d %H:%M:%S')"
else
    echo "✗ Backup failed!"
    exit 1
fi

# Optional: Keep only last 7 backups (uncomment to enable)
# echo "Cleaning up old backups..."
# find "${BACKUP_DIR}" -name "tidyquest-backup-*.tar.gz" -mtime +7 -delete

echo "Backup completed at $(date)"
