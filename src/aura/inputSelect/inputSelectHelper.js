({
	/**
	 * Returns the value as a string. If the value is already a string then it is unchanged;
	 * otherwise, it is coerced into a string. Undefined and null are converted to an empty string
	 *
	 * @param {*} value the value to convert
	 * @returns {string} a string
	 */
	asString: function(value) {
		if ($A.util.isUndefinedOrNull(value)) {
			value = '';
		} else if (typeof value !== 'string') {
			value = value + '';
		}
		return value;
	},

	/**
	 * Creates a local copy of the options so we don't modify the array passed via the component's
	 * options attribute
	 *
	 * @param {object[]} options the options to copy
	 * @returns {object[]} an array containing the copied options
	 */
	createLocalOptions: function(options) {
		var localOptions = [];

		if ($A.util.isEmpty(options)) {
			options = [];
		}

		for (var i = 0, n = options.length; i < n; i++) {
			var option = options[i];
			var value = this.asString(option.value);
			var label = this.asString(option.label);
			var disabled = !!option.disabled;

			var localOption = {
				value: value,
				label: label || value,
				className: this.getOptionClass(option),
				disabled: disabled
			};

			localOptions.push(localOption);
		}

		return localOptions;
	},

	/**
	 * Copies the options from the component's options attribute and stores them in a private
	 * attribute named localOptions
	 *
	 * @param {Aura.Component} component the inputSelect component
	 * @returns {object[]} an array containing the copied options
	 */
	createAndSetLocalOptions: function(component) {
		var options = component.get('v.options');
		var localOptions = this.createLocalOptions(options);
		component.set('v.localOptions', localOptions);
		return localOptions;
	},

	/**
	 * Return the CSS class for the option. We support 2 attributes for specifying an option's
	 * class - class and className. Since class is a keyword we have to use quotes
	 *
	 * @param {object} option the option
	 * @returns {string} the option's CSS class
	 */
	getOptionClass: function(option) {
		return this.asString(option['class']) + ' ' + this.asString(option.className);
	},

	/**
	 * Returns the index of the first element in the array that matches the predicate
	 *
	 * @param {*} values the array of values to search
	 * @param {Function} predicate a function that will be called for each element in the array
	 *                             until it returns true
	 * @returns {number} the index of the first element that matched the predicate or -1 if there
	 *                   was no match
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
	 * @param {object[]} options the options
	 * @param {string} value the value to find
	 * @returns {number} the index of the matching option or -1
	 */
	indexOfOptionByValue: function(options, value) {
		return this.indexOf(options, function(option) {
			return (option.value === value);
		});
	},

	/**
	 * Returns the index of the first option that is not disabled and has the specified label
	 *
	 * @param {object[]} options the options
	 * @param {string} label the label to find
	 * @returns {number} the index of the matching option or -1
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
	 * @param {object[]} options the options
	 * @param {string} label the label to find
	 * @returns {number} the index of the matching option or -1
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
	 * @param {Aura.Component} component the inputSelect component
	 * @param {boolean} [reverse] true to select previous option
	 * @returns {boolean} true if the selected option was changed; otherwise, false
	 */
	selectNextOptionElement: function(component, reverse) {
		var editable = component.get('v.editable');
		if (!editable) {
			return false;
		}

		var options = component.get('v.localOptions');

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
	 * @param {Aura.Component} component the inputSelect component
	 * @returns {void}
	 */
	updateOptionElements: function(component) {
		// Get the select element
		var selectElement = this.getSelectElement(component);
		if (!selectElement) {
			return;
		}

		// Update the options
		var options = component.get('v.localOptions');
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
	 * @param {Aura.Component} component the inputSelect component
	 * @returns {void}
	 */
	updateInputElement: function(component) {
		var editable = component.get('v.editable');
		if (!editable) {
			return;
		}

		var inputElement = this.getInputElement(component);

		var value = this.asString(component.get('v.value'));
		var options = component.get('v.localOptions');
		var selectedIndex = component.get('v.selectedIndex');
		if (selectedIndex === -1) {
			inputElement.value = value;
		} else {
			inputElement.value = options[selectedIndex].label;
		}
	},

	/**
	 * Updates the selected index of the select element based on the component value
	 *
	 * @param {Aura.Component} component the inputSelect component
	 * @returns {void}
	 */
	updateSelectElement: function(component) {
		var selectElement = this.getSelectElement(component);
		selectElement.selectedIndex = component.get('v.selectedIndex');
	},

	/**
	 * Updates the input and select elements
	 *
	 * @param {Aura.Component} component the inputSelect component
	 * @returns {void}
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
	 * Sets the value
	 *
	 * @param {Aura.Component} component the inputSelect component
	 * @param {string} value the value
	 * @returns {boolean} true if the value changed
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
	 * @param {Aura.Component} component the inputSelect component
	 * @returns {boolean} true if the value changed
	 */
	setValueFromSelectedIndex: function(component) {
		var options = component.get('v.localOptions');
		var selectedIndex = component.get('v.selectedIndex');

		var value = '';
		if ((selectedIndex >= 0) && (selectedIndex < options.length)) {
			value = options[selectedIndex].value;
		}

		return this.setValue(component, value);
	},

	/**
	 * Sets the value based on the text in the input element
	 *
	 * @param {Aura.Component} component the inputSelect component
	 * @returns {boolean} true if the value changed
	 */
	setValueFromInputElement: function(component) {
		var editable = component.get('v.editable');
		if (!editable) {
			return false;
		}

		var inputElement = this.getInputElement(component);
		var selectElement = this.getSelectElement(component);

		var value = inputElement.value;
		var oldValue = component.get('v.value');

		var options = component.get('v.localOptions');
		var selectedIndex = this.indexOfOptionByLabel(options, value);
		if (selectedIndex !== -1) {
			var option = options[selectedIndex];
			value = option.value;

			inputElement.value = option.label;
			selectElement.selectedIndex = selectedIndex;
		} else {
			selectElement.selectedIndex = -1;
		}

		var valueChanged = this.setValue(component, value);
		var selectedIndexChanged = this.setSelectedIndex(component, selectedIndex);

		var changed = valueChanged || selectedIndexChanged;
		if (changed) {
			this.fireEvent(component, 'onchange', {
				value: value,
				oldValue: oldValue
			});
		}

		return changed;
	},

	/**
	 * Sets the value based on the option selected in the select element
	 *
	 * @param {Aura.Component} component the inputSelect component
	 * @returns {boolean} true if the value changed
	 */
	setValueFromSelectElement: function(component) {
		var selectElement = this.getSelectElement(component);

		var value = selectElement.value;
		var oldValue = component.get('v.value');

		var options = component.get('v.localOptions');
		var selectedIndex = selectElement.selectedIndex;

		var editable = component.get('v.editable');
		if (editable) {
			var inputElement = this.getInputElement(component);
			if (selectedIndex === -1) {
				inputElement.value = value;
			} else {
				inputElement.value = options[selectedIndex].label;
			}
			inputElement.focus();
			inputElement.select();
		}

		var valueChanged = this.setValue(component, value);
		var selectedIndexChanged = this.setSelectedIndex(component, selectedIndex);

		var changed = valueChanged || selectedIndexChanged;
		if (changed) {
			this.fireEvent(component, 'onchange', {
				value: value,
				oldValue: oldValue
			});
		}

		return changed;
	},

	/**
	 * Sets the selected index
	 *
	 * @param {Aura.Component} component the inputSelect component
	 * @param {number} selectedIndex the selected index
	 * @returns {boolean} true if the selectedIndex changed
	 */
	setSelectedIndex: function(component, selectedIndex) {
		var options = component.get('v.localOptions');
		if ($A.util.isUndefinedOrNull(selectedIndex)) {
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
	 * @param {Aura.Component} component the inputSelect component
	 * @returns {boolean} true if the selectedIndex changed
	 */
	setSelectedIndexFromValue: function(component) {
		var value = this.asString(component.get('v.value'));
		var options = component.get('v.localOptions');
		var selectedIndex = this.indexOfOptionByValue(options, value);

		return this.setSelectedIndex(component, selectedIndex);
	},

	/**
	 * Returns the input element
	 *
	 * @param {Aura.Component} component the inputSelect component
	 * @returns {HTMLElement} the input element
	 */
	getInputElement: function(component) {
		var input = component.find('input');
		if (input) {
			return input.getElement();
		}
		return null;
	},

	/**
	 * Returns the select element
	 *
	 * @param {Aura.Component} component the inputSelect component
	 * @returns {HTMLElement} the select element
	 */
	getSelectElement: function(component) {
		var select = component.find('select');
		if (select) {
			if ($A.util.isArray(select)) {
				if (select.length > 0) {
					return select[0].getElement();
				}
			} else {
				return select.getElement();
			}
		}
		return null;
	},

	/**
	 * Fire the named event
	 *
	 * @param {Aura.Component} component the inputSelect component
	 * @param {string} name the event name
	 * @param {object} args optional event arguments
	 * @returns {void}
	 */
	fireEvent: function(component, name, args) {
		var event = component.getEvent(name);
		event.setParam('arguments', args || {});
		event.fire();
	}
})