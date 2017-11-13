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
	select: function(component, event, helper) {
		var inputElement = helper.getInputElement(component);
		if (inputElement) {
			inputElement.select();
		}
	},

	/**
	 * Initializes the component
	 */
	init: function(component, event, helper) {
		helper.importModules(component);
	},

	/**
	 * Handles change to the value attribute
	 */
	valueChange: function(component, event, helper) {
		if (component.ignoreValueChange) {
			return;
		}

		helper.updateInputElement(component);
	},

	/**
	 * Handles the focus event of the input element. Removes any formatting from the input
	 */
	inputFocus: function(component, event, helper) {
		if (helper.utils.isDesktop()) {
			helper.performBehaviorAction(component, event, 'onFocus');
		}

		helper.fireEvent(component, 'onfocus');
	},

	/**
	 * Handles the blur event of the input element. Applies formatting
	 */
	inputBlur: function(component, event, helper) {
		helper.performBehaviorAction(component, event, 'onBlur');
		helper.fireEvent(component, 'onblur');
	},

	/**
	 * Handles the keydown event of the input element. Implements the ARROW UP and ARROW DOWN step
	 * functionality
	 */
	inputKeyDown: function(component, event, helper) {
		var changed = helper.performBehaviorAction(component, event, 'onKeyDown');
		if (changed) {
			helper.fireEvent(component, 'onchange');
		}
	},

	/**
	 * Handles the keypress event of the input element. Allows only numbers and certain special
	 * characters to be entered
	 */
	inputKeyPress: function(component, event, helper) {
		// We don't need to handle this event on mobile
		if (helper.utils.isMobile()) {
			return;
		}

		helper.performBehaviorAction(component, event, 'onKeyPress');
	},

	/**
	 * Handles the change event of the input element. Updates the component value
	 */
	inputChange: function(component, event, helper) {
		var changed = helper.performBehaviorAction(component, event, 'onChange');
		if (changed) {
			helper.fireEvent(component, 'onchange');
		}
	}
})