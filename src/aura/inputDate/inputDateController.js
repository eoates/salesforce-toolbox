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
	 * Handles change to the disabled attribute
	 */
	disabledChange: function(component, event, helper) {
		// If disabled then close the dropdown
		var disabled = component.get('v.disabled');
		if (disabled && helper.isOpen(component)) {
			helper.close(component);
		}
	},

	/**
	 * Handles change to the readonly attribute
	 */
	readOnlyChange: function(component, event, helper) {
		// If read-only then close the dropdown
		var readOnly = component.get('v.readonly');
		if (readOnly && helper.isOpen(component)) {
			helper.close(component);
		}
	},

	/**
	 * Handles the focusin event of the container element
	 */
	containerFocusIn: function(component, event, helper) {
		// Check the blurTimeoutId property on the component. If it has a value then that means we
		// just lost focus because focus changed from one element to another within the container
		// so we just want to clear the timeout and do nothing. Otherwise, if blurTimeoutId has no
		// value then we are getting focus from some element outside of the datepicker
		if (component.blurTimeoutId) {
			clearTimeout(component.blurTimeoutId);
			component.blurTimeoutId = null;
			return;
		}

		helper.fireEvent(component, 'onfocus');
	},

	/**
	 * Handles the focusout event of the container element
	 */
	containerFocusOut: function(component, event, helper) {
		// When focus goes from one control to another within the container the onfocusout will be
		// fired when the current element loses focus and onfocusin will be fired when the new
		// element gains focus. When onfocusout is called we use a timeout to wait a fraction of a
		// second to see if another element within the container gains focus. If so then we will
		// clear the timeout and do nothing. If not, however, then we will fire our own onblur event
		if (component.blurTimeoutId) {
			clearTimeout(component.blurTimeoutId);
		}

		component.blurTimeoutId = setTimeout($A.getCallback(function() {
			component.blurTimeoutId = null;
			helper.fireEvent(component, 'onblur');
		}), 0);
	},

	/**
	 * Handles the focus event of the input element
	 */
	inputFocus: function(component, event, helper) {
		if (helper.isDesktop()) {
			var inputElement = event.target;

			var autoSelect = component.get('v.autoselect');
			if (autoSelect) {
				inputElement.select();
			}
		} else {
			helper.fireEvent(component, 'onfocus');
		}
	},

	/**
	 * Handles the blur event of the input element
	 */
	inputBlur: function(component, event, helper) {
		if (helper.isDesktop()) {
			helper.updateInputElementValue(component);
		} else {
			helper.fireEvent(component, 'onblur');
		}
	},

	/**
	 * Handles the change event of the input element
	 */
	inputChange: function(component, event, helper) {
		var inputElement = event.target;
		helper.setValue(component, inputElement.value);
	},

	/**
	 * Handles the click event of the trigger element
	 */
	triggerClick: function(component, event, helper) {
		helper.open(component, true);
	},

	/**
	 * Handles the select event of the datepicker
	 */
	datepickerSelect: function(component, event, helper) {
		var datepicker = event.getSource();
		var value = datepicker.get('v.value');

		helper.setValue(component, value);
		helper.close(component, true);
	},

	/**
	 * Handles the change event of the datepicker
	 */
	datepickerChange: function(component, event, helper) {
	},

	/**
	 * Handles the cancel event of the datepicker
	 */
	datepickerCancel: function(component, event, helper) {
		helper.close(component, true);
	},

	/**
	 * Handles the focus event of the datepicker
	 */
	datepickerFocus: function(component, event, helper) {
	},

	/**
	 * Handles the blur event of the datepicker
	 */
	datepickerBlur: function(component, event, helper) {
		helper.close(component);
	}
})