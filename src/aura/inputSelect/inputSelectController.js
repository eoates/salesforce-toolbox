({
	/**
	 * Sets focus to the select element
	 */
	focus: function(component, event, helper) {
		var selectElement = helper.getSelectElement(component);
		if (selectElement) {
			selectElement.focus();
		}
	},

	/**
	 * Handles change to the value attribute
	 */
	valueChange: function(component, event, helper) {
		if (component.ignoreValueChange) {
			return;
		}
		helper.updateOptions(component);
	},

	/**
	 * Handles change to the options attribute
	 */
	optionsChange: function(component, event, helper) {
		helper.updateOptions(component);
	},

	/**
	 * Handles the focus event of the select element
	 */
	selectFocus: function(component, event, helper) {
		helper.fireEvent(component, 'onfocus');
	},

	/**
	 * Handles the blur event of the select element
	 */
	selectBlur: function(component, event, helper) {
		helper.fireEvent(component, 'onblur');
	},

	/**
	 * Handles the change event of the select element
	 */
	selectChange: function(component, event, helper) {
		helper.setValue(component, event.target.value);
	}
})