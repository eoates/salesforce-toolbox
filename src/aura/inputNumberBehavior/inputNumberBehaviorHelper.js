({
	MIN_PRECISION: 1,
	MAX_PRECISION: 15,
	MIN_SCALE: 0,
	MAX_SCALE: 14,
	MULTIPLIERS: [ 'k', 'm', 'b', 't' ],
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

		var self = this;
		instance = {
			/**
			 * Invoke this method in your input element's onfocus event listener
			 *
			 * @param {Event}    event                  - The event object
			 * @param {Object}   opts                   - An object containing methods for
			 *                                            retrieving and updating component state
			 * @param {Function} opts.getSelectionStart - Returns the selectionStart property of the
			 *                                            input element
			 * @param {Function} opts.getSelectionEnd   - Returns the selectionEnd property of the
			 *                                            input element
			 * @param {Function} opts.getInputValue     - Returns the value of the input element
			 * @param {Function} opts.setInputValue     - Sets the value of the input element
			 *
			 * @return {void}
			 */
			onFocus: function(event, opts) {
				var disabled = component.get('v.disabled');
				var readOnly = component.get('v.readonly');
				if (disabled || readOnly) {
					return;
				}

				var selectionStart = opts.getSelectionStart();
				var selectionEnd = opts.getSelectionEnd();
				var selectionLength = selectionEnd - selectionStart;

				var oldValue = opts.getInputValue();

				if (!disabled && !readOnly) {
					var value = oldValue.replace(/,/g, '');
					value = self.utils.trim(value);

					opts.setInputValue(value);
				}

				if (selectionLength === oldValue.length) {
					opts.select();
				}
			},

			/**
			 * Invoke this method in your input element's onblur event listener
			 *
			 * @param {Event}    event              - The event object
			 * @param {Object}   opts               - An object containing methods for retrieving
			 *                                        and updating component state
			 * @param {Function} opts.hasFocus      - Returns true if the input element has focus
			 * @param {Function} opts.getValue      - Returns the component value
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

				this.updateInputElement(opts);
			},

			/**
			 * Invoke this method in your input element's onkeydown event listener
			 *
			 * @param {Event}    event              - The event object
			 * @param {Object}   opts               - An object containing methods for retrieving
			 *                                        and updating component state
			 * @param {Function} opts.hasFocus      - Returns true if the input element has focus
			 * @param {Function} opts.getValue      - Returns the component value
			 * @param {Function} opts.setValue      - Sets the component value
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

				var format = self.getFormat(component);
				var step = format.step;
				var stepMin = format.stepMin;

				var value = opts.getInputValue();
				value = self.parseNumber(value, format);
				if (!self.utils.isNumber(value)) {
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
			 * Invoke this method in your input element's onkeypress event listener
			 *
			 * @param {Event}    event                  - The event object
			 * @param {Object}   opts                   - An object containing methods for
			 *                                            retrieving and updating component state
			 * @param {Function} opts.getSelectionStart - Returns the selectionStart property of the
			 *                                            input element
			 * @param {Function} opts.getSelectionEnd   - Returns the selectionEnd property of the
			 *                                            input element
			 * @param {Function} opts.getInputValue     - Returns the value of the input element
			 *
			 * @return {boolean} true if the key was accepted or false if it was prevented
			 */
			onKeyPress: function(event, opts) {
				var disabled = component.get('v.disabled');
				var readOnly = component.get('v.readonly');
				if (disabled || readOnly) {
					return false;
				}

				var format = self.getFormat(component);
				var allowNegative = format.min < 0;

				var value = opts.getInputValue();
				var selectionStart = opts.getSelectionStart();
				var selectionEnd = opts.getSelectionEnd();
				var selectionLength = selectionEnd - selectionStart;

				var which = event.keyCode || event.which || 0;
				var prevent = false;
				if (which === 45) {
					// 45 = minus
					// If negative values are not allowed or if we are not at the first char then do
					// not allow the key
					if (!allowNegative || (selectionStart !== 0)) {
						prevent = true;
					}
				} else if (which === 46) {
					// 46 = period
					// If one or more characters are selected then we remove the selected substring
					// from the value as it will be overwritten with the period
					if (selectionLength > 0) {
						var left = value.substr(0, selectionStart);
						var right = value.substr(selectionEnd);
						value = left + right;
					}

					// Make sure the value does not already contain a period
					if (value.indexOf('.') >= 0) {
						prevent = true;
					}
				} else if ((which >= 48) && (which <= 57)) {
					// 0-9 are allowed
				} else if (which === 13) {
					// Enter is allowed
				} else {
					// All other characters
					var allowChar = false;

					// Check for special multipliers, but only at the very end and only if a
					// multiplier shortcut is not already present
					var multiplier = self.hasMultiplier(value);
					if (
						!multiplier
						&& ((value.length - selectionLength) > 0)
						&& ((selectionStart + selectionLength) === value.length)
					) {
						allowChar = self.isMultiplier(String.fromCharCode(which));
					}

					// If the character is not allowed then call preventDefault() on the event to
					// keep it from being entered into the input
					if (!allowChar) {
						prevent = true;
					}
				}

				if (prevent) {
					event.preventDefault();
				}

				return !prevent;
			},

			/**
			 * Invoke this method in your input element's onchange event listener
			 *
			 * @param {Event}    event              - The event object
			 * @param {Object}   opts               - An object containing methods for retrieving
			 *                                        and updating component state
			 * @param {Function} opts.hasFocus      - Returns true if the input element has focus
			 * @param {Function} opts.getValue      - Returns the component value
			 * @param {Function} opts.setValue      - Sets the component value
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

				var format = self.getFormat(component);

				var value = opts.getInputValue();
				value = self.parseNumber(value, format);

				var changed = opts.setValue(value);
				this.updateInputElement(opts);

				return changed;
			},

			/**
			 * Update input element value with the formatted value
			 *
			 * @param {Object}   opts               - An object containing methods for retrieving
			 *                                        and updating component state
			 * @param {Function} opts.hasFocus      - Returns true if the input element has focus
			 * @param {Function} opts.getValue      - Returns the component value
			 * @param {Function} opts.setInputValue - Sets the value of the input element
			 *
			 * @return {void}
			 */
			updateInputElement: function(opts) {
				var hasFocus = opts.hasFocus();
				var value = opts.getValue();

				var numValue = self.utils.asNumber(value);
				if (self.utils.isNumber(numValue)) {
					var format = self.getFormat(component);
					value = self.formatNumber(numValue, format, hasFocus);
				} else {
					value = self.utils.asString(value);
				}

				opts.setInputValue(value);
			},

			/**
			 * Returns the minimum value
			 *
			 * @return {number} The minimum value
			 */
			getMin: function() {
				var format = self.getFormat(component);
				return format.min;
			},

			/**
			 * Returns the maximum value
			 *
			 * @return {number} The maximum value
			 */
			getMax: function() {
				var format = self.getFormat(component);
				return format.max;
			},

			/**
			 * Returns the step value
			 *
			 * @return {number} The step value
			 */
			getStep: function() {
				var format = self.getFormat(component);
				return format.step;
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
	 * Returns true if the character is a special multiplier shortcut
	 *
	 * @param {string} value - The value to test
	 *
	 * @return {boolean} true if value is a shortcut
	 */
	isMultiplier: function(value) {
		return this.MULTIPLIERS.indexOf(value.toLowerCase()) >= 0;
	},

	/**
	 * Checks to see if the value ends with a special multiplier shortcut. These shortcuts include K
	 * for thousands, M for millions, B for billions and T for trillions
	 *
	 * @param {string} value - The value to test
	 *
	 * @return {boolean} true if the value ends with a multiplier; otherwise, false
	 */
	hasMultiplier: function(value) {
		for (var i = 0, n = this.MULTIPLIERS.length; i < n; i++) {
			var multiplier = this.MULTIPLIERS[i];
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
	 * @param {number}  value      - The number to format
	 * @param {Object}  format     - An object containing formatting information
	 * @param {boolean} [hasFocus] - If true then the thousands separator will not be used
	 *
	 * @return {string} The formatted number
	 */
	formatNumber: function(value, format, hasFocus) {
		var thousands = ',';
		if (this.utils.isMobile() || hasFocus) {
			thousands = '';
		}

		return this.utils.formatNumber(value, format.scale, thousands);
	}
})