({
	/**
	 * Imports modules
	 *
	 * @param  {Aura.Component}
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
	 * @param {Aura.Component} component - the inputText component
	 * @param {string}         value     - the value
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
	 * @param {Aura.Component} component - the inputText component
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
	 * @param {Aura.Component} component - the inputText component
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
	 * @param {Aura.Component} component - the inputText component
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