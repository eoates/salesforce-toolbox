/**************************************************************************************************
 * messageHelper.js
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
	 * Sets the theme and icon attributes based on the message type
	 *
	 * @param {Aura.Component} component - The message component
	 *
	 * @return {void}
	 */
	setThemeAndIconInfo: function(component) {
		var themeName = 'slds-theme_shade';
		var themeTextured = false;
		var iconName = 'utility:info';
		var iconAlternativeText = 'Information';
		var iconInverse = false;

		var type = '' + component.get('v.type');
		type = type.toLowerCase();

		if (type === 'success') {
			// Success
			themeName = 'slds-theme_success';
			themeTextured = true;
			iconName = 'utility:success';
			iconAlternativeText = 'Success';
			iconInverse = true;
		} else if (type === 'warning') {
			// Warning
			themeName = 'slds-theme_warning';
			themeTextured = true;
			iconName = 'utility:warning';
			iconAlternativeText = 'Warning';
			iconInverse = false;
		} else if (type === 'error') {
			// Error
			themeName = 'slds-theme_error';
			themeTextured = true;
			iconName = 'utility:clear';
			iconAlternativeText = 'Error';
			iconInverse = true;
		}

		if (themeTextured) {
			themeName += ' slds-theme_alert-texture';
		}

		component.set('v.themeName', themeName);
		component.set('v.iconName', iconName);
		component.set('v.iconAlternativeText', iconAlternativeText);
		component.set('v.iconInverse', iconInverse);
	}
})