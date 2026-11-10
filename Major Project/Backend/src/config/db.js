import pg from "pg";
const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10
});

export async function query(text, params = []) {
  return pool.query(text, params);
}

export async function connectDB() {
  const client = await pool.connect();
  try {
    await client.query("SELECT 1");
    console.log("PostgreSQL connected");
  } finally {
    client.release();
  }
}

export async function initDB() {
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id BIGSERIAL PRIMARY KEY,
      name VARCHAR(80) NOT NULL,
      email VARCHAR(180) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      phone VARCHAR(30),
      role VARCHAR(20) NOT NULL DEFAULT 'seeker',
      avatar TEXT,
      is_email_verified BOOLEAN NOT NULL DEFAULT false,
      is_phone_verified BOOLEAN NOT NULL DEFAULT false,
      is_kyc_verified BOOLEAN NOT NULL DEFAULT false,
      is_blocked BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      last_login_at TIMESTAMPTZ
    );

    CREATE TABLE IF NOT EXISTS profiles (
      id BIGSERIAL PRIMARY KEY,
      user_id BIGINT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      bio TEXT,
      gender VARCHAR(30),
      age INT,
      occupation VARCHAR(100),
      budget_min NUMERIC(12,2),
      budget_max NUMERIC(12,2),
      preferred_locations TEXT[] DEFAULT '{}',
      personality_tags TEXT[] DEFAULT '{}',
      sleep_schedule VARCHAR(40),
      food_preference VARCHAR(60),
      cleanliness VARCHAR(40),
      smoking BOOLEAN,
      pets BOOLEAN,
      dob VARCHAR(40),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    ALTER TABLE profiles ADD COLUMN IF NOT EXISTS dob VARCHAR(40);

    CREATE TABLE IF NOT EXISTS rooms (
      id BIGSERIAL PRIMARY KEY,
      owner_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(160) NOT NULL,
      description TEXT,
      city VARCHAR(80) NOT NULL,
      locality VARCHAR(120),
      address TEXT,
      rent NUMERIC(12,2) NOT NULL,
      deposit NUMERIC(12,2) DEFAULT 0,
      property_type VARCHAR(40) DEFAULT 'apartment',
      room_type VARCHAR(40) DEFAULT 'private',
      furnishing VARCHAR(40) DEFAULT 'furnished',
      gender_preference VARCHAR(30),
      available_from DATE,
      amenities TEXT[] DEFAULT '{}',
      images TEXT[] DEFAULT '{}',
      status VARCHAR(30) NOT NULL DEFAULT 'published',
      views INT NOT NULL DEFAULT 0,
      is_verified BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS favorites (
      user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      room_id BIGINT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      PRIMARY KEY(user_id, room_id)
    );

    CREATE TABLE IF NOT EXISTS matches (
      id BIGSERIAL PRIMARY KEY,
      user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      matched_user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      score NUMERIC(5,2) NOT NULL DEFAULT 0,
      status VARCHAR(30) NOT NULL DEFAULT 'pending',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      UNIQUE(user_id, matched_user_id)
    );

    CREATE TABLE IF NOT EXISTS visits (
      id BIGSERIAL PRIMARY KEY,
      room_id BIGINT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
      seeker_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      owner_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      scheduled_at TIMESTAMPTZ NOT NULL,
      note TEXT,
      status VARCHAR(30) NOT NULL DEFAULT 'pending',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS conversations (
      id BIGSERIAL PRIMARY KEY,
      user_one BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      user_two BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      UNIQUE(user_one, user_two)
    );

    CREATE TABLE IF NOT EXISTS messages (
      id BIGSERIAL PRIMARY KEY,
      conversation_id BIGINT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
      sender_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      body TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      is_read BOOLEAN NOT NULL DEFAULT false
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id BIGSERIAL PRIMARY KEY,
      user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(160) NOT NULL,
      message TEXT NOT NULL,
      type VARCHAR(40) DEFAULT 'general',
      is_read BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id BIGSERIAL PRIMARY KEY,
      reviewer_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      target_type VARCHAR(20) NOT NULL,
      target_id BIGINT NOT NULL,
      rating INT NOT NULL CHECK(rating BETWEEN 1 AND 5),
      comment TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS expenses (
      id BIGSERIAL PRIMARY KEY,
      user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(160) NOT NULL,
      amount NUMERIC(12,2) NOT NULL,
      total_people INT NOT NULL DEFAULT 1,
      paid BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS reports (
      id BIGSERIAL PRIMARY KEY,
      reporter_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      target_type VARCHAR(30) NOT NULL,
      target_id BIGINT NOT NULL,
      reason TEXT NOT NULL,
      status VARCHAR(30) NOT NULL DEFAULT 'open',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS devices (
      id BIGSERIAL PRIMARY KEY,
      user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(120),
      token TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE INDEX IF NOT EXISTS idx_rooms_city ON rooms(city);
    CREATE INDEX IF NOT EXISTS idx_rooms_rent ON rooms(rent);
    CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id, created_at);
    CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, created_at);
  `);
}
