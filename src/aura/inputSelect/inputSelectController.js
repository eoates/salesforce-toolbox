/**************************************************************************************************
 * inputSelectController.js
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
	 * Selects the input element
	 */
	select: function(component, event, helper) {
		var editable = component.get('v.editable');
		if (!editable) {
			return;
		}

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

		helper.setOldValue(component);
		helper.setSelectedIndexFromValue(component);
		helper.updateInputAndSelectElements(component);
	},

	/**
	 * Handles change to the options attribute
	 */
	optionsChange: function(component, event, helper) {
		helper.createAndSetLocalOptions(component);
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
			component.blurTimeoutId = null;
			return;
		}

		// Add the has-focus class
		var container = helper.getContainerElement(component);
		helper.utils.addClass(container, 'has-focus');

		// Walk up the element tree and check to see if the component is within a slds-form-element
		// and, if so, check whether it has the slds-has-error class. This is to prevent issues with
		// styling when the text input has focus
		var hasError = false;
		var element = container;
		while (element) {
			if (helper.utils.hasClass(element, 'slds-form-element')) {
				hasError = helper.utils.hasClass(element, 'slds-has-error');
				if (hasError) {
					break;
				}
			}
			element = element.parentElement;
		}

		if (hasError) {
			helper.utils.addClass(container, 'has-error');
		}

		// Fire the focus event
		helper.fireEvent(component, 'onfocus');
	},

	/**
	 * Handles the focusout event of the container element
	 */
	containerFocusOut: function(component, event, helper) {
		// Do nothing if the component is not rendered. This seems to happen in the Salesforce1
		// mobile app when the user refreshes the view while an inputSelect component has focus
		if (!component.isRendered() || !component.isValid()) {
			return;
		}

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
			component.blurTimeoutId = null;

			var container = helper.getContainerElement(component);
			helper.utils.removeClass(container, 'has-focus');
			helper.utils.removeClass(container, 'has-error');

			helper.fireEvent(component, 'onblur');
		}), 0);
	},

	/**
	 * Handles the blur event of the input element. This only fires in editable mode since the input
	 * element does not exist when editable is false
	 */
	inputBlur: function(component, event, helper) {
		// Do nothing if the component is not rendered. This seems to happen in the Salesforce1
		// mobile app when the user refreshes the view while an inputSelect component has focus
		if (!component.isRendered() || !component.isValid()) {
			return;
		}

		var type = component.get('v.type');
		if (type === 'number') {
			var selectElement = helper.getSelectElement(component);
			var selectedIndex = selectElement.selectedIndex;
			if (selectedIndex !== -1) {
				return;
			}

			// Update the value
			var valueChanged = helper.performNumberInputBehaviorAction(component, event, 'onBlur');

			// Make sure no option is selected in the select list
			var selectedIndexChanged = helper.setSelectedIndex(component, -1);
			helper.updateSelectElement(component);

			// If the value was changed then fire the event
			var changed = valueChanged || selectedIndexChanged;
			if (changed) {
				helper.fireEvent(component, 'onchange');
			}
		} else {
			component.pendingAutocomplete = false;
			helper.setValueFromInputElement(component);
		}
	},

	/**
	 * Handles the input event of the input element. This only fires in editable mode since the
	 * input element does not exist when editable is false
	 */
	inputInput: function(component, event, helper) {
		var type = component.get('v.type');
		if (type === 'number') {
			var selectElement = helper.getSelectElement(component);
			selectElement.selectedIndex = -1;

			helper.performNumberInputBehaviorAction(component, event, 'onInput');
		}
	},

	/**
	 * Handles the keydown event of the input element. This only fires in editable mode since the
	 * input element does not exist when editable is false
	 */
	inputKeyDown: function(component, event, helper) {
		// Autocomplete and up/down selection not implemented for mobile
		if (helper.utils.isMobile()) {
			return;
		}

		var selectElement = helper.getSelectElement(component);

		var handled = false;
		var which = event.which || event.keyCode;
		switch (which) {
		case 8: // Backspace
		case 46: // Delete
			component.pendingAutocomplete = false;
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
		// Autocomplete not implemented for number inputs
		var type = component.get('v.type');
		if (type === 'number') {
			return;
		}

		// Autocomplete not implemented for mobile
		if (helper.utils.isMobile()) {
			return;
		}

		// Reset pending autocomplete flag. This will be set to true if a match is found and we
		// insert and highlight the rest of the match
		component.pendingAutocomplete = false;

		// Get input and list elements
		var inputElement = event.target;
		var selectElement = helper.getSelectElement(component);

		var value = inputElement.value;
		value = value.substring(0, inputElement.selectionStart)
			+ String.fromCharCode(event.which || event.keyCode)
			+ value.substring(inputElement.selectionEnd);

		var selectionStart = inputElement.selectionStart + 1;

		// Try to find an option that has a label that begins with the same text entered into the
		// text input
		var options = helper.getLocalOptions(component);
		var index = helper.indexOfOptionByLabelStartsWith(options, value);
		if (index !== -1) {
			// A match was found! Insert the rest of the matching label text and highlight it so
			// that as the user keeps typing it overwrites the inserted text
			var option = options[index];

			inputElement.value = value + option.label.substring(value.length);
			inputElement.selectionStart = selectionStart;
			inputElement.selectionEnd = option.label.length;

			component.pendingAutocomplete = true;
			event.preventDefault();
		}

		selectElement.selectedIndex = index;
	},

	/**
	 * Handles the change event of the input element. This only fires in editable mode since the
	 * input element does not exist when editable is false
	 */
	inputChange: function(component, event, helper) {
		var type = component.get('v.type');
		if (type === 'number') {
			// If the select list has an option selected then do nothing as this means the user
			// probably changed the value by pressing up/down on the keyboard to select an option
			var selectElement = helper.getSelectElement(component);
			var selectedIndex = selectElement.selectedIndex;
			if (selectedIndex !== -1) {
				return;
			}

			// Update the value
			var valueChanged = helper.performNumberInputBehaviorAction(
				component,
				event,
				'onChange'
			);

			// Make sure no option is selected in the select list
			var selectedIndexChanged = helper.setSelectedIndex(component, -1);
			helper.updateSelectElement(component);

			// If the value was changed then fire the event
			var changed = valueChanged || selectedIndexChanged;
			if (changed) {
				helper.fireEvent(component, 'onchange');
			}
		} else {
			// Update the value and select a matching option if one exists
			component.pendingAutocomplete = false;
			helper.setValueFromInputElement(component);
		}
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
}) // eslint-disable-line semi