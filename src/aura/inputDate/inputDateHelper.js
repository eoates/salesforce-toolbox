({
	valueFormat: 'yyyy-MM-dd',

	/**
	 * Returns true if the application running on a desktop browser. This method uses the $Browser
	 * global variable to get the device type
	 *
	 * @return {boolean} true if the application is running on a desktop browser or false if it
	 *                   is running on a phone or tablet
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
	 * Removes leading and trailing white space characters from a string. If the specified value is
	 * null or undefined then an empty string will be returned. If the value is not a string then it
	 * will be converted to a string and then trimmed
	 *
	 * @param {*} value the value to be trimmed
	 * @return {string} the trimmed string
	 */
	trim: function(value) {
		if ($A.util.isUndefinedOrNull(value)) {
			value = '';
		} else {
			if (!this.isString(value)) {
				value = '' + value;
			}
			value = value.replace(/^\s+|\s+$/g, '');
		}
		return value;
	},

	/**
	 * Converts the value to a Date if possible. If the value cannot be converted to a Date then
	 * null is returned
	 *
	 * @param {*} value the value to convert
	 * @return {Date} the converted date or null if the value could not be converted to a Date
	 */
	toDate: function(value) {
		if ($A.util.isUndefinedOrNull(value)) {
			value = null;
		} else if (this.isDate(value)) {
			value = new Date(value.getFullYear(), value.getMonth(), value.getDate());
		} else if (this.isNumber(value)) {
			value = new Date(value);
		} else {
			value = this.trim(value);
			if (value !== '') {
				try {
					value = $A.localizationService.parseDateTime(value);
				} catch (e) {
					value = null;
				}
			} else {
				value = null;
			}
		}
		return value;
	},

	/**
	 * Returns true if the value is a string
	 *
	 * @param {*} vaue the value to test
	 * @return {boolean} true if the value is a string; otherwise, false
	 */
	isString: function(value) {
		return (typeof value === 'string');
	},

	/**
	 * Returns true if the value is a number. This method does not treat special NaN or Infinity as
	 * numbers even though they technically are
	 *
	 * @param {*} value the value to test
	 * @return {boolean} true if the value is a number; otherwise, false
	 */
	isNumber: function(value) {
		return (typeof value === 'number') && isFinite(value);
	},

	/**
	 * Returns true if the value is a date
	 *
	 * @param {*} value the value to test
	 * @return {boolean} true if the value is a date; otherwise, false
	 */
	isDate: function(value) {
		return (Object.prototype.toString.call(value) === '[object Date]');
	},

	/**
	 * Returns true if the dropdown is open
	 *
	 * @param {Aura.Component} component the inputDate component
	 * @return {boolean} true if the dropdown is open; otherwise, false
	 */
	isOpen: function(component) {
		var container = component.find('container');
		return $A.util.hasClass(container.getElement(), 'slds-is-open');
	},

	/**
	 * Opens the dropdown
	 *
	 * @param {Aura.Component} component the inputDate component
	 * @param {boolean} [focus] true if the datepicker should receive focus
	 * @return {void}
	 */
	open: function(component) {
		var datepicker = component.find('datepicker');

		if (!this.isOpen(component)) {
			datepicker.set('v.value', component.get('v.value'));

			var dropdown = component.find('dropdown');
			dropdown.getElement().setAttribute('aria-hidden', false);

			var container = component.find('container');
			$A.util.addClass(container.getElement(), 'slds-is-open');
		}

		if (focus) {
			datepicker.focus();
		}
	},

	/**
	 * Closes the dropdown
	 *
	 * @param {Aura.Component} component the inputDate component
	 * @param {boolean} [focus] true if the input element should recieve focus
	 * @return {void}
	 */
	close: function(component, focus) {
		if (this.isOpen(component)) {
			var container = component.find('container');
			$A.util.removeClass(container.getElement(), 'slds-is-open');

			var dropdown = component.find('dropdown');
			dropdown.getElement().setAttribute('aria-hidden', true);

			var datepicker = component.find('datepicker');
			datepicker.set('v.value', null);
		}

		if (focus) {
			var inputElement = this.getInputElement(component);
			inputElement.focus();
		}
	},

	/**
	 * Formats a date using the specified format. If no format is provided then a default format
	 * will be used
	 *
	 * @param {Date} value the date to format
	 * @param {string} [format] the format
	 * @return {string} the formatted date
	 */
	formatDate: function(value, format) {
		if ($A.util.isUndefinedOrNull(value)) {
			return '';
		}

		if ($A.util.isEmpty(format)) {
			format = this.valueFormat;
		} else {
			format = '' + format;
		}

		return $A.localizationService.formatDateTime(value, format);
	},

	/**
	 * Returns the value as a formatted string
	 *
	 * @param {Aura.Component} component the inputDate component
	 * @return {string} the formatted value
	 */
	getFormattedValue: function(component) {
		var value = component.get('v.value');
		var format = component.get('v.format');

		if (this.isMobile()) {
			format = this.valueFormat;
		}

		var strValue = '';
		if (!$A.util.isUndefinedOrNull(value)) {
			var dateValue = this.toDate(value);
			if (dateValue) {
				strValue = this.formatDate(dateValue, format);
			} else {
				strValue = value + '';
			}
		}

		return strValue;
	},

	/**
	 * Sets the value
	 *
	 * @param {Aura.Component} component the inputDate component
	 * @param {string} value the value
	 * @return {void}
	 */
	setValue: function(component, value) {
		// Format the value
		value = this.trim(value);
		if (value) {
			var dateValue = this.toDate(value);
			if (dateValue) {
				value = this.formatDate(dateValue);
			} else {
				value = null;
			}
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
		this.updateInputElement(component);

		// Fire the change event
		this.fireEvent(component, 'onchange');
	},

	/**
	 * Returns the input HTML element
	 *
	 * @param {Aura.Component} component the inputDate component
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
	 * Updates the value of the input element so it displays the formatted value
	 *
	 * @param {Aura.Component} component the inputDate component
	 * @return {void}
	 */
	updateInputElement: function(component) {
		var inputElement = this.getInputElement(component);
		if (inputElement) {
			inputElement.value = this.getFormattedValue(component);
		}
	},

	/**
	 * Fire the named event
	 *
	 * @param {Aura.Component} component the inputDate component
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