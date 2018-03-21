/**************************************************************************************************
 * inputNumberBehaviorHelper.js
 **************************************************************************************************
 * This is a shared component. Do not make modifications to this component without carefully
 * considering the impact this may have on existing applications/components/pages/etc. that use this
 * component.
 *
 * @author   Eugene Oates
 * @date     2018-03-20
 * @version  1.0.0
 *
 **************************************************************************************************/
({
	MIN_PRECISION: 1,
	MAX_PRECISION: 15,
	MIN_SCALE: 0,
	MAX_SCALE: 14,
	INSTANCES: {},

	/**
	 * Imports modules used by the component
	 *
	 * @param {Aura.Component} component - The inputNumberBehavior component
	 *
	 * @return {void}
	 */
	importModules: function(component) {
		if (!this.utils) {
			this.utils = component.find('utils').getModule();
		}
	},

	/**
	 * Destroys the instance for the specified component
	 *
	 * @param {Aura.Component} component - The inputNumberBehavior component
	 */
	destroy: function(component) {
		var componentId = component.getGlobalId();
		if (this.INSTANCES[componentId]) {
			this.INSTANCES[componentId] = undefined;
		}
	},

	/**
	 * Returns a module which can be used to add the inputNumber behavior
	 *
	 * @param {Aura.Component} component - The inputNumberBehavior component
	 *
	 * @return {Object} An object which has methods that implement the behavior
	 */
	getModule: function(component) {
		var componentId = component.getGlobalId();
		var instance = this.INSTANCES[componentId];
		if (instance) {
			return instance;
		}

		var helper = this;
		instance = {
			/**
			 * Invoke this method in your input element's onblur event listener
			 *
			 * @param {Event}    event              - The event object
			 * @param {Object}   opts               - An object containing methods for retrieving
			 *                                        and updating component state
			 * @param {Function} opts.getValue      - Returns the component value
			 * @param {Function} opts.getInputType  - Gets the input element's type
			 * @param {Function} opts.setInputValue - Sets the value of the input element
			 *
			 * @return {void}
			 */
			onBlur: function(event, opts) {
				var disabled = component.get('v.disabled');
				var readOnly = component.get('v.readonly');
				if (disabled || readOnly) {
					return;
				}

				if (this.formatTimeout) {
					clearTimeout(this.formatTimeout);
					this.formatTimeout = undefined;
				}

				this.updateInputElement(opts);
			},

			/**
			 * Invoke this method in your input element's onkeydown event listener
			 *
			 * @param {Event}    event              - The event object
			 * @param {Object}   opts               - An object containing methods for retrieving
			 *                                        and updating component state
			 * @param {Function} opts.getValue      - Returns the component value
			 * @param {Function} opts.setValue      - Sets the component value
			 * @param {Function} opts.getInputType  - Gets the input element's type
			 * @param {Function} opts.getInputValue - Returns the value of the input element
			 * @param {Function} opts.setInputValue - Sets the value of the input element
			 *
			 * @return {boolean} true if the component value was changed
			 */
			onKeyDown: function(event, opts) {
				var disabled = component.get('v.disabled');
				var readOnly = component.get('v.readonly');
				if (disabled || readOnly) {
					return false;
				}

				// This handling is not needed on mobile devices as phones and tablets do not
				// typically have up or down keys
				if (helper.utils.isMobile()) {
					return false;
				}

				// This handling is not needed for number inputs as they provide up/down arrow
				// support natively
				var type = opts.getInputType();
				if (type === 'number') {
					return false;
				}

				var format = helper.getFormat(component);
				var step = format.step;
				var stepMin = format.stepMin;

				var value = opts.getInputValue();
				value = helper.parseNumber(value, format);
				if (!helper.utils.isNumber(value)) {
					value = 0;
				}

				var newValue = (value - stepMin) - ((value - stepMin) % step) + stepMin;
				newValue = parseFloat(newValue.toFixed(format.scale));

				var which = event.keyCode || event.which || 0;
				if (which === 38) {
					// Arrow up
					if ((newValue + step) <= format.max) {
						newValue += step;
					}
				} else if (which === 40) {
					// Arrow down
					if ((newValue >= value) && ((newValue - step) >= format.min)) {
						newValue -= step;
					}
				} else {
					// We don't care about other keys
					return false;
				}

				newValue = newValue.toFixed(format.scale);
				newValue = parseFloat(newValue);

				var changed = opts.setValue(newValue);
				this.updateInputElement(opts);

				event.preventDefault();

				return changed;
			},

			/**
			 * Invoke this method in your input element's oninput event listener
			 *
			 * @param {Event}    event                  - The event object
			 * @param {Object}   opts                   - An object containing methods for
			 *                                            retrieving and updating component state
			 * @param {Function} opts.getInputType      - Gets the input element's type
			 * @param {Function} opts.getInputValue     - Gets the value of the input element
			 * @param {Function} opts.setInputValue     - Sets the value of the input element
			 * @param {Function} opts.getSelectionEnd   - Returns the zero based index of end of the
			 *                                            selected portion of the input element
			 * @param {Function} opts.setSelectionRange - Sets the start and end positions of the
			 *                                            current selection in the input element
			 *
			 * @return {void}
			 */
			onInput: function(event, opts) {
				var disabled = component.get('v.disabled');
				var readOnly = component.get('v.readonly');
				if (disabled || readOnly) {
					return;
				}

				// Do not perform real-time formatting for number inputs
				var type = opts.getInputType();
				if (type === 'number') {
					return;
				}

				// Check whether we are running on an Android device
				if (helper.utils.isAndroid()) {
					// Due to some strange behavior with the selectionStart and selectionEnd
					// properties on Android devices we use setTimeout() to wait a very small amount
					// of time before applying our formatting
					var that = this;
					if (that.formatTimeout) {
						clearTimeout(that.formatTimeout);
						that.formatTimeout = undefined;
					}
					that.formatTimeout = setTimeout($A.getCallback(function() {
						that.formatOnInput(opts);
					}), 10);
				} else {
					// Handling for all other devices is the same
					this.formatOnInput(opts);
				}
			},

			/**
			 * Invoke this method in your input element's onchange event listener
			 *
			 * @param {Event}    event              - The event object
			 * @param {Object}   opts               - An object containing methods for retrieving
			 *                                        and updating component state
			 * @param {Function} opts.getValue      - Returns the component value
			 * @param {Function} opts.setValue      - Sets the component value
			 * @param {Function} opts.getInputType  - Gets the input element's type
			 * @param {Function} opts.getInputValue - Returns the value of the input element
			 * @param {Function} opts.setInputValue - Sets the value of the input element
			 *
			 * @return {boolean} true if the component value was changed
			 */
			onChange: function(event, opts) {
				var disabled = component.get('v.disabled');
				var readOnly = component.get('v.readonly');
				if (disabled || readOnly) {
					this.updateInputElement(opts);
					return false;
				}

				if (this.formatTimeout) {
					clearTimeout(this.formatTimeout);
					this.formatTimeout = undefined;
				}

				var format = helper.getFormat(component);

				var value = opts.getInputValue();
				value = helper.parseNumber(value, format);

				var changed = opts.setValue(value);
				this.updateInputElement(opts);

				return changed;
			},

			/**
			 * Update input element value with the formatted value
			 *
			 * @param {Object}   opts               - An object containing methods for retrieving
			 *                                        and updating component state
			 * @param {Function} opts.getValue      - Returns the component value
			 * @param {Function} opts.getInputType  - Gets the input element's type
			 * @param {Function} opts.setInputValue - Sets the value of the input element
			 *
			 * @return {void}
			 */
			updateInputElement: function(opts) {
				var type = opts.getInputType();
				var value = opts.getValue();

				var numValue = helper.utils.asNumber(value);
				if (helper.utils.isNumber(numValue)) {
					var format = helper.getFormat(component);
					value = helper.formatNumber(numValue, format, type);
				} else {
					value = helper.utils.asString(value);
				}

				opts.setInputValue(value);
			},

			/**
			 * Returns the minimum value
			 *
			 * @return {number} The minimum value
			 */
			getMin: function() {
				var format = helper.getFormat(component);
				return format.min;
			},

			/**
			 * Returns the maximum value
			 *
			 * @return {number} The maximum value
			 */
			getMax: function() {
				var format = helper.getFormat(component);
				return format.max;
			},

			/**
			 * Returns the step value
			 *
			 * @return {number} The step value
			 */
			getStep: function() {
				var format = helper.getFormat(component);
				return format.step;
			},

			/**
			 * Formats the input
			 *
			 * @param {Object}   opts                   - An object containing methods for
			 *                                            retrieving and updating component state
			 * @param {Function} opts.getInputType      - Gets the input element's type
			 * @param {Function} opts.getInputValue     - Gets the value of the input element
			 * @param {Function} opts.setInputValue     - Sets the value of the input element
			 * @param {Function} opts.getSelectionEnd   - Returns the zero based index of end of the
			 *                                            selected portion of the input element
			 * @param {Function} opts.setSelectionRange - Sets the start and end positions of the
			 *                                            current selection in the input element
			 */
			formatOnInput: function(opts) {
				var format = helper.getFormat(component);
				var value = opts.getInputValue();
				var length = value.length;
				var hasMultiplier = false;
				var originalValue = value;
				var selectionStart = opts.getSelectionEnd();
				var leadingWhitespace, trailingWhitespace;
				var indexOfDecimal = -1;
				var i, charCode;
				var tempValue, tempSelectionStart, tempCounter, tempChar;

				// Make sure the input is not blank
				if (!value) {
					return;
				}

				// Remove leading whitespace
				leadingWhitespace = this.getLeadingWhitespace(value);
				if (leadingWhitespace.length > 0) {
					value = value.substring(leadingWhitespace.length);
					length = value.length;
					selectionStart = Math.max(selectionStart - leadingWhitespace.length, 0);
				}

				// Remove trailing whitespace
				trailingWhitespace = this.getTrailingWhitespace(value);
				if (trailingWhitespace.length > 0) {
					value = value.substring(0, length - trailingWhitespace.length);
					length = value.length;
					selectionStart = Math.min(selectionStart, length);
				}

				// Check for a single special multiplier shortcut at the end of the input. If one
				// is present then ignore it by subtracting 1 from our length variable
				if ((length > 1) && (/[kmbt]$/i.test(value))) {
					hasMultiplier = true;
					length--;
				}

				// Check for decimal and, if found, make sure all chars that appear after the
				// decimal are numbers
				if (format.scale > 0) {
					indexOfDecimal = value.indexOf('.');
					if (indexOfDecimal !== -1) {
						for (i = (length - 1); i > indexOfDecimal; i--) {
							charCode = value.charCodeAt(i);
							if ((charCode < 48) || (charCode > 57)) {
								// Not a number
								value = value.substring(0, i) + value.substring(i + 1);
								length--;
								if (i < selectionStart) {
									selectionStart--;
								}
							}
						}
					}
				}

				// If the first character is the decimal then add a leading 0
				if (indexOfDecimal === 0) {
					value = '0' + value;
					length++;
					selectionStart++;
					indexOfDecimal++;
				}

				// Step through each character up to either the decimal or the end of the value and
				// check whether it is a number. We step through the string in reverse to keep count
				// of how many characters we have processed and know when to insert a thousands
				// separator
				if (length > 0) {
					var beginAt = 0;
					var endAt = length - 1;
					if (indexOfDecimal !== -1) {
						endAt = indexOfDecimal - 1;
					}

					tempValue = '';
					tempSelectionStart = selectionStart;
					tempCounter = 0;
					tempChar = '';
					for (i = endAt; i >= beginAt; i--) {
						tempChar = value.charAt(i);

						charCode = value.charCodeAt(i);
						if ((charCode >= 48) && (charCode <= 57)) {
							// Char is a number; keep it
							if ((tempValue.length > 0) && ((tempCounter % 3) === 0)) {
								// Add a thousands separator every 3 digits
								tempValue = ',' + tempValue;
								tempCounter = 0;
								if (i < (selectionStart - 1)) {
									tempSelectionStart++;
								}
							}
							tempValue = tempChar + tempValue;
							tempCounter++;
						} else {
							// Char is not a number; skip it
							if (i < selectionStart) {
								tempSelectionStart--;
							}
						}
					}

					// If the first character was a minus (and the input allows negative values)
					// then keep it to allow for entry of negative numbers
					if ((tempChar === '-') && (format.min < 0)) {
						tempValue = '-' + tempValue;
						tempSelectionStart++;
					}

					value = tempValue +
						((indexOfDecimal !== -1) ? value.substring(indexOfDecimal, length) : '') +
						value.substring(length);
					length = value.length - (hasMultiplier ? 1 : 0);
					selectionStart = tempSelectionStart;
				}

				// Make sure cursor is in valid position
				selectionStart = Math.max(selectionStart, 0);
				selectionStart = Math.min(selectionStart, value.length);

				// Don't do anything if the value wasn't changed
				if (value === originalValue) {
					return;
				}

				// Update the input's value and cursor position
				opts.setInputValue(value);
				opts.setSelectionRange(selectionStart, selectionStart);
			},

			/**
			 * Returns the first match in the specified string
			 *
			 * @param {string} str     - The string to search
			 * @param {RegExp} pattern - The pattern to search for
			 *
			 * @return {string} The first match or an empty string if no match was found
			 */
			firstMatch: function(str, pattern) {
				var match = str.match(pattern);
				if (match) {
					return match[0];
				}
				return '';
			},

			/**
			 * Returns all leading whitespace characters from the specified string
			 *
			 * @param {string} str - The string to search
			 *
			 * @return {string} All leading whitespace characters
			 */
			getLeadingWhitespace: function(str) {
				return this.firstMatch(str, /^\s+/g);
			},

			/**
			 * Returns all trailing whitespace characters from the specified string
			 *
			 * @param {string} str - The string to search
			 *
			 * @return {string} All trailing whitespace characters
			 */
			getTrailingWhitespace: function(str) {
				return this.firstMatch(str, /\s+$/g);
			}
		};

		// Store the instance and return it
		this.INSTANCES[componentId] = instance;
		return instance;
	},

	/**
	 * Converts a value to a number. If the specified value cannot be converted to a number then
	 * defaultValue is returned
	 *
	 * @param {*}      value        - The value to convert
	 * @param {number} defaultValue - The number to return if value cannot be converted
	 *
	 * @return {number} The converted value as a number
	 */
	toNumber: function(value, defaultValue) {
		value = this.utils.asNumber(value);
		return this.utils.isNumber(value) ? value : defaultValue;
	},

	/**
	 * Similar to the toNumber() method, but the return value is an integer
	 *
	 * @param {*}      value        - The value to convert
	 * @param {number} defaultValue - The number to return if value cannot be converted
	 *
	 * @return {number} The converted value as an integer
	 */
	toInteger: function(value, defaultValue) {
		return this.utils.asInteger(this.toNumber(value, defaultValue));
	},

	/**
	 * Gets the precision. The precision is the maximum number of digits allowed in the number. Use
	 * this method to get the precision instead of reading the component's precision attribute
	 * directly as this method ensures that the returned value is within a vaid range
	 *
	 * @param {Aura.Component} component - The inputNumberBehavior component
	 *
	 * @return {number} The precision
	 */
	getPrecision: function(component) {
		var precision = component.get('v.precision');
		precision = this.toInteger(precision, this.MAX_PRECISION);
		precision = this.utils.minmax(precision, this.MIN_PRECISION, this.MAX_PRECISION);
		return precision;
	},

	/**
	 * Gets the scale. The scale is the number of digits allowed to the right of the decimal. Use
	 * this method to get the scale instead of reading the component's scale attribute directly as
	 * this method ensures that the returned value is within a valid range
	 *
	 * @param {Aura.Component} component - The inputNumberBehavior component
	 * @param {number}         precision - The maximum number of digits in the number
	 *
	 * @return {number} The scale
	 */
	getScale: function(component, precision) {
		var scale = component.get('v.scale');
		scale = this.toInteger(scale, this.MIN_SCALE);
		scale = this.utils.minmax(scale, this.MIN_SCALE, this.MAX_SCALE);
		scale = Math.min(scale, precision - 1);
		return scale;
	},

	/**
	 * Gets the minimum value
	 *
	 * @param {Aura.Component} component - The inputNumberBehavior component
	 * @param {Object}         range     - An object containing the valid number range
	 *
	 * @return {number} The minimum value
	 */
	getMin: function(component, range) {
		var min = component.get('v.min');
		min = this.toNumber(min, range.min);
		min = this.utils.minmax(min, range.min, range.max);
		return min;
	},

	/**
	 * Gets the maximium value
	 *
	 * @param {Aura.Component} component - The inputNumberBehavior component
	 * @param {Object}         range     - An object containing the valid number range
	 *
	 * @return {number} The maximum value
	 */
	getMax: function(component, range) {
		var max = component.get('v.max');
		max = this.toNumber(max, range.max);
		max = this.utils.minmax(max, range.min, range.max);
		return max;
	},

	/**
	 * Gets the amount by which the component will increment/decrement when the user presses the
	 * ARROW UP and ARROW DOWN keys respectively
	 *
	 * @param {Aura.Component} component - The inputNumberBehavior component
	 * @param {number}         scale     - Number of digits to the right of the decimal
	 *
	 * @return {number} The step value
	 */
	getStep: function(component, scale) {
		var step = component.get('v.step');
		step = this.toNumber(step, 1);
		if (step < 0) {
			step = 1;
		} else {
			step = Math.max(step, 1 / Math.pow(10, scale));
		}
		step = parseFloat(step.toFixed(scale));
		return step;
	},

	/**
	 * Returns an object containing information about the number format
	 *
	 * @param {Aura.Component} component - The inputNumberBehavior component
	 *
	 * @return {Object} An object containing properties for formatting the number
	 */
	getFormat: function(component) {
		var precision = this.getPrecision(component);
		var scale = this.getScale(component, precision);
		var range = this.utils.range(precision, scale);
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
		stepMin = parseFloat(stepMin.toFixed(scale));

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
	 * Parses a string to a number. The returned number will conform to the constraints specified by
	 * the format object. For example, if a string of "3,002" is passed in and the format object
	 * specifies a max value of 99 then 99 will be returned. Conversely, if the string "15" was
	 * passed in with the same format object then 15 would be returned
	 *
	 * @param {*}      value  - The value to be parsed. May be any type, but anything other than a
	 *                          string will be converted to a string before parsing
	 * @param {Object} format - An object that contains formatting information and constraints
	 *
	 * @return {number} The parsed number or undefined if the value could not be parsed
	 */
	parseNumber: function(value, format) {
		value = this.utils.asNumber(value);
		if (this.utils.isNumber(value)) {
			value = value.toFixed(format.scale);
			value = parseFloat(value);
			value = this.utils.minmax(value, format.min, format.max);
		} else if (!format.nillable) {
			value = this.utils.minmax(0, format.min, format.max);
		} else {
			value = undefined;
		}

		return value;
	},

	/**
	 * Formats a number using the information provided by a format object. If the value is not a
	 * number then an empty string will be returned
	 *
	 * @param {number} value  - The number to format
	 * @param {Object} format - An object containing formatting information
	 * @param {string} type   - The type of the input element. Expected values are "text" and
	 *                          "number"
	 *
	 * @return {string} The formatted number
	 */
	formatNumber: function(value, format, type) {
		var thousands = ',';
		if (type === 'number') {
			thousands = '';
		}

		return this.utils.formatNumber(value, format.scale, thousands);
	}
})