({
	/**
	 * Sets focus to the input element when the component is in editable mode and to the select
	 * element in non-editable mode
	 */
	focus: function(component, event, helper) {
		var editable = component.get('v.editable');

		var element;
		if (editable) {
			element = helper.getInputElement(component);
		} else {
			element = helper.getSelectElement(component);
		}

		if (element) {
			element.focus();
		}
	},

	/**
	 * Initializes the component
	 */
	init: function(component, event, helper) {
		helper.createAndSetLocalOptions(component);
		helper.setSelectedIndexFromValue(component);
	},

	/**
	 * Handles change to the value attribute
	 */
	valueChange: function(component, event, helper) {
		if (!component.isValid() || !component.isRendered()) {
			return;
		} else if (component.ignoreValueChange) {
			return;
		}

		helper.setSelectedIndexFromValue(component);
		helper.updateInputAndSelectElements(component);
	},

	/**
	 * Handles change to the options attribute
	 */
	optionsChange: function(component, event, helper) {
		var options = helper.createAndSetLocalOptions(component);
		helper.setSelectedIndexFromValue(component);

		if (!component.isValid() || !component.isRendered()) {
			return;
		}

		helper.updateOptionElements(component);
		helper.updateInputAndSelectElements(component);
	},

	/**
	 * Handles change to the selectedIndex attribute
	 */
	selectedIndexChange: function(component, event, helper) {
		if (!component.isValid() || !component.isRendered()) {
			return;
		} else if (component.ignoreSelectedIndexChange) {
			return;
		}

		var selectedIndex = component.get('v.selectedIndex');
		selectedIndex = +selectedIndex;
		if (isNaN(selectedIndex)) {
			selectedIndex = -1;
		}

		helper.setSelectedIndex(component, selectedIndex);
		helper.setValueFromSelectedIndex(component);
		helper.updateInputAndSelectElements(component);
	},

	/**
	 * Handles change to the editable attribute
	 */
	editableChange: function(component, event, helper) {
		if (!component.isValid() || !component.isRendered()) {
			return;
		}

		setTimeout($A.getCallback(function() {
			helper.updateOptionElements(component);
			helper.updateInputAndSelectElements(component);
		}), 0);
	},

	/**
	 * Handles the focusin event of the container element
	 */
	containerFocusIn: function(component, event, helper) {
		// If the editable attribute is false we don't need to do anything
		var editable = component.get('v.editable');
		if (!editable) {
			return;
		}

		// If the blur timeout has not fired yet that means focus remained within the component so
		// just clear the timeout and exit
		if (component.blurTimeoutId) {
			clearTimeout(component.blurTimeoutId);
			component.blurTimeoutId = undefined;
			return;
		}

		// Add the has-focus class
		var container = component.find('container').getElement();
		$A.util.addClass(container, 'has-focus');

		// Walk up the element tree and check to see if the component is within a slds-form-element
		// and, if so, check whether it has the slds-has-error class
		var hasError = false;
		var element = container;
		while (element) {
			if ($A.util.hasClass(element, 'slds-form-element')) {
				hasError = $A.util.hasClass(element, 'slds-has-error');
				break;
			}
			element = element.parentElement;
		}

		if (hasError) {
			$A.util.addClass(container, 'has-error');
		}

		// Fire the focus event
		helper.fireEvent(component, 'onfocus');
	},

	/**
	 * Handles the focusout event of the container element
	 */
	containerFocusOut: function(component, event, helper) {
		// If the editable attribute is false we don't need to do anything
		var editable = component.get('v.editable');
		if (!editable) {
			return;
		}

		// Focus may be changing between 2 elements within the container so we can't fire the blur
		// event immediately. We use a timeout to wait a fraction of a second. If focus changes to
		// another element within this container then the focusin event will fire and clear the
		// timeout
		component.blurTimeoutId = setTimeout($A.getCallback(function() {
			component.blurTimeoutId = undefined;

			var container = component.find('container').getElement();
			$A.util.removeClass(container, 'has-focus');
			$A.util.removeClass(container, 'has-error');

			helper.fireEvent(component, 'onblur');
		}), 0);
	},

	/**
	 * Handles the focus event of the input element. This only fires in editable mode since the
	 * input element does not exist when editable is false
	 */
	inputFocus: function(component, event, helper) {
		var inputElement = event.target;
		var autoSelect = component.get('v.autoselect');
		if (autoSelect) {
			inputElement.select();
		}
	},

	/**
	 * Handles the blur event of the input element. This only fires in editable mode since the input
	 * element does not exist when editable is false
	 */
	inputBlur: function(component, event, helper) {
		if (component.pendingAutocomplete) {
			component.pendingAutocomplete = false;
			helper.setValueFromInputElement(component);
		}
	},

	/**
	 * Handles the keydown event of the input element. This only fires in editable mode since the
	 * input element does not exist when editable is false
	 */
	inputKeyDown: function(component, event, helper) {
		var which = event.which || event.keyCode;

		var handled = false;
		switch (which) {
			case 8: // Backspace
			case 46: // Delete
				component.pendingAutocomplete = false;

				var selectElement = helper.getSelectElement(component);
				selectElement.selectedIndex = -1;
				break;

			case 38: // Up arrow
				if (helper.selectNextOptionElement(component, true)) {
					component.pendingAutocomplete = false;
					helper.setValueFromSelectElement(component);
				}
				handled = true;
				break;

			case 40: // Down arrow
				if (helper.selectNextOptionElement(component, false)) {
					component.pendingAutocomplete = false;
					helper.setValueFromSelectElement(component);
				}
				handled = true;
				break;
		}

		if (handled) {
			event.preventDefault();
		}
	},

	/**
	 * Handles the change event of the input element. This only fires in editable mode since the
	 * input element does not exist when editable is false
	 */
	inputKeyPress: function(component, event, helper) {
		component.pendingAutocomplete = false;

		var inputElement = event.target;
		var selectElement = helper.getSelectElement(component);

		var value = inputElement.value;
		value = value.substring(0, inputElement.selectionStart)
			+ value.substring(inputElement.selectionEnd)
			+ String.fromCharCode(event.which || event.keyCode);

		var options = component.get('v.localOptions');
		var index = helper.indexOfOptionByLabelStartsWith(options, value);
		if (index !== -1) {
			var option = options[index];

			inputElement.value = value + option.label.substring(value.length);
			inputElement.selectionStart = value.length;
			inputElement.selectionEnd = option.label.length;

			selectElement.selectedIndex = index;

			component.pendingAutocomplete = true;
			event.preventDefault();
		}
	},

	/**
	 * Handles the change event of the input element. This only fires in editable mode since the
	 * input element does not exist when editable is false
	 */
	inputChange: function(component, event, helper) {
		component.pendingAutocomplete = false;
		helper.setValueFromInputElement(component);
	},

	/**
	 * Handles the focus event of the select element. This only fires when editable is false.
	 * Although the select element exists in editable and non-editable modes, when editable is true
	 * the select element has no focus event listener attached
	 */
	selectFocus: function(component, event, helper) {
		helper.fireEvent(component, 'onfocus');
	},

	/**
	 * Handles the blur event of the select element. This only fires when editable is false.
	 * Although the select element exists in editable and non-editable modes, when editable is true
	 * the select element has no blur event listener attached
	 */
	selectBlur: function(component, event, helper) {
		helper.fireEvent(component, 'onblur');
	},

	/**
	 * Handles the change event of the select element. This fires in editable and non-editable modes
	 */
	selectChange: function(component, event, helper) {
		helper.setValueFromSelectElement(component);
	}
})