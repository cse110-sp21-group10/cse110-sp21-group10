/**
 * This class contains a suite of static functions that can be used to interact with our app's IndexedDB
 * database. The functions allow for storage, retrieval and deletion of bullet, label, daily, monthly,
 * yearly, and style JSON objects.
 *
 * @classdesc
 * @example <caption>Example usage of Database</caption>
 * // this sample code would store a daily object in the database and print a success statement when it completes
 * const id = 'D 20210519';
 * Database.store(id, { notes: 'this is an example' }, function (stored, id) {
 *   if (stored === true) {
 *     console.log('finished storing object with id ' + id);
 *   } else {
 *     console.log('could not store object with id' + id);
 *   }
 * }, id);
 *
 * @property {string} DATABASE_NAME - The name ('BulletJournal') of the IndexedDB database used by our app
 * @property {Object.<string, string>} Stores - Object containing the constant names of the object stores in the database
 */
export class Database {
  /**
   * @static
   * @property {string} DATABASE_NAME - The name ('BulletJournal') of the IndexedDB database used by our app
   */
  static get DATABASE_NAME () {
    return 'BulletJournal';
  }

  /**
   * @static
   * @property {Object.<string, string>} Stores - Object containing the constant names of the object stores in the database
   */
  static get Stores () {
    return {
      DAILY: 'daily',
      MONTHLY: 'monthly',
      YEARLY: 'yearly',
      BULLETS: 'bullets',
      LABELS: 'labels',
      STYLE: 'style'
    };
  }

  // ------------------------- Start Documentation For Callback Functions -------------------------

  /**
   * Callback function that is run after the database is opened and ready for transactions.
   *
   * @callback openCallback
   * @param {Object} databaseObject - The database object if the operation succeeded; null if it failed
   */

  /**
   * Callback for data retrieval. This callback must be specified to have access to the data retrieved from
   * the database request. If the transaction succeeded, the retrieved object will be passed as the parameter
   * to this function. Otherwise, null will be passed as the parameter to this function. If additional
   * arguments (varArgs) are given to the function that uses this callback, those arguments will be passed
   * to this callback function in order after the fetchedData parameter.
   *
   * @callback fetchCallback
   * @param {Object} fetchedData - The data that is retrieved from the object store if the get transaction
   * succeeded; null if it failed
   */

  /**
   * Callback for success/failure functionality after a storage transaction. Only needed if success and failure
   * conditions must be treated appropriately. If the transaction succeeded, true will be passed as the parameter
   * to this function. Otherwise, false will be passed as the parameter to this function. If additional
   * arguments (varArgs) are given to the function that uses this callback, those arguments will be passed
   * to this callback function in order after the transactionResult parameter.
   *
   * @callback storeCallback
   * @param {boolean} transactionResult - True if the storage transaction succeeded; false if it failed
   */

  /**
   * Callback for success/failure functionality after a deletion transaction. Only needed if success and failure
   * conditions must be treated appropriately. If the transaction succeeded, true will be passed as the parameter
   * to this function. Otherwise, false will be passed as the parameter to this function. If additional
   * arguments (varArgs) are given to the function that uses this callback, those arguments will be passed
   * to this callback function in order after the transactionResult parameter.
   *
   * @callback deleteCallback
   * @param {boolean} transactionResult - True if the delete transaction succeeded; false if it failed
   */

  // -------------------------- End Documentation For Callback Functions --------------------------

  // ----------------------------------- Start Helper Functions -----------------------------------

  /**
   * This function opens the IndexedDB database in order to allow for transactions to be run on the
   * database. It makes an asynchronous call to IndexedDB's open function with the constant database
   * name 'BulletJournal' and creates the appropriate object stores if the database doesn't yet exist.
   * It then runs the given callback function with the resulting database object if the operation
   * succeeds, or null if the operation fails. This function is automatically called as a helper function
   * when the fetch, store, and delete functions are called.
   *
   * @static
   * @param {?openCallback} [callback=null] - Callback function that is run after the database open
   * operation completes (if no callback is provided, nothing is run after the transaction is complete)
   */
  static openDatabase (callback = null) {
    // opens database (async)
    const dbOpenRequest = indexedDB.open(this.DATABASE_NAME, 2);

    // called when database is first created and when db updates are needed
    dbOpenRequest.onupgradeneeded = function (event) {
      // adds empty object stores to the database if they don't exist yet
      const db = dbOpenRequest.result;
      const objectStores = db.objectStoreNames;
      Object.values(Database.Stores).forEach(value => {
        if (!objectStores.contains(value)) {
          db.createObjectStore(value);
        }
      });
      console.log('CREATED DATABASE'); // console logging
    };

    // called when database is opened and ready for read/write operations
    dbOpenRequest.onsuccess = function (event) {
      console.log('OPENED DATABASE'); // console logging
      const db = dbOpenRequest.result;
      if (callback != null) {
        callback(db); // callback can use this database for read/write
      }
    };

    // called when database open operation fails (database can't be opened for transactions)
    dbOpenRequest.onerror = function (event) {
      if (callback != null) {
        callback(null); // callback with null signifying database couldn't be opened
      }
    };
  }

  /**
   * This function deletes the entire IndexedDB database and all its contents. It makes an
   * asynchronous call to IndexedDB's deleteDatabase function with the constant database
   * name 'BulletJournal'. If then runs the given callback function with a true/false parameter
   * based on whether or not the open operation succeeded.
   *
   * WARNING: DO NOT CALL UNLESS YOU WISH FOR ALL THE USER'S DATA TO BE DELETED.
   *
   * @static
   * @param {?deleteCallback} [callback=null] - Callback function that is run after the database delete
   * operation completes (if no callback is provided, nothing is run after the transaction is complete)
   */
  static deleteDatabase (callback = null) {
    // start request to delete database
    const dbDeleteRequest = indexedDB.deleteDatabase(this.DATABASE_NAME);

    // called when database is deleted
    dbDeleteRequest.onsuccess = function (event) {
      console.log('DELETED DATABASE'); // console logging
      if (callback != null) {
        callback(true); // callback signifying the database was deleted
      }
    };

    // called when database failed to be deleted
    dbDeleteRequest.onerror = function (event) {
      if (callback != null) {
        callback(false); // callback signifying the database was not deleted
      }
    };
  }

  /**
   * This function parses a given ID and determines what type of object (ex. bullet, daily, monthly, yearly,
   * etc) the ID represents. It returns the object store that stores that type of object. This function is
   * automatically called as a helper function when the fetch, store, and delete functions are called.
   *
   * @static
   * @param {string} id - The unique string ID that was used as the object's key in the database
   * @returns {string} The name of the object store containing the type of object (ex. bullet, daily, monthly,
   * yearly, etc) that the given ID represents
   */
  static getStoreFromID (id) {
    // get the first character of the ID string
    const firstChar = id.charAt(0);

    // use first character to identify the kind of object
    switch (firstChar) {
      case 'D':
        return this.Stores.DAILY; // ID starting with 'D' signifies daily object
      case 'M':
        return this.Stores.MONTHLY; // ID starting with 'M' signifies monthly object
      case 'Y':
        return this.Stores.YEARLY; // ID starting with 'Y' signifies yearly object
      case 'B':
        return this.Stores.BULLETS; // ID starting with 'B' signifies bullet object
      case 'L':
        return this.Stores.LABELS; // ID starting with 'L' signifies label object
      case 'S':
        return this.Stores.STYLE; // ID starting with 'S' signifies style object
    }
  }

  // ------------------------------------ End Helper Functions ------------------------------------

  // --------------------------------- Start Read/Write Functions ---------------------------------

  /**
   * This function retrieves a single JSON object with the given ID in the database. It first uses the format of
   * the given object ID to determine what type of object (ex. bullet, daily, monthly, yearly, etc) is being
   * retrieved. It then makes an asynchronous call to IndexedDB's get function on the appropriate object store
   * to retrieve the desired object, and then passes the retrieved object to the given callback function if the
   * retrieval operation succeeded, or passes null to the given callback if the retrieval operation failed. In
   * addition to the retrieved object, any other given parameters (specified by varArgs) are also passed to the
   * callback function.
   *
   * @static
   * @param {string} id - The unique string ID that was used as the object's key in the database
   * @param {?fetchCallback} [callback=null] - Callback function that is run after the database transaction
   * completes (if no callback is provided, nothing is run after the transaction is complete)
   * @param {...*} varArgs - Additional arguments that are passed into callback function (in order) along with
   * the retrieved object (which is passed as the first argument to the callback)
   */
  static fetch (id, callback = null, ...varArgs) {
    this.openDatabase(function (db) {
      if (db != null) {
        // call helper function to identify what type of object we are looking for, which determines what object store the object should be in
        const storeName = Database.getStoreFromID(id);

        // starts a transaction to create a get request for the object with the given ID
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const getRequest = store.get(id);

        // on success, call the callback function with the retrieved data and the varArgs if any were provided
        getRequest.onsuccess = function (event) {
          if (callback != null) {
            callback(event.target.result, ...varArgs);
          }
        };

        // on error, call the callback function with null and the varArgs if any were provided
        getRequest.onerror = function (event) {
          if (callback != null) {
            callback(null, ...varArgs);
          }
        };
      } else {
        console.log('ERROR: DATABASE COULD NOT BE OPENED');
      }
    });
  }

  /**
   * This function stores a single JSON object in the database using the given ID. It first uses the format of
   * the given object ID to determine what type of object (ex. bullet, daily, monthly, yearly, etc) is being
   * stored. It then makes an asynchronous call to IndexedDB's put function on the appropriate object store
   * to store the given object, and then passes a boolean (true if the operation succeeds or false if the operation
   * fails) to the given callback function. In addition to the boolean value, any other given parameters (specified by
   * varArgs) are also passed to the callback function.
   *
   * @static
   * @param {string} id - The unique string ID that will be used as the object's key in the database
   * @param {Object} dataObject - The JSON object to be stored
   * @param {?storeCallback} [callback=null] - Callback function that is run after the database transaction
   * completes (if no callback is provided, nothing is run after the transaction is complete)
   * @param {...*} varArgs - Additional arguments that are passed into callback function (in order) along with
   * a boolean representing the success/failure result of the transaction (which is passed as the first argument
   * to the callback)
   */
  static store (id, dataObject, callback = null, ...varArgs) {
    this.openDatabase(function (db) {
      if (db != null) {
        // call helper function to identify what type of object we are storing, which determines what object store the object should be stored in
        const storeName = Database.getStoreFromID(id);

        // starts a transaction to create a put request for the object
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const putRequest = store.put(dataObject, id);

        // on success, call the callback function with true and the varArgs if any were provided
        putRequest.onsuccess = function (event) {
          if (callback != null) {
            callback(true, ...varArgs);
          }
        };

        // on error, call the callback function with false and the varArgs if any were provided
        putRequest.onerror = function (event) {
          if (callback != null) {
            callback(false, ...varArgs);
          }
        };
      } else {
        console.log('ERROR: DATABASE COULD NOT BE OPENED');
      }
    });
  }

  /**
   * This function deletes a single JSON object with the given ID from the database. It first uses the format of
   * the given object ID to determine what type of object (ex. bullet, daily, monthly, yearly, etc) is being
   * deleted. It then makes an asynchronous call to IndexedDB's delete function on the appropriate object store
   * to delete the desired object, and then passes a boolean (true if the operation succeeds or false if the operation
   * fails) to the given callback function. In addition to the boolean value, any other given parameters (specified by
   * varArgs) are also passed to the callback function.
   *
   * @static
   * @param {string} id - The unique string ID that was used as the object's key in the database
   * @param {?deleteCallback} [callback=null] - Callback function that is run after the database transaction
   * completes (if no callback is provided, nothing is run after the transaction is complete)
   * @param {...*} varArgs - Additional arguments that are passed into callback function (in order) along with
   * a boolean representing the success/failure result of the transaction (which is passed as the first argument
   * to the callback)
   */
  static delete (id, callback = null, ...varArgs) {
    this.openDatabase(function (db) {
      if (db != null) {
        // call helper function to identify what type of object we are deleting, which determines what object store the object should be in
        const storeName = Database.getStoreFromID(id);

        // starts a transaction to create a get request for the object with the given ID
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const delRequest = store.delete(id);

        // on success, call the callback function with true and the varArgs if any were provided
        delRequest.onsuccess = function (event) {
          if (callback != null) {
            callback(true, ...varArgs);
          }
        };

        // on success, call the callback function with false and the varArgs if any were provided
        delRequest.onerror = function (event) {
          if (callback != null) {
            callback(false, ...varArgs);
          }
        };
      } else {
        console.log('ERROR: DATABASE COULD NOT BE OPENED');
      }
    });
  }

  /**
   * This function retrieves the keys of all the daily JSON objects in the database. The function makes an
   * asynchronous call to IndexedDB's getAllKeys function on the daily object store to retrieve all the keys
   * of the daily objects in the database, and then passes the retrieved object to the given callback function
   * if the retrieval operation succeeded, or passes null to the given callback if the retrieval operation
   * failed. In addition to the retrieved object, any other given parameters (specified by varArgs) are also
   * passed to the callback function.
   *
   * @static
   * @param {?fetchCallback} [callback=null] - Callback function that is run after the database transaction
   * completes (if no callback is provided, nothing is run after the transaction is complete)
   * @param {...*} varArgs - Additional arguments that are passed into callback function (in order) along with
   * the retrieved object (which is passed as the first argument to the callback)
   */
  static getEntryKeys (callback = null, ...varArgs) {
    this.openDatabase(function (db) {
      if (db != null) {
        // starts a transaction to create a get request for the object with the given ID
        const transaction = db.transaction([Database.Stores.DAILY], 'readwrite');
        const store = transaction.objectStore(Database.Stores.DAILY);
        const getKeysRequest = store.getAllKeys();

        // on success, call the callback function with the retrieved list of keys and the varArgs if any were provided
        getKeysRequest.onsuccess = function (event) {
          if (callback != null) {
            callback(event.target.result, ...varArgs);
          }
        };

        // on error, call the callback function with null and the varArgs if any were provided
        getKeysRequest.onerror = function (event) {
          if (callback != null) {
            callback(null, ...varArgs);
          }
        };
      } else {
        console.log('ERROR: DATABASE COULD NOT BE OPENED');
      }
    });
  }

  // ---------------------------------- End Read/Write Functions ----------------------------------
} // end class Database
