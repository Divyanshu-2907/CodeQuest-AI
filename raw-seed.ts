import 'dotenv/config';
import { Client } from 'pg';

const connectionString = process.env.DATABASE_URL;

const client = new Client({
  connectionString,
});

async function seed() {
  await client.connect();
  console.log("Connected to database...");

  // Generate a random UUID
  const chapterId = '550e8400-e29b-41d4-a716-446655440000';

  try {
    await client.query(`
      INSERT INTO "Chapter" ("id", "number", "title", "lore", "unlockXp", "isLocked", "npcName", "npcRole", "npcPersona")
      VALUES ($1, 1, 'The Awakening', 'Welcome to Neural City.', 0, false, 'Ghost', 'Guide', 'Underground hacker')
      ON CONFLICT ("number") DO NOTHING;
    `, [chapterId]);
    console.log("Seeded Chapter 1 successfully!");
  } catch (err) {
    console.error("Error inserting chapter:", err);
  } finally {
    await client.end();
  }
}

seed();
