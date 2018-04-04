/**************************************************************************************************
 * apexController.js
 **************************************************************************************************
 * This is a shared component. Do not make modifications to this component without carefully
 * considering the impact this may have on existing applications/components/pages/etc. that use this
 * component.
 *
 * @author   Eugene Oates
 * @date     2018-03-20
 * @version  2.0.0
 *
 **************************************************************************************************/
({
	/**
	 * Returns a handler function
	 */
	getHandler: function(component, event, helper) {
		var args = event.getParam('arguments');
		return helper.getHandler(args.opts);
	}
})