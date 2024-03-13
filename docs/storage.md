---
layout: default
title: Storage
nav_order: 25
---

# Storage backend
The storage backend provides several possibilities for storing entities created with Natural. Some are meant for persistent storage, some are for temporary storage. Currently, the following storage methods are supported:
* File: based on `fs`
* [MongoDB](https://www.npmjs.com/package/mongodb) and [mongoose](https://www.npmjs.com/package/mongoose)
* [Postgres](https://www.npmjs.com/package/postgres) and [pg](https://www.npmjs.com/package/pg)
* [Memcached](https://www.memcached.org/) and [memjs]
* [Redis](https://redis.io/) and [node-redis](https://www.npmjs.com/package/redis/)

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
- With the other storage methods the the backend generates a UUID using `uuid`.
* File-based storage is a bit different: path and filename are constructed from environment variable `FS_PATH,` UUID and extension `.json`.

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

const key = await storageBackend.store(object)
console.log(key) // UUID
const result = await storageBackend.retrieve(key)
console.log(result) // { attr1: 'val1', attr2: 'val2' }
```

## Docker compose
Besides the storage backend itself, a docker compose file is included that runs the following containers: Postgres, MongoDB, Memcached and Redis. After starting the containers, the storage backend is ready to use with all storage methods. Also, the tests in `io_spec` can be run against these containers.

## Testing on Github
The storage backend is tested on Github as part of the CI. Services for the storage methods are started from the Github Actions workflow.

## Environment variables
The following environment variables are supported:

| Environment variable | Description |
| --- | --- |
| General |
| `NATURAL_STORAGE_TYPE` | Storage type to use in Natural |
| Postgres |
| `POSTGRES_USER` | Postgres user |
| `POSTGRES_PASSWORD` | Postgres password |
| `POSTGRES_HOST` | Postgres host |
| `POSTGRES_PORT` | Postgres port |
| `POSTGRES_DATABASE` | Postgres database |
| `POSTGRES_TABLE`  | Postgres table |
| MongoDB |
| `MONGO_HOST` | MongoDB host |
| `MONGO_PORT` | MongoDB port |
| `MONGO_DATABASE` | MongoDB database |
| `MONGO_OBJECTMODEL` | MongoDB object model |
| Redis|
| `REDIS_HOST` | Redis host |
| `REDIS_PORT` | Redis port |
| Memcached | 
| `MEM_HOST` | Memcached host |
| `MEM_PORT` | Memcached port |
| `MEM_EXPIRES` | Expiration time in seconds of items in the cache |
| File |
| `FS_PATH` | Path to the directory where the files are stored |




