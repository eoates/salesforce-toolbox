({
	/**
	 * Returns the input HTML element
	 *
	 * @param {Aura.Component} component the inputCheckbox component
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
	 * Fire the named event
	 *
	 * @param {Aura.Component} component the inputCheckbox component
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