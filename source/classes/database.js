/**
 * This class contains a suite of functions that can be used to interact with our app's IndexedDB
 * database. The functions allow for storage and retrieval of bullet, label, daily, monthly, and
 * yearly JSON objects, as well as deletion of bullet and label JSON objects.
 *
 * @classdesc
 * @example <caption>Example usage of Database class</caption>
 * // this would create a new Database object, open the IndexedDB database, and store a daily object once the database is open
 * let database = new Database();
 * database.open(function (opened) {
 *   if (opened === true) {
 *     database.storeDay('20210519', {'test': 'test database storage'}, function (stored) {
 *       if (stored === true) {
 *         console.log('finished storing daily object');
 *       }
 *       else {
 *         console.log('could not store daily object');
 *       }
 *     });
 *   }
 *   else {
 *     console.log('could not open database');
 *   }
 * });
 * @property {string} DATABASE_NAME - The name ('BulletJournal') of the IndexedDB database used by our app
 */
export class Database {
  /**
   * Constructs the database with the appropriate database name for the application.
   *
   * @constructor
   */
  constructor () {
    this.DATABASE_NAME = 'BulletJournal';
  }

  // ---------------------- Start Documentation For Callback Functions --------------------------

  /**
   * Callback function that is run after the database is opened and ready for transactions.
   *
   * @callback openCallback
   * @param {boolean} transactionResult - True if the database open operation succeeded; false if it failed
   */

  /**
   * Callback for success/failure functionality after a storage transaction. Only needed if success and failure
   * conditions must be treated appropriately. If the transaction succeeded, true will be passed as the parameter
   * to this function. Otherwise, false will be passed as the parameter to this function.
   *
   * @callback storeCallback
   * @param {boolean} transactionResult - True if the storage transaction succeeded; false if it failed
   */

  /**
   * Callback for data retrieval. This callback must be specified to have access to the data retrieved from
   * the database request. If the transaction succeeded, the retrieved object will be passed as the parameter
   * to this function. Otherwise, null will be passed as the parameter to this function.
   *
   * @callback getCallback
   * @param {Object} data - The data that is retrieved from the object store if the get transaction succeeded;
   * null if it failed
   */

  /**
   * Callback for success/failure functionality after a deletion transaction. Only needed if success and failure
   * conditions must be treated appropriately. If the transaction succeeded, true will be passed as the parameter
   * to this function. Otherwise, false will be passed as the parameter to this function.
   *
   * @callback deleteCallback
   * @param {boolean} transactionResult - True if the delete transaction succeeded; false if it failed
   */

  // ---------------------- End Documentation For Callback Functions ----------------------------

  // ----------------------------- Start General DB Functions -----------------------------------

  /**
   * This function opens the IndexedDB database in order to allow for transactions to be run on the
   * database. It makes an asynchronous call to IndexedDB's open function with the constant database
   * name 'BulletJournal' and creates the appropriate object stores if the database doesn't yet exist.
   * It then runs the given callback function with a true/false parameter based on whether or
   * not the open operation succeeded.
   *
   * @param {?openCallback} [callback=null] - Callback function that is run after the database open
   * operation completes (if no callback is provided, nothing is run after the transaction is complete)
   */
  open (callback = null) {
    // opens database (async)
    const dbOpenRequest = indexedDB.open(this.DATABASE_NAME, 1);

    const obj = this; // used to maintain reference to this object

    // called when database is first created (then never called again)
    dbOpenRequest.onupgradeneeded = function (event) {
      // adds empty object stores to the empty database
      const db = dbOpenRequest.result;
      db.createObjectStore('bullets');
      db.createObjectStore('daily');
      db.createObjectStore('monthly');
      db.createObjectStore('yearly');
      db.createObjectStore('labels');

      console.log('created database'); // console logging
    };

    // called when database is opened and ready for read/write operations
    dbOpenRequest.onsuccess = function (event) {
      console.log('opened database'); // console logging
      obj.db = dbOpenRequest.result;
      if (callback != null) {
        callback(true); // callback can use this class's functions for r/w
      }
    };

    // called when database open operation fails (database can't be opened for transactions)
    dbOpenRequest.onerror = function (event) {
      if (callback != null) {
        callback(false); // callback can use this class's functions for r/w
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
   * @param {?deleteCallback} [callback=null] - Callback function that is run after the database delete
   * operation completes (if no callback is provided, nothing is run after the transaction is complete)
   */
  deleteDatabase (callback = null) {
    // start request to delete database
    const dbDeleteRequest = indexedDB.deleteDatabase(this.DATABASE_NAME);

    // called when database is deleted
    dbDeleteRequest.onsuccess = function (event) {
      console.log('deleted database'); // console logging
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

  // ------------------------------ End General DB Functions ------------------------------------

  // ---------------------------- Start Bullet Object Functions ---------------------------------

  /**
   * This function stores a single bullet JSON object with a given ID in the database. It makes an
   * asynchronous call to IndexedDB's put function on the 'bullets' object store to store the given
   * object, and then runs the given callback function with a true/false parameter based on whether or
   * not the storage operation succeeded.
   *
   * @param {string} id - The unique string ID that will be used as the object's key in the database
   * @param {Object} bulletObject - The bullet JSON object to be stored
   * @param {?storeCallback} [callback=null] - Callback function that is run after the database
   * transaction completes (if no callback is provided, nothing is run after the transaction is complete)
   */
  storeBullet (id, bulletObject, callback = null) {
    // starts a transaction to put new bullet object
    const transaction = this.db.transaction(['bullets'], 'readwrite');
    const bullets = transaction.objectStore('bullets');
    const putRequest = bullets.put(bulletObject, id);

    // on success and error, call the callback function with true/false
    putRequest.onsuccess = function (event) {
      if (callback != null) {
        callback(true);
      }
    };
    putRequest.onerror = function (event) {
      if (callback != null) {
        callback(false);
      }
    };
  }

  /**
   * This function retrieves a single bullet JSON object with the given ID in the database. It makes an
   * asynchronous call to IndexedDB's get function on the 'bullets' object store to retrieve the desired
   * object, and then passes the retrieved object to the given callback function if the retrieval operation
   * succeeded, or passes null to the given callback if the retrieval operation failed.
   *
   * @param {string} id - The unique string ID that was used as the object's key in the database
   * @param {?getCallback} [callback=null] - Callback function that is run after the database transaction
   * completes (if no callback is provided, nothing is run after the transaction is complete)
   */
  getBullet (id, callback = null) {
    // starts a transaction to get bullet object
    const transaction = this.db.transaction(['bullets'], 'readwrite');
    const bullets = transaction.objectStore('bullets');
    const getRequest = bullets.get(id);

    // on success and error, call the callback function with data/null
    getRequest.onsuccess = function (event) {
      if (callback != null) {
        callback(event.target.result);
      }
    };
    getRequest.onerror = function (event) {
      if (callback != null) {
        callback(null);
      }
    };
  }

  /**
   * This function deletes a single bullet JSON object with the given ID in the database. It makes an
   * asynchronous call to IndexedDB's delete function on the 'bullets' object store to delete the desired
   * object, and then runs the given callback function with a true/false parameter based on whether or
   * not the deletion operation succeeded.
   *
   * @param {string} id - The unique string ID that was used as the object's key in the database
   * @param {?deleteCallback} [callback=null] - Callback function that is run after the database transaction
   * completes (if no callback is provided, nothing is run after the transaction is complete)
   */
  deleteBullet (id, callback = null) {
    // starts a transaction to delete bullet object
    const transaction = this.db.transaction(['bullets'], 'readwrite');
    const bullets = transaction.objectStore('bullets');
    const delRequest = bullets.delete(id);

    // on success and error, call the callback function with true/false
    delRequest.onsuccess = function (event) {
      if (callback != null) {
        callback(true);
      }
    };
    delRequest.onerror = function (event) {
      if (callback != null) {
        callback(false);
      }
    };
  }

  // ------------------------------ End Bullet Object Functions ---------------------------------

  // ------------------------------ Start Daily Object Functions --------------------------------

  /**
   * This function stores a single daily JSON object with a given ID in the database. It makes an
   * asynchronous call to IndexedDB's put function on the 'daily' object store to store the given
   * object, and then runs the given callback function with a true/false parameter based on whether or
   * not the storage operation succeeded.
   *
   * @param {string} date - The unique string ID that will be used as the object's key in the database
   * @param {Object} dailyObject - The daily JSON object to be stored
   * @param {?storeCallback} [callback=null] - Callback function that is run after the database
   * transaction completes (if no callback is provided, nothing is run after the transaction is complete)
   */
  storeDay (date, dailyObject, callback = null) {
    // starts a transaction to put new daily object
    const transaction = this.db.transaction(['daily'], 'readwrite');
    const daily = transaction.objectStore('daily');
    const putRequest = daily.put(dailyObject, date);

    // on success and error, call the callback function with true/false
    putRequest.onsuccess = function (event) {
      if (callback != null) {
        callback(true);
      }
    };
    putRequest.onerror = function (event) {
      if (callback != null) {
        callback(false);
      }
    };
  }

  /**
   * This function retrieves a single daily JSON object with the given ID in the database. It makes an
   * asynchronous call to IndexedDB's get function on the 'daily' object store to retrieve the desired
   * object, and then passes the retrieved object to the given callback function if the retrieval operation
   * succeeded, or passes null to the given callback if the retrieval operation failed.
   *
   * @param {string} date - The unique string ID that was used as the object's key in the database
   * @param {?getCallback} [callback=null] - Callback function that is run after the database transaction
   * completes (if no callback is provided, nothing is run after the transaction is complete)
   */
  getDay (date, callback = null) {
    // starts a transaction to get daily object
    const transaction = this.db.transaction(['daily'], 'readonly');
    const daily = transaction.objectStore('daily');
    const getRequest = daily.get(date);

    // on success and error, call the callback function with data/null
    getRequest.onsuccess = function (event) {
      if (callback != null) {
        callback(event.target.result);
      }
    };
    getRequest.onerror = function (event) {
      if (callback != null) {
        callback(null);
      }
    };
  }

  // ------------------------------- End Daily Object Functions ---------------------------------

  // ----------------------------- Start Monthly Object Functions -------------------------------

  /**
   * This function stores a single monthly JSON object with a given ID in the database. It makes an
   * asynchronous call to IndexedDB's put function on the 'monthly' object store to store the given
   * object, and then runs the given callback function with a true/false parameter based on whether or
   * not the storage operation succeeded.
   *
   * @param {string} month - The unique string ID that will be used as the object's key in the database
   * @param {Object} monthlyObject - The monthly JSON object to be stored
   * @param {?storeCallback} [callback=null] - Callback function that is run after the database
   * transaction completes (if no callback is provided, nothing is run after the transaction is complete)
   */
  storeMonth (month, monthlyObject, callback = null) {
    // starts a transaction to put new monthly object
    const transaction = this.db.transaction(['monthly'], 'readwrite');
    const monthly = transaction.objectStore('monthly');
    const putRequest = monthly.put(monthlyObject, month);

    // on success and error, call the callback function with true/false
    putRequest.onsuccess = function (event) {
      if (callback != null) {
        callback(true);
      }
    };
    putRequest.onerror = function (event) {
      if (callback != null) {
        callback(false);
      }
    };
  }

  /**
   * This function retrieves a single monthly JSON object with the given ID in the database. It makes an
   * asynchronous call to IndexedDB's get function on the 'monthly' object store to retrieve the desired
   * object, and then passes the retrieved object to the given callback function if the retrieval operation
   * succeeded, or passes null to the given callback if the retrieval operation failed.
   *
   * @param {string} month - The unique string ID that was used as the object's key in the database
   * @param {?getCallback} [callback=null] - Callback function that is run after the database transaction
   * completes (if no callback is provided, nothing is run after the transaction is complete)
   */
  getMonth (month, callback = null) {
    // starts a transaction to get monthly object
    const transaction = this.db.transaction(['monthly'], 'readonly');
    const monthly = transaction.objectStore('monthly');
    const getRequest = monthly.get(month);

    // on success and error, call the callback function with data/null
    getRequest.onsuccess = function (event) {
      if (callback != null) {
        callback(event.target.result);
      }
    };
    getRequest.onerror = function (event) {
      if (callback != null) {
        callback(null);
      }
    };
  }

  // ----------------------------- End Monthly Object Functions ---------------------------------

  // ----------------------------- Start Yearly Object Functions --------------------------------

  /**
   * This function stores a single yearly JSON object with a given ID in the database. It makes an
   * asynchronous call to IndexedDB's put function on the 'yearly' object store to store the given
   * object, and then runs the given callback function with a true/false parameter based on whether or
   * not the storage operation succeeded.
   *
   * @param {string} year - The unique string ID that will be used as the object's key in the database
   * @param {Object} yearlyObject - The yearly JSON object to be stored
   * @param {?storeCallback} [callback=null] - Callback function that is run after the database
   * transaction completes (if no callback is provided, nothing is run after the transaction is complete)
   */
  storeYear (year, yearlyObject, callback = null) {
    // starts a transaction to get put new yearly object
    const transaction = this.db.transaction(['yearly'], 'readwrite');
    const yearly = transaction.objectStore('yearly');
    const putRequest = yearly.put(yearlyObject, year);

    // on success and error, call the callback function with true/false
    putRequest.onsuccess = function (event) {
      if (callback != null) {
        callback(true);
      }
    };
    putRequest.onerror = function (event) {
      if (callback != null) {
        callback(false);
      }
    };
  }

  /**
   * This function retrieves a single yearly JSON object with the given ID in the database. It makes an
   * asynchronous call to IndexedDB's get function on the 'yearly' object store to retrieve the desired
   * object, and then passes the retrieved object to the given callback function if the retrieval operation
   * succeeded, or passes null to the given callback if the retrieval operation failed.
   *
   * @param {string} year - The unique string ID that was used as the object's key in the database
   * @param {?getCallback} [callback=null] - Callback function that is run after the database transaction
   * completes (if no callback is provided, nothing is run after the transaction is complete)
   */
  getYear (year, callback = null) {
    // starts a transaction to get new yearly object
    const transaction = this.db.transaction(['yearly'], 'readonly');
    const yearly = transaction.objectStore('yearly');
    const getRequest = yearly.get(year);

    // on success and error, call the callback function with data/null
    getRequest.onsuccess = function (event) {
      if (callback != null) {
        callback(event.target.result);
      }
    };
    getRequest.onerror = function (event) {
      if (callback != null) {
        callback(null);
      }
    };
  }

  // ------------------------------ End Yearly Object Functions ---------------------------------

  // ------------------------------ Start Label Object Functions --------------------------------

  /**
   * This function stores a single label JSON object with a given ID in the database. It makes an
   * asynchronous call to IndexedDB's put function on the 'labels' object store to store the given
   * object, and then runs the given callback function with a true/false parameter based on whether or
   * not the storage operation succeeded.
   *
   * @param {string} id - The unique string ID that will be used as the object's key in the database
   * @param {Object} labelObject - The label JSON object to be stored
   * @param {?storeCallback} [callback=null] - Callback function that is run after the database
   * transaction completes (if no callback is provided, nothing is run after the transaction is complete)
   */
  storeLabel (id, labelObject, callback = null) {
    // starts a transaction to put new label object
    const transaction = this.db.transaction(['labels'], 'readonly');
    const labels = transaction.objectStore('labels');
    const putRequest = labels.put(labelObject, id);

    // on success and error, call the callback function with true/false
    putRequest.onsuccess = function (event) {
      if (callback != null) {
        callback(true);
      }
    };
    putRequest.onerror = function (event) {
      if (callback != null) {
        callback(false);
      }
    };
  }

  /**
   * This function retrieves a single label JSON object with the given ID in the database. It makes an
   * asynchronous call to IndexedDB's get function on the 'labels' object store to retrieve the desired
   * object, and then passes the retrieved object to the given callback function if the retrieval operation
   * succeeded, or passes null to the given callback if the retrieval operation failed.
   *
   * @param {string} id - The unique string ID that was used as the object's key in the database
   * @param {?getCallback} [callback=null] - Callback function that is run after the database transaction
   * completes (if no callback is provided, nothing is run after the transaction is complete)
   */
  getLabel (id, callback = null) {
    // starts a transaction to get new label object
    const transaction = this.db.transaction(['labels'], 'readwrite');
    const labels = transaction.objectStore('labels');
    const getRequest = labels.get(id);

    // on success and error, call the callback function with data/null
    getRequest.onsuccess = function (event) {
      if (callback != null) {
        callback(event.target.result);
      }
    };
    getRequest.onerror = function (event) {
      if (callback != null) {
        callback(null);
      }
    };
  }

  /**
   * This function deletes a single label JSON object with the given ID in the database. It makes an
   * asynchronous call to IndexedDB's delete function on the 'labels' object store to delete the desired
   * object, and then runs the given callback function with a true/false parameter based on whether or
   * not the deletion operation succeeded.
   *
   * @param {string} id - The unique string ID that was used as the object's key in the database
   * @param {?deleteCallback} [callback=null] - Callback function that is run after the database transaction
   * completes (if no callback is provided, nothing is run after the transaction is complete)
   */
  deleteLabel (id, callback = null) {
    // starts a transaction to delete label object
    const transaction = this.db.transaction(['labels'], 'readwrite');
    const labels = transaction.objectStore('labels');
    const delRequest = labels.delete(id);

    // on success and error, call the callback function with true/false
    delRequest.onsuccess = function (event) {
      if (callback != null) {
        callback(true);
      }
    };
    delRequest.onerror = function (event) {
      if (callback != null) {
        callback(false);
      }
    };
  }

  // ------------------------------ End Label Object Functions ----------------------------------
}
