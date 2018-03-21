/**************************************************************************************************
 * apexController.js
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
		helper.importModules(component);
	},

	/**
	 * Executes an Apex method
	 */
	execute: function(component, event, helper) {
		var args = event.getParam('arguments');
		helper.execute(args.component, args.name, args.opts);
	}
})