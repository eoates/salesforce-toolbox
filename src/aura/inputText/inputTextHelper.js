/**************************************************************************************************
 * inputTextHelper.js
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
	 * @param {Aura.Component} component - The inputText component
	 *
	 * @return {void}
	 */
	importModules: function(component) {
		if (!this.utils) {
			this.utils = component.find('utils').getModule();
		}
	},

	/**
	 * Gets the previous value of the component
	 *
	 * @param {Aura.Component} component - The inputSelect component
	 *
	 * @return {string} The previous value
	 */
	getOldValue: function(component) {
		return component.oldValue;
	},

	/**
	 * Sets the oldValue to the current value
	 *
	 * @param {Aura.Component} component - The inputText component
	 *
	 * @return {void}
	 */
	setOldValue: function(component) {
		component.oldValue = component.get('v.value');
	},

	/**
	 * Sets the value
	 *
	 * @param {Aura.Component} component - The inputText component
	 * @param {string}         value     - The value
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
	 * @param {Aura.Component} component - The inputText component
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
	 * Updates the value of the input element so it displays the formatted value
	 *
	 * @param {Aura.Component} component - The inputText component
	 *
	 * @return {void}
	 */
	updateInputElement: function(component) {
		var inputElement = this.getInputElement(component);
		if (inputElement) {
			var value = component.get('v.value');
			value = this.utils.asString(value);

			inputElement.value = value;
		}
	},

	/**
	 * Fire the named event
	 *
	 * @param {Aura.Component} component - The inputText component
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