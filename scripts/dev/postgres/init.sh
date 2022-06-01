#!/bin/bash

set -e

# Create Databases
psql postgres -c "CREATE DATABASE clean_node_login_api_ts_postgres_dev_db WITH ENCODING 'UTF8' TEMPLATE template0"

# Create Users
psql postgres -c "CREATE USER dev_user WITH PASSWORD 'dev_user' VALID UNTIL '2030-01-01' CONNECTION LIMIT 1000"

# Create Extentions
psql clean_node_login_api_ts_postgres_dev_db -c "CREATE EXTENSION \"uuid-ossp\""

# Create Schemas
psql clean_node_login_api_ts_postgres_dev_db -c "CREATE SCHEMA IF NOT EXISTS users_schema AUTHORIZATION dev_user"
psql clean_node_login_api_ts_postgres_dev_db -c "CREATE SCHEMA IF NOT EXISTS emails_schema AUTHORIZATION dev_user"

# Create Tables
psql clean_node_login_api_ts_postgres_dev_db -c "CREATE TABLE IF NOT EXISTS users_schema.refresh_token (
  id uuid DEFAULT uuid_generate_v4 (),
  expires_in BIGINT NOT NULL,
  PRIMARY KEY (id)
)"
psql clean_node_login_api_ts_postgres_dev_db -c "CREATE TABLE IF NOT EXISTS emails_schema.email_blacklist(
  id uuid DEFAULT uuid_generate_v4 (),
  domain VARCHAR(255) UNIQUE NOT NULL,
  PRIMARY KEY (id)
)"

# Insert Black List Emails Domain
# ========================================

file='./documents/disposable-emails.txt'

while read line; do
  psql clean_node_login_api_ts_postgres_dev_db -c "INSERT INTO emails_schema.email_blacklist (domain) VALUES ('$line')"
done < $file
# ========================================

# Create Function to Check if email is in the Blacklist
# ========================================
psql clean_node_login_api_ts_postgres_dev_db -c "CREATE OR REPLACE FUNCTION is_user_email_domain_valid (email VARCHAR(255)) RETURNS BOOLEAN AS \$\$
  DECLARE
    invalid_domains INT;
    email_domain VARCHAR(255);
  BEGIN
    email_domain := split_part(email, '@', 2);

    SELECT COUNT(domain) INTO invalid_domains FROM emails_schema.email_blacklist WHERE email_domain = domain;

    IF invalid_domains > 0 THEN
      RETURN FALSE;
    END IF;
    RETURN TRUE;
  END;
\$\$ LANGUAGE plpgsql"
# ========================================

psql clean_node_login_api_ts_postgres_dev_db -c "CREATE TABLE IF NOT EXISTS users_schema.users(
  id uuid DEFAULT uuid_generate_v4 (),
  taxvat VARCHAR (32) NOT NULL,
  name VARCHAR (255) NOT NULL,
  lastname VARCHAR (255) NOT NULL,
  email VARCHAR (255) UNIQUE NOT NULL,
  password VARCHAR (256) NOT NULL,
  refresh_token_id uuid DEFAULT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (refresh_token_id) REFERENCES users_schema.refresh_token(id) ON UPDATE CASCADE,
  CONSTRAINT users_name_check CHECK (LENGTH(CAST(name AS TEXT)) > 1),
  CONSTRAINT users_lastname_check CHECK (LENGTH(CAST(lastname AS TEXT)) > 1),
  CONSTRAINT users_email_check CHECK (
    email ~ '^[a-zA-Z0-9\._-]+\@[a-zA-Z0-9._-]+\.[a-zA-Z]+\$'
    AND is_user_email_domain_valid(email)
  )
)"

# Create Function to update client refresh token
# ========================================
psql clean_node_login_api_ts_postgres_dev_db -c "CREATE OR REPLACE FUNCTION update_client_refresh_token (token_id uuid, expiration_time bigint) RETURNS
  TABLE (
    id uuid,
    taxvat VARCHAR (32),
    name VARCHAR (255),
    lastname VARCHAR (255),
    email VARCHAR (255),
    password VARCHAR (256),
    refresh_token_id uuid
  ) AS \$\$
  BEGIN

    UPDATE users_schema.refresh_token
    SET
      expires_in = expiration_time
    WHERE id = token_id;

    RETURN QUERY UPDATE users_schema.users
    SET
      refresh_token_id = uuid_generate_v4 ()
    WHERE refresh_token_id = token_id
    RETURNING id, taxvat, name, lastname, email, password, refresh_token_id;

  END;
\$\$ LANGUAGE plpgsql"
# ========================================

# Create Index for gmail like index domains
psql clean_node_login_api_ts_postgres_dev_db -c "CREATE INDEX IF NOT EXISTS idx_users_email_gmail ON users_schema.users(email) WHERE email LIKE '%gmail.com%'"
psql clean_node_login_api_ts_postgres_dev_db -c "CREATE INDEX IF NOT EXISTS idx_users_email_outlook ON users_schema.users(email) WHERE email LIKE '%outlook.com%'"
psql clean_node_login_api_ts_postgres_dev_db -c "CREATE INDEX IF NOT EXISTS idx_users_email_yahoo ON users_schema.users(email) WHERE email LIKE '%yahoo.com%'"
psql clean_node_login_api_ts_postgres_dev_db -c "CREATE INDEX IF NOT EXISTS idx_users_email_aol ON users_schema.users(email) WHERE email LIKE '%aol.com%'"
psql clean_node_login_api_ts_postgres_dev_db -c "CREATE INDEX IF NOT EXISTS idx_users_email_hotmail ON users_schema.users(email) WHERE email LIKE '%hotmail.com%'"

# Grant Privileges
psql postgres -c "GRANT CONNECT ON DATABASE clean_node_login_api_ts_postgres_dev_db TO dev_user"

psql clean_node_login_api_ts_postgres_dev_db -c "GRANT USAGE ON SCHEMA users_schema TO dev_user"
psql clean_node_login_api_ts_postgres_dev_db -c "GRANT USAGE ON SCHEMA emails_schema TO dev_user"
psql clean_node_login_api_ts_postgres_dev_db -c "GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA users_schema TO dev_user"
psql clean_node_login_api_ts_postgres_dev_db -c "GRANT SELECT ON ALL TABLES IN SCHEMA emails_schema TO dev_user"

psql clean_node_login_api_ts_postgres_dev_db -c "GRANT EXECUTE ON FUNCTION is_user_email_domain_valid(VARCHAR) TO dev_user"

# Alter Data
psql postgres -c "ALTER DATABASE clean_node_login_api_ts_postgres_dev_db OWNER TO dev_user"

psql clean_node_login_api_ts_postgres_dev_db -c "ALTER SCHEMA users_schema OWNER TO dev_user"
psql clean_node_login_api_ts_postgres_dev_db -c "ALTER SCHEMA emails_schema OWNER TO dev_user"

psql clean_node_login_api_ts_postgres_dev_db -c "ALTER TABLE users_schema.users OWNER TO dev_user"
psql clean_node_login_api_ts_postgres_dev_db -c "ALTER TABLE users_schema.refresh_token OWNER TO dev_user"
psql clean_node_login_api_ts_postgres_dev_db -c "ALTER TABLE emails_schema.email_blacklist OWNER TO dev_user"

