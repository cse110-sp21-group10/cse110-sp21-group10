export class IDConverter {
  /**
   * this function is a helper function that is used to determine the date for a given id. the function
   * parses the given id to determine the year, month, and date, and returns a corresponding date object.
   *
   * @param {string} id - the daily id (with the format 'd yymmdd') to parse
   * @returns {date} a date object representing the date determined by the id
   */
  static getDateFromID (id) {
    // parse year, month, date
    const year = Number(id.substring(2, 4)) + 2000;
    const month = Number(id.substring(4, 6)) - 1;
    const date = Number(id.substring(6, 8));

    return new Date(year, month, date);
  }

  /**
   * This function is a helper function that is used to determine the day of the week for a given date.
   * The function takes a Date object, then retrieves and converts the day-of-week integer representation
   * into the corresponding string (English) format.
   *
   * @param {Date} dateObj - The Date object from which to retrieve day-of-week
   * @returns {string} The day of the week, as a string
   */
  static getDayFromDate (dateObj) {
    const dayIndex = dateObj.getDay();
    // convert 0-6 to Sunday-Saturday
    switch (dayIndex) {
      case 0:
        return 'Sunday';
      case 1:
        return 'Monday';
      case 2:
        return 'Tuesday';
      case 3:
        return 'Wednesday';
      case 4:
        return 'Thursday';
      case 5:
        return 'Friday';
      case 6:
        return 'Saturday';
    }
  }

  /**
   * This function is a helper function that is used to determine the month for a given date.
   * The function takes a Date object, then retrieves and converts the month integer
   * representation into the corresponding string (English) format.
   *
   * @param {Date} dateObj - The Date object from which to retrieve month
   * @returns {string} The month, as a string
   */
  static getMonthFromDate (dateObj) {
    const monthIndex = dateObj.getMonth();
    // convert 0-11 to January-December
    switch (monthIndex) {
      case 0:
        return 'January';
      case 1:
        return 'February';
      case 2:
        return 'March';
      case 3:
        return 'April';
      case 4:
        return 'May';
      case 5:
        return 'June';
      case 6:
        return 'July';
      case 7:
        return 'August';
      case 8:
        return 'September';
      case 9:
        return 'October';
      case 10:
        return 'November';
      case 11:
        return 'December';
    }
  }

  /**
   * This function is a helper function that is used to determine the suffix for a given
   * date based on how it would be read. The function takes a Date object, then retrieves
   * the date integer and determines the suffix for the date integer that should be
   * displayed. <p>
   *
   * date integer ending in 1 -> suffix 'st' <p>
   * date integer ending in 2 -> suffix 'nd' <p>
   * date integer ending in 3 -> suffix 'rd' <p>
   * date integer ending in 0 or 4-9 -> suffix 'th' <p>
   * special cases: date integers 11, 12, and 13 -> suffix 'th'
   *
   * @param {Date} dateObj - The Date object from which to retrieve the date and determine its suffix
   * @returns {string} The suffix ('st', 'nd', 'rd', 'th') corresponding to the date integer
   */
  static getSuffixOfDate (dateObj) {
    const date = dateObj.getDate();

    // possible suffixes
    const ST = 'st';
    const ND = 'nd';
    const RD = 'rd';
    const TH = 'th';

    /*
      11, 12, 13 are special 'th'
      for all other ones digits:
      1 -> 'st'
      2 -> 'nd'
      3 -> 'rd'
      0, 4-9 -> 'th'
      (no need to address any number greater than 31 because there are at most 31 days in a month)
    */
    if (date === 11 || date === 12 || date === 13) {
      return TH;
    } else if (date % 10 === 1) {
      return ST;
    } else if (date % 10 === 2) {
      return ND;
    } else if (date % 10 === 3) {
      return RD;
    } else {
      return TH;
    }
  }

  /**
   * This function is a helper function to convert an ID number into the right string format.
   * IDs for our objects are stored as strings, and if the number is less than 10, the string
   * representation we use has a 0 in front of the number. For example a section number 1 would
   * have an ID of '01'.
   *
   * @param {number} num - the integer that is being stringified
   * @returns {string} a string representation of the number that can be used in object IDs
   */
  static stringifyNum (num) {
    if (num < 10) {
      return `0${num}`;
    }
    return `${num}`;
  }

  /**
 * Uses date to generate the correct ID for the given object type <p>
 *
 * Creates 2-digit YY, MM, and DD from currDate variables to use in ID generation <p>
 *
 * Figures out which ID format to generate based off type and generates correct ID
 * (refer to Design Notes and data models for examples of ID formats)
 *
 * @param {string} type - Type of data object to generate ID for
 * @param {Date} date - The date to generate the ID for
 * @returns {string} The objects ID
 *
 */
  static generateID (type, date) {
    let day = date.getDate();
    day = (day < 10 ? '0' : '') + day;
    let month = date.getMonth() + 1;
    month = (month < 10 ? '0' : '') + month;
    const year = date.getFullYear() % 100;

    switch (type) {
      case 'day':
        return `D ${year}${month}${day}`;
      case 'month':
        return `M ${year}${month}`;
      case 'year':
        return `Y ${year}`;
      default:
        console.error(`No implementation yet for generating ${type} IDs`);
    }
  }

  /**
   * Generates the index for where given ID should be located in sorted array of IDs <p>
   *
   * Uses binary search for O(log n) runtime, and performs a dual function of both
   * looking up indices for existing IDs as well as deciding where new IDs would be
   * inserted to maintain the sorted structure
   *
   * @param {Array.<string>} entries - dayIDs of current entries
   * @param {string} ID - dayID to either lookup or add to entries
   * @returns {Number} index that ID belongs in list
   */
  static generateIndex (entries, ID) {
    let low = 0;
    let high = entries.length;

    while (low < high) {
      const mid = low + high >>> 1;
      if (entries[mid] < ID) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }

    return low;
  }
}
