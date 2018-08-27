/**************************************************************************************************
 * inputLookupFieldHelper.js
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
	 * Imports modules used by the component
	 *
	 * @param {Aura.Component} component - The inputLookupField component
	 *
	 * @return {void}
	 */
	importModules: function(component) {
		if (!this.utils) {
			this.utils = component.find('utils').getModule();
		}
	},

	/**
	 * Formats the field value
	 *
	 * @param {Aura.Component} component - The inputLookupField component
	 *
	 * @return {void}
	 */
	formatValue: function(component) {
		var actionable = component.get('v.actionable');
		var field = component.get('v.field');
		var type, value, scale;
		var formattedValue = '';
		var negative = false;
		var escaped = false;

		if (field) {
			type = this.utils.trim(field.dataType).toUpperCase();
			value = field.value;
			scale = field.scale;
		}

		// Format the value based on the field type
		switch (type) {
		case 'BOOLEAN':
			// Format boolean
			value = this.utils.asBoolean(value);
			if (actionable) {
				return;
			} else {
				formattedValue = value ? 'True' : 'False';
			}
			break;

		case 'CURRENCY':
			// Format currency. Negative values will be displayed within parenthesis. Formatted
			// amount will always display 2 digits to the right of the decimal regardless of the
			// scale defined by the field
			value = this.utils.asNumber(value);
			if (this.utils.isNumber(value)) {
				if (value < 0) {
					value = Math.abs(value);
					negative = true;
				}
				formattedValue = '$' + this.utils.formatNumber(value, 2);
				if (negative) {
					value *= -1;
					formattedValue = '(' + formattedValue + ')';
				}
			}
			break;

		case 'DOUBLE':
			// Format double
			value = this.utils.asNumber(value);
			if (this.utils.isNumber(value)) {
				formattedValue = this.utils.formatNumber(value, scale);
			}
			break;

		case 'PERCENT':
			// Format percent. Same as double except we append the % symbol
			value = this.utils.asNumber(value);
			if (this.utils.isNumber(value)) {
				formattedValue = this.utils.formatNumber(value, scale) + '%';
			}
			break;

		case 'INTEGER':
			// Format integer. Same as double except scale is always 0
			value = this.utils.asInteger(value);
			if (this.utils.isNumber(value)) {
				formattedValue = this.utils.formatNumber(value, 0);
			}
			break;

		case 'DATE':
			// Format date
			value = this.utils.asDate(value);
			if (this.utils.isDate(value)) {
				formattedValue = this.utils.formatDate(value, 'M/d/yyyy');
			}
			break;

		case 'DATETIME':
			// Format date/time
			value = this.utils.asDate(value);
			if (this.utils.isDate(value)) {
				formattedValue = this.utils.formatDate(value, 'M/d/yyyy h:mm a');
			}
			break;

		case 'PHONE':
			// Format phone. If the phone number is 10 digits or 11 digits (and begins with 1) then
			// the we use the format (000) 111-1111; otherwise, we just leave the value as-is. If
			// the component is actionable then we will display the value as a link
			value = this.utils.trim(value);
			formattedValue = value;
			if (/^1?[0-9]{10}$/.test(formattedValue)) {
				if (formattedValue.length === 11) {
					formattedValue = formattedValue.substring(1);
				}
				formattedValue = '(' + formattedValue.substring(0, 3) + ') '
					+ formattedValue.substring(3, 6) + '-'
					+ formattedValue.substring(6, 10);
			}
			if (formattedValue && actionable) {
				formattedValue = '<a href="tel:' + this.utils.escapeHtml(value) + '"'
					+ ' tabindex="-1">' + this.utils.escapeHtml(formattedValue) + '</a>';
				escaped = true;
			}
			break;

		case 'EMAIL':
			// Format email. If the component is actionable then we will display the value as a link
			formattedValue = this.utils.trim(value);
			if (formattedValue && actionable) {
				formattedValue = this.utils.escapeHtml(formattedValue);
				formattedValue = '<a href="mailto:' + formattedValue + '"'
					+ ' tabindex="-1">' + formattedValue + '</a>';
				escaped = true;
			}
			break;

		case 'URL':
			// Format URL. If the component is actionable then we will display the value as a link
			formattedValue = this.utils.trim(value);
			if (formattedValue && actionable) {
				formattedValue = this.utils.escapeHtml(formattedValue);
				formattedValue = '<a href="' + formattedValue + '"'
					+ ' title="' + formattedValue + '"'
					+ ' target="_blank" tabindex="-1">' + formattedValue + '</a>';
				escaped = true;
			}
			break;

		default:
			// For any other type not handled above just convert the value to a string
			formattedValue = this.utils.trim(value);
			break;
		}

		// Set the output
		var output = component.find('output');
		if (output) {
			if (!escaped) {
				formattedValue = this.utils.escapeHtml(formattedValue);
			}
			output.set('v.value', formattedValue);
		}
	}
}) // eslint-disable-line semi