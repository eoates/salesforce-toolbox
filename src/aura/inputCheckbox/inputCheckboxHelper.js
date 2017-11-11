({
	/**
	 * Returns the input HTML element
	 *
	 * @param {Aura.Component} component the inputCheckbox component
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
	 * Fire the named event
	 *
	 * @param {Aura.Component} component the inputCheckbox component
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