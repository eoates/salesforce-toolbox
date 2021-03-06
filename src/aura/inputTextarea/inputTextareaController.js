/**************************************************************************************************
 * inputTextareaController.js
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
		helper.setOldValue(component);
	},

	/**
	 * Handles change to the value attribute
	 */
	valueChange: function(component, event, helper) {
		if (component.ignoreValueChange) {
			return;
		}

		helper.setOldValue(component);
		helper.updateInputElement(component);
		helper.updateCounterElement(component);
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
	 * Handles the input event of the input element
	 */
	inputInput: function(component, event, helper) {
		var inputElement = event.target;
		var value = inputElement.value;

		var autoTrim = component.get('v.autotrim');
		if (autoTrim) {
			value = helper.utils.trim(value);
		}

		helper.setValue(component, value);
		helper.updateCounterElement(component);
	},

	/**
	 * Handles the change event of the input element
	 */
	inputChange: function(component, event, helper) {
		var inputElement = event.target;
		var value = inputElement.value;

		var autoTrim = component.get('v.autotrim');
		if (autoTrim) {
			value = helper.utils.trim(value);
			inputElement.value = value;
		}

		helper.updateCounterElement(component);

		var oldValue = helper.getOldValue(component);
		oldValue = helper.utils.asString(oldValue);

		var changed = helper.setValue(component, value);
		if (!changed) {
			changed = value !== oldValue;
		}

		if (changed) {
			helper.setOldValue(component);
			helper.fireEvent(component, 'onchange');
		}
	}
}) // eslint-disable-line semi