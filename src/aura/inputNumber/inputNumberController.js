({
	/**
	 * Sets focus to the input element
	 */
	focus: function(component, event, helper) {
		var inputElement = helper.getInputElement(component);
		if (inputElement) {
			inputElement.focus();
		}
	},

	/**
	 * Selects the input element
	 */
	select: function() {
		var inputElement = helper.getInputElement(component);
		if (inputElement) {
			inputElement.select();
		}
	},

	/**
	 * Handles change to the value attribute
	 */
	valueChange: function(component, event, helper) {
		if (component.ignoreValueChange) {
			return;
		}

		helper.updateInputElement(component);
	},

	/**
	 * Handles the focus event of the input element. Removes any formatting from the input
	 */
	inputFocus: function(component, event, helper) {
		if (helper.isDesktop()) {
			var inputElement = event.target;

			var selectionStart = inputElement.selectionStart;
			var selectionEnd = inputElement.selectionEnd;
			var selectionLength = selectionEnd - selectionStart;

			var oldValue = inputElement.value;

			var value = oldValue.replace(/,/g, '');
			value = helper.trim(value);

			inputElement.value = value;

			var autoSelect = component.get('v.autoselect');
			if ((selectionLength === oldValue.length) || autoSelect) {
				inputElement.select();
			}
		}

		helper.fireEvent(component, 'onfocus');
	},

	/**
	 * Handles the blur event of the input element. Applies formatting
	 */
	inputBlur: function(component, event, helper) {
		helper.updateInputElement(component);
		helper.fireEvent(component, 'onblur');
	},

	/**
	 * Handles the keydown event of the input element. Implements the ARROW UP and ARROW DOWN step
	 * functionality
	 */
	inputKeyDown: function(component, event, helper) {
		var inputElement = event.target;

		var format = helper.getFormat(component);
		var step = format.step;
		var stepMin = format.stepMin;

		var value = helper.parseNumber(inputElement.value, format);
		if (!helper.isNumber(value)) {
			value = 0;
		}

		var newValue = (value - stepMin) - ((value - stepMin) % step) + stepMin;

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
			return;
		}

		newValue = newValue.toFixed(format.scale);
		newValue = parseFloat(newValue);

		var changed = helper.setValue(component, newValue);
		helper.updateInputElement(component, true);
		if (changed) {
			helper.fireEvent(component, 'onchange');
		}

		event.preventDefault();
	},

	/**
	 * Handles the keypress event of the input element. Allows only numbers and certain special
	 * characters to be entered
	 */
	inputKeyPress: function(component, event, helper) {
		// We don't need to handle this event on mobile
		if (helper.isMobile()) {
			return;
		}

		var inputElement = event.target;
		var which = event.keyCode || event.which || 0;

		var format = helper.getFormat(component);
		var allowNegative = format.min < 0;

		var value = inputElement.value;
		var selectionStart = inputElement.selectionStart;
		var selectionEnd = inputElement.selectionEnd;
		var selectionLength = selectionEnd - selectionStart;

		if (which === 45) {
			// 45 = minus
			// If negative values are not allowed or if we are not at the first char then do not
			// allow the key
			if (!allowNegative || (selectionStart !== 0)) {
				event.preventDefault();
			}
		} else if (which === 46) {
			// 46 = period
			// If one or more characters are selected then we remove the selected substring from
			// the value as it will be overwritten with the period
			if (selectionLength > 0) {
				var left = value.substr(0, selectionStart);
				var right = value.substr(selectionEnd);
				value = left + right;
			}

			// Make sure the value does not already contain a period
			if (value.indexOf('.') >= 0) {
				event.preventDefault();
			}
		} else if ((which >= 48) && (which <= 57)) {
			// 0-9 are allowed
		}
		else {
			// All other characters
			var allowChar = false;

			// Check for special multipliers, but only at the very end and only if a multiplier is
			// not already present
			var multiplier = helper.getMultiplier(value);
			if (
				!multiplier
				&& (value.length > 0)
				&& ((selectionStart + selectionLength) === value.length)
			) {
				for (var key in helper.multipliers) {
					var l = key.toLowerCase().charCodeAt(0);
					var u = key.toUpperCase().charCodeAt(0);
					if ((which === l) || (which === u)) {
						// Allow multiplier shortcut
						allowChar = true;
						break;
					}
				}
			}

			// If the character is not allowed then call preventDefault() on the event to keep it
			// from being entered into the input
			if (!allowChar) {
				event.preventDefault();
			}
		}
	},

	/**
	 * Handles the change event of the input element. Updates the component value
	 */
	inputChange: function(component, event, helper) {
		var inputElement = event.target;

		var format = helper.getFormat(component);
		var value = helper.parseNumber(inputElement.value, format);

		var changed = helper.setValue(component, value);
		helper.updateInputElement(component);
		if (changed) {
			helper.fireEvent(component, 'onchange');
		}
	}
})