#!/bin/bash

set -e

psql $POSTGRES_DB -c "CREATE DATABASE $POSTGRES_DEV_DB WITH ENCODING '$POSTGRES_ENCODING' TEMPLATE template0"
psql $POSTGRES_DB -c "CREATE USER $POSTGRES_DEV_USER WITH PASSWORD '$POSTGRES_DEV_PASSWORD'"
psql $POSTGRES_DB -c "CREATE ROLE dev_role VALID UNTIL '2030-01-01' CONNECTION LIMIT $POSTGRES_MAX"

psql $POSTGRES_DEV_DB -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\""

psql $POSTGRES_DEV_DB -c "CREATE SCHEMA user_schema AUTHORIZATION dev_role"

psql $POSTGRES_DEV_DB -c "CREATE TABLE user_schema.refresh_token (
  id uuid DEFAULT uuid_generate_v4 (),
  expires_in BIGINT NOT NULL,
  PRIMARY KEY (id)
)"
psql $POSTGRES_DEV_DB -c "CREATE TABLE user_schema.users (
  id uuid DEFAULT uuid_generate_v4 (),
  taxvat VARCHAR (11) NOT NULL,
  name VARCHAR (256) NOT NULL,
  lastname VARCHAR (256) NOT NULL,
  email VARCHAR(256) UNIQUE NOT NULL,
  password VARCHAR(256) NOT NULL,
  refresh_token_id uuid DEFAULT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_refresh_token FOREIGN(refresh_token_id) REFERENCES user_schema.refresh_token(id)
)"

psql $POSTGRES_DB -c "GRANT CONNECT ON DATABASE $POSTGRES_DEV_DB TO dev_role"
psql $POSTGRES_DB -c "GRANT dev_role TO $POSTGRES_DEV_USER"

psql $POSTGRES_DEV_DB -c "GRANT USAGE ON SCHEMA user_schema TO dev_role"
psql $POSTGRES_DEV_DB -c "GRANT ALL ON ALL TABLES IN SCHEMA user_schema TO dev_role"

psql $POSTGRES_DB -c "ALTER DATABASE $POSTGRES_DEV_DB OWNER TO dev_role"

psql $POSTGRES_DEV_DB -c "ALTER TABLE user_schema.users OWNER TO dev_role"
psql $POSTGRES_DEV_DB -c "ALTER TABLE user_schema.refresh_token OWNER TO dev_role"
