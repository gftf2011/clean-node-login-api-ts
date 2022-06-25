set -e

mongo << EOF
  db = db.getSiblingDB('clean_node_login_api_ts_mongo_dev_db')

  db.createCollection('users')

  db.createRole(
    {
      role: 'dev-role',
      privileges: [
        {
          resource: {
            db: 'clean_node_login_api_ts_mongo_dev_db',
            collection: 'users'
          },
          actions: [ 'find', 'insert' ]
        },
      ],
      roles: [
        { role: 'readWrite', db: 'clean_node_login_api_ts_mongo_dev_db' }
      ]
    },
    { 
      w: 'majority',
      wtimeout: 5000
    }
  )

  db.createUser({
    user: 'dev_user',
    pwd: 'dev_user',
    mechanisms: [ 'SCRAM-SHA-256' ],
    roles: [{
      role: 'dev-role',
      db: 'clean_node_login_api_ts_mongo_dev_db'
    }]
  })

  db.users.createIndex(
    {
      email: 1
    },
    {
      name: 'users_email_unique_index_constraint',
      unique: true
    }
  )
EOF
