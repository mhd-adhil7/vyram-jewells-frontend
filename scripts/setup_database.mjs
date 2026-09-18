import { createRequire } from 'module';
import path from 'path';

const require = createRequire(path.join(process.cwd(), 'package.json'));
const { neon } = require('@neondatabase/serverless');

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_jRO4EXyoJ5Pp@ep-divine-grass-b4ypw7t1-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require';
const sql = neon(DATABASE_URL);

async function setupDatabase() {
  console.log('--- Step 1: Configuring Extensions & Roles ---');

  // 1. pgcrypto extension for HMAC-SHA1 signatures
  await sql`CREATE EXTENSION IF NOT EXISTS pgcrypto;`;
  console.log('pgcrypto extension enabled.');

  // 2. Roles: vyram_reader (strictly public read-only)
  await sql`DO $$
  BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'vyram_reader') THEN
      CREATE ROLE vyram_reader WITH LOGIN PASSWORD 'vyram_readonly_pub_2026';
    ELSE
      ALTER ROLE vyram_reader WITH PASSWORD 'vyram_readonly_pub_2026';
    END IF;

    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'vyram_admin') THEN
      CREATE ROLE vyram_admin WITH LOGIN PASSWORD 'vyram_admin_secure_2026';
    ELSE
      ALTER ROLE vyram_admin WITH PASSWORD 'vyram_admin_secure_2026';
    END IF;
  END
  $$;`;
  console.log('Roles vyram_reader and vyram_admin verified.');

  // 3. Permissions
  await sql`GRANT USAGE ON SCHEMA public TO vyram_reader;`;
  await sql`GRANT USAGE ON SCHEMA public TO vyram_admin;`;
  await sql`GRANT SELECT ON products TO vyram_reader;`;
  await sql`GRANT ALL PRIVILEGES ON products TO vyram_admin;`;

  // Explicitly revoke write permissions from vyram_reader
  await sql`REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON ALL TABLES IN SCHEMA public FROM vyram_reader;`;

  // 4. Enable Row-Level Security
  await sql`ALTER TABLE products ENABLE ROW LEVEL SECURITY;`;
  await sql`ALTER TABLE products FORCE ROW LEVEL SECURITY;`;

  await sql`DROP POLICY IF EXISTS "public_read_active_products" ON products;`;
  await sql`DROP POLICY IF EXISTS "admin_all_products" ON products;`;
  await sql`DROP POLICY IF EXISTS "owner_all_products" ON products;`;

  // vyram_reader and public can only read active products
  await sql`
    CREATE POLICY "public_read_active_products" ON products
    FOR SELECT
    TO vyram_reader
    USING (is_active = true);
  `;

  // vyram_admin can read, insert, update, delete any product
  await sql`
    CREATE POLICY "admin_all_products" ON products
    FOR ALL
    TO vyram_admin
    USING (true)
    WITH CHECK (true);
  `;

  // database owner can do everything
  await sql`
    CREATE POLICY "owner_all_products" ON products
    FOR ALL
    TO neondb_owner
    USING (true)
    WITH CHECK (true);
  `;
  console.log('RLS policies applied.');

  // 5. Secure Function for ImageKit client upload signatures
  // Stores private key safely inside the database engine, generating token, expire, and HMAC-SHA1 signature
  await sql`
    CREATE OR REPLACE FUNCTION get_imagekit_auth()
    RETURNS json
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    DECLARE
      v_token text := gen_random_uuid()::text;
      v_expire text := (extract(epoch from now())::bigint + 1800)::text;
      v_signature text;
      v_private_key text := 'private_AizEWOwgAtGhgU28Z3slaNyyWLQ=';
    BEGIN
      v_signature := encode(hmac((v_token || v_expire)::text, v_private_key::text, 'sha1'), 'hex');
      RETURN json_build_object(
        'token', v_token,
        'expire', v_expire::bigint,
        'signature', v_signature
      );
    END;
    $$;
  `;

  await sql`GRANT EXECUTE ON FUNCTION get_imagekit_auth() TO vyram_admin;`;
  await sql`GRANT EXECUTE ON FUNCTION get_imagekit_auth() TO neondb_owner;`;
  await sql`GRANT EXECUTE ON FUNCTION get_imagekit_auth() TO vyram_reader;`; // Allowed to obtain upload signature for Admin UI
  console.log('get_imagekit_auth() stored procedure created.');

  // Verify get_imagekit_auth()
  const authTest = await sql`SELECT get_imagekit_auth() AS auth;`;
  console.log('Tested get_imagekit_auth():', authTest[0].auth);

  console.log('--- Database & Security Setup Complete ---');
}

setupDatabase().catch(err => {
  console.error('Setup failed:', err);
  process.exit(1);
});
