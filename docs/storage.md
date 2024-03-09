---
layout: default
title: Storage
nav_order: 25
---

# Storage backend
The storage backend provides several possibilities for storing entities created with Natural. Some are meant for persistent storage, some are for temporary storage. Currently, the following storage methods are supported:
* File
* MongoDB
* Postgres
* Memcached
* Redis

## Behaviour of the storage backend
The storage backend is a class that has the following methods:
* Constructor: at creation time the storage method can be passed. If so, setStorageType is called after which the backend is ready to use.
* setStorageType: sets the storage type. After this the backend is ready to use.
* store: stores an entity using the configured storage method
* retrieve: retrieves an entity using the configured storage method

Standard behaviour of the backend with regard to storing and retrieving data:
* It stores and retrieves Javascript objects, so `JSON.stringify` and `JSON.parse` is done here. 
- A key is returned after storing an object.
* With Postgres and MongoDB the key is determined by the storage method. 
- With the other storage methods the the backend generates a UUID.
* File-based storage is a bit different: path and filename are constructed from environment variable `FILE_PATH,` UUID and extension `.json`.


So the handling of keys is a bit different depending on the storage method.

## Example
```javascript	
var Natural = require('natural');

const object = {
      attr1: 'val1',
      attr2: 'val2'
}
const options = { filename: 'example.txt' }

storageBackend = new storage.StorageBackend(storage.STORAGE_TYPES.FILE)

const result1 = await storageBackend.store(object, options)
console.log(result1) // example.txt
const result2 = await storageBackend.retrieve(null, options)
console.log(result2) // { attr1: 'val1', attr2: 'val2' }
```

## Docker compose
Besides the storage backend itself, a docker compose file is included that runs the following containers: Postgres, MongoDB, Memcached and Redis. After starting the containers, the storage backend is ready to use with all storage methods. Also, the tests can be run.

## Environment variables
The following environment variables are used:
| Environment variable | Description |
| --- | --- |
| `NATURAL_STORAGE_TYPE` | Storage type to use in Natural |
`FILE_PATH` | Path to the directory where the files are stored
`PG_USER` | Postgres user
`PG_PASSWORD` | Postgres password
`PG_HOST` | Postgres host
`PG_PORT` | Postgres port
`PG_DATABASE` | Postgres database
`PG_TABLE`  | Postgres table
`MONGO_HOST` | MongoDB host
`MONGO_PORT` | MongoDB port
`MONGO_DATABASE` | MongoDB database
`REDIS_HOST` | Redis host
`REDIS_PORT` | Redis port
`MEMCACHED_HOST` | Memcached host
`MEMCACHED_PORT` | Memcached port
`FS_PATH` | Path to the directory where the files are stored




