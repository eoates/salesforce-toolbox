/**************************************************************************************************
 * inputCheckboxHelper.js
 **************************************************************************************************
 * This is a shared component. Do not make modifications to this component without carefully
 * considering the impact this may have on existing applications/components/pages/etc. that use this
 * component.
 *
 * @author Eugene Oates
 *
 **************************************************************************************************/
({
	/**
	 * Imports modules used by the component
	 *
	 * @param {Aura.Component} component - The inputCheckbox component
	 *
	 * @return {void}
	 */
	importModules: function(component) {
		if (!this.utils) {
			this.utils = component.find('utils').getModule();
		}
	},

	/**
	 * Sets the value
	 *
	 * @param {Aura.Component} component - The inputText component
	 * @param {boolean}        value     - The value
	 *
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
	 * @param {Aura.Component} component - The inputCheckbox component
	 *
	 * @return {HTMLElement} The input element
	 */
	getInputElement: function(component) {
		var input = component.find('input');
		if (input) {
			return input.getElement();
		}
		return undefined;
	},

	/**
	 * Updates the input element
	 *
	 * @param {Aura.Component} component - The inputCheckbox component
	 *
	 * @return {void}
	 */
	updateInputElement: function(component) {
		var inputElement = this.getInputElement(component);
		if (!inputElement) {
			return;
		}

		var value = component.get('v.value');
		inputElement.checked = this.utils.asBoolean(value);
		inputElement.indeterminate = this.utils.isUndefinedOrNull(value);
	},

	/**
	 * Fire the named event
	 *
	 * @param {Aura.Component} component - The inputCheckbox component
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