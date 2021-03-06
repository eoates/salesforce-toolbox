/**************************************************************************************************
 * inputDateHelper.js
 **************************************************************************************************
 * This is a shared component. Do not make modifications to this component without carefully
 * considering the impact this may have on existing applications/components/pages/etc. that use this
 * component.
 *
 * @author Eugene Oates
 *
 **************************************************************************************************/
({
	VALUE_FORMAT: 'yyyy-MM-dd',

	/**
	 * Imports modules used by the component
	 *
	 * @param {Aura.Component} component - The inputDate component
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
	 * @param {Aura.Component} component - The inputDate component
	 *
	 * @return {boolean} true if the dropdown is open; otherwise, false
	 */
	isOpen: function(component) {
		var container = component.find('container');
		return this.utils.hasClass(container.getElement(), 'slds-is-open');
	},

	/**
	 * Opens the dropdown
	 *
	 * @param {Aura.Component} component     - The inputDate component
	 * @param {boolean}        [focus=false] - true if the datepicker should receive focus
	 *
	 * @return {void}
	 */
	open: function(component, focus) {
		var datepicker = component.find('datepicker');

		if (!this.isOpen(component)) {
			datepicker.set('v.value', component.get('v.value'));

			var dropdown = component.find('dropdown');
			dropdown.getElement().setAttribute('aria-hidden', false);

			var container = component.find('container');
			this.utils.addClass(container.getElement(), 'slds-is-open');
		}

		if (focus) {
			datepicker.focus();
		}
	},

	/**
	 * Closes the dropdown
	 *
	 * @param {Aura.Component} component     - The inputDate component
	 * @param {boolean}        [focus=false] - true if the input element should recieve focus
	 *
	 * @return {void}
	 */
	close: function(component, focus) {
		if (this.isOpen(component)) {
			var container = component.find('container');
			this.utils.removeClass(container.getElement(), 'slds-is-open');

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
	 * @param {Aura.Component} component - The inputDate component
	 *
	 * @return {string} The formatted value
	 */
	getFormattedValue: function(component) {
		var value = component.get('v.value');

		var format = this.utils.asString(component.get('v.format'));
		if (this.utils.isBlank(format) || this.utils.isMobile()) {
			format = this.VALUE_FORMAT;
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
	 * @param {Aura.Component} component - The inputDate component
	 * @param {string}         value     - The value
	 *
	 * @return {boolean} true if the value changed
	 */
	setValue: function(component, value) {
		// Format the value
		value = this.utils.trim(value);
		if (value) {
			var dateValue = this.utils.asDate(value);
			if (dateValue) {
				value = this.utils.formatDate(dateValue, this.VALUE_FORMAT);
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
	 * @param {Aura.Component} component - The inputDate component
	 *
	 * @return {HTMLElement} The input element
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
	 * @param {Aura.Component} component - The inputDate component
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
	 * @param {Aura.Component} component - The inputDate component
	 * @param {string}         name      - The event name
	 * @param {Object}         args      - Optional event arguments
	 *
	 * @return {void}
	 */
	fireEvent: function(component, name, args) {
		var event = component.getEvent(name);
		event.setParam('arguments', args || {});
		event.fire();
	}
}) // eslint-disable-line semi