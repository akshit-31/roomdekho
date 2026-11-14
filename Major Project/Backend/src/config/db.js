import pg from "pg";
const { Pool } = pg;

const isRemoteDb =
  Boolean(process.env.DATABASE_URL && (process.env.DATABASE_URL.includes("supabase.com") || process.env.DATABASE_URL.includes("pooler") || process.env.NODE_ENV === "production"));

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  ssl: isRemoteDb ? { rejectUnauthorized: false } : undefined,
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
      is_profile_completed BOOLEAN NOT NULL DEFAULT false,
      approval_status VARCHAR(20) NOT NULL DEFAULT 'approved',
      property_city VARCHAR(80),
      property_locality VARCHAR(120),
      property_address TEXT,
      id_proof_type VARCHAR(60),
      id_proof_number VARCHAR(100),
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      last_login_at TIMESTAMPTZ
    );

    ALTER TABLE users ADD COLUMN IF NOT EXISTS is_profile_completed BOOLEAN DEFAULT false;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS approval_status VARCHAR(20) DEFAULT 'approved';
    ALTER TABLE users ADD COLUMN IF NOT EXISTS property_city VARCHAR(80);
    ALTER TABLE users ADD COLUMN IF NOT EXISTS property_locality VARCHAR(120);
    ALTER TABLE users ADD COLUMN IF NOT EXISTS property_address TEXT;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS id_proof_type VARCHAR(60);
    ALTER TABLE users ADD COLUMN IF NOT EXISTS id_proof_number VARCHAR(100);
    ALTER TABLE users ADD COLUMN IF NOT EXISTS intent VARCHAR(40) DEFAULT 'both';

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
      looking_for VARCHAR(40) DEFAULT 'both',
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    ALTER TABLE profiles ADD COLUMN IF NOT EXISTS dob VARCHAR(40);
    ALTER TABLE profiles ADD COLUMN IF NOT EXISTS looking_for VARCHAR(40) DEFAULT 'both';

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

    ALTER TABLE conversations ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();
    ALTER TABLE messages ADD COLUMN IF NOT EXISTS image_url TEXT;

    CREATE INDEX IF NOT EXISTS idx_rooms_city ON rooms(city);
    CREATE INDEX IF NOT EXISTS idx_rooms_rent ON rooms(rent);
    CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id, created_at);
    CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, created_at);
  `);
}
