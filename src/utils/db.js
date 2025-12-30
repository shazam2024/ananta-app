class IndexedDBManager {
  constructor() {
    this.dbName = 'anantaPerfumeDB';
    this.dbVersion = 1;
    this.db = null;
  }

  async initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = (event) => {
        reject('Database error: ' + event.target.error);
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        if (!db.objectStoreNames.contains('users')) {
          const userStore = db.createObjectStore('users', { keyPath: 'email' });
          userStore.createIndex('email', 'email', { unique: true });
        }

        if (!db.objectStoreNames.contains('cart')) {
          const cartStore = db.createObjectStore('cart', { keyPath: 'id', autoIncrement: true });
          cartStore.createIndex('userEmail', 'userEmail', { unique: false });
        }

        if (!db.objectStoreNames.contains('orders')) {
          const orderStore = db.createObjectStore('orders', { keyPath: 'id', autoIncrement: true });
          orderStore.createIndex('userEmail', 'userEmail', { unique: false });
          orderStore.createIndex('orderDate', 'orderDate', { unique: false });
        }
      };
    });
  }

  async addUser(user) {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['users'], 'readwrite');
      const store = transaction.objectStore('users');
      const request = store.add(user);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getUser(email) {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['users'], 'readonly');
      const store = transaction.objectStore('users');
      const request = store.get(email);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async addToCart(item) {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['cart'], 'readwrite');
      const store = transaction.objectStore('cart');
      const request = store.add(item);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getCartItems(userEmail) {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['cart'], 'readonly');
      const store = transaction.objectStore('cart');
      const index = store.index('userEmail');
      const request = index.getAll(userEmail);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async updateCartItem(itemId, updates) {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['cart'], 'readwrite');
      const store = transaction.objectStore('cart');
      
      const getRequest = store.get(itemId);
      getRequest.onsuccess = () => {
        const item = getRequest.result;
        if (item) {
          Object.assign(item, updates);
          const putRequest = store.put(item);
          putRequest.onsuccess = () => resolve(putRequest.result);
          putRequest.onerror = () => reject(putRequest.error);
        } else {
          reject('Item not found');
        }
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  async removeCartItem(itemId) {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['cart'], 'readwrite');
      const store = transaction.objectStore('cart');
      const request = store.delete(itemId);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async clearCart(userEmail) {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['cart'], 'readwrite');
      const store = transaction.objectStore('cart');
      const index = store.index('userEmail');
      const request = index.getAll(userEmail);

      request.onsuccess = () => {
        const items = request.result;
        let deletePromises = items.map(item => {
          return new Promise((res, rej) => {
            const deleteReq = store.delete(item.id);
            deleteReq.onsuccess = () => res(deleteReq.result);
            deleteReq.onerror = () => rej(deleteReq.error);
          });
        });

        Promise.all(deletePromises)
          .then(() => resolve(items.length))
          .catch(reject);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async addOrder(order) {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['orders'], 'readwrite');
      const store = transaction.objectStore('orders');
      const request = store.add(order);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getOrders(userEmail) {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['orders'], 'readonly');
      const store = transaction.objectStore('orders');
      const index = store.index('userEmail');
      const request = index.getAll(userEmail);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}

export default new IndexedDBManager();
