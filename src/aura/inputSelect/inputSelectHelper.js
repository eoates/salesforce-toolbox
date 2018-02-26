({
	/**
	 * Imports modules used by the component
	 *
	 * @param {Aura.Component} component - The inputSelect component
	 *
	 * @return {void}
	 */
	importModules: function(component) {
		if (!this.utils) {
			this.utils = component.find('utils').getModule();
		}
	},

	/**
	 * Parses an option string. Option strings can be either a simple string such as "Option 1" or
	 * they can contain a value and label separated by a colon such as "1: Value for Option 1".
	 * In the latter example the value would be "1" and the label would be "Option 1". We do not
	 * support colons within the value. If you need a colon in the value then you must pass in an
	 * object with its own value and label properties
	 *
	 * @param {string} optionString - The string representation of an option
	 *
	 * @return {Object} The option object
	 */
	parseOptionString: function(optionString) {
		var value = optionString;
		var label = value;

		var indexOfEqual = optionString.indexOf(':');
		if (indexOfEqual !== -1) {
			value = optionString.substr(0, indexOfEqual);
			label = optionString.substr(indexOfEqual + 1);
		}

		value = this.utils.trim(value);
		label = this.utils.trim(label);

		return {
			value: value,
			label: label
		};
	},

	/**
	 * Creates a local copy of the options so we don't modify the array passed via the component's
	 * options attribute
	 *
	 * @param {Object[]} options - The options to copy
	 *
	 * @return {Object[]} An array containing the copied options
	 */
	createLocalOptions: function(options) {
		var localOptions = [];

		if (this.utils.isEmpty(options)) {
			options = [];
		}

		for (var i = 0, n = options.length; i < n; i++) {
			var option = options[i];
			if (this.utils.isString(option)) {
				option = this.parseOptionString(option);
			}

			var value = this.utils.asString(option.value);
			var label = this.utils.asString(option.label);
			var disabled = !!option.disabled;

			var localOption = {
				className: this.getOptionClass(option),
				value: value,
				label: label || value,
				title: this.getOptionTitle(option),
				disabled: disabled
			};

			localOptions.push(localOption);
		}

		return localOptions;
	},

	/**
	 * Gets the list of local options. Local options are the options created and managed by the
	 * component based on the options attribute. The component creates and manages its own, separate
	 * array of options in order to prevent needing to modify the value of the options attribute
	 *
	 * @param {Aura.Component} component - The inputSelect component
	 *
	 * @return {Object[]} An array containing the local options
	 */
	getLocalOptions: function(component) {
		return component.localOptions;
	},

	/**
	 * Copies the options from the component's options attribute and stores them in a private
	 * attribute named localOptions
	 *
	 * @param {Aura.Component} component - The inputSelect component
	 *
	 * @return {Object[]} An array containing the copied options
	 */
	createAndSetLocalOptions: function(component) {
		var options = component.get('v.options');
		var localOptions = this.createLocalOptions(options);
		component.localOptions = localOptions;
		return localOptions;
	},

	/**
	 * Returns the CSS class for the option. We support 2 attributes for specifying an option's
	 * class - class and className. Since class is a keyword we have to use quotes. Additionally, if
	 * the option's valid property is false then "slds-text-color_error" is appended to the class
	 *
	 * @param {Object} option - The option
	 *
	 * @return {string} The option's CSS class
	 */
	getOptionClass: function(option) {
		var className = this.utils.trim(option['class']) + ' ' + this.utils.trim(option.className);
		if (option.valid === false) {
			className += ' slds-text-color_error';
		}
		return className;
	},

	/**
	 * Returns the string to use for the option's title attribute. If the option's valid property is
	 * false then the option's message property is used instead of title unless message is blank
	 *
	 * @param {Object} option - The option
	 *
	 * @return {string} The option's title
	 */
	getOptionTitle: function(option) {
		var title = this.utils.trim(option.title);
		if (option.valid === false) {
			var message = this.utils.trim(option.message);
			if (message !== '') {
				title = message;
			}
		}
		return title;
	},

	/**
	 * Returns the index of the first element in the array that matches the predicate
	 *
	 * @param {*}        values    - The array of values to search
	 * @param {Function} predicate - A function that will be called for each element in the array
	 *                               until it returns true
	 *
	 * @return {number} The index of the first element that matched the predicate or -1 if there
	 *                  was no match
	 */
	indexOf: function(values, predicate) {
		if (values && values.length) {
			for (var i = 0, n = values.length; i < n; i++) {
				var value = values[i];
				var match = predicate.call(this, value, i, values);
				if (match) {
					return i;
				}
			}
		}
		return -1;
	},

	/**
	 * Returns the index of the first option that has the specified value
	 *
	 * @param {Object[]} options - The options
	 * @param {string}   value   - The value to find
	 *
	 * @return {number} The index of the matching option or -1
	 */
	indexOfOptionByValue: function(options, value) {
		return this.indexOf(options, function(option) {
			return (option.value === value);
		});
	},

	/**
	 * Returns the index of the first option that is not disabled and has the specified label
	 *
	 * @param {Object[]} options - The options
	 * @param {string}   label   - The label to find
	 *
	 * @return {number} The index of the matching option or -1
	 */
	indexOfOptionByLabel: function(options, label) {
		var labelLower = label.toLowerCase();
		return this.indexOf(options, function(option) {
			return !option.disabled && (option.label.toLowerCase() === labelLower);
		});
	},

	/**
	 * Returns the index of the first option that is not disabled and where the label starts with
	 * the specified text
	 *
	 * @param {Object[]} options - The options
	 * @param {string}   label   - The label to find
	 *
	 * @return {number} The index of the matching option or -1
	 */
	indexOfOptionByLabelStartsWith: function(options, label) {
		if (!label) {
			return -1;
		}

		var labelLower = label.toLowerCase();
		var labelLength = label.length;
		return this.indexOf(options, function(option) {
			if (option.disabled) {
				return false;
			}

			var optionLabel = option.label;
			var optionLabelLower = optionLabel.toLowerCase();
			if (optionLabel.length < labelLength) {
				return false;
			}

			return (optionLabelLower.substring(0, labelLength) === labelLower);
		});
	},

	/**
	 * Selects the next option element based on the current selection. If reverse is true then this
	 * method actually selects the previous option. This method should only be called when editable
	 * is true
	 *
	 * @param {Aura.Component} component       - The inputSelect component
	 * @param {boolean}        [reverse=false] - true to select previous option
	 *
	 * @return {boolean} true if the selected option was changed; otherwise, false
	 */
	selectNextOptionElement: function(component, reverse) {
		var editable = component.get('v.editable');
		if (!editable) {
			return false;
		}

		var options = this.getLocalOptions(component);

		var inputElement = this.getInputElement(component);
		var selectElement = this.getSelectElement(component);

		// If there is no selected option then try to find a good starting point based on the
		// text entered into the input element
		var selectedIndex = selectElement.selectedIndex;
		if (selectedIndex === -1) {
			selectedIndex = this.indexOfOptionByLabel(options, inputElement.value);
		}

		// Get the indexes to check
		var i;
		var indexes = [];
		if (reverse) {
			for (i = 0; i < selectedIndex; i++) {
				indexes.push(i);
			}
			indexes = indexes.reverse();
		} else {
			for (i = (selectedIndex + 1); i < options.length; i++) {
				indexes.push(i);
			}
		}

		// Find the next option that isn't disabled
		for (i = 0; i < indexes.length; i++) {
			var index = indexes[i];
			var option = options[index];
			if (!option.disabled) {
				selectedIndex = index;
				break;
			}
		}

		// If the selection changed then update the select and input elements
		var changed = (selectedIndex !== selectElement.selectedIndex);
		if (changed) {
			selectElement.selectedIndex = selectedIndex;

			if (selectedIndex !== -1) {
				inputElement.value = options[selectedIndex].label;
				inputElement.focus();
				inputElement.select();
			}
		}

		return changed;
	},

	/**
	 * Updates the select element's options
	 *
	 * @param {Aura.Component} component - The inputSelect component
	 *
	 * @return {void}
	 */
	updateOptionElements: function(component) {
		// Get the select element
		var selectElement = this.getSelectElement(component);
		if (!selectElement) {
			return;
		}

		// Update the options
		var options = this.getLocalOptions(component);
		for (var i = 0, n = options.length; i < n; i++) {
			// Get option info
			var option = options[i];

			// Update the option element
			var optionElement;
			if (i < selectElement.children.length) {
				// An option already exists at this index so just update it
				optionElement = selectElement.children[i];
			} else {
				// No existing option at this index so add a new option
				optionElement = document.createElement('option');
				selectElement.appendChild(optionElement);
			}

			optionElement.className = option.className;
			optionElement.value = option.value;
			optionElement.title = option.title;
			optionElement.disabled = option.disabled;
			optionElement.innerText = option.label;
		}

		// Remove any extra options
		while (selectElement.children.length > options.length) {
			var lastChild = selectElement.children[selectElement.children.length - 1];
			selectElement.removeChild(lastChild);
		}
	},

	/**
	 * Updates the value of the input element based on the component value. If an option exists
	 * with the same value as the component then the input element's value is set to the label of
	 * that option; otherwise, we just set the input element's value is set to the component value
	 *
	 * @param {Aura.Component} component - The inputSelect component
	 *
	 * @return {void}
	 */
	updateInputElement: function(component) {
		var editable = component.get('v.editable');
		if (!editable) {
			return;
		}

		var inputElement = this.getInputElement(component);

		var value = this.utils.asString(component.get('v.value'));
		var options = this.getLocalOptions(component);
		var selectedIndex = component.get('v.selectedIndex');
		if (selectedIndex === -1) {
			inputElement.value = value;

			var type = component.get('v.type');
			if (type === 'number') {
				var numberInputBehavior = component.find('numberInputBehavior').getModule();
				numberInputBehavior.updateInputElement({
					hasFocus: function() {
						return (inputElement === document.activeElement);
					},
					getValue: function() {
						return value;
					},
					setInputValue: function(value) {
						inputElement.value = value;
					}
				});
			}
		} else {
			inputElement.value = options[selectedIndex].label;
		}
	},

	/**
	 * Updates the selected index of the select element based on the component value
	 *
	 * @param {Aura.Component} component - The inputSelect component
	 *
	 * @return {void}
	 */
	updateSelectElement: function(component) {
		var selectElement = this.getSelectElement(component);
		selectElement.selectedIndex = component.get('v.selectedIndex');
	},

	/**
	 * Updates the input and select elements
	 *
	 * @param {Aura.Component} component - The inputSelect component
	 *
	 * @return {void}
	 */
	updateInputAndSelectElements: function(component) {
		var editable = component.get('v.editable');
		if (editable) {
			component.pendingAutocomplete = false;
			this.updateInputElement(component);
		}

		this.updateSelectElement(component);
	},

	/**
	 * Gets the previous value of the component
	 *
	 * @param {Aura.Component} component - The inputSelect component
	 *
	 * @return {string} The previous value
	 */
	getOldValue: function(component) {
		return component.oldValue;
	},

	/**
	 * Sets the oldValue to the current value
	 *
	 * @param {Aura.Component} component - The inputSelect component
	 *
	 * @return {void}
	 */
	setOldValue: function(component) {
		component.oldValue = component.get('v.value');
	},

	/**
	 * Sets the value
	 *
	 * @param {Aura.Component} component - The inputSelect component
	 * @param {string}         value     - The value
	 *
	 * @return {boolean} true if the value changed
	 */
	setValue: function(component, value) {
		var oldValue = component.get('v.value');
		if (value === oldValue) {
			return false;
		}

		component.ignoreValueChange = true;
		try {
			component.set('v.value', value);
		} finally {
			component.ignoreValueChange = false;
		}

		return true;
	},

	/**
	 * Sets the value based on the selected option index
	 *
	 * @param {Aura.Component} component - The inputSelect component
	 *
	 * @return {boolean} true if the value changed
	 */
	setValueFromSelectedIndex: function(component) {
		var options = this.getLocalOptions(component);
		var selectedIndex = component.get('v.selectedIndex');

		var value = '';
		if ((selectedIndex >= 0) && (selectedIndex < options.length)) {
			value = options[selectedIndex].value;
		}

		var changed = this.setValue(component, value);
		if (changed) {
			this.setOldValue(component);
		}

		return changed;
	},

	/**
	 * Sets the value based on the text in the input element
	 *
	 * @param {Aura.Component} component - The inputSelect component
	 *
	 * @return {boolean} true if the value changed
	 */
	setValueFromInputElement: function(component) {
		var editable = component.get('v.editable');
		if (!editable) {
			return false;
		}

		var inputElement = this.getInputElement(component);
		var selectElement = this.getSelectElement(component);

		var value = inputElement.value;

		var options = this.getLocalOptions(component);
		var selectedIndex = this.indexOfOptionByLabel(options, value);
		if (selectedIndex !== -1) {
			var option = options[selectedIndex];
			value = option.value;

			inputElement.value = option.label;
			selectElement.selectedIndex = selectedIndex;
		} else {
			var autoTrim = component.get('v.autotrim');
			if (autoTrim) {
				value = this.utils.trim(value);
				inputElement.value = value;
			}

			selectElement.selectedIndex = -1;
		}

		var oldValue = this.getOldValue(component);
		oldValue = this.utils.asString(oldValue);

		var valueChanged = this.setValue(component, value);
		var selectedIndexChanged = this.setSelectedIndex(component, selectedIndex);

		var changed = valueChanged || selectedIndexChanged;
		if (!changed) {
			changed = value !== oldValue;
		}

		if (changed) {
			this.setOldValue(component);
			this.fireEvent(component, 'onchange');
		}

		return changed;
	},

	/**
	 * Sets the value based on the option selected in the select element
	 *
	 * @param {Aura.Component} component - The inputSelect component
	 *
	 * @return {boolean} true if the value changed
	 */
	setValueFromSelectElement: function(component) {
		var selectElement = this.getSelectElement(component);
		var value = selectElement.value;
		var selectedIndex = selectElement.selectedIndex;

		var valueChanged = this.setValue(component, value);
		var selectedIndexChanged = this.setSelectedIndex(component, selectedIndex);

		var editable = component.get('v.editable');
		if (editable) {
			var inputElement = this.getInputElement(component);
			if (selectedIndex === -1) {
				inputElement.value = value;
			} else {
				var options = this.getLocalOptions(component);
				inputElement.value = options[selectedIndex].label;
			}
			inputElement.focus();
			inputElement.select();
		}

		var changed = valueChanged || selectedIndexChanged;
		if (changed) {
			this.setOldValue(component);
			this.fireEvent(component, 'onchange');
		}

		return changed;
	},

	/**
	 * Sets the selected index
	 *
	 * @param {Aura.Component} component     - The inputSelect component
	 * @param {number}         selectedIndex - The selected index
	 *
	 * @return {boolean} true if the selectedIndex changed
	 */
	setSelectedIndex: function(component, selectedIndex) {
		var options = this.getLocalOptions(component);
		if (this.utils.isUndefinedOrNull(selectedIndex)) {
			selectedIndex = -1;
		} else if ((selectedIndex < 0) || (selectedIndex >= options.length)) {
			selectedIndex = -1;
		}

		if (selectedIndex === component.get('v.selectedIndex')) {
			return false;
		}

		component.ignoreSelectedIndexChange = true;
		try {
			component.set('v.selectedIndex', selectedIndex);
		} finally {
			component.ignoreSelectedIndexChange = false;
		}

		return true;
	},

	/**
	 * Sets the component's selectedIndex attribute based on its current value
	 *
	 * @param {Aura.Component} component - The inputSelect component
	 *
	 * @return {boolean} true if the selectedIndex changed
	 */
	setSelectedIndexFromValue: function(component) {
		var value = this.utils.asString(component.get('v.value'));
		var options = this.getLocalOptions(component);
		var selectedIndex = this.indexOfOptionByValue(options, value);

		return this.setSelectedIndex(component, selectedIndex);
	},

	/**
	 * Returns the input element
	 *
	 * @param {Aura.Component} component - The inputSelect component
	 *
	 * @return {HTMLElement} The input element
	 */
	getInputElement: function(component) {
		var input = component.find('input');
		if (input) {
			return input.getElement();
		}
		return undefined;
	},

	/**
	 * Returns the select element
	 *
	 * @param {Aura.Component} component - The inputSelect component
	 *
	 * @return {HTMLElement} The select element
	 */
	getSelectElement: function(component) {
		var select = component.find('select');
		if (select) {
			if (this.utils.isArray(select)) {
				if (select.length > 0) {
					return select[0].getElement();
				}
			} else {
				return select.getElement();
			}
		}
		return undefined;
	},

	/**
	 * Performs a specified behavior action when the component type is "number"
	 *
	 * @param {Aura.Component} component - The inputSelect component
	 * @param {Event}          event     - The event object
	 * @param {string}         name      - The name of the action to perform
	 *
	 * @return {*} Varies depending on the action performed
	 */
	performNumberInputBehaviorAction: function(component, event, name) {
		var editable = component.get('v.editable');
		if (!editable) {
			return undefined;
		}

		var inputElement = this.getInputElement(component);
		var behavior = component.find('numberInputBehavior').getModule();
		var action = behavior[name];

		var self = this;
		return action.call(behavior, event, {
			select: function() {
				inputElement.select();
			},
			hasFocus: function() {
				return (inputElement === document.activeElement);
			},
			getSelectionStart: function() {
				return inputElement.selectionStart;
			},
			getSelectionEnd: function() {
				return inputElement.selectionEnd;
			},
			getInputValue: function() {
				return inputElement.value;
			},
			setInputValue: function(value) {
				inputElement.value = value;
			},
			getValue: function() {
				return component.get('v.value');
			},
			setValue: function(value) {
				value = self.utils.asString(value);
				return self.setValue(component, value);
			}
		});
	},

	/**
	 * Fire the named event
	 *
	 * @param {Aura.Component} component - The inputSelect component
	 * @param {string}         name      - The event name
	 * @param {Object}         args      - Optional event arguments
	 *
	 * @return {void}
	 */
	fireEvent: function(component, name, args) {
		var event = component.getEvent(name);
		event.setParam('arguments', args || {});
		event.fire();
	}
})