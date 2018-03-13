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