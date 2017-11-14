({
	// ISO 8601 date format (YYYY-MM-DD)
	FORMAT_ISO_8601: 'yyyy-MM-dd',

	/**
	 * Returns true if the application running on a desktop browser. This method uses the $Browser
	 * global variable to get the device type
	 *
	 * @return {boolean} true if the application is running on a desktop browser or false if it is
	 *                   running on a phone or tablet
	 */
	isDesktop: function() {
		var formFactor = $A.get('$Browser.formFactor');
		return (formFactor === 'DESKTOP');
	},

	/**
	 * Returns true if the application is running on a phone or a table. This method will always
	 * return the opposite of isDesktop()
	 *
	 * @return {boolean} true if the application is running on a phone or a table; otherwise, false
	 */
	isMobile: function() {
		return !this.isDesktop();
	},

	/**
	 * Returns true if the value is undefined; otherwise, false
	 *
	 * @param {*} value - the value to check
	 *
	 * @return {boolean} true if the value is undefined; otherwise, false
	 */
	isUndefined: function(value) {
		return (typeof value === 'undefined');
	},

	/**
	 * Returns true if the value is null; otherwise, false
	 *
	 * @param {*} value - the value to check
	 *
	 * @return {boolean} true if the value is null; otherwise, false
	 */
	isNull: function(value) {
		return (value === null);
	},

	/**
	 * Returns true if the value is undefined or null; otherwise, false
	 *
	 * @param {*} value - the value to check
	 *
	 * @return {boolean} true if the value is undefined or null; otherwise, false
	 */
	isUndefinedOrNull: function(value) {
		return this.isUndefined(value) || this.isNull(value);
	},

	/**
	 * Returns true if the value is a boolean; otherwise, false
	 *
	 * @param {*} value - the value to check
	 *
	 * @return {boolean} true if the value is a boolean; otherwise, false
	 */
	isBoolean: function(value) {
		return (typeof value === 'boolean');
	},

	/**
	 * Returns true if the value is a number; otherwise, false
	 *
	 * @param {*} value - the value to check
	 *
	 * @return {boolean} true if the value is a number; otherwise, false
	 */
	isNumber: function(value) {
		return (typeof value === 'number') && isFinite(value);
	},

	/**
	 * Returns true if the value is an integer; otherwise, false
	 *
	 * @param {*} value - the value to check
	 *
	 * @return {boolean} true if the value is an integer; otherwise, false
	 */
	isInteger: function(value) {
		return this.isNumber(value) && (this.trunc(value) === value);
	},

	/**
	 * Returns true if the value is a string; otherwise, false
	 *
	 * @param {*} value - the value to check
	 *
	 * @return {boolean} true if the value is a string; otherwise, false
	 */
	isString: function(value) {
		return (typeof value === 'string');
	},

	/**
	 * Returns true if the value is a date; otherwise, false
	 *
	 * @param {*} value - the value to check
	 *
	 * @return {boolean} true if the value is a date; otherwise, false
	 */
	isDate: function(value) {
		return (Object.prototype.toString.call(value) === '[object Date]');
	},

	/**
	 * Returns true if the value is an array; otherwise, false
	 *
	 * @param {*} value - the value to check
	 *
	 * @return {boolean} true if the value is an array; otherwise, false
	 */
	isArray: function(value) {
		if (Array.isArray) {
			return Array.isArray(value);
		}
		return (Object.prototype.toString.call(value) === '[object Array]');
	},

	/**
	 * Returns true if the value is an object; otherwise, false. This method does not consider the
	 * following types as objects even though the typeof operator returns "object": null, Array,
	 * Date
	 *
	 * @param {*} value - the value to check
	 *
	 * @return {boolean} true if the value is an object; otherwise, false
	 */
	isObject: function(value) {
		return (
			(typeof value === 'object')
			&& !this.isNull(value)
			&& !this.isDate(value)
			&& !this.isArray(value)
		);
	},

	/**
	 * Returns true if the value is a function; otherwise, false
	 *
	 * @param {*} value - the value to check
	 *
	 * @return {boolean} true if the value is a function; otherwise, false
	 */
	isFunction: function(value) {
		return (typeof value === 'function');
	},

	/**
	 * Returns true if the value is empty; otherwise, false. This method considers the following
	 * values as empty: undefined, null, arrays with a length of 0, empty strings, objects with no
	 * keys
	 *
	 * @param {*} value - the value to check
	 *
	 * @return {boolean} true if the value is empty; otherwise, false
	 */
	isEmpty: function(value) {
		if (this.isUndefinedOrNull(value)) {
			return true;
		}

		if (this.isString(value) || this.isArray(value)) {
			return (value.length === 0);
		}

		if (this.isObject(value)) {
			for (var key in value) {
				return false;
			}
			return true;
		}

		return false;
	},

	/**
	 * Returns true if the value is an empty string; otherwise, false. This method differs from
	 * isEmpty() in a couple of important ways. First, it only works with strings. If value is not
	 * a string then the method will always return false. Second, it returns true if the string
	 * contains only white space characters whereas isEmpty() returns true only if the string's
	 * length is 0. In short, if isEmpty() returns true then isBlank() will return true,  but the
	 * reverse is not always true. Calling isEmpty() with the string " " will return false, but
	 * isEmpty() will return true
	 *
	 * @param {*} value - the value to check
	 *
	 * @return {boolean} true if the value is a blank string; otherwise, false
	 */
	isBlank: function(value) {
		if (this.isString(value)) {
			value = this.trim(value);
			return (value.length === 0);
		}

		return false;
	},

	/**
	 * Returns the value as a boolean. This method contains special logic for converting strings.
	 * The following strings are converted to true: "y", "yes", "t", "true" - case does not matter
	 *
	 * @param {*} value - the value to convert
	 *
	 * @return {boolean} the boolean value
	 */
	asBoolean: function(value) {
		if (this.isString(value)) {
			value = value.toLowerCase();
			return [ 'y', 'yes', 't', 'true' ].indexOf(value) >= 0;
		}

		return Boolean(value);
	},

	/**
	 * Returns the value as a number. This method contains special logic for converting strings.
	 * This method can handle strings which contain special characters such as commas, exponentials
	 * (e.g. "e+8"), and multiplier shortcuts at the end of the string (e.g. "20k", "1.5m", etc.)
	 *
	 * @param {*} value - the value to convert
	 *
	 * @return {number} the number value
	 */
	asNumber: function(value) {
		if ((typeof value === 'number') && !isFinite(value)) {
			return NaN;
		}

		if (this.isString(value)) {
			value = this.trim(value);
			value = value.replace(/,/g, '');

			var multiplier = 1;
			var multipliers = { 'k': 1000, 'm': 1000000, 'b': 1000000000, 't': 1000000000000 };
			for (var key in multipliers) {
				if (this.endsWithIgnoreCase(value, key)) {
					multiplier = multipliers[key];
					value = value.substr(0, value.length - key.length);
					break;
				}
			}

			var pattern = /^[-+]?\d+(?:\.\d*)?(?:e[-+]?\d+)?$/i;
			if (!pattern.test(value)) {
				return NaN;
			}

			value = parseFloat(value);
			if (!this.isNumber(value)) {
				return NaN;
			}

			return value * multiplier;
		}

		return Number(value);
	},

	/**
	 * Returns the value as an integer. This method uses the same logic for converting strings as
	 * asNumber(). The key difference between asNumber() and asInteger() is that the latter drops
	 * any digits after the decimal
	 *
	 * @see  asNumber
	 *
	 * @param {*} value - the value to convert
	 *
	 * @return {number} the integer value
	 */
	asInteger: function(value) {
		return this.trunc(this.asNumber(value));
	},

	/**
	 * Returns the value as a string. Undefined and null are converted to an empty string
	 *
	 * @param {*} value - the value to convert
	 *
	 * @return {string} the string value
	 */
	asString: function(value) {
		if (this.isUndefinedOrNull(value)) {
			return '';
		}

		if ((typeof value === 'number') && !isFinite(value)) {
			return '';
		}

		if (!this.isString(value)) {
			return String(value);
		}

		return value;
	},

	/**
	 * Returns the value as a date. This method contains special logic for converting strings. If
	 * value is a string then this method attempts to parse the date using
	 * $A.localizationService.parseDateTime()
	 *
	 * @param {*} value - the value to convert
	 *
	 * @return {Date} the date value
	 */
	asDate: function(value) {
		if (this.isUndefinedOrNull(value)) {
			return undefined;
		}

		if (this.isDate(value)) {
			return value;
		}

		if (this.isNumber(value)) {
			return new Date(value);
		}

		value = this.trim(value);
		if (value) {
			try {
				value = $A.localizationService.parseDateTime(value);
				if (this.isNull(value)) {
					value = undefined;
				}
				return value;
			} catch (e) {
			}
		}

		return undefined;
	},

	/**
	 * Returns the possible range of values given a precision and scale
	 *
	 * @param {number} precision - the total number of digits in the number
	 * @param {number} scale     - the number of digits to the right of the decimal
	 *
	 * @return {Object} an object containing the min and max values
	 */
	range: function(precision, scale) {
		var max = (Math.pow(10, precision) - 1) / Math.pow(10, scale);
		var min = -max;
		return {
			min: min,
			max: max
		};
	},

	/**
	 * Ensures that a number is within a given range. If value is less than min then min is
	 * returned. If value is greater than max then max is returned. Otherwise, value is returned.
	 *
	 * @param {number} value - the value
	 * @param {number} min   - the minimimum value or undefined if there is no minimum
	 * @param {number} max   - the maximium value or undefined if there is no maximum
	 *
	 * @return {number} the value
	 */
	minmax: function(value, min, max) {
		if (!this.isNumber(value)) {
			return NaN;
		}

		if (!this.isUndefined(min)) {
			if (!this.isNumber(min)) {
				return NaN;
			} else {
				value = Math.max(value, min);
			}
		}

		if (!this.isUndefined(max)) {
			if (!this.isNumber(max)) {
				return NaN;
			} else if (this.isUndefined(min) || (max > min)) {
				value = Math.min(value, max);
			}
		}

		return value;
	},

	/**
	 * Returns the number of digits to the right of the decimal. If value is a number then it is
	 * first converted to a string which will drop any trailing 0s. If value is already a string
	 * then this will not happen. As an example, calling this method with the number 9.900 will
	 * return 1 whereas calling it with the string "9.900" will return 3
	 *
	 * @param {number|string} value - the value to check
	 *
	 * @return {number} the number of digits to the right of the decimal
	 */
	scale: function(value) {
		var match = ('' + value).match(/(?:\.(\d+))?(?:e([-+]?\d+))?$/i);
		if (!match) {
			return 0;
		}

		return Math.max(
			0,
			(match[1] ? match[1].length : 0) - (match[2] ? +match[2] : 0)
		);
	},

	/**
	 * Returns the integer part of a number by removing any fractional digits
	 *
	 * @param {number} value - a number
	 *
	 * @return {number} the integer part of the given number
	 */
	trunc: function(value) {
		if (Math.trunc) {
			return Math.trunc(value);
		}
		var x = value;
		var n = x - (x % 1);
		return (n === 0) && (x < 0 || (x === 0 && (1 / x !== 1 / 0))) ? -0 : n;
	},

	/**
	 * Escapes special regular expression characters
	 *
	 * @param {string} value - the string to escape
	 *
	 * @return {string} the escaped string
	 */
	escapeRegExp: function(value) {
		return this.asString(value).replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
	},

	/**
	 * Removes leading and trailing white space. If value is not a string it will be converted.
	 * Undefined and null will be converted to an empty string
	 *
	 * @param {*} value - the value to trim
	 *
	 * @return {string} the trimmed string
	 */
	trim: function(value) {
		value = this.asString(value);

		if (value.trim) {
			value = value.trim();
		} else {
			value = value.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
		}

		return value;
	},

	/**
	 * Returns a formatted number. If value is not a number then an empty string is returned
	 *
	 * @param {number} value         - the number to format
	 * @param {number} [scale]       - the number of digits to display to the right of the decimal
	 * @param {string} [thousands=,] - the thousands separator
	 * @param {string} [decimal=.]   - the decimal
	 *
	 * @return {string} the formatted number
	 */
	formatNumber: function(value, scale, thousands, decimal) {
		if (!this.isNumber(value)) {
			return '';
		}

		if (!this.isNumber(scale)) {
			scale = this.scale(value);
		}

		if (this.isUndefinedOrNull(thousands)) {
			thousands = ',';
		} else {
			thousands = this.asString(thousands);
		}

		decimal = this.asString(decimal);
		if (decimal === '') {
			decimal = '.';
		}

		var negative = (value < 0) ? '-' : '',
			i = parseInt(value = Math.abs(+value || 0).toFixed(scale), 10) + '',
			j = ((j = i.length) > 3) ? (j % 3) : 0;

		return negative +
			(j ? i.substr(0, j) + thousands : '') +
			i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands) +
			(scale ? decimal + Math.abs(value - i).toFixed(scale).slice(2) : '');
	},

	/**
	 * Returns a formatted date. If value is not a date then an empty string is returned. This
	 * method uses $A.localizationService.formatDateTime() to format the date
	 *
	 * @param {Date}   value               - the date to format
	 * @param {string} [format=yyyy-MM-dd] - the format to use
	 *
	 * @return {string} the formatted date
	 */
	formatDate: function(value, format) {
		if (!this.isDate(value)) {
			return '';
		}

		format = this.asString(format);
		if (this.isBlank(format)) {
			format = this.FORMAT_ISO_8601;
		}

		var formattedDate = $A.localizationService.formatDateTime(value, format);
		return formattedDate;
	},

	/**
	 * The startsWith() method determines whether a string begins with the characters of a specified
	 * string, returning true or false as appropriate. This method uses the native
	 * String.protottype.startsWith() if available
	 *
	 * @param {string} value        - the string to search
	 * @param {string} searchString - the characters to be searched for at the start of value
	 * @param {number} position     - the position in value at which to begin searching for
	 *                                searchString; defaults to 0
	 *
	 * @return {boolean} true if the given characters are found at the beginning of the string;
	 *                   otherwise, false
	 */
	startsWith: function(value, searchString, position) {
		if (String.prototype.startsWith) {
			return String.prototype.startsWith.call(value, searchString, position);
		}

		value = this.asString(value);

		if (this.isUndefinedOrNull(searchString)) {
			return false;
		}

		searchString = this.asString(searchString);
		if (searchString === '') {
			return true;
		}

		return value.substr(position || 0, searchString.length) === searchString;
	},

	/**
	 * Case-insensitive version of startsWith()
	 *
	 * @see startsWith
	 *
	 * @param {string} value        - the string to search
	 * @param {string} searchString - the characters to be searched for at the start of value
	 * @param {number} [position=0] - the position in value at which to begin searching for
	 *                                searchString; defaults to 0
	 *
	 * @return {boolean} true if the given characters are found at the beginning of the string;
	 *                   otherwise, false
	 */
	startsWithIgnoreCase: function(value, searchString, position) {
		value = this.asString(value).toLowerCase();
		if (!this.isUndefinedOrNull(searchString)) {
			searchString = this.asString(searchString).toLowerCase();
		}
		return this.startsWith(value, searchString, position);
	},

	/**
	 * The endsWith() method determines whether a string ends with the characters of a specified
	 * string, returning true or false as appropriate. This method uses the native
	 * String.prototype.endsWith if it is available
	 *
	 * @param {string} value        - the string to search
	 * @param {string} searchString - the characters to be searched for at the end of value
	 * @param {number} [length]     - if provided overwrites the considered length of the string to
	 *                                search in. If omitted, the default value is the length of the
	 *                                string
	 *
	 * @return {boolean} true if the given characters are found at the end of the string; otherwise,
	 *                   false
	 */
	endsWith: function(value, searchString, length) {
		if (String.prototype.endsWith) {
			return String.prototype.endsWith.call(value, searchString, length);
		}

		value = this.asString(value);

		if (this.isUndefinedOrNull(searchString)) {
			return false;
		}

		searchString = this.asString(searchString);
		if (searchString === '') {
			return true;
		}

		if (!(length < value.length)) {
			length = value.length;
		} else {
			length |= 0;
		}

		var startIndex = length - searchString.length;
		return value.substr(startIndex, searchString.length) === searchString;
	},

	/**
	 * Case-insensitive version of endsWith()
	 *
	 * @see endsWith
	 *
	 * @param {string} value        - the string to search
	 * @param {string} searchString - the characters to be searched for at the end of value
	 * @param {number} [length]     - if provided overwrites the considered length of the string to
	 *                                search in. If omitted, the default value is the length of the
	 *                                string
	 *
	 * @return {boolean} true if the given characters are found at the end of the string; otherwise,
	 *                   false
	 */
	endsWithIgnoreCase: function(value, searchString, length) {
		value = this.asString(value).toLowerCase();
		if (!this.isUndefinedOrNull(searchString)) {
			searchString = this.asString(searchString).toLowerCase();
		}
		return this.endsWith(value, searchString, length);
	},

	/**
	 * Returns the first day of the specified month
	 *
	 * @param {number} year  - the year
	 * @param {month}  month - the month
	 *
	 * @return {Date} the first day of the specified month
	 */
	firstDayOfMonth: function(year, month) {
		if (!this.isNumber(year) || !this.isNumber(month)) {
			return undefined;
		}

		year = this.asInteger(year);
		month = this.asInteger(month);
		if ((year < 0) || (month < 0) || (month > 11)) {
			return undefined;
		}

		return new Date(year, month, 1);
	},

	/**
	 * Returns the last day of the specified month
	 *
	 * @param {number} year  - the year
	 * @param {number} month - the month
	 *
	 * @return {Date} the last day of the specified month
	 */
	lastDayOfMonth: function(year, month) {
		if (!this.isNumber(year) || !this.isNumber(month)) {
			return undefined;
		}

		year = this.asInteger(year);
		month = this.asInteger(month);
		if ((year < 0) || (month < 0) || (month > 11)) {
			return undefined;
		}

		month++;
		if (month > 11) {
			year++;
			month = 0;
		}

		var date = this.firstDayOfMonth(year, month);
		return this.addDays(date, -1);
	},

	/**
	 * Adds a specified number of days to a date. Use a negative value for count to subtract that
	 * number of days
	 *
	 * @param {Date}   date  - the date
	 * @param {number} count - the number of days to add
	 *
	 * @return {Date} a date
	 */
	addDays: function(date, count) {
		if (!this.isDate(date)) {
			return undefined;
		}

		if (!this.isNumber(count)) {
			return undefined;
		}

		count = this.asInteger(count);
		if (count === 0) {
			return date;
		}

		var result = new Date(date);
		result.setDate(result.getDate() + count);
		return result;
	},

	/**
	 * Adds a specified number of months to a date. Use a negative value for count to subtract
	 * that number of months
	 *
	 * @param {Date}   date  - the date
	 * @param {number} count - the number of months to add
	 *
	 * @return {Date} a date
	 */
	addMonths: function(date, count) {
		if (!this.isDate(date)) {
			return undefined;
		}

		if (!this.isNumber(count)) {
			return date;
		}

		count = this.asInteger(count);
		if (count === 0) {
			return date;
		}

		var year = date.getFullYear();
		var month = date.getMonth();
		var day = date.getDate();

		year += (count - (count % 12)) / 12;
		month += (count % 12);
		if (month > 11) {
			year++;
			month = 0;
		} else if (month < 0) {
			year--;
			month = 11;
		}

		var result;
		var lastDay = this.lastDayOfMonth(year, month);
		if (day > lastDay.getDate()) {
			result = lastDay;
		} else {
			result = new Date(year, month, day);
		}

		return result;
	},

	/**
	 * Adds a specified number of years to a date. Use a negative value for count to subtract that
	 * number of years
	 *
	 * @param {Date}   date  - the date
	 * @param {number} count - the number of years to add
	 *
	 * @return {Date} a date
	 */
	addYears: function(date, count) {
		if (!this.isDate(date)) {
			return undefined;
		}

		if (!this.isNumber(count)) {
			return date;
		}

		count = this.asInteger(count);
		if (count === 0) {
			return date;
		}

		var year = date.getFullYear();
		var month = date.getMonth();
		var day = date.getDate();

		year += count;

		var result;
		var lastDay = this.lastDayOfMonth(year, month);
		if (day > lastDay.getDate()) {
			result = lastDay;
		} else {
			result = new Date(year, month, day);
		}

		return result;
	},

	/**
	 * Returns the number of days between two dates
	 *
	 * @param {Date} date1 - the first date
	 * @param {Date} date2 - the second date
	 *
	 * @return {number} the number of days between the dates
	 */
	daysBetween: function(date1, date2) {
		if (!this.isDate(date1) || !this.isDate(date2)) {
			return 0;
		}

		var millisecondsPerDay = 24 * 60 * 60 * 1000;
		var days = (this.treatAsUTC(date2) - this.treatAsUTC(date1)) / millisecondsPerDay;
		return days;
	},

	/**
	 * Returns true if two dates represent the same day
	 *
	 * @param {Date} date1 - the first date
	 * @param {Date} date2 - the second date
	 *
	 * @return {boolean} true if the two dates represent the same day
	 */
	sameDay: function(date1, date2) {
		if (!this.isDate(date1) || !this.isDate(date2)) {
			return false;
		}

		var same = $A.localizationService.isSame(date1, date2, 'day');
		return same;
	},

	/**
	 * Treat a date like a UTC date without actually converting it. Useful in certain calculations
	 *
	 * @param {Date} date - the date
	 *
	 * @return {Date} the date adjusted by its timezone offset
	 */
	treatAsUTC: function(date) {
		var result = new Date(date);
		result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
		return result;
	}
})