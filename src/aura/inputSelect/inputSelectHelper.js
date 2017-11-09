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
	 * Returns the index of the option with the specified value. If a matching option is not found
	 * then -1 is returned
	 *
	 * @param {object[]} options the array of options
	 * @param {string} value the value of the option to find
	 * @returns {number} the index of the option
	 */
	indexOfOption: function(options, value) {
		for (var i = 0, n = options.length; i < n; i++) {
			var option = options[i];
			var optionValue = this.asString(option.value);
			if (optionValue === value) {
				return i;
			}
		}
		return -1;
	},

	/**
	 * Returns true if an option exists with the specified value
	 *
	 * @param {object[]} options the array of options
	 * @param {string} value the value of the option to find
	 * @returns {boolean} true if an option was found for the specified value; otherwise, false
	 */
	hasOption: function(options, value) {
		var index = this.indexOfOption(options, value);
		return index >= 0;
	},

	/**
	 * Updates the select element's options
	 *
	 * @param {Aura.Component} component the inputSelect component
	 * @returns {void}
	 */
	updateOptions: function(component) {
		// Get the select element
		var selectElement = this.getSelectElement(component);
		if (!selectElement) {
			return;
		}

		// Get the current value and options
		var value = this.asString(component.get('v.value'));
		var options = component.get('v.options');
		if ($A.util.isEmpty(options)) {
			options = [];
		}
		options = options.slice();

		// If there is no option for the current value then create a temporary option so we don't
		// lose the value
		var hasOptionForValue = this.hasOption(options, value);
		if (!hasOptionForValue) {
			options.unshift({
				className: 'faux-option',
				value: value,
				label: value
			});
		}

		// Update the options
		var selectedIndex = -1;
		for (var i = 0; i < options.length; i++) {
			// Get option info
			var option = options[i];
			var optionValue = this.asString(option.value);
			var optionLabel = this.asString(option.label);
			if (!optionLabel) {
				optionLabel = optionValue;
			}

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

			optionElement.className = this.getOptionClass(option);
			optionElement.value = optionValue;
			optionElement.disabled = !!option.disabled;
			optionElement.innerText = optionLabel;

			// Remember the index of the selected option
			if ((selectedIndex === -1) && (optionValue === value)) {
				selectedIndex = i;
			}
		}

		// Set the selected option
		selectElement.selectedIndex = selectedIndex;

		// Remove any extra options
		while (selectElement.children.length > options.length) {
			var lastChild = selectElement.children[selectElement.children.length - 1];
			selectElement.removeChild(lastChild);
		}
	},

	/**
	 * Sets the value
	 *
	 * @param {Aura.Component} component the inputSelect component
	 * @param {string} value the value
	 * @returns {void}
	 */
	setValue: function(component, value) {
		var oldValue = component.get('v.value');
		if (value === oldValue) {
			return;
		}

		component.ignoreValueChange = true;
		try {
			component.set('v.value', value);
		} finally {
			component.ignoreValueChange = false;
		}

		component.set('v.value', value);
		this.updateOptions(component);

		this.fireEvent(component, 'onchange', {
			value: value,
			oldValue: oldValue
		});
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
			return select.getElement();
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