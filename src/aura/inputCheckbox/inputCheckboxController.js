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
	 * Handles the focus event of the input element
	 */
	inputFocus: function(component, event, helper) {
		helper.fireEvent(component, 'onfocus');
	},

	/**
	 * Handles the blur event of the input element
	 */
	inputBlur: function(component, event, helper) {
		helper.fireEvent(component, 'onblur');
	},

	/**
	 * Handles the change event of the input element
	 */
	inputChange: function(component, event, helper) {
		var inputElement = event.target;

		component.set('v.value', inputElement.checked);
		helper.fireEvent(component, 'onchange');
	}
})