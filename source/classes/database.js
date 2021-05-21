/**
 * This class contains a suite of static functions that can be used to interact with our app's IndexedDB
 * database. The functions allow for storage, retrieval and deletion of bullet, label, daily, monthly,
 * and yearly JSON objects.
 *
 * @classdesc
 * @example <caption>Example usage of Database</caption>
 * // this sample code would store a daily object in the database and print a success statement when it completes
 * const id = '20210519';
 * Database.store(id, { 'notes': 'this is an example' }, function (stored, id) {
 *   if (stored === true) {
 *     console.log('finished storing object with id ' + id);
 *   } else {
 *     console.log('could not store object with id' + id);
 *   }
 * }, id);
 *
 * @property {string} DATABASE_NAME - The name ('BulletJournal') of the IndexedDB database used by our app
 * @property {Object.<string, string>} Stores - The names of the object stores in the database in constant key-value pairs
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
   * @property {Object.<string, string>} Stores - The names of the object stores in the database in constant key-value pairs
   */
  static get Stores () {
    return {
      DAILY: 'daily',
      MONTHLY: 'monthly',
      YEARLY: 'yearly',
      BULLETS: 'bullets',
      LABELS: 'labels'
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
    const dbOpenRequest = indexedDB.open(this.DATABASE_NAME, 1);

    // called when database is first created (then never called again)
    dbOpenRequest.onupgradeneeded = function (event) {
      // adds empty object stores to the empty database
      const db = dbOpenRequest.result;
      Object.values(Database.Stores).forEach(value => {
        db.createObjectStore(value);
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
    // ID starting with 'B' signifies bullet object
    if (id.charAt(0) === 'B') {
      return this.Stores.BULLETS;

    // ID starting with 'L' signifies label object
    } else if (id.charAt(0) === 'L') {
      return this.Stores.LABELS;

    // ID that doesn't start with any special letter (ex. 'B' or 'L') and has
    // length of 8 (ex. '20210519') signifies daily object
    } else if (id.length === 8) {
      return this.Stores.DAILY;

    // ID that doesn't start with any special letter (ex. 'B' or 'L') and has
    // length of 6 (ex. '202105') signifies monthly object
    } else if (id.length === 6) {
      return this.Stores.MONTHLY;

    // ID that doesn't start with any special letter (ex. 'B' or 'L') and has
    // length of 4 (ex. '2021') signifies yearly object
    } else {
      return this.Stores.YEARLY;
    }

    // will need to add checks for section IDs, widget IDs, etc. when we implement those objects
  }

  // ------------------------------------ End Helper Functions ------------------------------------

  // --------------------------------- Start Read/Write Functions ---------------------------------

  /**
   * This function retrieves a single JSON object with the given ID in the database. It first uses the format of
   * the given object ID to determine what type of object (ex. bullet, daily, monthly, yearly, etc) is being
   * retrieved. It then makes an asynchronous call to IndexedDB's get function on the appropriate object store
   * to retrieve the desired object, and then passes the retrieved object to the given callback function if the
   * retrieval operation succeeded, or passes null to the given callback if the retrieval operation failed. In
   * addition to the retrieved object, other parameters (specified by varArgs) are also passed to the callback
   * function.
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
        // call helper function to identify what type of object we are looking for, which determines what object
        // store the object comes from
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
   * This function retrieves a single JSON object with the given ID in the database. It first uses the format of
   * the given object ID to determine what type of object (ex. bullet, daily, monthly, yearly, etc) is being
   * stored. It then makes an asynchronous call to IndexedDB's put function on the appropriate object store
   * to store the desired object, and then passes a boolean (true if the operation succeeds or false if the operation
   * fails) to the given callback function. In addition to the retrieved object, other parameters (specified by varArgs)
   * are also passed to the callback function.
   *
   * @static
   * @param {string} id - The unique string ID that was used as the object's key in the database
   * @param {Object} dataObject - The object (JSON format) to be stored
   * @param {?storeCallback} [callback=null] - Callback function that is run after the database transaction
   * completes (if no callback is provided, nothing is run after the transaction is complete)
   * @param {...*} varArgs - Additional arguments that are passed into callback function (in order) along with
   * a boolean representing the success/failure result of the transaction (which is passed as the first argument
   * to the callback)
   */
  static store (id, dataObject, callback = null, ...varArgs) {
    this.openDatabase(function (db) {
      if (db != null) {
        // call helper function to identify what type of object we are looking for, which determines what object store
        // the object comes from
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
   * fails) to the given callback function. In addition to the retrieved object, other parameters (specified by
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
        // call helper function to identify what type of object we are looking for, which determines what object store
        // the object comes from
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

  // ---------------------------------- End Read/Write Functions ----------------------------------
} // end class Database
