# TidyQuest Backup & Restore

## Quick Start

### Create a Backup

```bash
./backup.sh
```

This will:
1. Stop the container
2. Create a timestamped backup in `backups/` directory
3. Restart the container

### Restore from Backup

```bash
./restore.sh
```

This will:
1. List available backups
2. Prompt you to select one
3. Stop the container
4. Restore the data
5. Restart the container

## Backup Location

Backups are stored in: `backups/tidyquest-backup-YYYYMMDD-HHMMSS.tar.gz`

Each backup contains:
- `data/tidyquest.db` - Main database file
- `data/tidyquest.db-wal` - Write-Ahead Log
- `data/tidyquest.db-shm` - Shared memory
- `data/avatars/` - User avatar images

## Automated Backups

Add to crontab for daily backups at 2 AM:

```bash
0 2 * * * /var/home/ashton/sandbox/tidyquest/backup.sh >> /var/home/ashton/sandbox/tidyquest/backup.log 2>&1
```

## Manual Backup (No Downtime)

If you prefer not to stop the container:

```bash
# Copy files while running (WAL mode ensures consistency)
cp -r data backups/tidyquest-manual-$(date +%Y%m%d)
```

Note: For guaranteed consistency, stop the container first.

## Verification

Check backup integrity:

```bash
# List backup contents
tar -tzf backups/tidyquest-backup-20260505-091005.tar.gz

# Test extraction (dry run)
tar -xzf backups/tidyquest-backup-20260505-091005.tar.gz --test-label
```

## Storage Management

Backups grow over time. To keep only the last 7 days:

```bash
# Clean up backups older than 7 days
find backups -name "tidyquest-backup-*.tar.gz" -mtime +7 -delete
```

Add this to crontab for automatic cleanup:

```bash
# Clean old backups weekly on Sunday at 3 AM
0 3 * * 0 find /var/home/ashton/sandbox/tidyquest/backups -name "tidyquest-backup-*.tar.gz" -mtime +7 -delete
```

## Important Notes

1. **Always verify backups** - Test restore periodically
2. **Off-site storage** - Copy backups to external location
3. **Test restores** - Verify you can actually restore before you need to
4. **Backup before updates** - Create backup before deploying new versions

## Emergency Recovery

If database corruption occurs:

1. Stop container: `podman stop tidyquest`
2. Restore latest backup: `./restore.sh`
3. If backup also corrupted, try WAL recovery:
   ```bash
   # Remove WAL files (may lose last few transactions)
   rm data/tidyquest.db-wal data/tidyquest.db-shm
   ```
4. Restart: `podman start tidyquest`
