import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

// Database file will be in the data directory
const dataDir = path.join(process.cwd(), "data");
const dbPath = path.join(dataDir, "pokehub.sqlite");

// Create data directory if it doesn't exist
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Use global to persist database connection during Next.js hot reload
const globalForDb = globalThis as unknown as {
  db: Database.Database | undefined;
};

if (!globalForDb.db) {
  globalForDb.db = new Database(dbPath);
  globalForDb.db.pragma("journal_mode = WAL");

  // Initialize schema
  globalForDb.db.exec(`
    CREATE TABLE IF NOT EXISTS nicknames (
      pokemon_id INTEGER PRIMARY KEY,
      nickname TEXT NOT NULL
    );
  `);

  globalForDb.db.exec(`
    CREATE TABLE IF NOT EXISTS pokemon_info (
      pokemon_id INTEGER PRIMARY KEY,
      height REAL,
      weight REAL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

const db = globalForDb.db;

// Prepared statements
const getNicknameStmt = db.prepare(
  "SELECT nickname FROM nicknames WHERE pokemon_id = ?"
);
const setNicknameStmt = db.prepare(`
  INSERT INTO nicknames (pokemon_id, nickname)
  VALUES (?, ?)
  ON CONFLICT(pokemon_id) DO UPDATE SET nickname = excluded.nickname
`);
const deleteNicknameStmt = db.prepare(
  "DELETE FROM nicknames WHERE pokemon_id = ?"
);

// ============ Types ============

export interface AboutInfo {
  height: number | null;
  weight: number | null;
  description: string | null;
}

// ============ Pokemon Nicknames ============

export function getNickname(pokemonId: number): string | null {
  const row = getNicknameStmt.get(pokemonId) as { nickname: string } | undefined;
  return row ? row.nickname : null;
}

export function setNickname(pokemonId: number, nickname: string): void {
  setNicknameStmt.run(pokemonId, nickname);
}

export function deleteNickname(pokemonId: number): void {
  deleteNicknameStmt.run(pokemonId);
}

// ============ Pokemon About Info ============

export function getAboutInfo(pokemonId: number): AboutInfo | null {
  const stmt = db.prepare(
    "SELECT height, weight, description FROM pokemon_info WHERE pokemon_id = ?"
  );
  const result = stmt.get(pokemonId) as AboutInfo | undefined;
  return result ?? null;
}

export function setAboutInfo(pokemonId: number, aboutData: AboutInfo): void {
  const { height, weight, description } = aboutData;
  const stmt = db.prepare(`
    INSERT INTO pokemon_info (pokemon_id, height, weight, description, updated_at)
    VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(pokemon_id) DO UPDATE SET
      height = excluded.height,
      weight = excluded.weight,
      description = excluded.description,
      updated_at = CURRENT_TIMESTAMP
  `);
  stmt.run(pokemonId, height, weight, description);
}

export function deleteAboutInfo(pokemonId: number): void {
  const stmt = db.prepare("DELETE FROM pokemon_info WHERE pokemon_id = ?");
  stmt.run(pokemonId);
}

export function getAboutInfoForIds(pokemonIds: number[]): Map<number, AboutInfo> {
  if (pokemonIds.length === 0) return new Map();

  const placeholders = pokemonIds.map(() => "?").join(",");
  const stmt = db.prepare(`
    SELECT pokemon_id, height, weight, description 
    FROM pokemon_info 
    WHERE pokemon_id IN (${placeholders})
  `);

  const results = stmt.all(...pokemonIds) as Array<{
    pokemon_id: number;
    height: number | null;
    weight: number | null;
    description: string | null;
  }>;

  const map = new Map<number, AboutInfo>();

  results.forEach((row) => {
    map.set(row.pokemon_id, {
      height: row.height,
      weight: row.weight,
      description: row.description,
    });
  });

  return map;
}

export default db;