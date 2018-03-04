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
	 * Returns true if the application is running on a phone
	 *
	 * @return {boolean} true if the application is running on a phone; otherwise, false
	 */
	isPhone: function() {
		return $A.get('$Browser.isPhone');
	},

	/**
	 * Returns true if the application is running on a tablet
	 *
	 * @return {boolean} true if the application is running on a tablet; otherwise, false
	 */
	isTablet: function() {
		return $A.get('$Browser.isTablet');
	},

	/**
	 * Returns true if the application is running on an Android device
	 *
	 * @return {boolean} true if the application is running on an Android device; otherwise, false
	 */
	isAndroid: function() {
		return $A.get('$Browser.isAndroid');
	},

	/**
	 * Returns true if the application is running on an iOS device. Not available in all
	 * implementations. For more information refer to the Lightning Components Developer Guide
	 *
	 * @return {boolean} true if the application is running on an iOS device; otherwise, false
	 */
	isIOS: function() {
		return $A.get('$Browser.isIOS');
	},

	/**
	 * Returns true if the value is undefined; otherwise, false
	 *
	 * @param {*} value - The value to check
	 *
	 * @return {boolean} true if the value is undefined; otherwise, false
	 */
	isUndefined: function(value) {
		return (typeof value === 'undefined');
	},

	/**
	 * Returns true if the value is null; otherwise, false
	 *
	 * @param {*} value - The value to check
	 *
	 * @return {boolean} true if the value is null; otherwise, false
	 */
	isNull: function(value) {
		return (value === null);
	},

	/**
	 * Returns true if the value is undefined or null; otherwise, false
	 *
	 * @param {*} value - The value to check
	 *
	 * @return {boolean} true if the value is undefined or null; otherwise, false
	 */
	isUndefinedOrNull: function(value) {
		return this.isUndefined(value) || this.isNull(value);
	},

	/**
	 * Returns true if the value is a boolean; otherwise, false
	 *
	 * @param {*} value - The value to check
	 *
	 * @return {boolean} true if the value is a boolean; otherwise, false
	 */
	isBoolean: function(value) {
		return (typeof value === 'boolean');
	},

	/**
	 * Returns true if the value is a number; otherwise, false
	 *
	 * @param {*} value - The value to check
	 *
	 * @return {boolean} true if the value is a number; otherwise, false
	 */
	isNumber: function(value) {
		return (typeof value === 'number') && isFinite(value);
	},

	/**
	 * Returns true if the value is an integer; otherwise, false
	 *
	 * @param {*} value - The value to check
	 *
	 * @return {boolean} true if the value is an integer; otherwise, false
	 */
	isInteger: function(value) {
		return this.isNumber(value) && (this.trunc(value) === value);
	},

	/**
	 * Returns true if the value is infinity; otherwise, false
	 *
	 * @param {*} value - The value to check
	 *
	 * @return {boolean} true if the value is infinity; otherwise, false
	 */
	isInfinity: function(value) {
		return (typeof value === 'number') && !isFinite(value);
	},

	/**
	 * Returns true if the value is a string; otherwise, false
	 *
	 * @param {*} value - The value to check
	 *
	 * @return {boolean} true if the value is a string; otherwise, false
	 */
	isString: function(value) {
		return (typeof value === 'string');
	},

	/**
	 * Returns true if the value is a date; otherwise, false
	 *
	 * @param {*} value - The value to check
	 *
	 * @return {boolean} true if the value is a date; otherwise, false
	 */
	isDate: function(value) {
		return (Object.prototype.toString.call(value) === '[object Date]');
	},

	/**
	 * Returns true if the value is an array; otherwise, false
	 *
	 * @param {*} value - The value to check
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
	 * @param {*} value - The value to check
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
	 * @param {*} value - The value to check
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
	 * @param {*} value - The value to check
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
			var keys = this.keys(value);
			return (keys.length === 0);
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
	 * isBlank() will return true
	 *
	 * @param {*} value - The value to check
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
	 * @param {*} value - The value to convert
	 *
	 * @return {boolean} The boolean value
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
	 * @param {*} value - The value to convert
	 *
	 * @return {number} The number value
	 */
	asNumber: function(value) {
		if (this.isUndefinedOrNull(value) || this.isInfinity(value)) {
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
	 * @see asNumber
	 *
	 * @param {*} value - The value to convert
	 *
	 * @return {number} The integer value
	 */
	asInteger: function(value) {
		return this.trunc(this.asNumber(value));
	},

	/**
	 * Returns the value as a string. Undefined and null are converted to an empty string
	 *
	 * @param {*} value - The value to convert
	 *
	 * @return {string} The string value
	 */
	asString: function(value) {
		if (this.isUndefinedOrNull(value) || this.isInfinity(value)) {
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
	 * @param {*} value - The value to convert
	 *
	 * @return {Date} The date value
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
	 * Changes undefined values to null. If value is an array then changeUndefinedToNull() is called
	 * for each element in the array. If value is an object then changeUndefinedToNull() is called
	 * for each property
	 *
	 * The main purpose of this method is to be called on an object before calling JSON.stringify()
	 * to convert it to JSON. This is because JSON.stringify() omits properties with a value of
	 * undefined which can cause problems when sending the data to the server if it expects those
	 * properties to be present
	 *
	 * @param {*} value - The value to check
	 *
	 * @return {*} The original value if it was not undefined; otherwise, null
	 */
	changeUndefinedToNull: function(value) {
		if (this.isUndefined(value)) {
			value = null;
		} else if (this.isArray(value)) {
			for (var i = 0, n = value.length; i < n; i++) {
				value[i] = this.changeUndefinedToNull(value[i]);
			}
		} else if (this.isObject(value)) {
			var keys = this.keys(value);
			for (var i = 0, n = keys.length; i < n; i++) {
				var key = keys[i];
				if (!this.isFunction(value[key])) {
					value[key] = this.changeUndefinedToNull(value[key]);
				}
			}
		}
		return value;
	},

	/**
	 * Merge the contents of two or more objects together into the first object. This code was
	 * shamelessly taken from [jQuery]{@link https://api.jquery.com/jquery.extend/}
	 *
	 * @param {boolean}   [deep=false] - If true, the merge becomes recursive (aka. deep copy)
	 * @param {Object}    [target]     - The object to extend. It will receive the new properties.
	 *                                   If omitted an empty object will be used
	 * @param {Object}    object1      - An object containing additional properties to merge in
	 * @param {...Object} [objectN]    - Additional objects containing properties to merge in
	 *
	 * @return {Object} The extended object
	 */
	extend: function() {
		var target = arguments[0];
		var i = 1, length = arguments.length;
		var deep = false;
		var options, name, src, copy, copyIsObject, copyIsArray, clone;

		// Handle a deep copy situation
		if (this.isBoolean(target)) {
			deep = target;

			target = arguments[i] || {};
			i++;
		} else {
			target = target || {};
		}

		// Handle case when target is a string or something (possible in deep copy)
		if (!this.isObject(target) && !this.isArray(target) && !this.isFunction(target)) {
			target = {};
		}

		// Extend an empty object if only one argument is passed
		if (i === length) {
			target = {};
			i--;
		}

		for (; i < length; i++) {
			options = arguments[i];
			if (options !== null) {
				// Extend the base object
				for (name in options) {
					src = target[name];
					copy = options[name];

					// Prevent never-ending loop
					if (target === copy) {
						continue;
					}

					// Recurse if we're merging plain objects or arrays
					copyIsObject = this.isObject(copy);
					copyIsArray = this.isArray(copy);
					if (deep && copy && (copyIsObject || copyIsArray)) {
						if (copyIsArray) {
							clone = src && this.isArray(src) ? src : [];
						} else {
							clone = src && this.isObject(src) ? src : {};
						}

						// Never move original objects, clone them
						target[name] = this.extend(deep, clone, copy);
					} else if (!this.isUndefined(copy)) {
						// Don't bring in undefined values
						target[name] = copy;
					}
				}
			}
		}

		// Return the modified object
		return target;
	},

	/**
	 * Clones an object or array. If you pass a value that is not an object or array then this
	 * method will simply return that same value unmodified
	 *
	 * @param {Object|Array} value - The object or array to be cloned
	 *
	 * @return {Object|Array} The cloned object or array
	 */
	clone: function(value) {
		if (this.isArray(value)) {
			value = this.extend(true, [], value);
		} else if (this.isObject(value)) {
			value = this.extend(true, {}, value);
		}
		return value;
	},

	/**
	 * Compares two values and returns true if they are equal. Compaison uses strict equality so the
	 * types must also match. The deepEquals() method is useful when comparing arrays or objects.
	 * For arrays deepEquals() is called recursively for each element in the array. For objects
	 * deepEquals() is called for each property in the object
	 *
	 * @param {*} a - The first value to compare
	 * @param {*} b - The second value to compare
	 *
	 * @return {boolean} true if the values are equal; otherwise, false
	 */
	deepEquals: function(a, b) {
		// If the values are the same then just return true immediately
		if (a === b) {
			return true;
		}

		if (this.isArray(a) && this.isArray(b) && (a.length === b.length)) {
			// Compare arrays of equal length
			for (var i = 0, n = a.length; i < n; i++) {
				if (!this.deepEquals(a[i], b[i])) {
					return false;
				}
			}
			return true;
		} else if (this.isObject(a) && this.isObject(b)) {
			// Compare objects
			var keysInA = this.keys(a);
			var keysInB = this.keys(b);
			var keysInBoth = this.distinct(keysInA.concat(keysInB));
			for (var i = 0, n = keysInBoth.length; i < n; i++) {
				var key = keysInBoth[i];
				if (!this.deepEquals(a[key], b[key])) {
					return false;
				}
			}
			return true;
		}

		// If we reach this point then assume the values are not equal
		return false;
	},

	/**
	 * The keys() method returns an array of a given object's own enumerable properties, in the same
	 * order as that provided by a for...in loop (the difference being that a for-in loop enumerates
	 * properties in the prototype chain as well)
	 *
	 * Note that this is a polyfill for Object.keys(). Object.keys() will be used if available
	 *
	 * @param {*} obj - The object of which the enumerable own properties are to be returned
	 *
	 * @return {string[]} An array of strings that represent all the enumerable properties of the
	 *                    given object
	 */
	keys: function(obj) {
		// Must be an object or a function
		if ((typeof obj !== 'function') && ((typeof obj !== 'object') || (obj === null))) {
			throw new TypeError('keys() called on non-object');
		}

		// Use Object.keys() if available
		if (Object.keys) {
			return Object.keys(obj);
		}

		var hasOwnProperty = Object.prototype.hasOwnProperty;
		var hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString');
		var dontEnums = [
			'toString',
			'toLocaleString',
			'valueOf',
			'hasOwnProperty',
			'isPrototypeOf',
			'propertyIsEnumerable',
			'constructor'
		];
		var dontEnumsLength = dontEnums.length;

		var result = [];
		for (var key in o) {
			if (hasOwnProperty.call(o, key)) {
				result.push(key);
			}
		}
		if (hasDontEnumBug) {
			for (var i = 0; i < dontEnumsLength; i++) {
				if (hasOwnProperty.call(o, dontEnums[i])) {
					result.push(dontEnums[i]);
				}
			}
		}
		return result;
	},

	/**
	 * Generates a random number between min (included) and max (excluded)
	 *
	 * @param {number} min - The minimum value
	 * @param {number} max - The maximum value
	 *
	 * @return {number} A random number
	 */
	randomNumber: function(min, max) {
		if (!this.isNumber(min) || !this.isNumber(max)) {
			return NaN;
		}

		if (max < min) {
			var tempValue = min;
			min = max;
			max = tempValue;
		}

		return (Math.random() * (max - min)) + min
	},

	/**
	 * Generates a random integer between min (included) and max (excluded)
	 *
	 * @param {number} min - The minimum value
	 * @param {number} max - The maximum value
	 *
	 * @return {number} A random integer
	 */
	randomInteger: function(min, max) {
		return this.asInteger(this.randomNumber(min, max));
	},

	/**
	 * Returns the possible range of values given a precision and scale
	 *
	 * @param {number} precision - The total number of digits in the number
	 * @param {number} scale     - The number of digits to the right of the decimal
	 *
	 * @return {Object} An object containing the min and max values
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
	 * @param {number} value - The value
	 * @param {number} min   - The minimimum value or undefined if there is no minimum
	 * @param {number} max   - The maximium value or undefined if there is no maximum
	 *
	 * @return {number} The value
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
	 * @param {number|string} value - The value to check
	 *
	 * @return {number} The number of digits to the right of the decimal
	 */
	scale: function(value) {
		var match = this.asString(value).match(/(?:\.(\d+))?(?:e([-+]?\d+))?$/i);
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
	 * @param {number} value - A number
	 *
	 * @return {number} The integer part of the given number
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
	 * @param {string} value - The string to escape
	 *
	 * @return {string} The escaped string
	 */
	escapeRegExp: function(value) {
		return this.asString(value).replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
	},

	/**
	 * Removes leading and trailing white space. If value is not a string it will be converted.
	 * Undefined and null will be converted to an empty string
	 *
	 * @param {*} value - The value to trim
	 *
	 * @return {string} The trimmed string
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
	 * @param {number} value         - The number to format
	 * @param {number} [scale]       - The number of digits to display to the right of the decimal
	 * @param {string} [thousands=,] - The thousands separator
	 * @param {string} [decimal=.]   - The decimal
	 *
	 * @return {string} The formatted number
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
	 * @param {Date}   value               - The date to format
	 * @param {string} [format=yyyy-MM-dd] - The format to use
	 *
	 * @return {string} The formatted date
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
	 * @param {string} value        - The string to search
	 * @param {string} searchString - The characters to be searched for at the start of value
	 * @param {number} [position=0] - The position in value at which to begin searching for
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
	 * @param {string} value        - The string to search
	 * @param {string} searchString - The characters to be searched for at the start of value
	 * @param {number} [position=0] - The position in value at which to begin searching for
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
	 * @param {string} value        - The string to search
	 * @param {string} searchString - The characters to be searched for at the end of value
	 * @param {number} [length]     - If provided overwrites the considered length of the string to
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
	 * @param {string} value        - The string to search
	 * @param {string} searchString - The characters to be searched for at the end of value
	 * @param {number} [length]     - If provided overwrites the considered length of the string to
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
	 * @param {number} year  - The year
	 * @param {month}  month - The month
	 *
	 * @return {Date} The first day of the specified month
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
	 * @param {number} year  - The year
	 * @param {number} month - The month
	 *
	 * @return {Date} The last day of the specified month
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
	 * @param {Date}   date  - The date
	 * @param {number} count - The number of days to add
	 *
	 * @return {Date} A date
	 */
	addDays: function(date, count) {
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

		var result = new Date(date);
		result.setDate(result.getDate() + count);
		return result;
	},

	/**
	 * Adds a specified number of months to a date. Use a negative value for count to subtract
	 * that number of months
	 *
	 * @param {Date}   date  - The date
	 * @param {number} count - The number of months to add
	 *
	 * @return {Date} A date
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
	 * @param {Date}   date  - The date
	 * @param {number} count - The number of years to add
	 *
	 * @return {Date} A date
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
	 * @param {Date} date1 - The first date
	 * @param {Date} date2 - The second date
	 *
	 * @return {number} The number of days between the dates
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
	 * @param {Date} date1 - The first date
	 * @param {Date} date2 - The second date
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
	 * @param {Date} date - The date
	 *
	 * @return {Date} The date adjusted by its timezone offset
	 */
	treatAsUTC: function(date) {
		var result = new Date(date);
		result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
		return result;
	},

	/**
	 * The findIndex() method returns the index of the first element in the array that satisfies
	 * the provided testing function. Otherwise -1 is returned
	 *
	 * @param {Array}    array     - The array to search
	 * @param {Function} predicate - Function to execute on each value in the array
	 * @param {*}        thisArg   - Object to use as this when executing predicate
	 *
	 * @return {*} An index in the array if an element passes the test; otherwise, -1
	 */
	findIndex: function(array, predicate, thisArg) {
		if (!array) {
			throw new TypeError('array is undefined or null');
		}
		if (!this.isFunction(predicate)) {
			throw new TypeError('predicate must be a function');
		}

		var length = array.length;
		for (var i = 0; i < length; i++) {
			if (i in array) {
				var value = array[i];
				if (predicate.call(thisArg, value, i, array)) {
					return i;
				}
			}
		}

		return -1;
	},

	/**
	 * The find() method returns the value of the first element in the array that satisfies the
	 * provided testing function. Otherwise undefined is returned
	 *
	 * @param {Array}    array     - The array to search
	 * @param {Function} predicate - Function to execute on each value in the array
	 * @param {*}        thisArg   - Object to use as this when executing predicate
	 *
	 * @return {*} A value in the array if an element passes the test; otherwise, undefined
	 */
	find: function(array, predicate, thisArg) {
		var index = this.findIndex(array, predicate, thisArg);
		if (index !== -1) {
			return array[index];
		}
		return undefined;
	},

	/**
	 * The filter() method creates a new array with all elements that pass the test implemented by
	 * the provided function
	 *
	 * Note that this is a polyfill for Array.prototype.filter(). Array.prototype.filter() will be
	 * used if available
	 *
	 * @param {Array}    array     - The array to filter
	 * @param {Function} predicate - Function to execute on each value in the array
	 * @param {*}        [thisArg] - Object to use as this when executing predicate
	 *
	 * @return {Array} A new array with the elements that pass the test. If no elements pass the
	 *                 test, an empty array will be returned
	 */
	filter: function(array, predicate, thisArg) {
		if (!array) {
			throw new TypeError('array is undefined or null');
		}
		if (!this.isFunction(predicate)) {
			throw new TypeError('predicate must be a function');
		}

		if (Array.prototype.filter) {
			return array.filter(predicate, thisArg);
		}

		var length = array.length;
		var result = new Array(length);
		var numMatches = 0;

		for (var i = 0; i < length; i++) {
			if (i in array) {
				var match = predicate.call(thisArg, array[i], i, array);
				if (match) {
					result[numMatches++] = array[i];
				}
			}
		}

		result.length = numMatches;
		return result;
	},

	/**
	 * The distinct() method creates a new array containing the unique elements from the source
	 * array
	 *
	 * @param {Array}    array      - The source array
	 * @param {Function} [equality] - Optional function to implement custom equality logic. If a
	 *                                function is not provided then Array.prototype.indexOf() will
	 *                                be used
	 * @param {*}        [thisArg]  - Object to use as this when executing equality
	 *
	 * @return {Array} A new array with the unique elements from the source array
	 */
	distinct: function(array, equality, thisArg) {
		if (!array) {
			throw new TypeError('array is undefined or null');
		}
		if (equality && !this.isFunction(equality)) {
			throw new TypeError('equality must be a function');
		}

		var length = array.length;
		var result = new Array(length);
		var numDistinct = 0;

		for (var i = 0; i < length; i++) {
			if (i in array) {
				var index;
				if (equality) {
					index = this.findIndex(result, function(value) {
						return equality.call(thisArg, array[i], value);
					});
				} else {
					index = result.indexOf(array[i]);
				}

				if (index < 0) {
					result[numDistinct++] = array[i];
				}
			}
		}

		result.length = numDistinct;
		return result;
	}
})