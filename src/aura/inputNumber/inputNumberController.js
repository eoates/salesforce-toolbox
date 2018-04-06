/**************************************************************************************************
 * inputNumberController.js
 **************************************************************************************************
 * This is a shared component. Do not make modifications to this component without carefully
 * considering the impact this may have on existing applications/components/pages/etc. that use this
 * component.
 *
 * @author   Eugene Oates
 * @date     2018-03-20
 * @version  1.0.0
 *
 **************************************************************************************************/
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
		helper.fireEvent(component, 'onfocus');
	},

	/**
	 * Handles the blur event of the input element. Applies formatting
	 */
	inputBlur: function(component, event, helper) {
		var changed = helper.performBehaviorAction(component, event, 'onBlur');
		if (changed) {
			helper.fireEvent(component, 'onchange');
		}
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

	inputInput: function(component, event, helper) {
		helper.performBehaviorAction(component, event, 'onInput');
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
}) // eslint-disable-line semi