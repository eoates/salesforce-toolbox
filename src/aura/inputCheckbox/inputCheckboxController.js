/**************************************************************************************************
 * inputCheckboxController.js
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
		var value = inputElement.checked;

		var changed = helper.setValue(component, value);

		if (changed) {
			helper.fireEvent(component, 'onchange');
		}
	}
}) // eslint-disable-line semi