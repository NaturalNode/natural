const memjs = require('memjs')

const memcached = memjs.Client.create('127.0.0.1:11211')

memcached.set('key', 'value', function (err, result) {
  if (err) {
    console.log(err)
  } else {
    console.log(result)
  }
})

memcached.get('key', function (err, result) {
  if (err) {
    console.log(err)
  } else {
    console.log(result)
  }
})
