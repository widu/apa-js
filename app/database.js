const { openDB } = require('idb');
 
const dbPromise = openDB('keyval-store', 3, {
  upgrade(db) {
    const store = db.createObjectStore('command-history');
    store.createIndex('date', 'date');
  },
});


exports.cmdDB =  {
  async get(key) {
    return (await dbPromise).get('command-history', key);
  },
  async set(key, val) {
    return (await dbPromise).put('command-history', val, key);
  },
  async delete(key) {
    return (await dbPromise).delete('command-history', key);
  },
  async clear() {
    return (await dbPromise).clear('command-history');
  },
  async keys() {
    return (await dbPromise).getAllKeys('command-history');
  },
  async allKeysFromIndex(index) {
    return (await dbPromise).getAllKeysFromIndex('command-history', index);
  },
};
