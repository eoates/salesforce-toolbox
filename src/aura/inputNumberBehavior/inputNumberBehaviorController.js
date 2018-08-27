/**************************************************************************************************
 * inputNumberBehaviorController.js
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
	 * Initializes the component
	 */
	init: function(component, event, helper) {
		helper.importModules(component);
	},

	/**
	 * Returns the module
	 */
	getModule: function(component, event, helper) {
		return helper.getModule(component);
	}
}) // eslint-disable-line semi