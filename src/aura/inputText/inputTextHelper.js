({
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
	 * Sets the value
	 *
	 * @param {Aura.Component} component the inputText component
	 * @param {string} value the value
	 * @param {boolean} [updateInput] true to update the input element
	 * @returns {void}
	 */
	setValue: function(component, value, updateInput) {
		// Format the value
		var autoTrim = component.get('v.autotrim');
		if (autoTrim) {
			value = this.trim(value);
		}

		// Determine whether the value has changed
		var oldValue = component.get('v.value');
		if (value === oldValue) {
			return;
		}

		// Update the value
		component.ignoreValueChange = true;
		try {
			component.set('v.value', value);
		} finally {
			component.ignoreValueChange = false;
		}

		// Update the input element value
		if (updateInput || $A.util.isUndefinedOrNull(updateInput)) {
			this.updateInputElementValue(component);
		}

		// Fire the change event
		this.fireEvent(component, 'onchange', {
			value: value,
			oldValue: oldValue
		});
	},


	/**
	 * Returns the input HTML element
	 *
	 * @param {Aura.Component} component the inputText component
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
	 * Updates the value of the input element so it displays the formatted value
	 *
	 * @param {Aura.Component} component the inputText component
	 * @returns {void}
	 */
	updateInputElementValue: function(component) {
		var inputElement = this.getInputElement(component);
		if (inputElement) {
			var value = component.get('v.value');
			if ($A.util.isUndefinedOrNull(value)) {
				value = '';
			} else if (typeof value !== 'string') {
				value = value + '';
			}

			var autoTrim = component.get('v.autotrim');
			if (autoTrim) {
				value = this.trim(value);
			}

			inputElement.value = value;
		}
	},

	/**
	 * Fire the named event
	 *
	 * @param {Aura.Component} component the inputText component
	 * @param {string} name the event name
	 * @param {object} args optional event arguments
	 * @returns {void}
	 */
	fireEvent: function(component, name, args) {
		var event = component.getEvent(name);
		event.setParam('arguments', args || {});
		event.fire();
	}
})