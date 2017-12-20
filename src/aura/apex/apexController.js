({
	/**
	 * Executes an Apex method
	 */
	execute: function(component, event, helper) {
		var args = event.getParam('arguments');
		helper.execute(args.component, args.name, args.opts);
	}
})