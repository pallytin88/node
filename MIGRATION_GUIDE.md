# TypeORM Migration Guide

## Overview

This project now uses TypeORM migrations for database schema management instead of `synchronize: true`.

## Configuration

-   **Config File**: `ormconfig.ts` (matches your actual PostgreSQL setup)
-   **Migrations Directory**: `src/migrations/`
-   **Database**: PostgreSQL on port 5332

## Migration Commands

### Generate a new migration

```bash
# Generate migration based on entity changes
npm run migration:generate src/migrations/MigrationName

# Example: Add a new field to points
npm run migration:generate src/migrations/AddReferralPoints
```

### Run migrations

```bash
# Run all pending migrations
npm run migration:run

# Show migration status
npm run migration:show
```

### Revert migrations

```bash
# Revert the last migration
npm run migration:revert
```

### Schema management

```bash
# Sync schema (development only)
npm run schema:sync

# Show what SQL would be executed
npm run schema:log
```

## Workflow for Adding New Fields

### 1. Update your entity

```typescript
// src/model/entities/GCRv2/GCR_Main.ts
@Column({ type: "jsonb", name: "points", default: () => "'{}'" })
points: {
    totalPoints: number
    breakdown: {
        web3Wallets: { [chain: string]: number }
        socialAccounts: {
            twitter: number
            github: number
            discord: number
        }
        referrals: number  // New field
    }
    lastUpdated: Date
}
```

### 2. Generate migration

```bash
npm run migration:generate src/migrations/AddReferralPoints
```

### 3. Review the generated migration

Check the generated SQL in `src/migrations/AddReferralPoints.ts`

### 4. Run the migration

```bash
npm run migration:run
```

## Testing Migrations

### Test in development

1. Make your entity changes
2. Generate migration: `npm run migration:generate src/migrations/TestMigration`
3. Review the generated SQL
4. Run migration: `npm run migration:run`
5. Test your application

### Test with existing data

1. Create a test database with production data
2. Run migrations on test database
3. Verify data integrity
4. Test application functionality

## Important Notes

### Production Deployment

-   Set `synchronize: false` in production (already done in ormconfig.ts)
-   Always test migrations on a copy of production data first
-   Run migrations before deploying new code

### Data Safety

-   Migrations preserve existing data
-   New fields get default values for existing records
-   Points data is stored in JSONB, so it's flexible

### Rollback Strategy

-   Keep backups before running migrations
-   Test rollback procedures: `npm run migration:revert`
-   Consider data migration scripts for complex changes

## Example: Adding Referral Points

```bash
# 1. Update entity (add referrals field)
# 2. Generate migration
npm run migration:generate src/migrations/AddReferralPoints

# 3. Review generated file
cat src/migrations/AddReferralPoints.ts

# 4. Run migration
npm run migration:run

# 5. Verify
npm run migration:show
```

## Troubleshooting

### Migration fails

-   Check database connection
-   Verify PostgreSQL is running: `docker ps | grep postgres`
-   Check logs for specific errors

### Entity not found

-   Ensure entity is imported in `ormconfig.ts`
-   Check TypeScript compilation

### Permission issues

-   Verify database user permissions
-   Check PostgreSQL logs
