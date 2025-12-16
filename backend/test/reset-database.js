const { DataSource } = require('typeorm');
const { config } = require('dotenv');
const path = require('path');

config({ path: path.resolve(__dirname, '../.env') });

async function resetDatabase() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [path.resolve(__dirname, '../src/entities/**/*.js')],
    synchronize: false,
  });

  await dataSource.initialize();

  // Fetch all table names in public schema except migrations table (if any)
  const tablesResult = await dataSource.query(
    "SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename NOT LIKE 'migrations'"
  );

  for (const row of tablesResult) {
    const table = row.tablename;
    await dataSource.query(
      `TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE;`
    );
    console.log(`Truncated table: ${table}`);
  }

  await dataSource.destroy();
}

resetDatabase()
  .then(() => {
    console.log('Database reset completed');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error resetting database:', err);
    process.exit(1);
  });
