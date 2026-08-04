import 'dotenv/config';
import { Client } from 'pg';

const connectionString = process.env.DATABASE_URL;

const client = new Client({
  connectionString,
});

async function check() {
  await client.connect();
  try {
    const res = await client.query('SELECT * FROM "Chapter"');
    console.log("Chapters in DB:", res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

check();
