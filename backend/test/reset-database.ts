import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import path from 'path';

config({ path: path.resolve(__dirname, '../.env') });

async function resetDatabase() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [path.resolve(__dirname, '../src/entities/**/*.ts')],
    synchronize: false,
  });

  await dataSource.initialize();

  const tables = ['user', 'invoice', 'product', 'customer']; // add more tables if needed

  for (const table of tables) {
    await dataSource.query(
      `TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE;`,
    );
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
