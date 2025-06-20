interface CartItem {
  uuid: string;
  name: string;
  sku?: string;
  quantity: number;
  price: number;
  image: string;
  dateAdded: Date;
}

interface CartData {
  [productUuid: string]: CartItem;
}

class CartDB {
  private dbName = 'kikichoice-cart';
  private version = 2; // Increment version to trigger upgrade
  private storeName = 'cart-data';
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Clear old store if exists
        if (db.objectStoreNames.contains('cart-items')) {
          db.deleteObjectStore('cart-items');
        }

        // Create new store for cart data
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'id' });
        }
      };
    });
  }

  async getAllItems(): Promise<CartData> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get('cart');

      request.onsuccess = () => resolve(request.result?.data || {});
      request.onerror = () => reject(request.error);
    });
  }

  async addItem(productUuid: string, item: Omit<CartItem, 'uuid' | 'dateAdded'>): Promise<void> {
    if (!this.db) await this.init();

    return new Promise(async (resolve, reject) => {
      try {
        // Get current cart data
        const currentCart = await this.getAllItems();

        // Add/update item (this will override if exists)
        currentCart[productUuid] = {
          ...item,
          uuid: productUuid,
          dateAdded: new Date()
        };

        // Save updated cart
        const transaction = this.db!.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.put({ id: 'cart', data: currentCart });

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      } catch (error) {
        reject(error);
      }
    });
  }

  async updateQuantity(productUuid: string, quantity: number): Promise<void> {
    if (quantity <= 0) {
      return this.removeItem(productUuid);
    }

    if (!this.db) await this.init();

    return new Promise(async (resolve, reject) => {
      try {
        const currentCart = await this.getAllItems();

        if (currentCart[productUuid]) {
          currentCart[productUuid].quantity = quantity;

          const transaction = this.db!.transaction([this.storeName], 'readwrite');
          const store = transaction.objectStore(this.storeName);
          const request = store.put({ id: 'cart', data: currentCart });

          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        } else {
          resolve(); // Item doesn't exist, nothing to update
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  async removeItem(productUuid: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise(async (resolve, reject) => {
      try {
        const currentCart = await this.getAllItems();
        delete currentCart[productUuid];

        const transaction = this.db!.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.put({ id: 'cart', data: currentCart });

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      } catch (error) {
        reject(error);
      }
    });
  }

  async clearCart(): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.put({ id: 'cart', data: {} });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

export const cartDB = new CartDB();
export type { CartItem, CartData };