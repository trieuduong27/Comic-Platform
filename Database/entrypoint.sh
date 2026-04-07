#!/bin/bash
# Wait to be sure that SQL Server came up
sleep 15s

# Run the setup script to create the DB and the schema in the DB
echo "Initializing SQL script..."
/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P $SA_PASSWORD -d master -i /scripts/init_db.sql -C

echo "Seeding SQL script..."
/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P $SA_PASSWORD -d master -i /scripts/seed_db.sql -C
