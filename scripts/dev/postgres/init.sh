#!/bin/bash

set -e

psql postgres -c "CREATE DATABASE clean_node_login_api_ts_postgres_dev_db WITH ENCODING 'UTF8' TEMPLATE template0"
psql postgres -c "CREATE USER dev_user WITH PASSWORD 'dev_user' VALID UNTIL '2030-01-01' CONNECTION LIMIT 1000"

psql clean_node_login_api_ts_postgres_dev_db -c "CREATE EXTENSION \"uuid-ossp\""

psql clean_node_login_api_ts_postgres_dev_db -c "CREATE SCHEMA IF NOT EXISTS users_schema AUTHORIZATION dev_user"

psql clean_node_login_api_ts_postgres_dev_db -c "CREATE TABLE IF NOT EXISTS users_schema.refresh_token (
  id uuid DEFAULT uuid_generate_v4 (),
  expires_in BIGINT NOT NULL,
  PRIMARY KEY (id)
)"
psql clean_node_login_api_ts_postgres_dev_db -c "CREATE TABLE IF NOT EXISTS users_schema.users(
  id uuid DEFAULT uuid_generate_v4 (),
  taxvat VARCHAR (32) NOT NULL,
  name VARCHAR (32) NOT NULL,
  lastname VARCHAR (32) NOT NULL,
  email VARCHAR(32) UNIQUE NOT NULL,
  password VARCHAR(256) NOT NULL,
  refresh_token_id uuid DEFAULT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (refresh_token_id) REFERENCES users_schema.refresh_token(id)
)"

psql postgres -c "GRANT CONNECT ON DATABASE clean_node_login_api_ts_postgres_dev_db TO dev_user"

psql clean_node_login_api_ts_postgres_dev_db -c "GRANT USAGE ON SCHEMA users_schema TO dev_user"
psql clean_node_login_api_ts_postgres_dev_db -c "GRANT ALL ON ALL TABLES IN SCHEMA users_schema TO dev_user"

psql postgres -c "ALTER DATABASE clean_node_login_api_ts_postgres_dev_db OWNER TO dev_user"

psql clean_node_login_api_ts_postgres_dev_db -c "ALTER SCHEMA users_schema OWNER TO dev_user"

psql clean_node_login_api_ts_postgres_dev_db -c "ALTER TABLE users_schema.users OWNER TO dev_user"
psql clean_node_login_api_ts_postgres_dev_db -c "ALTER TABLE users_schema.refresh_token OWNER TO dev_user"
