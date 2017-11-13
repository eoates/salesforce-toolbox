({
	/**
	 * Imports modules used by the component
	 *
	 * @param {Aura.Component} component - the inputNumber component
	 *
	 * @return {void}
	 */
	importModules: function(component) {
		if (!this.utils) {
			this.utils = component.find('utils').getModule();
		}
	},

	/**
	 * Performs a specified behavior action
	 *
	 * @param  {Aura.Component} component the inputNumber component
	 * @param  {Event} event the event object
	 * @param  {string} name the name of the action to perform
	 * @return {*} varies depending on the action performed
	 */
	performBehaviorAction: function(component, event, name) {
		var inputElement = this.getInputElement(component);
		var behavior = component.find('behavior').getModule();
		var action = behavior[name];

		var self = this;
		return action.call(behavior, event, {
			select: function() {
				inputElement.select();
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
				return self.setValue(component, value);
			}
		});
	},

	/**
	 * Sets the value
	 *
	 * @param {Aura.Component} component - the inputNumber component
	 * @param {number}         value     - the value
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
	 * Returns the input HTML element
	 *
	 * @param {Aura.Component} component - the inputNumber component
	 *
	 * @return {HTMLElement} the input element
	 */
	getInputElement: function(component) {
		var input = component.find('input');
		if (input) {
			return input.getElement();
		}
		return undefined;
	},

	/**
	 * Updates the input element
	 *
	 * @param {Aura.Component} component  - the inputNumber component
	 * @param {boolean}        [hasFocus] - true if the input element current has keyboard focus
	 *
	 * @return {void}
	 */
	updateInputElement: function(component, hasFocus) {
		var inputElement = this.getInputElement(component);
		if (!inputElement) {
			return;
		}

		var behavior = component.find('behavior').getModule();
		behavior.updateInputElement({
			getValue: function() {
				return component.get('v.value');
			},
			setInputValue: function(value) {
				inputElement.value = value;
			}
		}, hasFocus);
	},

	/**
	 * Sets attributes only needed when the application is running on mobile
	 *
	 * @param {Aura.Component} component - the inputNumber component
	 *
	 * @return {void}
	 */
	setInputElementAttributesForMobile: function(component) {
		var inputElement = this.getInputElement(component);
		if (inputElement && this.utils.isMobile()) {
			var behavior = component.find('behavior').getModule();
			inputElement.min = behavior.getMin();
			inputElement.max = behavior.getMax();
			inputElement.step = behavior.getStep();
		}
	},

	/**
	 * Fire the named event
	 *
	 * @param {Aura.Component} component - the inputNumber component
	 * @param {string}         name      - the event name
	 * @param {Object}         args      - optional event arguments
	 *
	 * @return {void}
	 */
	fireEvent: function(component, name, args) {
		var event = component.getEvent(name);
		event.setParam('arguments', args || {});
		event.fire();
	}
})