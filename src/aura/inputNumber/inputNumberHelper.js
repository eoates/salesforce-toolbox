({
	minPrecision: 1,
	maxPrecision: 15,
	minScale: 0,
	maxScale: 14,
	multipliers: {
		'K': 1000,
		'M': 1000000,
		'B': 1000000000,
		'T': 1000000000000
	},

	/**
	 * Returns true if the application running on a desktop browser. This method uses the $Browser
	 * global variable to get the device type
	 *
	 * @returns {boolean} true if the application is running on a desktop browser or false if it
	 *                    is running on a phone or tablet
	 */
	isDesktop: function() {
		var formFactor = $A.get('$Browser.formFactor');
		return (formFactor === 'DESKTOP');
	},

	/**
	 * Returns true if the application is running on a phone or a table. This method will always
	 * return the opposite of isDesktop()
	 *
	 * @returns {boolean} true if the application is running on a phone or a table; otherwise, false
	 */
	isMobile: function() {
		return !this.isDesktop();
	},

	/**
	 * Returns true if the value is a number. This method does not treat special NaN or Infinity as
	 * numbers even though they technically are
	 *
	 * @param {*} value the value to test
	 * @returns {boolean} true if the value is a number; otherwise, false
	 */
	isNumber: function(value) {
		return (typeof value === 'number') && isFinite(value);
	},

	/**
	 * Converts a value to a number. The conversion used by this method is very simple and not as
	 * complex as parseNumber(). If the specified value cannot be converted to a number then 0 will
	 * be returned
	 *
	 * @param {*} value the value to convert
	 * @param {number} defaultValue the number to return if value cannot be converted
	 * @returns {number} the converted value as a number
	 */
	toNumber: function(value, defaultValue) {
		if (this.isNumber(value)) {
			return value;
		}

		value = this.trim(value);
		value = parseFloat(value);

		return this.isNumber(value) ? value : defaultValue;
	},

	/**
	 * Similar to the toNumber() method, but the return value is a whole integer
	 *
	 * @param {*} value the value to convert
	 * @param {number} defaultValue the number to return if value cannot be converted
	 * @returns {number} the converted value as an integer
	 */
	toInteger: function(value, defaultValue) {
		value = this.toNumber(value, defaultValue);
		return Math.floor(value);
	},

	/**
	 * Removes leading and trailing white space characters from a string. If the specified value is
	 * null or undefined then an empty string will be returned. If the value is not a string then it
	 * will be converted to a string and then trimmed
	 *
	 * @param {*} value the value to be trimmed
	 * @returns {string} the trimmed string
	 */
	trim: function(value) {
		if ($A.util.isUndefinedOrNull(value)) {
			value = '';
		} else {
			if (typeof value !== 'string') {
				value = '' + value;
			}
			value = value.replace(/^\s+|\s+$/g, '');
		}
		return value;
	},

	/**
	 * Returns true if the value ends with the specified search string. The comparison is
	 * case-insensitive
	 *
	 * @param {string} value the value to test
	 * @param {string} searchString the string to check for
	 * @returns {boolean} true if value ends with searchString; otherwise, false
	 */
	endsWithIgnoreCase: function(value, searchString) {
		var a = searchString.toLowerCase();
		var b = value.substr(0 - searchString.length).toLowerCase();
		return a === b;
	},

	/**
	 * Ensures that a value is within a specified range. If the number is within the the same value
	 * will be returned. If the number is too low then min will be returned and if it is too high
	 * then max will be returned
	 *
	 * @param {number} value the value to check
	 * @param {number} min the minimum allowed value
	 * @param {number} max the maximum allowed value
	 * @returns {number} a number that is definitely within the specified range
	 */
	numberInRange: function(value, min, max) {
		value = Math.max(value, min);
		value = Math.min(value, max);
		return value;
	},

	/**
	 * Gets the precision. The precision is the maximum number of digits allowed in the number. Use
	 * this method to get the precision instead of reading the component's precision attribute
	 * directly as this method ensures that the returned value is within a vaid range
	 *
	 * @param {Aura.Component} component the inputNumber component
	 * @returns {number} the precision
	 */
	getPrecision: function(component) {
		var precision = component.get('v.precision');
		precision = this.toInteger(precision, this.maxPrecision);
		precision = this.numberInRange(precision, this.minPrecision, this.maxPrecision);
		return precision;
	},

	/**
	 * Gets the scale. The scale is the number of digits allowed to the right of the decimal. Use
	 * this method to get the scale instead of reading the component's scale attribute directly as
	 * this method ensures that the returned value is within a valid range
	 *
	 * @param {Aura.Component} component the inputNumber component
	 * @param {number} precision the maximum number of digits in the number
	 * @returns {number} the scale
	 */
	getScale: function(component, precision) {
		var scale = component.get('v.scale');
		scale = this.toInteger(scale, this.minScale);
		scale = this.numberInRange(scale, this.minScale, this.maxScale);
		scale = Math.min(scale, precision - 1);
		return scale;
	},

	/**
	 * Returns the minimum and maximum possible values for the given precision and scale
	 *
	 * @param {number} precision the maximum number of digits in the number
	 * @param {number} scale the number of digits to the right of the decimal
	 * @returns {object} an object containing 2 properties: min and max
	 */
	getRange: function(precision, scale) {
		var max = (Math.pow(10, precision) - 1) / Math.pow(10, scale);
		var min = -max;
		return {
			min: min,
			max: max
		};
	},

	/**
	 * Gets the minimum value
	 *
	 * @param {Aura.Component} component the inputNumber component
	 * @param {Object} range an object containing the valid number range
	 * @returns {number} the minimum value
	 */
	getMin: function(component, range) {
		var min = component.get('v.min');
		min = this.toNumber(min, range.min);
		min = this.numberInRange(min, range.min, range.max);
		return min;
	},

	/**
	 * Gets the maximium value
	 *
	 * @param {Aura.Component} component the inputNumber component
	 * @param {Object} range an object containing the valid number range
	 * @returns {number} the maximum value
	 */
	getMax: function(component, range) {
		var max = component.get('v.max');
		max = this.toNumber(max, range.max);
		max = this.numberInRange(max, range.min, range.max);
		return max;
	},

	/**
	 * Gets the amount by which the component will increment/decrement when the user presses the
	 * ARROW UP and ARROW DOWN keys respectively
	 *
	 * @param {Aura.Component} component the inputNumber component
	 * @param {number} scale number of digits to the right of the decimal
	 * @returns {number} the step value
	 */
	getStep: function(component, scale) {
		var step = component.get('v.step');
		step = this.toNumber(step, 1);
		if (step < 0) {
			step = 1;
		} else {
			step = Math.max(step, 1 / Math.pow(10, scale));
		}
		return step;
	},

	/**
	 * Returns an object containing information about the number format
	 *
	 * @param {Aura.Component} component the inputNumber component
	 * @returns {object} an object containing properties for formatting the number
	 */
	getFormat: function(component) {
		var precision = this.getPrecision(component);
		var scale = this.getScale(component, precision);
		var range = this.getRange(precision, scale);
		var min = this.getMin(component, range);
		var max = this.getMax(component, range);
		var step = this.getStep(component, scale);
		var nillable = $A.util.getBooleanValue(component.get('v.nillable'));

		// When a user presses the ARROW UP or ARROW DOWN key in a number field the value is
		// incremented/decremented by the amount in the step attribute. The min attribute affects
		// this behavior. The native control assumes a min of 0 if one is not explicitly provided.
		// If we use the min we calculated above when incrementing/decrementing by step then our
		// component will not function exactly as the native element. To address this we will use
		// this stepMin value which will be the value from the min attribute if one was supplied or
		// 0 otherwise
		var stepMin = this.toNumber(component.get('v.min'), 0);

		return {
			precision: precision,
			scale: scale,
			min: min,
			max: max,
			step: step,
			stepMin: stepMin,
			nillable: nillable
		};
	},

	/**
	 * Checks to see if the value ends with a special multiplier shortcut key. These shortcuts
	 * include K for thousands, M for millions, B for billions and T for trillions. If the value
	 * does end with one of these special shortcuts then an object is returned which contains both
	 * the shortcut that was detected as well the original value with the shortcut removed from the
	 * end. If the value does not end with one of the shortcuts then null is returned
	 *
	 * @param {string} value the value to test
	 * @returns {object} an object containing the multiplier and the value with the shortcut removed
	 */
	getMultiplier: function(value) {
		for (var key in this.multipliers) {
			if (this.endsWithIgnoreCase(value, key)) {
				value = value.substr(0, value.length - 1);
				return {
					factor: this.multipliers[key],
					value: value
				};
			}
		}

		return null;
	},

	/**
	 * Parses a string to a number. The returned number will conform to the constraints specified by
	 * the format object. For example, if a string of "3,002" is passed in and the format object
	 * specifies a max value of 99 then 99 will be returned. Conversely, if the string "15" was
	 * passed in with the same format object then 15 would be returned
	 *
	 * @param {*} value the value to be parsed. May be any type, but anything other than a string
	 *                  will be converted to a string before parsing
	 * @param {Object} format an object that contains formatting information and constraints
	 * @returns {number} the parsed number or null if the value could not be parsed
	 */
	parseNumber: function(value, format) {
		// Remove leading/trailing white space and commas. If nothing is left then return null
		// or the min value if null is not allowed
		var strValue = this.trim(value);
		strValue = strValue.replace(/,/g, '');
		if (strValue === '') {
			return format.nillable ? null : format.min;
		}

		// Check for shortcuts characters at the end of the value to indicate thousands (K),
		// millions (M), billions (B) or trillions (T)
		var multiplier = this.getMultiplier(strValue);
		if (multiplier) {
			strValue = multiplier.value;
		}

		// Parse the number as a float
		var numValue = parseFloat(strValue);
		if (this.isNumber(numValue)) {
			// Multiply it by the multiplier and convert it to the desired scale. This will take
			// care of any necessary rounding
			if (multiplier) {
				numValue *= multiplier.factor;
			}
			strValue = numValue.toFixed(format.scale);

			// Parse it again to get the final value
			numValue = parseFloat(strValue);
			numValue = this.numberInRange(numValue, format.min, format.max);
		} else {
			// Not a valid number. Return null or the min value if null is not allowed
			numValue = format.nillable ? null : format.min;
		}

		return numValue;
	},

	/**
	 * Formats a number using the information provided by a format object. If the value is not a
	 * number (undefined, null, NaN, etc.) then an empty string will be returned
	 *
	 * @param {number} value the number to format
	 * @param {Object} format an object containing formatting information
	 * @param {boolean} [hasFocus] if true then the thousands separator will not be used
	 * @returns {string} the formatted number
	 */
	formatNumber: function(value, format, hasFocus) {
		if (!this.isNumber(value)) {
			return '';
		}

		var negative = (value < 0) ? '-' : '',
			thousands = (this.isMobile() || hasFocus) ? '' : ',',
			scale = format.scale,
			i = parseInt(value = Math.abs(+value || 0).toFixed(scale), 10) + '',
			j = ((j = i.length) > 3) ? (j % 3) : 0;

		return negative +
			(j ? i.substr(0, j) + thousands : '') +
			i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands) +
			(scale ? '.' + Math.abs(value - i).toFixed(scale).slice(2) : '');
	},

	/**
	 * Sets the value
	 *
	 * @param {Aura.Component} component the inputNumber component
	 * @param {number} value the value
	 * @returns {boolean} true if the value changed
	 */
	setValue: function(component, value) {
		var oldValue = component.get('v.value');
		if (value === oldValue) {
			return false;
		}

		component.ignoreValueChange = true;
		try {
			component.set('v.value', value);
		} finally {
			component.ignoreValueChange = false;
		}

		return true;
	},

	/**
	 * Returns the input HTML element
	 *
	 * @param {Aura.Component} component the inputNumber component
	 * @returns {HTMLElement} the input element
	 */
	getInputElement: function(component) {
		var input = component.find('input');
		if (input) {
			return input.getElement();
		}
		return null;
	},

	/**
	 * Updates the input element
	 *
	 * @param {Aura.Component} component the inputNumber component
	 * @param {boolean} [hasFocus] true if the input element current has keyboard focus
	 * @returns {void}
	 */
	updateInputElement: function(component, hasFocus) {
		var inputElement = this.getInputElement(component);
		if (!inputElement) {
			return;
		}

		var format = this.getFormat(component);
		var value = component.get('v.value');

		var strValue = '';
		var numValue = null;
		if (!$A.util.isUndefinedOrNull(value)) {
			if (this.isNumber(value)) {
				numValue = value;
				strValue = this.formatNumber(numValue, format, hasFocus);
			} else {
				numValue = this.parseNumber(value, format);
				if (this.isNumber(numValue)) {
					strValue = this.formatNumber(numValue, format, hasFocus);
				} else {
					strValue = value + '';
				}
			}
		}

		inputElement.value = strValue;
	},

	/**
	 * Sets attributes only needed when the application is running on mobile
	 *
	 * @param {Aura.Component} component the inputNumber component
	 * @returns {void}
	 */
	setInputElementAttributesForMobile: function(component) {
		var inputElement = this.getInputElement(component);
		if (inputElement && this.isMobile()) {
			var format = this.getFormat(component);
			inputElement.min = format.min;
			inputElement.max = format.max;
			inputElement.step = format.step;
		}
	},

	/**
	 * Fire the named event
	 *
	 * @param {Aura.Component} component the inputNumber component
	 * @param {string} name the event name
	 * @param {Object} args optional event arguments
	 * @returns {void}
	 */
	fireEvent: function(component, name, args) {
		var event = component.getEvent(name);
		event.setParam('arguments', args || {});
		event.fire();
	}
})