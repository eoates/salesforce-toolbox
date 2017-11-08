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
	 * Selects the input element
	 */
	select: function() {
		var inputElement = helper.getInputElement(component);
		if (inputElement) {
			inputElement.select();
		}
	},

	/**
	 * Handles change to the value attribute
	 */
	valueChange: function(component, event, helper) {
		if (component.ignoreValueChange) {
			return;
		}
		helper.updateInputElementValue(component);
	},

	/**
	 * Handles the focus event of the input element
	 */
	inputFocus: function(component, event, helper) {
		var inputElement = event.target;
		var autoSelect = component.get('v.autoselect');
		if (autoSelect) {
			inputElement.select();
		}

		helper.fireEvent(component, 'onfocus');
	},

	/**
	 * Handles the blur event of the input element
	 */
	inputBlur: function(component, event, helper) {
		helper.updateInputElementValue(component);
		helper.fireEvent(component, 'onblur');
	},

	/**
	 * Handles the change event of the input element
	 */
	inputChange: function(component, event, helper) {
		var inputElement = event.target;
		helper.setValue(component, inputElement.value, false);
	}
})