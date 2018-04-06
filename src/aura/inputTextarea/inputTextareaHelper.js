/**************************************************************************************************
 * inputTextareaHelper.js
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
	 * Imports modules used by the component
	 *
	 * @param {Aura.Component} component - The inputTextarea component
	 *
	 * @return {void}
	 */
	importModules: function(component) {
		if (!this.utils) {
			this.utils = component.find('utils').getModule();
		}
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
	 * @param {Aura.Component} component - The inputTextarea component
	 *
	 * @return {void}
	 */
	setOldValue: function(component) {
		component.oldValue = component.get('v.value');
	},

	/**
	 * Sets the value
	 *
	 * @param {Aura.Component} component - The inputTextarea component
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
	 * Returns the input HTML element
	 *
	 * @param {Aura.Component} component - The inputTextarea component
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
	 * Returns the span that displays the number of characters remaining
	 *
	 * @param {Aura.Component} component - The inputTextarea component
	 *
	 * @return {HTMLElement} The counter element
	 */
	getCounterElement: function(component) {
		var counter = component.find('counter');
		if (counter) {
			return counter.getElement();
		}
		return undefined;
	},

	/**
	 * Updates the value of the input element so it displays the formatted value
	 *
	 * @param {Aura.Component} component - The inputTextarea component
	 *
	 * @return {void}
	 */
	updateInputElement: function(component) {
		var inputElement = this.getInputElement(component);
		if (inputElement) {
			var value = component.get('v.value');
			value = this.utils.asString(value);

			inputElement.value = value;
		}
	},

	/**
	 * Updates the span which displays the number of characters remaining. This should always be
	 * called after updateInputElement
	 *
	 * @param {Aura.Component} component - The inputTextarea component
	 *
	 * @return {void}
	 */
	updateCounterElement: function(component) {
		var inputElement = this.getInputElement(component);
		var counterElement = this.getCounterElement(component);
		if (inputElement && counterElement) {
			var message = '';

			var value = inputElement.value;
			value = this.utils.asString(value);

			var length = value.length;

			var maxLength = component.get('v.maxlength');
			if (this.utils.isInteger(maxLength)) {
				var chars = '';
				if (length > maxLength) {
					chars = this.utils.formatNumber(length - maxLength, 0);
					message = chars + ' characters too long';
				} else if (maxLength >= 0) {
					chars = this.utils.formatNumber(maxLength - length, 0);
					message = chars + ' characters remaining';
				}
			}

			counterElement.innerText = message;
			counterElement.title = message;
		}
	},

	/**
	 * Fire the named event
	 *
	 * @param {Aura.Component} component - The inputTextarea component
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
}) // eslint-disable-line semi