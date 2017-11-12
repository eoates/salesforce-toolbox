({
	valueFormat: 'yyyy-MM-dd',

	/**
	 * Imports modules used by the component
	 *
	 * @param {Aura.Component} component - the inputDate component
	 *
	 * @return {void}
	 */
	importModules: function(component) {
		if (!this.utils) {
			this.utils = component.find('utils').getModule();
		}
	},

	/**
	 * Returns true if the dropdown is open
	 *
	 * @param {Aura.Component} component - the inputDate component
	 *
	 * @return {boolean} true if the dropdown is open; otherwise, false
	 */
	isOpen: function(component) {
		var container = component.find('container');
		return $A.util.hasClass(container.getElement(), 'slds-is-open');
	},

	/**
	 * Opens the dropdown
	 *
	 * @param {Aura.Component} component - the inputDate component
	 * @param {boolean}        [focus]   - true if the datepicker should receive focus
	 *
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
	 * @param {Aura.Component} component - the inputDate component
	 * @param {boolean}        [focus]   - true if the input element should recieve focus
	 *
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
	 * Returns the value as a formatted string
	 *
	 * @param {Aura.Component} component - the inputDate component
	 *
	 * @return {string} the formatted value
	 */
	getFormattedValue: function(component) {
		var value = component.get('v.value');

		var format = this.utils.asString(component.get('v.format'));
		if (this.utils.isBlank(format) || this.utils.isMobile()) {
			format = this.valueFormat;
		}

		var strValue = '';
		if (!this.utils.isUndefinedOrNull(value)) {
			var dateValue = this.utils.asDate(value);
			if (dateValue) {
				strValue = this.utils.formatDate(dateValue, format);
			} else {
				strValue = this.utils.asString(value);
			}
		}

		return strValue;
	},

	/**
	 * Sets the value
	 *
	 * @param {Aura.Component} component - the inputDate component
	 * @param {string}         value     - the value
	 *
	 * @return {boolean} true if the value changed
	 */
	setValue: function(component, value) {
		// Format the value
		value = this.utils.trim(value);
		if (value) {
			var dateValue = this.utils.asDate(value);
			if (dateValue) {
				value = this.utils.formatDate(dateValue, this.valueFormat);
			} else {
				value = null;
			}
		} else {
			value = null;
		}

		// Determine whether the value has changed
		var oldValue = component.get('v.value');
		if (value === oldValue) {
			return false;
		}

		// Update the value
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
	 * @param {Aura.Component} component - the inputDate component
	 *
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
	 * @param {Aura.Component} component - the inputDate component
	 *
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
	 * @param {Aura.Component} component - the inputDate component
	 * @param {string}         name      - the event name
	 * @param {Object}         args      - optional event arguments
	 *
	 * @return {void}
	 */
	fireEvent: function(component, name, args) {
		var event = component.getEvent(name);
		event.setParam('arguments', args || {});
		event.fire();
	}
})