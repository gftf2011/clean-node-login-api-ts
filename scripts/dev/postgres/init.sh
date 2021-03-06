#!/bin/bash

set -e

# Create Databases
psql $POSTGRES_DB -c "CREATE DATABASE $POSTGRES_DEV_DB WITH ENCODING 'UTF8' TEMPLATE template1"

# Create Users
psql $POSTGRES_DB -c "CREATE USER $POSTGRES_DEV_USER WITH PASSWORD '$POSTGRES_DEV_PASSWORD' VALID UNTIL '2030-01-01' CONNECTION LIMIT $POSTGRES_MAX_CONNECTIONS"

# Create Extentions
psql $POSTGRES_DEV_DB -c "CREATE EXTENSION \"uuid-ossp\""

# Create Schemas
psql $POSTGRES_DEV_DB -c "CREATE SCHEMA IF NOT EXISTS users_schema AUTHORIZATION $POSTGRES_DEV_USER"
psql $POSTGRES_DEV_DB -c "CREATE SCHEMA IF NOT EXISTS emails_schema AUTHORIZATION $POSTGRES_DEV_USER"
psql $POSTGRES_DEV_DB -c "CREATE SCHEMA IF NOT EXISTS taxvats_schema AUTHORIZATION $POSTGRES_DEV_USER"
# taxvat_schema.taxvat_blacklist

# Create Tables
psql $POSTGRES_DEV_DB -c "CREATE TABLE IF NOT EXISTS taxvats_schema.taxvat_blacklist(
  id uuid DEFAULT uuid_generate_v4 (),
  value VARCHAR(11) UNIQUE NOT NULL,
  PRIMARY KEY (id)
)"

psql $POSTGRES_DEV_DB -c "CREATE TABLE IF NOT EXISTS emails_schema.email_blacklist(
  id uuid DEFAULT uuid_generate_v4 (),
  domain VARCHAR(255) UNIQUE NOT NULL,
  PRIMARY KEY (id)
)"

# Insert values to tables
# ========================================

disposable_emails_file='./documents/disposable-emails.txt'
blacklist_taxvats_file='./documents/blacklist-taxvats.txt'

while read line; do
  psql $POSTGRES_DEV_DB -c "INSERT INTO emails_schema.email_blacklist (domain) VALUES ('$line')"
done < $disposable_emails_file

while read line; do
  psql $POSTGRES_DEV_DB -c "INSERT INTO taxvats_schema.taxvat_blacklist (value) VALUES ('$line')"
done < $blacklist_taxvats_file
# ========================================

# Create Function to Check if email is in the Blacklist
# ========================================
psql $POSTGRES_DEV_DB -c "CREATE OR REPLACE FUNCTION is_user_email_domain_valid (email VARCHAR(320)) RETURNS BOOLEAN AS \$\$
  DECLARE
    invalid_domains INT;
    email_domain VARCHAR(320);
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

psql $POSTGRES_DEV_DB -c "CREATE TABLE IF NOT EXISTS users_schema.users(
  id uuid DEFAULT uuid_generate_v4 (),
  taxvat VARCHAR (32) NOT NULL,
  name VARCHAR (255) NOT NULL,
  lastname VARCHAR (255) NOT NULL,
  email VARCHAR (320) UNIQUE NOT NULL,
  password VARCHAR (256) NOT NULL,
  confirmed BOOLEAN NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT users_name_check CHECK (LENGTH(CAST(name AS TEXT)) > 1),
  CONSTRAINT users_lastname_check CHECK (LENGTH(CAST(lastname AS TEXT)) > 1),
  CONSTRAINT users_email_check CHECK (
    email ~ '^[a-zA-Z0-9\._-]+\@[a-zA-Z0-9._-]+\.[a-zA-Z]+\$'
    AND is_user_email_domain_valid(email)
  )
)"

# Create Index for gmail like index domains
psql $POSTGRES_DEV_DB -c "CREATE INDEX IF NOT EXISTS idx_users_email_gmail ON users_schema.users(email) WHERE email LIKE '%gmail.com%'"
psql $POSTGRES_DEV_DB -c "CREATE INDEX IF NOT EXISTS idx_users_email_outlook ON users_schema.users(email) WHERE email LIKE '%outlook.com%'"
psql $POSTGRES_DEV_DB -c "CREATE INDEX IF NOT EXISTS idx_users_email_yahoo ON users_schema.users(email) WHERE email LIKE '%yahoo.com%'"
psql $POSTGRES_DEV_DB -c "CREATE INDEX IF NOT EXISTS idx_users_email_aol ON users_schema.users(email) WHERE email LIKE '%aol.com%'"
psql $POSTGRES_DEV_DB -c "CREATE INDEX IF NOT EXISTS idx_users_email_hotmail ON users_schema.users(email) WHERE email LIKE '%hotmail.com%'"

# Grant Privileges
psql $POSTGRES_DB -c "GRANT CONNECT ON DATABASE $POSTGRES_DEV_DB TO $POSTGRES_DEV_USER"

psql $POSTGRES_DEV_DB -c "GRANT USAGE ON SCHEMA users_schema TO $POSTGRES_DEV_USER"
psql $POSTGRES_DEV_DB -c "GRANT USAGE ON SCHEMA emails_schema TO $POSTGRES_DEV_USER"
psql $POSTGRES_DEV_DB -c "GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA users_schema TO $POSTGRES_DEV_USER"
psql $POSTGRES_DEV_DB -c "GRANT SELECT ON ALL TABLES IN SCHEMA emails_schema TO $POSTGRES_DEV_USER"

psql $POSTGRES_DEV_DB -c "GRANT EXECUTE ON FUNCTION is_user_email_domain_valid(VARCHAR) TO $POSTGRES_DEV_USER"

# Alter Data
psql $POSTGRES_DB -c "ALTER DATABASE $POSTGRES_DEV_DB OWNER TO $POSTGRES_DEV_USER"

psql $POSTGRES_DEV_DB -c "ALTER SCHEMA users_schema OWNER TO $POSTGRES_DEV_USER"
psql $POSTGRES_DEV_DB -c "ALTER SCHEMA emails_schema OWNER TO $POSTGRES_DEV_USER"

psql $POSTGRES_DEV_DB -c "ALTER TABLE users_schema.users OWNER TO $POSTGRES_DEV_USER"
psql $POSTGRES_DEV_DB -c "ALTER TABLE emails_schema.email_blacklist OWNER TO $POSTGRES_DEV_USER"
