({
	minPrecision: 1,
	maxPrecision: 15,
	minScale: 0,
	maxScale: 14,
	multipliers: [ 'k', 'm', 'b', 't' ],

	/**
	 * Imports modules used by the component
	 *
	 * @param  {Aura.Component} the inputNumber component
	 * @return {void}
	 */
	importModules: function(component) {
		if (!this.utils) {
			this.utils = component.find('utils').getModule();
		}
	},

	/**
	 * Converts a value to a number. If the specified value cannot be converted to a number then
	 * defaultValue is returned
	 *
	 * @param {*} value the value to convert
	 * @param {number} defaultValue the number to return if value cannot be converted
	 * @return {number} the converted value as a number
	 */
	toNumber: function(value, defaultValue) {
		value = this.utils.asNumber(value);
		return this.utils.isNumber(value) ? value : defaultValue;
	},

	/**
	 * Similar to the toNumber() method, but the return value is an integer
	 *
	 * @param {*} value the value to convert
	 * @param {number} defaultValue the number to return if value cannot be converted
	 * @return {number} the converted value as an integer
	 */
	toInteger: function(value, defaultValue) {
		return this.utils.asInteger(this.toNumber(value, defaultValue));
	},

	/**
	 * Ensures that a value is within a specified range. If the number is within the the same value
	 * will be returned. If the number is too low then min will be returned and if it is too high
	 * then max will be returned
	 *
	 * @param {number} value the value to check
	 * @param {number} min the minimum allowed value
	 * @param {number} max the maximum allowed value
	 * @return {number} a number that is definitely within the specified range
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
	 * @return {number} the precision
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
	 * @return {number} the scale
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
	 * @return {object} an object containing 2 properties: min and max
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
	 * @return {number} the minimum value
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
	 * @return {number} the maximum value
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
	 * @return {number} the step value
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
	 * @return {object} an object containing properties for formatting the number
	 */
	getFormat: function(component) {
		var precision = this.getPrecision(component);
		var scale = this.getScale(component, precision);
		var range = this.getRange(precision, scale);
		var min = this.getMin(component, range);
		var max = this.getMax(component, range);
		var step = this.getStep(component, scale);
		var nillable = this.utils.asBoolean(component.get('v.nillable'));

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
	 * Returns true if the character is a special multiplier shortcut
	 *
	 * @param {string} value the character to check
	 * @return {boolean} true if value is a shortcut
	 */
	isMultiplier: function(value) {
		return this.multipliers.indexOf(value.toLowerCase()) >= 0;
	},

	/**
	 * Checks to see if the value ends with a special multiplier shortcut. These shortcuts include K
	 * for thousands, M for millions, B for billions and T for trillions
	 *
	 * @param {string} value the value to test
	 * @return {boolean} true if the value ends with a multiplier; otherwise, false
	 */
	hasMultiplier: function(value) {
		for (var i = 0, n = this.multipliers.length; i < n; i++) {
			var multiplier = this.multipliers[i];
			if (this.utils.endsWithIgnoreCase(value, multiplier)) {
				return true;
			}
		}
		return false;
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
	 * @return {number} the parsed number or null if the value could not be parsed
	 */
	parseNumber: function(value, format) {
		value = this.utils.asNumber(value);
		if (this.utils.isNumber(value)) {
			value = value.toFixed(format.scale);
			value = parseFloat(value);
			value = this.numberInRange(value, format.min, format.max);
		} else {
			value = format.nillable ? null : format.min;
		}

		return value;
	},

	/**
	 * Formats a number using the information provided by a format object. If the value is not a
	 * number (undefined, null, NaN, etc.) then an empty string will be returned
	 *
	 * @param {number} value the number to format
	 * @param {Object} format an object containing formatting information
	 * @param {boolean} [hasFocus] if true then the thousands separator will not be used
	 * @return {string} the formatted number
	 */
	formatNumber: function(value, format, hasFocus) {
		var thousands = ',';
		if (this.utils.isMobile() || hasFocus) {
			thousands = '';
		}

		return this.utils.formatNumber(value, format.scale, thousands);
	},

	/**
	 * Sets the value
	 *
	 * @param {Aura.Component} component the inputNumber component
	 * @param {number} value the value
	 * @return {boolean} true if the value changed
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
	 * @return {HTMLElement} the input element
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
	 * @return {void}
	 */
	updateInputElement: function(component, hasFocus) {
		var inputElement = this.getInputElement(component);
		if (!inputElement) {
			return;
		}

		var format = this.getFormat(component);
		var value = component.get('v.value');

		if (this.utils.isNumber(value)) {
			value = this.formatNumber(value, format, hasFocus);
		} else {
			value = this.utils.asString(value);
		}

		inputElement.value = value;
	},

	/**
	 * Sets attributes only needed when the application is running on mobile
	 *
	 * @param {Aura.Component} component the inputNumber component
	 * @return {void}
	 */
	setInputElementAttributesForMobile: function(component) {
		var inputElement = this.getInputElement(component);
		if (inputElement && this.utils.isMobile()) {
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
	 * @return {void}
	 */
	fireEvent: function(component, name, args) {
		var event = component.getEvent(name);
		event.setParam('arguments', args || {});
		event.fire();
	}
})