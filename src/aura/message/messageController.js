/**************************************************************************************************
 * messageController.js
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
	 * Initializes the component
	 */
	init: function(component, event, helper) {
		helper.setThemeAndIconInfo(component);
	},

	/**
	 * Updates the theme and icon attributes when the type changes
	 */
	typeChange: function(component, event, helper) {
		helper.setThemeAndIconInfo(component);
	}
}) // eslint-disable-line semi