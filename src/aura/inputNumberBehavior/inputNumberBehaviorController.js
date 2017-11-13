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
})