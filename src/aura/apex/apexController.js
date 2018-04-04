/**************************************************************************************************
 * apexController.js
 **************************************************************************************************
 * This is a shared component. Do not make modifications to this component without carefully
 * considering the impact this may have on existing applications/components/pages/etc. that use this
 * component.
 *
 * @author   Eugene Oates
 * @date     2018-03-20
 * @version  1.1.0
 *
 **************************************************************************************************/
({
	/**
	 * Initializes the component
	 */
	init: function(component, event, helper) {
		helper.importModules(component);
	},

	/**
	 * Returns the apex module
	 */
	getModule: function(component, event, helper) {
		return helper.getInstance();
	}
})